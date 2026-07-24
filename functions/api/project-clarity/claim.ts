import { HttpError, jsonResponse, sha256 } from "../../_lib/http";
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

export async function handleClaim(context: { request: Request; env: Env }): Promise<Response> {
  try {
    await requireWorker(context.request, context.env.PROJECT_CLARITY_WORKER_TOKEN);
    if (!context.env.PROJECT_CLARITY_DB) throw new HttpError(503, "queue_not_configured");
    const now = new Date();
    const lease = new Date(now.getTime() + 10 * 60 * 1_000).toISOString();
    const row = await context.env.PROJECT_CLARITY_DB
      .prepare(
        `UPDATE project_clarity_submissions
         SET status = 'processing', updated_at = ?1, lease_until = ?2, attempt_count = attempt_count + 1
         WHERE submission_id = (
           SELECT submission_id FROM project_clarity_submissions
           WHERE (status = 'queued' OR (status = 'processing' AND lease_until < ?1))
             AND attempt_count < 2
           ORDER BY created_at ASC LIMIT 1
         )
         RETURNING submission_id, created_at, updated_at, language, buyer_type, status,
           consent_version, retention_until, source, payload_json, attempt_count`,
      )
      .bind(now.toISOString(), lease)
      .first<Record<string, unknown>>();
    if (!row) return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
    return jsonResponse({ ok: true, submission: { ...row, payload: JSON.parse(String(row.payload_json)), payload_json: undefined } });
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: { request: Request; env: Env }) =>
  handleClaim(context);
