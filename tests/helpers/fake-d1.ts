import type { D1DatabaseLike, D1PreparedStatement, D1RunResult } from "../../functions/_lib/types";

type Submission = Record<string, unknown>;

class Statement implements D1PreparedStatement {
  private values: unknown[] = [];
  constructor(private readonly database: FakeD1, private readonly sql: string) {}
  bind(...values: unknown[]) { this.values = values; return this; }

  async first<T>(): Promise<T | null> {
    const sql = this.sql.replace(/\s+/g, " ");
    if (sql.includes("FROM rate_limits")) {
      return (this.database.rateLimits.get(String(this.values[0])) as T) ?? null;
    }
    if (sql.includes("WHERE idempotency_key")) {
      const row = [...this.database.submissions.values()].find((item) => item.idempotency_key === this.values[0]);
      return (row as T) ?? null;
    }
    if (sql.startsWith("UPDATE project_clarity_submissions") && sql.includes("RETURNING")) {
      const now = String(this.values[0]);
      const lease = String(this.values[1]);
      const row = [...this.database.submissions.values()]
        .filter((item) => item.status === "queued" || (item.status === "processing" && String(item.lease_until) < now))
        .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))[0];
      if (!row) return null;
      row.status = "processing";
      row.updated_at = now;
      row.lease_until = lease;
      row.attempt_count = Number(row.attempt_count ?? 0) + 1;
      return row as T;
    }
    return null;
  }

  async run(): Promise<D1RunResult> {
    const sql = this.sql.replace(/\s+/g, " ");
    if (sql.startsWith("INSERT INTO rate_limits")) {
      const [key, windowStarted] = [String(this.values[0]), Number(this.values[1])];
      const current = this.database.rateLimits.get(key);
      if (!current || current.window_started_at !== windowStarted) this.database.rateLimits.set(key, { request_count: 1, window_started_at: windowStarted });
      else current.request_count += 1;
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("INSERT OR IGNORE INTO project_clarity_submissions")) {
      const [id, idempotency, created, language, buyer, consent, retention, source, payload] = this.values;
      const duplicate = [...this.database.submissions.values()].some((item) => item.idempotency_key === idempotency);
      if (duplicate) return { success: true, meta: { changes: 0 } };
      this.database.submissions.set(String(id), {
        submission_id: id,
        idempotency_key: idempotency,
        created_at: created,
        updated_at: created,
        status: "queued",
        language,
        buyer_type: buyer,
        consent_version: consent,
        retention_until: retention,
        source,
        payload_json: payload,
        notification_status: "pending",
        attempt_count: 0,
      });
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.includes("SET notification_status")) {
      const row = this.database.submissions.get(String(this.values[2]));
      if (row) { row.notification_status = this.values[0]; row.updated_at = this.values[1]; }
      return { success: true, meta: { changes: row ? 1 : 0 } };
    }
    if (sql.includes("SET status = ?1") && sql.includes("draft_message_id")) {
      const row = this.database.submissions.get(String(this.values[4]));
      if (!row || row.status !== "processing") return { success: true, meta: { changes: 0 } };
      row.status = this.values[0]; row.updated_at = this.values[1]; row.draft_message_id = this.values[2]; row.diagnostic = this.values[3]; row.lease_until = null;
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("DELETE FROM project_clarity_submissions")) {
      const cutoff = String(this.values[0]);
      let changes = 0;
      for (const [id, row] of this.database.submissions) {
        if (String(row.retention_until) <= cutoff) {
          this.database.submissions.delete(id);
          changes += 1;
        }
      }
      return { success: true, meta: { changes } };
    }
    return { success: true, meta: { changes: 0 } };
  }

  async all<T>(): Promise<{ results: T[] }> {
    return { results: [] };
  }
}

export class FakeD1 implements D1DatabaseLike {
  readonly submissions = new Map<string, Submission>();
  readonly rateLimits = new Map<string, { request_count: number; window_started_at: number }>();
  prepare(query: string): D1PreparedStatement { return new Statement(this, query); }
  async batch(statements: D1PreparedStatement[]): Promise<unknown[]> {
    return Promise.all(statements.map((statement) => statement.run()));
  }
}
