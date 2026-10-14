-- Matchmakers: internal TDC staff who manage clients
CREATE TABLE IF NOT EXISTS matchmakers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,          -- bcrypt hash, NEVER store plain text
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS matchmakers_updated_at ON matchmakers;
CREATE TRIGGER matchmakers_updated_at
  BEFORE UPDATE ON matchmakers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for fast email lookup during login
CREATE INDEX IF NOT EXISTS idx_matchmakers_email ON matchmakers(email);
