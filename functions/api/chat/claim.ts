import { HttpError, jsonResponse } from "../../_lib/http";
import { requireWorkerBearer } from "../../_lib/worker-auth";
import type { BaseEnv } from "../../_lib/types";

interface Env extends BaseEnv {
  PROJECT_CLARITY_WORKER_TOKEN?: string;
}

export async function handleChatClaim(context: { request: Request; env: Env }): Promise<Response> {
  try {
    await requireWorkerBearer(context.request, context.env.PROJECT_CLARITY_WORKER_TOKEN);
    if (!context.env.PROJECT_CLARITY_DB) throw new HttpError(503, "chat_store_not_configured");
    const now = new Date();
    const lease = new Date(now.getTime() + 2 * 60_000).toISOString();
    const row = await context.env.PROJECT_CLARITY_DB
      .prepare(
        `UPDATE site_chat_jobs
         SET status = 'processing', updated_at = ?1, lease_until = ?2, attempt_count = attempt_count + 1
         WHERE interaction_id = (
           SELECT interaction_id FROM site_chat_jobs
           WHERE (status = 'queued' OR (status = 'processing' AND lease_until < ?1))
             AND attempt_count < 3
           ORDER BY created_at ASC LIMIT 1
         )
         RETURNING interaction_id, session_id, turn_index, created_at, language, page_path,
           payload_json, retention_until, attempt_count`,
      )
      .bind(now.toISOString(), lease)
      .first<Record<string, unknown>>();
    if (!row) return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
    return jsonResponse({
      ok: true,
      job: {
        ...row,
        payload: JSON.parse(String(row.payload_json)),
        payload_json: undefined,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: { request: Request; env: Env }) => handleChatClaim(context);
