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
    if (sql.includes("FROM site_chat_sessions") && sql.includes("WHERE token_hash")) {
      const row = [...this.database.chatSessions.values()].find((item) => item.token_hash === this.values[0]);
      return (row as T) ?? null;
    }
    if (sql.includes("FROM site_chat_interactions") && sql.includes("WHERE interaction_id")) {
      return (this.database.chatInteractions.get(String(this.values[0])) as T) ?? null;
    }
    if (sql.includes("FROM site_chat_interactions") && sql.includes("WHERE session_id") && sql.includes("turn_index")) {
      const row = [...this.database.chatInteractions.values()].find((item) => item.session_id === this.values[0] && item.turn_index === this.values[1]);
      return (row as T) ?? null;
    }
    if (sql.includes("FROM site_chat_jobs") && sql.includes("WHERE interaction_id") && !sql.startsWith("UPDATE")) {
      return (this.database.chatJobs.get(String(this.values[0])) as T) ?? null;
    }
    if (sql.includes("FROM site_chat_jobs") && sql.includes("WHERE session_id") && sql.includes("turn_index")) {
      const row = [...this.database.chatJobs.values()].find((item) => item.session_id === this.values[0] && item.turn_index === this.values[1]);
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
    if (sql.startsWith("UPDATE site_chat_jobs") && sql.includes("RETURNING")) {
      const now = String(this.values[0]);
      const lease = String(this.values[1]);
      const row = [...this.database.chatJobs.values()]
        .filter((item) => (item.status === "queued" || (item.status === "processing" && String(item.lease_until) < now)) && Number(item.attempt_count ?? 0) < 3)
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
        submission_id: id, idempotency_key: idempotency, created_at: created, updated_at: created,
        status: "queued", language, buyer_type: buyer, consent_version: consent,
        retention_until: retention, source, payload_json: payload, notification_status: "pending", attempt_count: 0,
      });
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("INSERT INTO site_chat_sessions")) {
      const [sessionId, tokenHash, ipHash, locale, createdAt, expiresAt] = this.values;
      this.database.chatSessions.set(String(sessionId), {
        session_id: sessionId, token_hash: tokenHash, ip_hash: ipHash, locale,
        created_at: createdAt, expires_at: expiresAt, turn_count: 0,
      });
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("INSERT OR IGNORE INTO site_chat_interactions")) {
      const [interactionId, sessionId, turnIndex, createdAt, language, pagePath, visitorMessage, assistantReply, ownerSummary, intent, urgency, suggestions, retention] = this.values;
      const duplicate = this.database.chatInteractions.has(String(interactionId))
        || [...this.database.chatInteractions.values()].some((item) => item.session_id === sessionId && item.turn_index === turnIndex);
      if (duplicate) return { success: true, meta: { changes: 0 } };
      this.database.chatInteractions.set(String(interactionId), {
        interaction_id: interactionId, session_id: sessionId, turn_index: turnIndex,
        created_at: createdAt, language, page_path: pagePath, visitor_message: visitorMessage,
        assistant_reply: assistantReply, owner_summary: ownerSummary, intent, urgency,
        suggestions_json: suggestions, email_status: "pending", retention_until: retention,
      });
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("INSERT OR IGNORE INTO site_chat_jobs")) {
      const [interactionId, sessionId, turnIndex, createdAt, language, pagePath, payload, retention] = this.values;
      const duplicate = this.database.chatJobs.has(String(interactionId))
        || [...this.database.chatJobs.values()].some((item) => item.session_id === sessionId && item.turn_index === turnIndex);
      if (duplicate) return { success: true, meta: { changes: 0 } };
      this.database.chatJobs.set(String(interactionId), {
        interaction_id: interactionId, session_id: sessionId, turn_index: turnIndex,
        created_at: createdAt, updated_at: createdAt, status: "queued", language,
        page_path: pagePath, payload_json: payload, assistant_reply: null,
        owner_summary: null, intent: null, urgency: null, suggestions_json: null,
        email_status: "pending", lease_until: null, attempt_count: 0,
        retention_until: retention, diagnostic: null,
      });
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("UPDATE site_chat_sessions SET turn_count")) {
      const row = this.database.chatSessions.get(String(this.values[1]));
      if (!row || row.turn_count !== this.values[2]) return { success: true, meta: { changes: 0 } };
      row.turn_count = this.values[0];
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("UPDATE site_chat_interactions SET email_status")) {
      const row = this.database.chatInteractions.get(String(this.values[1]));
      if (row) row.email_status = this.values[0];
      return { success: true, meta: { changes: row ? 1 : 0 } };
    }
    if (sql.startsWith("UPDATE site_chat_jobs SET status = 'completed'")) {
      const row = this.database.chatJobs.get(String(this.values[6]));
      if (!row || row.status !== "processing") return { success: true, meta: { changes: 0 } };
      row.status = "completed"; row.updated_at = this.values[0]; row.lease_until = null;
      row.assistant_reply = this.values[1]; row.owner_summary = this.values[2];
      row.intent = this.values[3]; row.urgency = this.values[4]; row.suggestions_json = this.values[5]; row.diagnostic = null;
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("UPDATE site_chat_jobs SET status = 'failed'")) {
      const row = this.database.chatJobs.get(String(this.values[2]));
      if (!row || row.status !== "processing") return { success: true, meta: { changes: 0 } };
      row.status = "failed"; row.updated_at = this.values[0]; row.lease_until = null; row.diagnostic = this.values[1];
      return { success: true, meta: { changes: 1 } };
    }
    if (sql.startsWith("UPDATE site_chat_jobs SET email_status")) {
      const row = this.database.chatJobs.get(String(this.values[1]));
      if (row) row.email_status = this.values[0];
      return { success: true, meta: { changes: row ? 1 : 0 } };
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
      return this.deleteExpired(this.database.submissions, String(this.values[0]), "retention_until");
    }
    if (sql.startsWith("DELETE FROM site_chat_interactions")) {
      return this.deleteExpired(this.database.chatInteractions, String(this.values[0]), "retention_until");
    }
    if (sql.startsWith("DELETE FROM site_chat_jobs")) {
      return this.deleteExpired(this.database.chatJobs, String(this.values[0]), "retention_until");
    }
    if (sql.startsWith("DELETE FROM site_chat_sessions")) {
      const cutoff = String(this.values[0]);
      let changes = 0;
      for (const [id, row] of this.database.chatSessions) {
        const parentSessionId = String(row.session_id ?? id);
        const hasChildren = [...this.database.chatInteractions.values(), ...this.database.chatJobs.values()]
          .some((child) => String(child.session_id ?? "") === parentSessionId);
        if (String(row.expires_at) <= cutoff && !hasChildren) {
          this.database.chatSessions.delete(id);
          changes += 1;
        }
      }
      return { success: true, meta: { changes } };
    }
    return { success: true, meta: { changes: 0 } };
  }

  private deleteExpired(rows: Map<string, Submission>, cutoff: string, field: string): D1RunResult {
    let changes = 0;
    for (const [id, row] of rows) {
      if (String(row[field]) <= cutoff) { rows.delete(id); changes += 1; }
    }
    return { success: true, meta: { changes } };
  }

  async all<T>(): Promise<{ results: T[] }> { return { results: [] }; }
}

export class FakeD1 implements D1DatabaseLike {
  readonly submissions = new Map<string, Submission>();
  readonly chatSessions = new Map<string, Submission>();
  readonly chatInteractions = new Map<string, Submission>();
  readonly chatJobs = new Map<string, Submission>();
  readonly rateLimits = new Map<string, { request_count: number; window_started_at: number }>();
  prepare(query: string): D1PreparedStatement { return new Statement(this, query); }
  async batch(statements: D1PreparedStatement[]): Promise<unknown[]> {
    return Promise.all(statements.map((statement) => statement.run()));
  }
}
