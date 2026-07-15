ALTER TABLE badges ADD UNIQUE (points_threshold);

ALTER TABLE teams ADD COLUMN IF NOT EXISTS password_plaintext TEXT;

ALTER TABLE workshops ADD COLUMN IF NOT EXISTS track TEXT;

ALTER TABLE workshops DROP CONSTRAINT IF EXISTS workshops_week_id_workshop_number_key;
ALTER TABLE workshops ADD UNIQUE (week_id, workshop_number, track);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  answered_at TIMESTAMPTZ
);
