-- Status tag enum and customer types
DO '
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''customer_status'') THEN
    CREATE TYPE customer_status AS ENUM (''new'', ''active'', ''matched'', ''paused'', ''closed'');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''gender_type'') THEN
    CREATE TYPE gender_type AS ENUM (''male'', ''female'', ''other'');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''tristate'') THEN
    CREATE TYPE tristate AS ENUM (''yes'', ''no'', ''maybe'');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''marital_type'') THEN
    CREATE TYPE marital_type AS ENUM (''single'', ''divorced'', ''widowed'');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''diet_type'') THEN
    CREATE TYPE diet_type AS ENUM (''veg'', ''non-veg'', ''jain'', ''vegan'', ''eggetarian'');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = ''habit_type'') THEN
    CREATE TYPE habit_type AS ENUM (''never'', ''occasionally'', ''socially'', ''regularly'');
  END IF;
END;
';

CREATE TABLE IF NOT EXISTS customers (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_matchmaker_id  UUID REFERENCES matchmakers(id) ON DELETE SET NULL,
  
  -- Personal Info
  first_name              TEXT NOT NULL,
  last_name               TEXT NOT NULL,
  gender                  gender_type NOT NULL,
  date_of_birth           DATE NOT NULL,
  
  -- Location
  country                 TEXT NOT NULL DEFAULT 'India',
  city                    TEXT NOT NULL,
  
  -- Physical
  height_cm               INTEGER NOT NULL,
  
  -- Contact
  email                   TEXT UNIQUE NOT NULL,
  phone                   TEXT,
  
  -- Education
  college                 TEXT,
  degree                  TEXT,
  
  -- Professional
  income_lpa              DECIMAL(10,2),
  company                 TEXT,
  designation             TEXT,
  
  -- Matrimonial
  marital_status          marital_type NOT NULL DEFAULT 'single',
  languages               TEXT[] DEFAULT '{}',
  siblings                INTEGER DEFAULT 0,
  caste                   TEXT,
  religion                TEXT,
  
  -- Preferences
  want_kids               tristate DEFAULT 'maybe',
  open_to_relocate        tristate DEFAULT 'maybe',
  open_to_pets            tristate DEFAULT 'maybe',
  
  -- Lifestyle
  dietary_preference      diet_type DEFAULT 'veg',
  drinking                habit_type DEFAULT 'never',
  smoking                 habit_type DEFAULT 'never',
  hobbies                 TEXT[] DEFAULT '{}',
  
  -- Profile management
  profile_photo_url       TEXT,
  status_tag              customer_status DEFAULT 'new',
  notes                   TEXT,
  is_dummy                BOOLEAN DEFAULT FALSE,
  
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_customers_matchmaker ON customers(assigned_matchmaker_id);
CREATE INDEX IF NOT EXISTS idx_customers_gender ON customers(gender);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status_tag);
CREATE INDEX IF NOT EXISTS idx_customers_religion ON customers(religion);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
