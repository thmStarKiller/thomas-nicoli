import { HttpError } from "./http";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyTurnstile(options: {
  secret?: string;
  token: string;
  remoteIp?: string;
  expectedHostname: string;
  expectedAction: string;
  fetcher?: typeof fetch;
}): Promise<void> {
  if (!options.secret) throw new HttpError(503, "turnstile_not_configured");
  if (!options.token) throw new HttpError(400, "turnstile_required");

  const response = await (options.fetcher ?? fetch)(VERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: options.secret,
      response: options.token,
      ...(options.remoteIp ? { remoteip: options.remoteIp } : {}),
    }),
  });
  if (!response.ok) throw new HttpError(502, "turnstile_unavailable");

  const result = (await response.json()) as TurnstileResult;
  const officialAlwaysPassTestSecret = options.secret === "1x0000000000000000000000000000000AA";
  const hostnameMatches = officialAlwaysPassTestSecret || !result.hostname || result.hostname === options.expectedHostname;
  const actionMatches = officialAlwaysPassTestSecret || !result.action || result.action === options.expectedAction;
  if (!result.success || !hostnameMatches || !actionMatches) {
    throw new HttpError(400, "turnstile_invalid");
  }
}
