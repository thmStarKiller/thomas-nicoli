-- Asynchronous public chat queue consumed only by the private local Ollama worker.
CREATE TABLE IF NOT EXISTS site_chat_jobs (
  interaction_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  turn_index INTEGER NOT NULL CHECK (turn_index BETWEEN 1 AND 12),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  language TEXT NOT NULL CHECK (language IN ('es', 'en', 'fr')),
  page_path TEXT NOT NULL CHECK (length(page_path) <= 180),
  payload_json TEXT NOT NULL CHECK (length(payload_json) <= 12000),
  assistant_reply TEXT CHECK (assistant_reply IS NULL OR length(assistant_reply) <= 1000),
  owner_summary TEXT CHECK (owner_summary IS NULL OR length(owner_summary) <= 700),
  intent TEXT CHECK (intent IS NULL OR length(intent) <= 80),
  urgency TEXT CHECK (urgency IS NULL OR urgency IN ('low', 'medium', 'high')),
  suggestions_json TEXT CHECK (suggestions_json IS NULL OR length(suggestions_json) <= 512),
  email_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'delivered', 'failed')),
  retention_until TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count BETWEEN 0 AND 3),
  lease_until TEXT,
  diagnostic TEXT CHECK (diagnostic IS NULL OR length(diagnostic) <= 300),
  UNIQUE(session_id, turn_index)
);

CREATE INDEX IF NOT EXISTS idx_site_chat_jobs_queue
  ON site_chat_jobs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_site_chat_jobs_retention
  ON site_chat_jobs(retention_until);
