export interface D1RunResult {
  success: boolean;
  meta?: { changes?: number };
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<D1RunResult>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
}

export interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
}

export interface WorkersAiLike {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

export interface BaseEnv {
  RESEND_API_KEY?: string;
  RESEND_TO?: string;
  MAIL_DOMAIN?: string;
  RESEND_FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
  PROJECT_CLARITY_DB?: D1DatabaseLike;
  AI?: WorkersAiLike;
}
