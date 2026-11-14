import type { ChatAiOutput, ChatJobPayload } from "../../src/lib/chat/contracts";
import { buildChatOwnerEmail } from "./chat";
import type { BaseEnv, D1DatabaseLike } from "./types";

/**
 * Publishes a validated model answer on a job that is being processed.
 * Returns false when another worker already moved the job on.
 */
export async function publishChatOutput(
  database: D1DatabaseLike,
  interactionId: string,
  output: ChatAiOutput,
  now: Date,
): Promise<boolean> {
  const updated = await database
    .prepare(
      `UPDATE site_chat_jobs
       SET status = 'completed', updated_at = ?1, lease_until = NULL,
           assistant_reply = ?2, owner_summary = ?3, intent = ?4, urgency = ?5,
           suggestions_json = ?6, diagnostic = NULL
       WHERE interaction_id = ?7 AND status = 'processing'`,
    )
    .bind(
      now.toISOString(),
      output.reply,
      output.summary,
      output.intent,
      output.urgency,
      JSON.stringify(output.suggestions).slice(0, 512),
      interactionId,
    )
    .run();
  return (updated.meta?.changes ?? 0) === 1;
}

export async function sendChatOwnerEmail(
  env: BaseEnv,
  interactionId: string,
  request: Pick<ChatJobPayload, "turnIndex" | "pagePath" | "locale" | "message">,
  output: ChatAiOutput,
  fetcher: typeof fetch,
): Promise<boolean> {
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

/** Sends the owner summary and records whether it was delivered. */
export async function deliverChatOwnerSummary(
  env: BaseEnv,
  database: D1DatabaseLike,
  interactionId: string,
  request: Pick<ChatJobPayload, "turnIndex" | "pagePath" | "locale" | "message">,
  output: ChatAiOutput,
  fetcher: typeof fetch,
): Promise<boolean> {
  const emailed = await sendChatOwnerEmail(env, interactionId, request, output, fetcher).catch(() => false);
  await database
    .prepare("UPDATE site_chat_jobs SET email_status = ?1 WHERE interaction_id = ?2")
    .bind(emailed ? "delivered" : "failed", interactionId)
    .run();
  return emailed;
}
