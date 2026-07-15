CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  track TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_plaintext TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  track TEXT,
  workshop_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  speaker TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(week_id, workshop_number, track)
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  points_value INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  submission_url TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'submitted',
  points_awarded INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  UNIQUE(task_id, team_id)
);

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  chess_piece TEXT NOT NULL,
  points_threshold INTEGER NOT NULL UNIQUE,
  description TEXT
);

CREATE VIEW team_current_badge AS
SELECT DISTINCT ON (t.id)
  t.id AS team_id,
  b.name,
  b.chess_piece,
  b.points_threshold
FROM teams t
JOIN badges b ON b.points_threshold <= t.points
ORDER BY t.id, b.points_threshold DESC;

INSERT INTO badges (name, chess_piece, points_threshold, description) VALUES
  ('Pawn', 'pawn', 0, 'Every master was once a beginner.'),
  ('Knight', 'knight', 30, 'You think in L-shapes.'),
  ('Bishop', 'bishop', 60, 'You see diagonals others miss.'),
  ('Rook', 'rook', 100, 'Straight-line focus, unstoppable.'),
  ('Queen', 'queen', 150, 'Versatile, powerful, dominant.'),
  ('King', 'king', 200, 'The crown is yours.')
ON CONFLICT (points_threshold) DO NOTHING;

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  answered_at TIMESTAMPTZ
);
