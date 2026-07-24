import { CHAT_LIMITS, chatRequestSchema, type ChatAiOutput, type ChatLocale, type ChatRequest } from "../../../src/lib/chat/contracts";
import { buildChatModelInput, buildChatOwnerEmail, CHAT_MODEL, parseChatAiOutput, retentionUntil } from "../../_lib/chat";
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
type InteractionRow = {
  interaction_id: string;
  session_id: string;
  turn_index: number;
  language: ChatLocale;
  page_path: string;
  visitor_message: string;
  assistant_reply: string;
  owner_summary: string;
  intent: string;
  urgency: "low" | "medium" | "high";
  suggestions_json: string;
  email_status: string;
};

async function findInteraction(database: D1DatabaseLike, interactionId: string): Promise<InteractionRow | null> {
  return database
    .prepare("SELECT interaction_id, session_id, turn_index, language, page_path, visitor_message, assistant_reply, owner_summary, intent, urgency, suggestions_json, email_status FROM site_chat_interactions WHERE interaction_id = ?1")
    .bind(interactionId)
    .first<InteractionRow>();
}

async function findTurn(database: D1DatabaseLike, sessionId: string, turnIndex: number): Promise<InteractionRow | null> {
  return database
    .prepare("SELECT interaction_id, session_id, turn_index, language, page_path, visitor_message, assistant_reply, owner_summary, intent, urgency, suggestions_json, email_status FROM site_chat_interactions WHERE session_id = ?1 AND turn_index = ?2")
    .bind(sessionId, turnIndex)
    .first<InteractionRow>();
}

function duplicateResponse(row: InteractionRow): Response {
  let suggestions: string[] = [];
  try {
    const parsed = JSON.parse(row.suggestions_json);
    if (Array.isArray(parsed)) suggestions = parsed.filter((item): item is string => typeof item === "string");
  } catch {
    suggestions = [];
  }
  return jsonResponse({
    ok: true,
    duplicate: true,
    interactionId: row.interaction_id,
    reply: row.assistant_reply,
    suggestions,
    emailed: row.email_status === "delivered",
  });
}

async function sendOwnerSummary(
  env: Env,
  request: Pick<ChatRequest, "turnIndex" | "pagePath" | "locale" | "message">,
  output: ChatAiOutput,
  interactionId: string,
  fetcher: typeof fetch,
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.RESEND_TO) return false;
  const email = buildChatOwnerEmail({ interactionId, request, output });
  const from = env.RESEND_FROM_EMAIL?.trim()
    || (env.MAIL_DOMAIN?.trim()
      ? `Thomas Nicoli Consulting <bonjour@${env.MAIL_DOMAIN.trim()}>`
      : "Thomas Nicoli Consulting <onboarding@resend.dev>");
  const payload = JSON.stringify({
    from,
    to: [env.RESEND_TO],
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: "Bearer " + env.RESEND_API_KEY,
        "content-type": "application/json",
      },
      body: payload,
    });
    if (response.ok) return true;
  }
  return false;
}

async function retryFailedOwnerSummary(
  env: Env,
  database: D1DatabaseLike,
  row: InteractionRow,
  fetcher: typeof fetch,
): Promise<InteractionRow> {
  if (row.email_status !== "failed") return row;
  const emailed = await sendOwnerSummary(
    env,
    {
      turnIndex: row.turn_index,
      pagePath: row.page_path,
      locale: row.language,
      message: row.visitor_message,
    },
    {
      reply: row.assistant_reply,
      summary: row.owner_summary,
      intent: row.intent,
      urgency: row.urgency,
      suggestions: [],
    },
    row.interaction_id,
    fetcher,
  ).catch(() => false);
  if (!emailed) return row;
  await database
    .prepare("UPDATE site_chat_interactions SET email_status = ?1 WHERE interaction_id = ?2")
    .bind("delivered", row.interaction_id)
    .run();
  return { ...row, email_status: "delivered" };
}

