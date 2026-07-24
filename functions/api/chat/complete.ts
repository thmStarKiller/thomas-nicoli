import { CHAT_LIMITS, chatAiOutputSchema, chatJobPayloadSchema, type ChatAiOutput, type ChatJobPayload } from "../../../src/lib/chat/contracts";
import { buildChatOwnerEmail } from "../../_lib/chat";
import { cleanSingleLine, HttpError, jsonResponse, readBoundedBody } from "../../_lib/http";
import { requireWorkerBearer } from "../../_lib/worker-auth";
import type { BaseEnv } from "../../_lib/types";

interface Env extends BaseEnv {
  PROJECT_CLARITY_WORKER_TOKEN?: string;
}

type JobRow = {
  interaction_id: string;
  status: "queued" | "processing" | "completed" | "failed";
  payload_json: string;
  assistant_reply: string | null;
  owner_summary: string | null;
  intent: string | null;
  urgency: "low" | "medium" | "high" | null;
  suggestions_json: string | null;
  email_status: "pending" | "delivered" | "failed";
};

async function sendOwnerEmail(env: Env, interactionId: string, request: ChatJobPayload, output: ChatAiOutput, fetcher: typeof fetch): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.RESEND_TO) return false;
  const email = buildChatOwnerEmail({ interactionId, request, output });
  const from = env.RESEND_FROM_EMAIL?.trim()
    || (env.MAIL_DOMAIN?.trim()
      ? `Thomas Nicoli Consulting <bonjour@${env.MAIL_DOMAIN.trim()}>`
      : "Thomas Nicoli Consulting <onboarding@resend.dev>");
  const payload = JSON.stringify({ from, to: [env.RESEND_TO], subject: email.subject, html: email.html, text: email.text });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
      body: payload,
    });
    if (response.ok) return true;
  }
  return false;
}

export async function handleChatComplete(
  context: { request: Request; env: Env },
  dependencies: { fetcher?: typeof fetch; now?: Date } = {},
): Promise<Response> {
  try {
    await requireWorkerBearer(context.request, context.env.PROJECT_CLARITY_WORKER_TOKEN);
    const database = context.env.PROJECT_CLARITY_DB;
    if (!database) throw new HttpError(503, "chat_store_not_configured");
    const body = await readBoundedBody(context.request, 8_192);
    const interactionId = cleanSingleLine(body.interactionId, 40);
    const status = cleanSingleLine(body.status, 20);
    const diagnostic = cleanSingleLine(body.diagnostic, 300);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(interactionId)) {
      throw new HttpError(400, "invalid_interaction_id");
    }
    if (status !== "completed" && status !== "failed") throw new HttpError(400, "invalid_status");

    let row = await database
      .prepare("SELECT interaction_id, status, payload_json, assistant_reply, owner_summary, intent, urgency, suggestions_json, email_status FROM site_chat_jobs WHERE interaction_id = ?1")
      .bind(interactionId)
      .first<JobRow>();
    if (!row) throw new HttpError(404, "chat_interaction_not_found");

    if (status === "failed") {
      if (row.status !== "processing") throw new HttpError(409, "chat_state_conflict");
      const result = await database
        .prepare("UPDATE site_chat_jobs SET status = 'failed', updated_at = ?1, lease_until = NULL, diagnostic = ?2 WHERE interaction_id = ?3 AND status = 'processing'")
        .bind((dependencies.now ?? new Date()).toISOString(), diagnostic || "local_model_failed", interactionId)
        .run();
      if ((result.meta?.changes ?? 0) !== 1) throw new HttpError(409, "chat_state_conflict");
      return jsonResponse({ ok: true, interactionId, status: "failed" });
    }

    const payloadResult = chatJobPayloadSchema.safeParse(JSON.parse(row.payload_json));
    if (!payloadResult.success) throw new HttpError(500, "stored_chat_payload_invalid");
    const requestPayload = payloadResult.data;
    let output: ChatAiOutput;

    if (row.status === "processing") {
      const outputResult = chatAiOutputSchema.safeParse(body.output);
      if (!outputResult.success) throw new HttpError(400, "invalid_model_output");
      output = outputResult.data;
      const updated = await database
        .prepare(
          `UPDATE site_chat_jobs
           SET status = 'completed', updated_at = ?1, lease_until = NULL,
               assistant_reply = ?2, owner_summary = ?3, intent = ?4, urgency = ?5,
               suggestions_json = ?6, diagnostic = NULL
           WHERE interaction_id = ?7 AND status = 'processing'`,
        )
        .bind(
          (dependencies.now ?? new Date()).toISOString(),
          output.reply,
          output.summary,
          output.intent,
          output.urgency,
          JSON.stringify(output.suggestions).slice(0, 512),
          interactionId,
        )
        .run();
      if ((updated.meta?.changes ?? 0) !== 1) throw new HttpError(409, "chat_state_conflict");
      row = { ...row, status: "completed", assistant_reply: output.reply, owner_summary: output.summary, intent: output.intent, urgency: output.urgency, suggestions_json: JSON.stringify(output.suggestions), email_status: "pending" };
    } else if (row.status === "completed" && row.assistant_reply && row.owner_summary && row.intent && row.urgency) {
      output = chatAiOutputSchema.parse({
        reply: row.assistant_reply,
        summary: row.owner_summary,
        intent: row.intent,
        urgency: row.urgency,
        suggestions: JSON.parse(row.suggestions_json ?? "[]"),
      });
      if (row.email_status === "delivered") {
        return jsonResponse({ ok: true, interactionId, status: "completed", emailed: true });
      }
    } else {
      throw new HttpError(409, "chat_state_conflict");
    }

    const emailed = await sendOwnerEmail(context.env, interactionId, requestPayload, output, dependencies.fetcher ?? fetch).catch(() => false);
    await database
      .prepare("UPDATE site_chat_jobs SET email_status = ?1 WHERE interaction_id = ?2")
      .bind(emailed ? "delivered" : "failed", interactionId)
      .run();
    return jsonResponse({ ok: true, interactionId, status: "completed", emailed, maxTurns: CHAT_LIMITS.sessionTurns });
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: { request: Request; env: Env }) => handleChatComplete(context);
