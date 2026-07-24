import { HttpError, jsonResponse, readBoundedBody, sha256 } from "../../_lib/http";
import type { BaseEnv } from "../../_lib/types";

interface Env extends BaseEnv {
  PROJECT_CLARITY_WORKER_TOKEN?: string;
}

async function requireWorker(request: Request, expected?: string): Promise<void> {
  if (!expected) throw new HttpError(503, "worker_not_configured");
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const [actualHash, expectedHash] = await Promise.all([sha256(supplied), sha256(expected)]);
  if (!supplied || actualHash !== expectedHash) throw new HttpError(401, "worker_unauthorized");
}

export async function handlePurge(
  context: { request: Request; env: Env },
  options: { now?: Date } = {},
): Promise<Response> {
  try {
    await requireWorker(context.request, context.env.PROJECT_CLARITY_WORKER_TOKEN);
    if (!context.env.PROJECT_CLARITY_DB) throw new HttpError(503, "queue_not_configured");
    const body = await readBoundedBody(context.request, 512);
    if (body.confirm !== true) throw new HttpError(400, "explicit_confirmation_required");

    const now = options.now ?? new Date();
    const cutoff = now.toISOString();
    const [clarity, chat, sessions] = await Promise.all([
      context.env.PROJECT_CLARITY_DB
        .prepare("DELETE FROM project_clarity_submissions WHERE retention_until <= ?1")
        .bind(cutoff)
        .run(),
      context.env.PROJECT_CLARITY_DB
        .prepare("DELETE FROM site_chat_interactions WHERE retention_until <= ?1")
        .bind(cutoff)
        .run(),
      context.env.PROJECT_CLARITY_DB
        .prepare("DELETE FROM site_chat_sessions WHERE expires_at <= ?1")
        .bind(cutoff)
        .run(),
    ]);

    return jsonResponse({
      ok: true,
      purged: clarity.meta?.changes ?? 0,
      chatPurged: chat.meta?.changes ?? 0,
      sessionsPurged: sessions.meta?.changes ?? 0,
      cutoff,
    });
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: { request: Request; env: Env }) =>
  handlePurge(context);
