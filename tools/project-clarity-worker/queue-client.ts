import type { QueueSubmission } from "./vault";

function endpoint(base: string, path: string) {
  const url = new URL(path, base.endsWith("/") ? base : `${base}/`);
  const local = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) throw new Error("queue_url_must_be_https");
  return url;
}

export async function claimSubmission(options: { baseUrl: string; workerToken: string; fetcher?: typeof fetch }): Promise<QueueSubmission | null> {
  if (!options.workerToken) throw new Error("worker_token_required");
  const response = await (options.fetcher ?? fetch)(endpoint(options.baseUrl, "/api/project-clarity/claim"), {
    method: "POST",
    headers: { authorization: `Bearer ${options.workerToken}` },
  });
  if (response.status === 204) return null;
  if (!response.ok) throw new Error(`claim_failed_${response.status}`);
  const body = await response.json() as { submission?: QueueSubmission };
  if (!body.submission) throw new Error("claim_missing_submission");
  return body.submission;
}

export async function updateState(options: { baseUrl: string; workerToken: string; submissionId: string; status: "needs-review" | "failed" | "completed"; draftMessageId?: string; diagnostic?: string; fetcher?: typeof fetch }) {
  const response = await (options.fetcher ?? fetch)(endpoint(options.baseUrl, "/api/project-clarity/state"), {
    method: "POST",
    headers: { authorization: `Bearer ${options.workerToken}`, "content-type": "application/json" },
    body: JSON.stringify({ submissionId: options.submissionId, status: options.status, draftMessageId: options.draftMessageId ?? "", diagnostic: (options.diagnostic ?? "").slice(0, 400) }),
  });
  if (!response.ok) throw new Error(`state_update_failed_${response.status}`);
}
