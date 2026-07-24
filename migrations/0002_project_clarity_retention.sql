-- Support bounded retention purges without scanning unrelated queue order.
CREATE INDEX IF NOT EXISTS idx_project_clarity_retention
  ON project_clarity_submissions(retention_until);
