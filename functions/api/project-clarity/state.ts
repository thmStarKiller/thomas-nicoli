import { cleanSingleLine, HttpError, jsonResponse, readBoundedBody, sha256 } from "../../_lib/http";
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

export async function handleState(context: { request: Request; env: Env }): Promise<Response> {
  try {
    await requireWorker(context.request, context.env.PROJECT_CLARITY_WORKER_TOKEN);
    if (!context.env.PROJECT_CLARITY_DB) throw new HttpError(503, "queue_not_configured");
    const body = await readBoundedBody(context.request, 2_048);
    const submissionId = cleanSingleLine(body.submissionId, 40);
    const status = cleanSingleLine(body.status, 20);
    const draftMessageId = cleanSingleLine(body.draftMessageId, 180);
    const diagnostic = cleanSingleLine(body.diagnostic, 400);
    if (!/^PC-\d{8}-[A-F0-9]{8}$/.test(submissionId)) throw new HttpError(400, "invalid_submission_id");
    if (!["needs-review", "failed", "completed"].includes(status)) throw new HttpError(400, "invalid_status");
    if (status === "needs-review" && !draftMessageId) throw new HttpError(400, "draft_required");

    const result = await context.env.PROJECT_CLARITY_DB
      .prepare(
        `UPDATE project_clarity_submissions
         SET status = ?1, updated_at = ?2, lease_until = NULL,
             draft_message_id = NULLIF(?3, ''), diagnostic = NULLIF(?4, '')
         WHERE submission_id = ?5 AND status = 'processing'`,
      )
      .bind(status, new Date().toISOString(), draftMessageId, diagnostic, submissionId)
      .run();
    if ((result.meta?.changes ?? 0) !== 1) throw new HttpError(409, "state_conflict");
    return jsonResponse({ ok: true, submissionId, status });
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: { request: Request; env: Env }) =>
  handleState(context);
