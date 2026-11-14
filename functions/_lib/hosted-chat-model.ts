import { chatJobPayloadSchema, type ChatAiOutput, type ChatJobPayload } from "../../src/lib/chat/contracts";
import { buildChatModelInput, CHAT_OUTPUT_JSON_SCHEMA, validateChatModelText } from "./chat";

/** NVIDIA's hosted, OpenAI-compatible endpoint. The key never leaves the Functions runtime. */
export const HOSTED_CHAT_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
export const HOSTED_CHAT_MODEL = "nvidia/nemotron-3.5-super-vl-120b-a12b";

/** Only Nemotron models from NVIDIA's own namespace may be selected by configuration. */
const MODEL_PATTERN = /^nvidia\/[a-z0-9.-]*nemotron[a-z0-9.-]*$/;

export class HostedChatModelError extends Error {
  constructor(public readonly diagnostic: string) {
    super("hosted_chat_model_failed");
  }
}

export function resolveHostedChatModel(configured?: string): string {
  const candidate = configured?.trim();
  return candidate && MODEL_PATTERN.test(candidate) ? candidate : HOSTED_CHAT_MODEL;
}

/** Reasoning models may wrap private working in think tags; it is never shown or stored. */
function stripReasoning(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^[\s\S]*<\/think>/i, "").trim();
}

export async function runHostedChatModel(
  payload: unknown,
  options: { apiKey: string; model?: string; fetcher?: typeof fetch; timeoutMs?: number; attempts?: number },
): Promise<{ output: ChatAiOutput; payload: ChatJobPayload; model: string }> {
  const validated = chatJobPayloadSchema.safeParse(payload);
  if (!validated.success) throw new HostedChatModelError("invalid_job_payload");
  const safePayload = validated.data;
  const apiKey = options.apiKey.trim();
  if (!apiKey) throw new HostedChatModelError("hosted_key_missing");
  const model = resolveHostedChatModel(options.model);
  const modelInput = buildChatModelInput(safePayload);
  const attempts = Math.max(1, Math.min(options.attempts ?? 2, 3));
  let diagnostic = "no_response";
  // Measured on 14 Nov 2026: the schema makes every reply parse, and answering
  // without the private reasoning pass takes about 2 seconds instead of 10.
  // If the provider ever rejects these options, the next attempt goes without.
  let strict = true;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await (options.fetcher ?? fetch)(HOSTED_CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          authorization: "Bearer " + apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        signal: AbortSignal.timeout(options.timeoutMs ?? 25_000),
        body: JSON.stringify({
          model,
          stream: false,
          temperature: 0.45,
          top_p: 0.9,
          max_tokens: 2_048,
          messages: modelInput.messages,
          ...(strict
            ? {
                response_format: {
                  type: "json_schema",
                  json_schema: { name: "chat_reply", strict: true, schema: CHAT_OUTPUT_JSON_SCHEMA },
                },
                chat_template_kwargs: { enable_thinking: false },
              }
            : {}),
        }),
      });
      if (!response.ok) {
        diagnostic = `hosted_http_${response.status}`;
        if (response.status === 400 || response.status === 422) strict = false;
        // A rejected key or an unknown model will not improve on a second try.
        if (response.status === 401 || response.status === 403 || response.status === 404) break;
        continue;
      }
      const envelope = await response.json() as { choices?: Array<{ message?: { content?: string | null } }> };
      const text = stripReasoning(String(envelope.choices?.[0]?.message?.content ?? ""));
      const output = validateChatModelText(text);
      return { output, payload: safePayload, model };
    } catch (error) {
      // Never keep provider text or headers: only a short, key-free reason.
      const name = error instanceof Error ? error.name : "";
      diagnostic = name === "TimeoutError" || name === "AbortError" ? "hosted_timeout" : "hosted_invalid_output";
    }
  }
  throw new HostedChatModelError(diagnostic);
}
