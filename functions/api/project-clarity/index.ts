import {
  CLARITY_LIMITS,
  type ProjectClarityInput,
} from "../../../src/lib/project-clarity/contracts";
import {
  HttpError,
  assertSameOrigin,
  jsonResponse,
  readBoundedBody,
  requestIp,
  sha256,
} from "../../_lib/http";
import { enforceRateLimit } from "../../_lib/rate-limit";
import {
  PUBLIC_SOURCE,
  buildOwnerNotification,
  normalizeProjectClarityBody,
  projectClaritySchema,
  retentionDate,
  submissionId,
} from "../../_lib/project-clarity";
import { verifyTurnstile } from "../../_lib/turnstile";
import type { BaseEnv, D1DatabaseLike } from "../../_lib/types";

interface Env extends BaseEnv {
  PROJECT_CLARITY_SUBMISSIONS_ENABLED?: string;
  PROJECT_CLARITY_LEGAL_APPROVED?: string;
  PROJECT_CLARITY_CONSENT_VERSION?: string;
  PROJECT_CLARITY_RETENTION_DAYS?: string;
}

type QueueRow = {
  submission_id: string;
  status: string;
  created_at: string;
};

async function sendNotification(
  env: Env,
  input: ProjectClarityInput,
  id: string,
  fetcher: typeof fetch,
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.RESEND_TO) return false;
  const notification = buildOwnerNotification(id, input);
  const from = env.RESEND_FROM_EMAIL?.trim()
    || (env.MAIL_DOMAIN?.trim()
      ? `Thomas Nicoli Consulting <bonjour@${env.MAIL_DOMAIN.trim()}>`
      : "Thomas Nicoli Consulting <onboarding@resend.dev>");
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [env.RESEND_TO],
      reply_to: input.email,
      subject: notification.subject,
      text: notification.text,
      html: notification.html,
    }),
  });
  return response.ok;
}

async function findByIdempotency(database: D1DatabaseLike, key: string): Promise<QueueRow | null> {
  return database
    .prepare(
      "SELECT submission_id, status, created_at FROM project_clarity_submissions WHERE idempotency_key = ?1",
    )
    .bind(key)
    .first<QueueRow>();
}

export async function handleProjectClaritySubmission(
  context: { request: Request; env: Env },
  dependencies: { fetcher?: typeof fetch; now?: Date; random?: string } = {},
): Promise<Response> {
  try {
    assertSameOrigin(context.request);
    if (
      context.env.PROJECT_CLARITY_SUBMISSIONS_ENABLED !== "true"
      || context.env.PROJECT_CLARITY_LEGAL_APPROVED !== "true"
    ) {
      throw new HttpError(503, "legal_checkpoint");
    }
    if (!context.env.PROJECT_CLARITY_DB) throw new HttpError(503, "queue_not_configured");

    const retentionDays = Number(context.env.PROJECT_CLARITY_RETENTION_DAYS ?? "");
    if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 3_650) {
      throw new HttpError(503, "retention_not_approved");
    }
    const consentVersion = context.env.PROJECT_CLARITY_CONSENT_VERSION?.trim();
    if (!consentVersion) throw new HttpError(503, "consent_not_approved");

    const body = await readBoundedBody(context.request, CLARITY_LIMITS.bodyBytes);
    const normalized = normalizeProjectClarityBody(body);
    if (normalized.company) return jsonResponse({ ok: true, queued: true });
    const parsed = projectClaritySchema.safeParse(normalized);
    if (!parsed.success) {
      return jsonResponse(
        {
          ok: false,
          error: "invalid_fields",
          fields: [...new Set(parsed.error.issues.map((issue) => String(issue.path[0] ?? "form")))],
        },
        400,
      );
    }
    const input = parsed.data as ProjectClarityInput;
    if (input.consentVersion !== consentVersion) throw new HttpError(400, "consent_version_invalid");

    const url = new URL(context.request.url);
    await verifyTurnstile({
      secret: context.env.TURNSTILE_SECRET_KEY,
      token: input.turnstileToken,
      remoteIp: requestIp(context.request),
      expectedHostname: url.hostname,
      expectedAction: "project_clarity",
      fetcher: dependencies.fetcher,
    });
    await enforceRateLimit({
      database: context.env.PROJECT_CLARITY_DB,
      scope: "project-clarity",
      identity: requestIp(context.request),
      limit: 3,
      windowSeconds: 3_600,
      now: Math.floor((dependencies.now ?? new Date()).getTime() / 1_000),
    });

    const idempotencyHash = await sha256(`project-clarity:${input.idempotencyKey}`);
    const existing = await findByIdempotency(context.env.PROJECT_CLARITY_DB, idempotencyHash);
    if (existing) {
      return jsonResponse({
        ok: true,
        queued: true,
        duplicate: true,
        referenceId: existing.submission_id,
        status: existing.status,
        summary: {
          buyerType: input.buyerType,
          stuck: input.stuck,
          assets: input.assets,
          outcome: input.outcome,
          timingConstraints: input.timingConstraints,
          responseLanguage: input.responseLanguage,
        },
      });
    }

    const now = dependencies.now ?? new Date();
    const id = submissionId(now, dependencies.random);
    const createdAt = now.toISOString();
    const payload = {
      ...input,
      turnstileToken: undefined,
      idempotencyKey: undefined,
      company: undefined,
    };
    const result = await context.env.PROJECT_CLARITY_DB
      .prepare(
        `INSERT OR IGNORE INTO project_clarity_submissions
          (submission_id, idempotency_key, created_at, updated_at, status, language,
           buyer_type, consent_version, retention_until, source, payload_json)
         VALUES (?1, ?2, ?3, ?3, 'queued', ?4, ?5, ?6, ?7, ?8, ?9)`,
      )
      .bind(
        id,
        idempotencyHash,
        createdAt,
        input.responseLanguage,
        input.buyerType,
        input.consentVersion,
        retentionDate(now, retentionDays),
        PUBLIC_SOURCE,
        JSON.stringify(payload),
      )
      .run();

    if ((result.meta?.changes ?? 0) === 0) {
      const duplicate = await findByIdempotency(context.env.PROJECT_CLARITY_DB, idempotencyHash);
      if (!duplicate) throw new HttpError(503, "queue_conflict");
      return jsonResponse({ ok: true, queued: true, duplicate: true, referenceId: duplicate.submission_id });
    }

    const delivered = await sendNotification(
      context.env,
      input,
      id,
      dependencies.fetcher ?? fetch,
    ).catch(() => false);
    await context.env.PROJECT_CLARITY_DB
      .prepare(
        "UPDATE project_clarity_submissions SET notification_status = ?1, updated_at = ?2 WHERE submission_id = ?3",
      )
      .bind(delivered ? "delivered" : "failed", new Date().toISOString(), id)
      .run();

    return jsonResponse(
      {
        ok: true,
        queued: true,
        referenceId: id,
        summary: {
          buyerType: input.buyerType,
          stuck: input.stuck,
          assets: input.assets,
          outcome: input.outcome,
          timingConstraints: input.timingConstraints,
          responseLanguage: input.responseLanguage,
        },
      },
      202,
    );
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ ok: false, error: error.code }, error.status);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: { request: Request; env: Env }) =>
  handleProjectClaritySubmission(context);

export const onRequestOptions = () =>
  new Response(null, { status: 405, headers: { allow: "POST" } });
