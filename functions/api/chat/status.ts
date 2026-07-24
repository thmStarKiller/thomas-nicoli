import { CHAT_LIMITS } from "../../../src/lib/chat/contracts";
import { cleanSingleLine, HttpError, assertSameOrigin, jsonResponse, readBoundedBody, requestIp, sha256 } from "../../_lib/http";
import type { BaseEnv } from "../../_lib/types";

interface Env extends BaseEnv {
  CHATBOT_ENABLED?: string;
}

type SessionRow = { session_id: string; ip_hash: string; expires_at: string };
type JobRow = {
  interaction_id: string;
  session_id: string;
  turn_index: number;
  status: "queued" | "processing" | "completed" | "failed";
  assistant_reply: string | null;
  suggestions_json: string | null;
  email_status: "pending" | "delivered" | "failed";
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function handleChatStatus(
  context: { request: Request; env: Env },
  dependencies: { now?: Date } = {},
): Promise<Response> {
  try {
    assertSameOrigin(context.request);
    if (context.env.CHATBOT_ENABLED !== "true") throw new HttpError(503, "chat_disabled");
    const database = context.env.PROJECT_CLARITY_DB;
    if (!database) throw new HttpError(503, "chat_store_not_configured");
    const body = await readBoundedBody(context.request, 1_024);
    const interactionId = cleanSingleLine(body.interactionId, 40);
    const sessionId = cleanSingleLine(body.sessionId, 40);
    const sessionToken = cleanSingleLine(body.sessionToken, 40);
    if (![interactionId, sessionId, sessionToken].every((value) => uuidPattern.test(value))) {
      throw new HttpError(400, "invalid_fields");
    }

    const tokenHash = await sha256(`site-chat-token:${sessionToken}`);
    const session = await database
      .prepare("SELECT session_id, ip_hash, expires_at FROM site_chat_sessions WHERE token_hash = ?1")
      .bind(tokenHash)
      .first<SessionRow>();
    if (!session || session.session_id !== sessionId || session.expires_at <= (dependencies.now ?? new Date()).toISOString()) {
      throw new HttpError(401, "chat_session_invalid");
    }
    const ipHash = await sha256(`site-chat-ip:${requestIp(context.request)}`);
    if (session.ip_hash !== ipHash) throw new HttpError(401, "chat_session_invalid");

    const job = await database
      .prepare("SELECT interaction_id, session_id, turn_index, status, assistant_reply, suggestions_json, email_status FROM site_chat_jobs WHERE interaction_id = ?1")
      .bind(interactionId)
      .first<JobRow>();
    if (!job || job.session_id !== sessionId) throw new HttpError(404, "chat_interaction_not_found");

    if (job.status === "completed" && job.assistant_reply) {
      let suggestions: string[] = [];
      try {
        const parsed = JSON.parse(job.suggestions_json ?? "[]");
        if (Array.isArray(parsed)) suggestions = parsed.filter((item): item is string => typeof item === "string");
      } catch {
        suggestions = [];
      }
      return jsonResponse({
        ok: true,
        queued: false,
        status: "completed",
        interactionId,
        reply: job.assistant_reply,
        suggestions,
        emailed: job.email_status === "delivered",
        turnIndex: job.turn_index,
        maxTurns: CHAT_LIMITS.sessionTurns,
      });
    }
    if (job.status === "failed") {
      return jsonResponse({ ok: false, status: "failed", interactionId, error: "local_ai_failed" }, 502);
    }
    return jsonResponse({ ok: true, queued: true, status: job.status, interactionId }, 202);
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: { request: Request; env: Env }) => handleChatStatus(context);
