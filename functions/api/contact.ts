import {
  CONTACT_BUDGET_IDS,
  CONTACT_LIMITS,
  CONTACT_PACKAGE_IDS,
  CONTACT_SERVICE_IDS,
  CONTACT_TIMING_IDS,
  SUPPORTED_LANGUAGES,
  isAllowedValue,
} from "../../src/lib/project-clarity/contracts";
import {
  HttpError,
  assertSameOrigin,
  cleanMultiline,
  cleanSingleLine,
  escapeHtml,
  isEmail,
  isHttpUrl,
  jsonResponse,
  neutralizeMarkup,
  readBoundedBody,
  requestIp,
} from "../_lib/http";
import { enforceRateLimit } from "../_lib/rate-limit";
import { verifyTurnstile } from "../_lib/turnstile";
import type { BaseEnv } from "../_lib/types";

type Env = BaseEnv;

type HandlerContext = { request: Request; env: Env };

type ContactInput = {
  name: string;
  businessName: string;
  email: string;
  website: string;
  timing: string;
  location: string;
  service: string;
  budget: string;
  package: string;
  message: string;
  locale: string;
  consent: boolean;
  company: string;
  startedAt: number;
  turnstileToken: string;
};

const cleanInput = (body: Record<string, unknown>): ContactInput => ({
  name: cleanSingleLine(body.name, CONTACT_LIMITS.name),
  businessName: cleanSingleLine(body.businessName, CONTACT_LIMITS.businessName),
  email: cleanSingleLine(body.email, CONTACT_LIMITS.email).toLowerCase(),
  website: cleanSingleLine(body.website, CONTACT_LIMITS.website),
  timing: cleanSingleLine(body.timing, CONTACT_LIMITS.timing),
  location: cleanSingleLine(body.location, CONTACT_LIMITS.location),
  service: cleanSingleLine(body.service, CONTACT_LIMITS.service),
  budget: cleanSingleLine(body.budget, CONTACT_LIMITS.budget),
  package: cleanSingleLine(body.package, CONTACT_LIMITS.budget),
  message: cleanMultiline(body.message, CONTACT_LIMITS.message),
  locale: cleanSingleLine(body.locale, 2),
  consent: body.consent === true || body.consent === "true" || body.consent === "on",
  company: cleanSingleLine(body.company, 100),
  startedAt: Number(body.startedAt ?? 0),
  turnstileToken: cleanSingleLine(
    body.turnstileToken ?? body["cf-turnstile-response"],
    2_048,
  ),
});

function validationErrors(input: ContactInput): string[] {
  const errors: string[] = [];
  if (input.name.length < 2) errors.push("name");
  if (!isEmail(input.email)) errors.push("email");
  if (!isHttpUrl(input.website)) errors.push("website");
  if (!isAllowedValue(SUPPORTED_LANGUAGES, input.locale)) errors.push("locale");
  if (!isAllowedValue(CONTACT_SERVICE_IDS, input.service)) errors.push("service");
  if (!isAllowedValue(CONTACT_BUDGET_IDS, input.budget)) errors.push("budget");
  if (!isAllowedValue(CONTACT_PACKAGE_IDS, input.package)) errors.push("package");
  if (!isAllowedValue(CONTACT_TIMING_IDS, input.timing)) errors.push("timing");
  if (input.message.length < 20) errors.push("message");
  if (!input.consent) errors.push("consent");
  return errors;
}

function textLine(label: string, value: string): string {
  return `${label}: ${neutralizeMarkup(value) || "—"}`;
}

export async function handleContact(
  context: HandlerContext,
  dependencies: { fetcher?: typeof fetch; now?: number } = {},
): Promise<Response> {
  try {
    assertSameOrigin(context.request);
    const body = await readBoundedBody(context.request, CONTACT_LIMITS.bodyBytes);
    const input = cleanInput(body);

    if (input.company) return jsonResponse({ ok: true });

    const now = dependencies.now ?? Date.now();
    if (input.startedAt && now - input.startedAt < 1_200) {
      return jsonResponse({ ok: false, error: "too_fast" }, 400);
    }

    const errors = validationErrors(input);
    if (errors.length) return jsonResponse({ ok: false, error: "invalid_fields", fields: errors }, 400);

    const url = new URL(context.request.url);
    await verifyTurnstile({
      secret: context.env.TURNSTILE_SECRET_KEY,
      token: input.turnstileToken,
      remoteIp: requestIp(context.request),
      expectedHostname: url.hostname,
      expectedAction: "contact",
      fetcher: dependencies.fetcher,
    });

    await enforceRateLimit({
      database: context.env.PROJECT_CLARITY_DB,
      scope: "contact",
      identity: requestIp(context.request),
      limit: 5,
      windowSeconds: 3_600,
      now: Math.floor(now / 1_000),
    });

    if (!context.env.RESEND_API_KEY || !context.env.RESEND_TO) {
      throw new HttpError(503, "email_not_configured");
    }

    const from = context.env.RESEND_FROM_EMAIL?.trim()
      || (context.env.MAIL_DOMAIN?.trim()
        ? `Thomas Nicoli Consulting <bonjour@${context.env.MAIL_DOMAIN.trim()}>`
        : "Thomas Nicoli Consulting <onboarding@resend.dev>");

    const subject = `Website enquiry — ${input.name}`;
    const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br />");
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;color:#121215;line-height:1.55">
        <h1 style="font-size:22px">New website enquiry</h1>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Business:</strong> ${escapeHtml(input.businessName || "—")}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Website:</strong> ${escapeHtml(input.website || "—")}</p>
        <p><strong>Timing:</strong> ${escapeHtml(input.timing || "—")}</p>
        <p><strong>City / country:</strong> ${escapeHtml(input.location || "—")}</p>
        <p><strong>Service:</strong> ${escapeHtml(input.service)}</p>
        <p><strong>Budget:</strong> ${escapeHtml(input.budget || "—")}</p>
        <p><strong>Package:</strong> ${escapeHtml(input.package || "—")}</p>
        <p><strong>Language:</strong> ${escapeHtml(input.locale)}</p>
        <hr style="border:0;border-top:1px solid #ddd" />
        <p>${safeMessage}</p>
      </div>`;
    const text = [
      "New website enquiry",
      textLine("Name", input.name),
      textLine("Business", input.businessName),
      textLine("Email", input.email),
      textLine("Website", input.website),
      textLine("Timing", input.timing),
      textLine("City / country", input.location),
      textLine("Service", input.service),
      textLine("Budget", input.budget),
      textLine("Package", input.package),
      textLine("Language", input.locale),
      "",
      neutralizeMarkup(input.message),
    ].join("\n");

    const response = await (dependencies.fetcher ?? fetch)("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${context.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [context.env.RESEND_TO],
        reply_to: input.email,
        subject,
        html,
        text,
      }),
    });
    if (!response.ok) throw new HttpError(502, "email_delivery_failed");

    return jsonResponse({ ok: true, delivered: true });
  } catch (error) {
    if (error instanceof HttpError) {
      return jsonResponse({ ok: false, error: error.code }, error.status);
    }
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

export const onRequestPost = (context: { request: Request; env: Env }) =>
  handleContact(context);

export const onRequestOptions = () =>
  new Response(null, { status: 405, headers: { allow: "POST" } });
