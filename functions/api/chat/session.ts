import { CHAT_LIMITS, chatSessionRequestSchema } from "../../../src/lib/chat/contracts";
import { HttpError, assertSameOrigin, jsonResponse, readBoundedBody, requestIp, sha256 } from "../../_lib/http";
import { sessionExpiry } from "../../_lib/chat";
import { enforceRateLimit } from "../../_lib/rate-limit";
import { verifyTurnstile } from "../../_lib/turnstile";
import type { BaseEnv } from "../../_lib/types";

interface Env extends BaseEnv {
  CHATBOT_ENABLED?: string;
}

type Context = { request: Request; env: Env };

export async function handleChatSession(
  context: Context,
  dependencies: { fetcher?: typeof fetch; now?: Date; token?: string } = {},
): Promise<Response> {
  try {
    assertSameOrigin(context.request);
    if (context.env.CHATBOT_ENABLED !== "true") throw new HttpError(503, "chat_disabled");
    if (!context.env.PROJECT_CLARITY_DB) throw new HttpError(503, "chat_store_not_configured");

    const body = await readBoundedBody(context.request, CHAT_LIMITS.bodyBytes);
    const parsed = chatSessionRequestSchema.safeParse(body);
    if (!parsed.success) {
      return jsonResponse({ ok: false, error: "invalid_fields" }, 400);
    }
    const input = parsed.data;
    if (input.company) {
      return jsonResponse({ ok: true, sessionToken: crypto.randomUUID(), expiresAt: new Date().toISOString(), maxTurns: CHAT_LIMITS.sessionTurns });
    }

    const now = dependencies.now ?? new Date();
    const ip = requestIp(context.request);
    const url = new URL(context.request.url);
    await verifyTurnstile({
      secret: context.env.TURNSTILE_SECRET_KEY,
      token: input.turnstileToken,
      remoteIp: ip,
      expectedHostname: url.hostname,
      expectedAction: "site_chat",
      fetcher: dependencies.fetcher,
    });
    await enforceRateLimit({
      database: context.env.PROJECT_CLARITY_DB,
      scope: "site-chat-session",
      identity: ip,
      limit: 6,
      windowSeconds: 3_600,
      now: Math.floor(now.getTime() / 1_000),
    });

    const sessionToken = dependencies.token ?? crypto.randomUUID();
    const tokenHash = await sha256(`site-chat-token:${sessionToken}`);
    const ipHash = await sha256(`site-chat-ip:${ip}`);
    const expiresAt = sessionExpiry(now);
    await context.env.PROJECT_CLARITY_DB
      .prepare(
        `INSERT INTO site_chat_sessions
          (session_id, token_hash, ip_hash, locale, created_at, expires_at, turn_count)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0)
         ON CONFLICT(session_id) DO UPDATE SET
          token_hash = excluded.token_hash,
          ip_hash = excluded.ip_hash,
          locale = excluded.locale,
          created_at = excluded.created_at,
          expires_at = excluded.expires_at,
          turn_count = 0`,
      )
      .bind(input.sessionId, tokenHash, ipHash, input.locale, now.toISOString(), expiresAt)
      .run();

    return jsonResponse({ ok: true, sessionToken, expiresAt, maxTurns: CHAT_LIMITS.sessionTurns }, 201);
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: Context) => handleChatSession(context);
export const onRequestOptions = () => new Response(null, { status: 405, headers: { allow: "POST" } });
