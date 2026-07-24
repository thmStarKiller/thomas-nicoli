import { CHAT_LIMITS, chatRequestSchema } from "../../../src/lib/chat/contracts";
import { retentionUntil } from "../../_lib/chat";
import { HttpError, assertSameOrigin, jsonResponse, readBoundedBody, requestIp, sha256 } from "../../_lib/http";
import { enforceRateLimit } from "../../_lib/rate-limit";
import type { BaseEnv, D1DatabaseLike } from "../../_lib/types";

interface Env extends BaseEnv {
  CHATBOT_ENABLED?: string;
}

type Context = { request: Request; env: Env };
type SessionRow = {
  session_id: string;
  ip_hash: string;
  locale: string;
  expires_at: string;
  turn_count: number;
};
type JobRow = {
  interaction_id: string;
  session_id: string;
  turn_index: number;
  status: "queued" | "processing" | "completed" | "failed";
  assistant_reply: string | null;
  suggestions_json: string | null;
  email_status: "pending" | "delivered" | "failed";
};

async function findJob(database: D1DatabaseLike, interactionId: string): Promise<JobRow | null> {
  return database
    .prepare("SELECT interaction_id, session_id, turn_index, status, assistant_reply, suggestions_json, email_status FROM site_chat_jobs WHERE interaction_id = ?1")
    .bind(interactionId)
    .first<JobRow>();
}

async function findTurn(database: D1DatabaseLike, sessionId: string, turnIndex: number): Promise<JobRow | null> {
  return database
    .prepare("SELECT interaction_id, session_id, turn_index, status, assistant_reply, suggestions_json, email_status FROM site_chat_jobs WHERE session_id = ?1 AND turn_index = ?2")
    .bind(sessionId, turnIndex)
    .first<JobRow>();
}

function jobResponse(row: JobRow): Response {
  if (row.status === "completed" && row.assistant_reply) {
    let suggestions: string[] = [];
    try {
      const parsed = JSON.parse(row.suggestions_json ?? "[]");
      if (Array.isArray(parsed)) suggestions = parsed.filter((item): item is string => typeof item === "string");
    } catch {
      suggestions = [];
    }
    return jsonResponse({
      ok: true,
      queued: false,
      status: "completed",
      interactionId: row.interaction_id,
      reply: row.assistant_reply,
      suggestions,
      emailed: row.email_status === "delivered",
      turnIndex: row.turn_index,
      maxTurns: CHAT_LIMITS.sessionTurns,
    });
  }
  if (row.status === "failed") {
    return jsonResponse({ ok: false, status: "failed", interactionId: row.interaction_id, error: "local_ai_failed" }, 502);
  }
  return jsonResponse({
    ok: true,
    queued: true,
    status: row.status,
    interactionId: row.interaction_id,
    turnIndex: row.turn_index,
    maxTurns: CHAT_LIMITS.sessionTurns,
  }, 202);
}

export async function handleChat(
  context: Context,
  dependencies: { now?: Date } = {},
): Promise<Response> {
  try {
    assertSameOrigin(context.request);
    if (context.env.CHATBOT_ENABLED !== "true") throw new HttpError(503, "chat_disabled");
    const database = context.env.PROJECT_CLARITY_DB;
    if (!database) throw new HttpError(503, "chat_store_not_configured");

    const body = await readBoundedBody(context.request, CHAT_LIMITS.bodyBytes);
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) return jsonResponse({ ok: false, error: "invalid_fields" }, 400);
    const input = parsed.data;
    if (input.company) return jsonResponse({ ok: true, queued: true, status: "queued", interactionId: input.interactionId }, 202);

    const now = dependencies.now ?? new Date();
    const tokenHash = await sha256(`site-chat-token:${input.sessionToken}`);
    const session = await database
      .prepare("SELECT session_id, ip_hash, locale, expires_at, turn_count FROM site_chat_sessions WHERE token_hash = ?1")
      .bind(tokenHash)
      .first<SessionRow>();
    if (!session || session.session_id !== input.sessionId) throw new HttpError(401, "chat_session_invalid");
    if (session.expires_at <= now.toISOString()) throw new HttpError(401, "chat_session_expired");
    const ip = requestIp(context.request);
    const ipHash = await sha256(`site-chat-ip:${ip}`);
    if (session.ip_hash !== ipHash || session.locale !== input.locale) throw new HttpError(401, "chat_session_invalid");

    await enforceRateLimit({
      database,
      scope: "site-chat-message",
      identity: ip,
      limit: 30,
      windowSeconds: 3_600,
      now: Math.floor(now.getTime() / 1_000),
    });

    const existing = await findJob(database, input.interactionId);
    if (existing) {
      if (existing.session_id !== input.sessionId) throw new HttpError(401, "chat_session_invalid");
      return jobResponse(existing);
    }
    if (input.turnIndex !== session.turn_count + 1 || input.turnIndex > CHAT_LIMITS.sessionTurns) {
      const sameTurn = await findTurn(database, input.sessionId, input.turnIndex);
      if (sameTurn) return jobResponse(sameTurn);
      throw new HttpError(409, "chat_turn_conflict");
    }

    const turnLock = await database
      .prepare("UPDATE site_chat_sessions SET turn_count = ?1 WHERE session_id = ?2 AND turn_count = ?3")
      .bind(input.turnIndex, input.sessionId, input.turnIndex - 1)
      .run();
    if ((turnLock.meta?.changes ?? 0) === 0) {
      const concurrent = await findTurn(database, input.sessionId, input.turnIndex);
      if (concurrent) return jobResponse(concurrent);
      throw new HttpError(409, "chat_turn_in_progress");
    }
    const rollbackTurn = () => database
      .prepare("UPDATE site_chat_sessions SET turn_count = ?1 WHERE session_id = ?2 AND turn_count = ?3")
      .bind(input.turnIndex - 1, input.sessionId, input.turnIndex)
      .run();

    const createdAt = now.toISOString();
    const payload = {
      sessionId: input.sessionId,
      interactionId: input.interactionId,
      turnIndex: input.turnIndex,
      locale: input.locale,
      pagePath: input.pagePath,
      message: input.message,
      history: input.history,
    };
    const insert = await database
      .prepare(
        `INSERT OR IGNORE INTO site_chat_jobs
          (interaction_id, session_id, turn_index, created_at, updated_at, status, language,
           page_path, payload_json, retention_until)
         VALUES (?1, ?2, ?3, ?4, ?4, 'queued', ?5, ?6, ?7, ?8)`,
      )
      .bind(
        input.interactionId,
        input.sessionId,
        input.turnIndex,
        createdAt,
        input.locale,
        input.pagePath,
        JSON.stringify(payload),
        retentionUntil(now),
      )
      .run()
      .catch(async () => {
        await rollbackTurn().catch(() => undefined);
        throw new HttpError(503, "chat_store_conflict");
      });

    const stored = await findTurn(database, input.sessionId, input.turnIndex);
    if ((insert.meta?.changes ?? 0) === 0) {
      if (stored) return jobResponse(stored);
      await rollbackTurn().catch(() => undefined);
      throw new HttpError(503, "chat_store_conflict");
    }
    if (!stored) {
      await rollbackTurn().catch(() => undefined);
      throw new HttpError(503, "chat_store_conflict");
    }
    return jobResponse(stored);
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: Context) => handleChat(context);
export const onRequestOptions = () => new Response(null, { status: 405, headers: { allow: "POST" } });
