interface Env {
  RESEND_API_KEY?: string;
  RESEND_TO?: string;
  MAIL_DOMAIN?: string;
  RESEND_FROM_EMAIL?: string;
}

interface ContactPayload {
  name?: unknown;
  businessName?: unknown;
  email?: unknown;
  service?: unknown;
  budget?: unknown;
  message?: unknown;
  consent?: unknown;
  company?: unknown;
  formStartedAt?: unknown;
  lang?: unknown;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const responseHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength + 1) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  let payload: ContactPayload;
  try {
    const input = await request.json();
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid body");
    payload = input as ContactPayload;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const name = text(payload.name, 120);
  const businessName = text(payload.businessName, 160);
  const email = text(payload.email, 200);
  const service = text(payload.service, 120);
  const budget = text(payload.budget, 60);
  const message = text(payload.message, 5000);
  const company = text(payload.company, 200);
  const lang = ["es", "en", "fr"].includes(String(payload.lang)) ? String(payload.lang) : "es";
  const fields: string[] = [];

  if (name.length < 2 || name.length > 120) fields.push("name");
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.push("email");
  if (message.length < 20 || message.length > 5000) fields.push("message");
  if (payload.consent !== true) fields.push("consent");
  if (businessName.length > 160) fields.push("businessName");
  if (service.length > 120) fields.push("service");
  if (budget.length > 60) fields.push("budget");

  if (fields.length) return json({ ok: false, error: "validation", fields }, 400);

  // Honeypot and timing trap: accept silently so automated submitters get no signal.
  const startedAt = Number(payload.formStartedAt ?? 0);
  if (company || (startedAt > 0 && Date.now() - startedAt < 1500)) {
    return json({ ok: true, delivered: false });
  }

  const apiKey = env.RESEND_API_KEY?.trim();
  const recipient = env.RESEND_TO?.trim();
  const domain = env.MAIL_DOMAIN?.trim();
  const from =
    env.RESEND_FROM_EMAIL?.trim() ||
    (domain ? `Leads <noreply@${domain}>` : "Thomas Nicoli Consulting <onboarding@resend.dev>");

  if (!apiKey || !recipient) {
    console.error("[contact] RESEND_API_KEY or RESEND_TO is missing.");
    return json({ ok: false, error: "email_not_configured" }, 503);
  }

  const subjectName = name.replace(/[\r\n]+/g, " ");
  const rows = [
    ["Name", name],
    ["Business", businessName],
    ["Email", email],
    ["Service", service],
    ["Budget", budget],
    ["Language", lang.toUpperCase()],
  ].filter(([, value]) => value);
  const plainText = [
    `New website enquiry (${lang})`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message,
  ].join("\n");
  const html = `
    <div style="background:#f4f1ea;padding:32px;color:#121215;font-family:Arial,sans-serif">
      <div style="max-width:640px;margin:auto;background:#fff;padding:32px;border-top:6px solid #1f3be0">
        <p style="margin:0 0 8px;color:#1f3be0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Thomas Nicoli Consulting</p>
        <h1 style="margin:0 0 28px;font-size:28px">New website enquiry</h1>
        <table role="presentation" style="border-collapse:collapse;font-size:14px">
          ${rows
            .map(
              ([label, value]) =>
                `<tr><td style="padding:5px 20px 5px 0;color:#666">${label}</td><td style="padding:5px 0">${escapeHtml(value)}</td></tr>`,
            )
            .join("")}
        </table>
        <div style="margin-top:28px;padding:20px;background:#f4f1ea;white-space:pre-wrap;font-size:15px;line-height:1.6">${escapeHtml(message)}</div>
      </div>
    </div>`;

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `Website enquiry — ${subjectName}${businessName ? ` (${businessName})` : ""}`,
        text: plainText,
        html,
      }),
    });

    if (!resendResponse.ok) {
      console.error(`[contact] Resend returned HTTP ${resendResponse.status}.`);
      return json({ ok: false, error: "email_delivery_failed" }, 502);
    }

    return json({ ok: true, delivered: true });
  } catch {
    console.error("[contact] Resend request failed.");
    return json({ ok: false, error: "email_delivery_failed" }, 502);
  }
}
