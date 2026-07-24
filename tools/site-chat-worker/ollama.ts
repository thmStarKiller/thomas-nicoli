import { chatJobPayloadSchema, type ChatAiOutput, type ChatJobPayload } from "../../src/lib/chat/contracts";
import { buildChatModelInput, CHAT_OUTPUT_JSON_SCHEMA, validateChatModelText } from "../../functions/_lib/chat";

export class LocalChatModelError extends Error {
  constructor(public readonly diagnostic: string) {
    super("local_chat_model_failed");
  }
}

export async function runLocalChatModel(
  payload: unknown,
  options: { ollamaUrl?: string; model?: string; fetcher?: typeof fetch } = {},
): Promise<{ output: ChatAiOutput; payload: ChatJobPayload }> {
  const validatedPayload = chatJobPayloadSchema.safeParse(payload);
  if (!validatedPayload.success) throw new LocalChatModelError("invalid_job_payload");
  const safePayload = validatedPayload.data;
  const ollamaUrl = new URL(options.ollamaUrl ?? "http://127.0.0.1:11434");
  if (ollamaUrl.protocol !== "http:" || ollamaUrl.hostname !== "127.0.0.1" || ollamaUrl.port !== "11434") {
    throw new Error("ollama_must_use_127.0.0.1_11434");
  }
  const model = options.model ?? "gemma4-local";
  if (!new Set(["gemma4-local", "gemma4-local:latest"]).has(model)) throw new Error("model_not_allowed");
  const modelInput = buildChatModelInput(safePayload);
  let diagnostic = "no_response";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await (options.fetcher ?? fetch)(new URL("/api/chat", ollamaUrl), {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(120_000),
        body: JSON.stringify({
          model,
          stream: false,
          format: CHAT_OUTPUT_JSON_SCHEMA,
          keep_alive: "10m",
          options: { temperature: 0.45, num_ctx: 8_192, num_predict: 1_000 },
          messages: modelInput.messages,
        }),
      });
      if (!response.ok) throw new Error(`ollama_http_${response.status}`);
      const envelope = await response.json() as { message?: { content?: string } };
      const output = validateChatModelText(envelope.message?.content ?? "");
      return { output, payload: safePayload };
    } catch (error) {
      diagnostic = String(error instanceof Error ? error.message : error).slice(0, 300);
    }
  }
  throw new LocalChatModelError(diagnostic);
}