export async function handleChat(
  context: Context,
  dependencies: {
    fetcher?: typeof fetch;
    aiRunner?: (model: string, input: Record<string, unknown>) => Promise<unknown>;
    now?: Date;
  } = {},
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
    if (input.company) return jsonResponse({ ok: true, reply: "", suggestions: [], emailed: true });

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

    const existing = await findInteraction(database, input.interactionId);
    if (existing) {
      const retried = await retryFailedOwnerSummary(
        context.env,
        database,
        existing,
        dependencies.fetcher ?? fetch,
      );
      return duplicateResponse(retried);
    }
    if (input.turnIndex !== session.turn_count + 1 || input.turnIndex > CHAT_LIMITS.sessionTurns) {
      throw new HttpError(409, "chat_turn_conflict");
    }

    const aiRunner = dependencies.aiRunner
      ?? (context.env.AI ? ((model, modelInput) => context.env.AI!.run(model, modelInput)) : undefined);
    if (!aiRunner) throw new HttpError(503, "ai_not_configured");

    const turnLock = await database
      .prepare("UPDATE site_chat_sessions SET turn_count = ?1 WHERE session_id = ?2 AND turn_count = ?3")
      .bind(input.turnIndex, input.sessionId, input.turnIndex - 1)
      .run();
    if ((turnLock.meta?.changes ?? 0) === 0) {
      const concurrent = await findTurn(database, input.sessionId, input.turnIndex);
      if (concurrent) return duplicateResponse(concurrent);
      throw new HttpError(409, "chat_turn_in_progress");
    }
    const rollbackTurn = () => database
      .prepare("UPDATE site_chat_sessions SET turn_count = ?1 WHERE session_id = ?2 AND turn_count = ?3")
      .bind(input.turnIndex - 1, input.sessionId, input.turnIndex)
      .run();

    let aiRaw: unknown;
    try {
      aiRaw = await aiRunner(CHAT_MODEL, buildChatModelInput(input));
    } catch (error) {
      console.error("site_chat_ai_error", error instanceof Error ? error.message.slice(0, 300) : "unknown_provider_error");
      await rollbackTurn().catch(() => undefined);
      throw new HttpError(502, "ai_unavailable");
    }
    const output = parseChatAiOutput(aiRaw, input);
    const createdAt = now.toISOString();
    const suggestionsJson = JSON.stringify(output.suggestions);

    const insertResult = await database
      .prepare(
          `INSERT OR IGNORE INTO site_chat_interactions
            (interaction_id, session_id, turn_index, created_at, language, page_path,
             visitor_message, assistant_reply, owner_summary, intent, urgency,
             suggestions_json, email_status, retention_until)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, 'pending', ?13)`,
        )
        .bind(
          input.interactionId,
          input.sessionId,
          input.turnIndex,
          createdAt,
          input.locale,
          input.pagePath,
          input.message,
          output.reply,
          output.summary,
          output.intent,
          output.urgency,
          suggestionsJson,
          retentionUntil(now),
        )
      .run()
      .catch(async () => {
        await rollbackTurn().catch(() => undefined);
        throw new HttpError(503, "chat_store_conflict");
      });

    const stored = await findTurn(database, input.sessionId, input.turnIndex);
    if ((insertResult.meta?.changes ?? 0) === 0) {
      if (stored) return duplicateResponse(stored);
      await rollbackTurn().catch(() => undefined);
      throw new HttpError(503, "chat_store_conflict");
    }
    if (!stored) {
      await rollbackTurn().catch(() => undefined);
      throw new HttpError(503, "chat_store_conflict");
    }
    if (stored.interaction_id !== input.interactionId) return duplicateResponse(stored);

    const emailed = await sendOwnerSummary(
      context.env,
      input,
      output,
      input.interactionId,
      dependencies.fetcher ?? fetch,
    ).catch(() => false);
    await database
      .prepare("UPDATE site_chat_interactions SET email_status = ?1 WHERE interaction_id = ?2")
      .bind(emailed ? "delivered" : "failed", input.interactionId)
      .run();

    return jsonResponse({
      ok: true,
      interactionId: input.interactionId,
      reply: output.reply,
      suggestions: output.suggestions,
      emailed,
      turnIndex: input.turnIndex,
      maxTurns: CHAT_LIMITS.sessionTurns,
    });
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: Context) => handleChat(context);
export const onRequestOptions = () => new Response(null, { status: 405, headers: { allow: "POST" } });
