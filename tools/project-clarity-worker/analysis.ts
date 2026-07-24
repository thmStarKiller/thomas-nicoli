import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import schema from "./analysis-schema.json";
import { ANALYSIS_SERVICE_IDS, RISK_FLAGS, SUPPORTED_LANGUAGES } from "../../src/lib/project-clarity/contracts";

const here = dirname(fileURLToPath(import.meta.url));

const bounded = (min: number, max: number) => z.string().min(min).max(max);
export const reportSchema = z.object({
  schemaVersion: z.literal("1.0"),
  language: z.enum(SUPPORTED_LANGUAGES),
  summary: bounded(20, 600),
  observations: z.array(bounded(5, 240)).min(1).max(5),
  nextStep: bounded(10, 400),
  notYet: z.array(bounded(5, 240)).min(1).max(3),
  quickWins: z.array(bounded(5, 240)).length(3),
  discoveryQuestions: z.array(bounded(5, 240)).min(2).max(6),
  recommendedService: z.object({
    id: z.enum(ANALYSIS_SERVICE_IDS),
    label: bounded(2, 100),
    rationale: bounded(10, 300),
  }).strict(),
  missingInformation: z.array(bounded(3, 200)).max(6),
  confidence: z.number().min(0).max(1),
  riskFlags: z.array(z.enum(RISK_FLAGS)).max(5),
}).strict().superRefine((value, context) => {
  if (value.riskFlags.includes("none") && value.riskFlags.length > 1) {
    context.addIssue({ code: "custom", path: ["riskFlags"], message: "none cannot be combined" });
  }
});

export type AnalysisReport = z.infer<typeof reportSchema>;

export function sanitizeVisitorText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " [script removed] ")
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[\w-]*/g, " "))
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*])\s+/gm, "")
    .replace(/[*_~`]/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeLeadPayload(payload: Record<string, unknown>) {
  const safe = {
    buyerType: sanitizeVisitorText(payload.buyerType, 20),
    stuck: sanitizeVisitorText(payload.stuck, 800),
    assets: sanitizeVisitorText(payload.assets, 800),
    outcome: sanitizeVisitorText(payload.outcome, 600),
    timingConstraints: sanitizeVisitorText(payload.timingConstraints, 500),
    responseLanguage: sanitizeVisitorText(payload.responseLanguage, 2),
    name: sanitizeVisitorText(payload.name, 100),
    email: sanitizeVisitorText(payload.email, 254),
    website: sanitizeVisitorText(payload.website, 300),
    location: sanitizeVisitorText(payload.location, 120),
  };
  const total = safe.stuck.length + safe.assets.length + safe.outcome.length + safe.timingConstraints.length;
  if (total > 2_800) throw new Error("visitor_text_too_large");
  if (!SUPPORTED_LANGUAGES.includes(safe.responseLanguage as never)) throw new Error("invalid_language");
  return safe;
}

export class InvalidModelOutputError extends Error {
  constructor(public readonly diagnostic: string) {
    super("invalid_model_output");
  }
}

export async function analyzeLead(
  payload: Record<string, unknown>,
  options: {
    ollamaUrl?: string;
    model?: string;
    fetcher?: typeof fetch;
  } = {},
): Promise<{ report: AnalysisReport; sanitized: ReturnType<typeof sanitizeLeadPayload> }> {
  const sanitized = sanitizeLeadPayload(payload);
  const ollamaUrl = new URL(options.ollamaUrl ?? "http://127.0.0.1:11434");
  if (ollamaUrl.protocol !== "http:" || ollamaUrl.hostname !== "127.0.0.1" || ollamaUrl.port !== "11434") {
    throw new Error("ollama_must_use_127.0.0.1_11434");
  }
  const model = options.model ?? "gemma4-local";
  if (!new Set(["gemma4-local", "gemma4-local:latest"]).has(model)) throw new Error("model_not_allowed");
  const system = await readFile(join(here, "professional-system-prompt.txt"), "utf8");
  const user = JSON.stringify({
    label: "UNTRUSTED_VISITOR_DATA",
    requestedLanguage: sanitized.responseLanguage,
    fields: sanitized,
  });
  let diagnostic = "no response";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await (options.fetcher ?? fetch)(new URL("/api/chat", ollamaUrl), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model,
          stream: false,
          format: schema,
          keep_alive: "5m",
          options: { temperature: 0, num_ctx: 4096, num_predict: 1200 },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!response.ok) throw new Error(`ollama_http_${response.status}`);
      const envelope = await response.json() as { message?: { content?: string } };
      const parsed = JSON.parse(envelope.message?.content ?? "");
      const validated = reportSchema.safeParse(parsed);
      if (!validated.success) throw new Error(validated.error.issues.map((issue) => issue.path.join(".")).slice(0, 4).join(","));
      if (validated.data.language !== sanitized.responseLanguage) throw new Error("language_mismatch");
      return { report: validated.data, sanitized };
    } catch (error) {
      diagnostic = String(error instanceof Error ? error.message : error).slice(0, 240);
    }
  }
  throw new InvalidModelOutputError(diagnostic);
}
