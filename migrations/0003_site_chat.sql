-- Public AI chat: short-lived anonymous sessions plus a bounded per-turn email outbox.
CREATE TABLE IF NOT EXISTS site_chat_sessions (
  session_id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  ip_hash TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('es', 'en', 'fr')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  turn_count INTEGER NOT NULL DEFAULT 0 CHECK (turn_count BETWEEN 0 AND 12)
);

CREATE INDEX IF NOT EXISTS idx_site_chat_sessions_expiry
  ON site_chat_sessions(expires_at);

CREATE TABLE IF NOT EXISTS site_chat_interactions (
  interaction_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  turn_index INTEGER NOT NULL CHECK (turn_index BETWEEN 1 AND 12),
  created_at TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('es', 'en', 'fr')),
  page_path TEXT NOT NULL CHECK (length(page_path) <= 180),
  visitor_message TEXT NOT NULL CHECK (length(visitor_message) <= 600),
  assistant_reply TEXT NOT NULL CHECK (length(assistant_reply) <= 1000),
  owner_summary TEXT NOT NULL CHECK (length(owner_summary) <= 700),
  intent TEXT NOT NULL CHECK (length(intent) <= 80),
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
  suggestions_json TEXT NOT NULL CHECK (length(suggestions_json) <= 512),
  email_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'delivered', 'failed')),
  retention_until TEXT NOT NULL,
  UNIQUE(session_id, turn_index)
);

CREATE INDEX IF NOT EXISTS idx_site_chat_interactions_session
  ON site_chat_interactions(session_id, turn_index);
CREATE INDEX IF NOT EXISTS idx_site_chat_interactions_retention
  ON site_chat_interactions(retention_until);
