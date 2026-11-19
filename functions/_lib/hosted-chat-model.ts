import { chatJobPayloadSchema, type ChatAiOutput, type ChatJobPayload, type ChatLocale } from "../../src/lib/chat/contracts";
import {
  buildChatModelInput,
  buildChatToneInput,
  CHAT_OUTPUT_JSON_SCHEMA,
  CHAT_TONE_JSON_SCHEMA,
  validateChatModelText,
  type ChatTone,
} from "./chat";

/** NVIDIA's hosted, OpenAI-compatible endpoint. The key never leaves the Functions runtime. */
export const HOSTED_CHAT_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
export const HOSTED_CHAT_MODEL = "nvidia/nemotron-3.5-super-vl-120b-a12b";

/** Only Nemotron models from NVIDIA's own namespace may be selected by configuration. */
const MODEL_PATTERN = /^nvidia\/[a-z0-9.-]*nemotron[a-z0-9.-]*$/;

/** Accurate and steady for real questions; loose for visitors who are playing. */
const SAMPLING: Record<ChatTone, { temperature: number; top_p: number }> = {
  serious: { temperature: 0.45, top_p: 0.9 },
  playful: { temperature: 0.9, top_p: 0.95 },
};

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

type Call = { apiKey: string; model: string; fetcher: typeof fetch };

function post(call: Call, body: Record<string, unknown>, timeoutMs: number): Promise<Response> {
  // Cloudflare's fetch refuses to run as a method of another object
  // ("Illegal invocation"), so it is taken off the object before the call.
  const { fetcher } = call;
  return fetcher(HOSTED_CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: "Bearer " + call.apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({ model: call.model, stream: false, ...body }),
  });
}

function messageText(envelope: unknown): string {
  const content = (envelope as { choices?: Array<{ message?: { content?: string | null } }> }).choices?.[0]?.message?.content;
  return stripReasoning(String(content ?? ""));
}

type VisitorSignals = { tone: ChatTone; language?: ChatLocale };
const REPLY_LOCALES = new Set<string>(["es", "en", "fr"]);

/**
 * A short first call that decides whether the visitor is playing and which
 * language they write in. Anything unexpected counts as serious with no
 * language, so a failure can never make the assistant joke at the wrong
 * moment, and the reply then follows the general language rule.
 */
export async function readVisitorSignals(payload: ChatJobPayload, call: Call, timeoutMs = 8_000): Promise<VisitorSignals> {
  try {
    const response = await post(call, {
      temperature: 0,
      max_tokens: 30,
      messages: buildChatToneInput(payload).messages,
      response_format: { type: "json_schema", json_schema: { name: "chat_tone", strict: true, schema: CHAT_TONE_JSON_SCHEMA } },
      chat_template_kwargs: { enable_thinking: false },
    }, timeoutMs);
    if (!response.ok) return { tone: "serious" };
    const parsed = JSON.parse(messageText(await response.json())) as { tone?: unknown; language?: unknown };
    const language = typeof parsed.language === "string" && REPLY_LOCALES.has(parsed.language) ? parsed.language as ChatLocale : undefined;
    return { tone: parsed.tone === "playful" ? "playful" : "serious", language };
  } catch {
    return { tone: "serious" };
  }
}

export async function detectChatTone(payload: ChatJobPayload, call: Call, timeoutMs = 8_000): Promise<ChatTone> {
  return (await readVisitorSignals(payload, call, timeoutMs)).tone;
}

export async function runHostedChatModel(
  payload: unknown,
  options: { apiKey: string; model?: string; fetcher?: typeof fetch; timeoutMs?: number; attempts?: number; tone?: ChatTone },
): Promise<{ output: ChatAiOutput; payload: ChatJobPayload; model: string; tone: ChatTone }> {
  const validated = chatJobPayloadSchema.safeParse(payload);
  if (!validated.success) throw new HostedChatModelError("invalid_job_payload");
  const safePayload = validated.data;
  const apiKey = options.apiKey.trim();
  if (!apiKey) throw new HostedChatModelError("hosted_key_missing");
  const call: Call = { apiKey, model: resolveHostedChatModel(options.model), fetcher: options.fetcher ?? fetch };
  const signals: VisitorSignals = options.tone ? { tone: options.tone } : await readVisitorSignals(safePayload, call);
  const tone = signals.tone;
  const modelInput = buildChatModelInput(safePayload, tone, signals.language);
  const attempts = Math.max(1, Math.min(options.attempts ?? 2, 3));
  let diagnostic = "no_response";
  // Measured on 14 Nov 2026: the schema makes every reply parse, and answering
  // without the private reasoning pass takes about 2 seconds instead of 10.
  // If the provider ever rejects these options, the next attempt goes without.
  let strict = true;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    let answered = false;
    try {
      const response = await post(call, {
        ...SAMPLING[tone],
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
      }, options.timeoutMs ?? 25_000);
      if (!response.ok) {
        diagnostic = `hosted_http_${response.status}`;
        if (response.status === 400 || response.status === 422) strict = false;
        // A rejected key or an unknown model will not improve on a second try.
        if (response.status === 401 || response.status === 403 || response.status === 404) break;
        continue;
      }
      answered = true;
      const output = validateChatModelText(messageText(await response.json()));
      return { output, payload: safePayload, model: call.model, tone };
    } catch (error) {
      // Never keep provider text or headers: only a short, key-free reason.
      // A request that never got an answer is told apart from a bad answer.
      const name = error instanceof Error ? error.name : "";
      if (name === "TimeoutError" || name === "AbortError") diagnostic = "hosted_timeout";
      else diagnostic = answered ? "hosted_invalid_output" : "hosted_request_failed";
    }
  }
  throw new HostedChatModelError(diagnostic);
}
