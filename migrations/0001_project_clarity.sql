-- Project Clarity bounded queue and durable rate limits.
-- Apply to preview first; production only after the legal-data checkpoint.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count >= 1)
);

CREATE TABLE IF NOT EXISTS project_clarity_submissions (
  submission_id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'needs-review', 'failed', 'completed')),
  language TEXT NOT NULL CHECK (language IN ('es', 'en', 'fr')),
  buyer_type TEXT NOT NULL CHECK (buyer_type IN ('independent', 'digital-team', 'unsure')),
  consent_version TEXT NOT NULL,
  retention_until TEXT NOT NULL,
  source TEXT NOT NULL,
  payload_json TEXT NOT NULL CHECK (length(payload_json) <= 8192),
  notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending', 'delivered', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count BETWEEN 0 AND 2),
  lease_until TEXT,
  draft_message_id TEXT,
  diagnostic TEXT CHECK (diagnostic IS NULL OR length(diagnostic) <= 400)
);

CREATE INDEX IF NOT EXISTS idx_project_clarity_queue
  ON project_clarity_submissions(status, created_at);
