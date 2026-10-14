-- Log of match actions (when a matchmaker sends a match suggestion)
CREATE TABLE IF NOT EXISTS match_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  matched_with_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  matchmaker_id     UUID NOT NULL REFERENCES matchmakers(id) ON DELETE CASCADE,
  ai_score          INTEGER,                -- 0-100 from Gemini
  ai_explanation    TEXT,
  ai_intro          TEXT,
  action            TEXT DEFAULT 'sent',   -- 'sent', 'rejected', 'interested'
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_match_logs_customer ON match_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_match_logs_matchmaker ON match_logs(matchmaker_id);
