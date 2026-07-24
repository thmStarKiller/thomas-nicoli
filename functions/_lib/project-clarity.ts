import { z } from "zod";
import {
  BUYER_TYPES,
  CLARITY_LIMITS,
  CLARITY_SOURCE,
  SUPPORTED_LANGUAGES,
  type ProjectClarityInput,
} from "../../src/lib/project-clarity/contracts";
import { cleanMultiline, cleanSingleLine, escapeHtml, isEmail, isHttpUrl, neutralizeMarkup } from "./http";

const nonEmpty = (max: number, min = 1) => z.string().trim().min(min).max(max);

export const projectClaritySchema = z
  .object({
    buyerType: z.enum(BUYER_TYPES),
    stuck: nonEmpty(CLARITY_LIMITS.stuck, 10),
    assets: nonEmpty(CLARITY_LIMITS.assets, 2),
    outcome: nonEmpty(CLARITY_LIMITS.outcome, 10),
    timingConstraints: nonEmpty(CLARITY_LIMITS.timingConstraints, 2),
    responseLanguage: z.enum(SUPPORTED_LANGUAGES),
    name: nonEmpty(CLARITY_LIMITS.name, 2),
    email: nonEmpty(CLARITY_LIMITS.email, 6).refine(isEmail),
    website: z.string().trim().max(CLARITY_LIMITS.website).refine(isHttpUrl).optional().default(""),
    location: z.string().trim().max(CLARITY_LIMITS.location).optional().default(""),
    consent: z.literal(true),
    consentVersion: nonEmpty(80, 3),
    idempotencyKey: nonEmpty(CLARITY_LIMITS.idempotencyKey, 8),
    turnstileToken: nonEmpty(2_048, 1),
    company: z.string().max(100).optional().default(""),
  })
  .strict()
  .refine(
    (value) =>
      value.stuck.length + value.assets.length + value.outcome.length + value.timingConstraints.length
      <= CLARITY_LIMITS.totalVisitorText,
    { message: "total_text_too_large" },
  );

export function normalizeProjectClarityBody(body: Record<string, unknown>): Record<string, unknown> {
  return {
    buyerType: cleanSingleLine(body.buyerType, 20),
    stuck: cleanMultiline(body.stuck, CLARITY_LIMITS.stuck),
    assets: cleanMultiline(body.assets, CLARITY_LIMITS.assets),
    outcome: cleanMultiline(body.outcome, CLARITY_LIMITS.outcome),
    timingConstraints: cleanMultiline(body.timingConstraints, CLARITY_LIMITS.timingConstraints),
    responseLanguage: cleanSingleLine(body.responseLanguage, 2),
    name: cleanSingleLine(body.name, CLARITY_LIMITS.name),
    email: cleanSingleLine(body.email, CLARITY_LIMITS.email).toLowerCase(),
    website: cleanSingleLine(body.website, CLARITY_LIMITS.website),
    location: cleanSingleLine(body.location, CLARITY_LIMITS.location),
    consent: body.consent === true || body.consent === "true" || body.consent === "on",
    consentVersion: cleanSingleLine(body.consentVersion, 80),
    idempotencyKey: cleanSingleLine(body.idempotencyKey, CLARITY_LIMITS.idempotencyKey),
    turnstileToken: cleanSingleLine(
      body.turnstileToken ?? body["cf-turnstile-response"],
      2_048,
    ),
    company: cleanSingleLine(body.company, 100),
  };
}

export function submissionId(now = new Date(), random = crypto.randomUUID()): string {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `PC-${date}-${random.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

export function retentionDate(createdAt: Date, days: number): string {
  const value = new Date(createdAt);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString();
}

export function buildOwnerNotification(id: string, input: ProjectClarityInput) {
  const fields: Array<[string, string]> = [
    ["Buyer type", input.buyerType],
    ["What is stuck", input.stuck],
    ["Existing systems/assets", input.assets],
    ["Worthwhile outcome", input.outcome],
    ["Timing/constraint", input.timingConstraints],
    ["Response language", input.responseLanguage],
    ["Name", input.name],
    ["Email", input.email],
    ["Website", input.website || "—"],
    ["City/country", input.location || "—"],
  ];
  return {
    subject: `[PROJECT-CLARITY][${id}] ${input.buyerType}/${input.responseLanguage}`,
    text: [`Project Clarity submission ${id}`, ...fields.map(([key, value]) => `${key}: ${neutralizeMarkup(value)}`)].join("\n\n"),
    html: `<div style="font-family:Inter,Arial,sans-serif;color:#121215;line-height:1.55"><h1>Project Clarity ${escapeHtml(id)}</h1>${fields
      .map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value).replace(/\n/g, "<br />")}</p>`)
      .join("")}</div>`,
  };
}

export const PUBLIC_SOURCE = CLARITY_SOURCE;
