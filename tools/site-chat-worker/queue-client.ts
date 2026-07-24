import type { ChatAiOutput, ChatJobPayload } from "../../src/lib/chat/contracts";

export interface ClaimedChatJob {
  interaction_id: string;
  session_id: string;
  turn_index: number;
  language: "es" | "en" | "fr";
  attempt_count: number;
  payload: ChatJobPayload;
}

function endpoint(base: string, path: string) {
  const url = new URL(path, base.endsWith("/") ? base : `${base}/`);
  const local = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) throw new Error("queue_url_must_be_https");
  return url;
}

export async function claimChatJob(options: { baseUrl: string; workerToken: string; fetcher?: typeof fetch }): Promise<ClaimedChatJob | null> {
  const response = await (options.fetcher ?? fetch)(endpoint(options.baseUrl, "/api/chat/claim"), {
    method: "POST",
    headers: { authorization: "Bearer " + options.workerToken },
  });
  if (response.status === 204) return null;
  if (!response.ok) throw new Error(`chat_claim_failed_${response.status}`);
  const body = await response.json() as { job?: ClaimedChatJob };
  if (!body.job) throw new Error("chat_claim_missing_job");
  return body.job;
}

export async function completeChatJob(options: {
  baseUrl: string;
  workerToken: string;
  interactionId: string;
  status: "completed" | "failed";
  output?: ChatAiOutput;
  diagnostic?: string;
  fetcher?: typeof fetch;
}) {
  const response = await (options.fetcher ?? fetch)(endpoint(options.baseUrl, "/api/chat/complete"), {
    method: "POST",
    headers: { authorization: "Bearer " + options.workerToken, "content-type": "application/json" },
    body: JSON.stringify({
      interactionId: options.interactionId,
      status: options.status,
      output: options.output,
      diagnostic: (options.diagnostic ?? "").slice(0, 300),
    }),
  });
  if (!response.ok) throw new Error(`chat_complete_failed_${response.status}`);
  return response.json() as Promise<{ ok: true; interactionId: string; status: string; emailed?: boolean }>;
}
