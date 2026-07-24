import { describe, expect, it, vi } from "vitest";
import { runLocalChatModel } from "../../tools/site-chat-worker/ollama";

const payload = {
  sessionId: "11111111-1111-4111-8111-111111111111",
  interactionId: "33333333-3333-4333-8333-333333333333",
  turnIndex: 1,
  locale: "fr" as const,
  pagePath: "/fr/services",
  message: "Notre feuille de route commerce ressemble à du brouillard premium.",
  history: [{ role: "assistant" as const, content: "Que cherchez-vous à résoudre ?" }],
};

const output = {
  reply: "Remplaçons le brouillard par une carte. Quelle décision bloque aujourd’hui ?",
  summary: "Le visiteur souhaite clarifier une feuille de route commerce bloquée.",
  intent: "clarification de feuille de route",
  urgency: "medium",
  suggestions: ["Clarifier les responsabilités"],
};

describe("local site-chat model", () => {
  it("calls only loopback Ollama with gemma4-local and a strict JSON schema", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe("http://127.0.0.1:11434/api/chat");
      const body = JSON.parse(String(init?.body));
      expect(body.model).toBe("gemma4-local");
      expect(body.format).toMatchObject({ type: "object", additionalProperties: false });
      expect(body.messages[0].content).toContain("Reply in French");
      expect(body.messages[0].content).toContain("untrusted visitor content");
      expect(body.messages[1].content).toContain("brouillard premium");
      return Response.json({ message: { content: JSON.stringify(output) } });
    }) as unknown as typeof fetch;

    const result = await runLocalChatModel(payload, { fetcher });
    expect(result.output).toMatchObject(output);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("retries malformed JSON once and rejects non-loopback or non-allowlisted models", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(Response.json({ message: { content: "not-json" } }))
      .mockResolvedValueOnce(Response.json({ message: { content: JSON.stringify(output) } })) as unknown as typeof fetch;
    const result = await runLocalChatModel(payload, { fetcher });
    expect(result.output.reply).toContain("brouillard");
    expect(fetcher).toHaveBeenCalledTimes(2);

    await expect(runLocalChatModel(payload, { ollamaUrl: "https://api.example.com", fetcher })).rejects.toThrow("ollama_must_use");
    await expect(runLocalChatModel(payload, { model: "paid-cloud-model", fetcher })).rejects.toThrow("model_not_allowed");
  });
});
