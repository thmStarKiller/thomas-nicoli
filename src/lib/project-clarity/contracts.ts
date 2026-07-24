export const SUPPORTED_LANGUAGES = ["es", "en", "fr"] as const;
export type ProjectLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const BUYER_TYPES = ["independent", "digital-team", "unsure"] as const;
export type BuyerType = (typeof BUYER_TYPES)[number];

export const CLARITY_ROUTE_IDS = ["independent", "digital-team", "unsure"] as const;
export type ClarityRouteId = (typeof CLARITY_ROUTE_IDS)[number];

export const CONTACT_SERVICE_IDS = [
  "signature-websites",
  "local-visibility",
  "brand-content-systems",
  "practical-ai-automation",
  "interactive-3d",
  "commerce-crm",
  "delivery-support",
  "discovery",
  "other",
] as const;

export const CONTACT_BUDGET_IDS = [
  "under-1500",
  "1500-3000",
  "3000-6000",
  "over-6000",
  "unsure",
  "",
] as const;

export const CONTACT_TIMING_IDS = [
  "as-soon-as-possible",
  "one-to-three-months",
  "three-to-six-months",
  "exploring",
  "",
] as const;

export const CONTACT_PACKAGE_IDS = ["launch", "signature", "campaign", "custom", ""] as const;

export const ANALYSIS_SERVICE_IDS = [
  "website",
  "local-visibility",
  "brand-content",
  "practical-ai",
  "commerce-crm",
  "delivery-support",
  "discovery",
] as const;

export const RISK_FLAGS = [
  "insufficient-information",
  "sensitive-data",
  "legal-or-compliance",
  "security",
  "unrealistic-timing",
  "unclear-owner",
  "none",
] as const;

export const CLARITY_LIMITS = {
  bodyBytes: 16_384,
  name: 100,
  email: 254,
  website: 300,
  location: 120,
  stuck: 800,
  assets: 800,
  outcome: 600,
  timingConstraints: 500,
  totalVisitorText: 2_800,
  idempotencyKey: 100,
} as const;

export const CONTACT_LIMITS = {
  bodyBytes: 12_288,
  name: 100,
  businessName: 120,
  email: 254,
  website: 300,
  timing: 40,
  location: 120,
  message: 2_000,
  service: 80,
  budget: 40,
  honeypot: 0,
} as const;

export const REPORT_SCHEMA_VERSION = "1.0" as const;
export const CLARITY_SOURCE = "thomas-nicoli.com/project-clarity" as const;

export type ProjectClarityInput = {
  buyerType: BuyerType;
  stuck: string;
  assets: string;
  outcome: string;
  timingConstraints: string;
  responseLanguage: ProjectLanguage;
  name: string;
  email: string;
  website?: string;
  location?: string;
  consent: true;
  consentVersion: string;
  idempotencyKey: string;
  turnstileToken: string;
  company?: string;
};

export type SubmittedSummary = Pick<
  ProjectClarityInput,
  "buyerType" | "stuck" | "assets" | "outcome" | "timingConstraints" | "responseLanguage"
>;

export const isAllowedValue = <T extends readonly string[]>(
  allowed: T,
  value: unknown,
): value is T[number] => typeof value === "string" && allowed.includes(value as T[number]);
