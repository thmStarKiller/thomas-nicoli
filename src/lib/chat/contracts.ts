import { z } from "zod";

export const CHAT_LIMITS = {
  bodyBytes: 16_384,
  message: 600,
  historyItem: 900,
  historyItems: 10,
  reply: 1_000,
  summary: 700,
  suggestion: 90,
  suggestions: 3,
  pagePath: 180,
  sessionTurns: 12,
} as const;

export const chatLocaleSchema = z.enum(["es", "en", "fr"]);

export const chatSessionRequestSchema = z.object({
  sessionId: z.string().uuid(),
  locale: chatLocaleSchema,
  turnstileToken: z.string().min(1).max(2_048),
  company: z.string().max(100).default(""),
}).strict();

const chatHistoryItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(CHAT_LIMITS.historyItem),
}).strict();

export const chatRequestSchema = z.object({
  sessionId: z.string().uuid(),
  sessionToken: z.string().uuid(),
  interactionId: z.string().uuid(),
  turnIndex: z.number().int().min(1).max(CHAT_LIMITS.sessionTurns),
  locale: chatLocaleSchema,
  pagePath: z.string().trim().min(1).max(CHAT_LIMITS.pagePath).regex(/^\/(es|en|fr)(?:\/[^\s?#]*)?$/),
  message: z.string().trim().min(2).max(CHAT_LIMITS.message),
  history: z.array(chatHistoryItemSchema).max(CHAT_LIMITS.historyItems),
  company: z.string().max(100).default(""),
}).strict();

export const chatAiOutputSchema = z.object({
  reply: z.string().trim().min(1).max(CHAT_LIMITS.reply),
  summary: z.string().trim().min(1).max(CHAT_LIMITS.summary),
  intent: z.string().trim().min(1).max(80),
  urgency: z.enum(["low", "medium", "high"]),
  suggestions: z.array(z.string().trim().min(1).max(CHAT_LIMITS.suggestion)).max(CHAT_LIMITS.suggestions),
});

export type ChatLocale = z.infer<typeof chatLocaleSchema>;
export type ChatSessionRequest = z.infer<typeof chatSessionRequestSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatAiOutput = z.infer<typeof chatAiOutputSchema>;
