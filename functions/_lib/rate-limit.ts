import type { D1DatabaseLike } from "./types";
import { HttpError, sha256 } from "./http";

export async function enforceRateLimit(options: {
  database?: D1DatabaseLike;
  scope: string;
  identity: string;
  limit: number;
  windowSeconds: number;
  now?: number;
}): Promise<void> {
  if (!options.database) throw new HttpError(503, "rate_limit_not_configured");
  const now = options.now ?? Math.floor(Date.now() / 1000);
  const windowStart = now - (now % options.windowSeconds);
  const identityHash = await sha256(`${options.scope}:${options.identity}`);
  const key = `${options.scope}:${identityHash}`;

  await options.database
    .prepare(
      `INSERT INTO rate_limits (key, window_started_at, request_count)
       VALUES (?1, ?2, 1)
       ON CONFLICT(key) DO UPDATE SET
         request_count = CASE WHEN window_started_at = excluded.window_started_at
           THEN request_count + 1 ELSE 1 END,
         window_started_at = excluded.window_started_at`,
    )
    .bind(key, windowStart)
    .run();

  const row = await options.database
    .prepare("SELECT request_count FROM rate_limits WHERE key = ?1")
    .bind(key)
    .first<{ request_count: number }>();

  if (!row || row.request_count > options.limit) {
    throw new HttpError(429, "rate_limited");
  }
}
