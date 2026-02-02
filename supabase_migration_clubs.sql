-- ============================================
-- MIGRATION: Multi-Club System
-- WARNING: This will DROP existing tables and data
-- ============================================

-- Step 1: Drop old tables
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS sources CASCADE;
DROP TABLE IF EXISTS circle_members CASCADE;
DROP TABLE IF EXISTS circles CASCADE;

-- Step 2: Create clubs table
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🔥',
  theme TEXT,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Create club_members table
CREATE TABLE club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(club_id, user_id)
);

-- Step 4: Create sources table
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  thumbnail TEXT,
  domain TEXT,
  source_type TEXT,
  category TEXT,
  summary TEXT,
  personal_note TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 5: Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 6: Create indexes
CREATE INDEX idx_club_members_user ON club_members(user_id);
CREATE INDEX idx_club_members_club ON club_members(club_id);
CREATE INDEX idx_sources_club ON sources(club_id);
CREATE INDEX idx_sources_user ON sources(user_id);
CREATE INDEX idx_sources_created ON sources(created_at DESC);
CREATE INDEX idx_clubs_invite_code ON clubs(invite_code);

-- Step 7: Enable RLS
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Step 8: RLS Policies for CLUBS
CREATE POLICY "Users can view clubs they belong to" ON clubs
  FOR SELECT USING (
    id IN (SELECT club_id FROM club_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create clubs" ON clubs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Club creator can update" ON clubs
  FOR UPDATE USING (created_by = auth.uid());

-- Step 9: RLS Policies for CLUB_MEMBERS
CREATE POLICY "View members of my clubs" ON club_members
  FOR SELECT USING (
    club_id IN (SELECT club_id FROM club_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can join clubs" ON club_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave clubs" ON club_members
  FOR DELETE USING (user_id = auth.uid());

-- Step 10: RLS Policies for SOURCES
CREATE POLICY "View sources from my clubs" ON sources
  FOR SELECT USING (
    club_id IN (SELECT club_id FROM club_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Add sources to my clubs" ON sources
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    club_id IN (SELECT club_id FROM club_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Manage own sources" ON sources
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Delete own sources" ON sources
  FOR DELETE USING (user_id = auth.uid());

-- Step 11: RLS Policies for COMMENTS
CREATE POLICY "View comments from my clubs" ON comments
  FOR SELECT USING (
    source_id IN (
      SELECT id FROM sources WHERE club_id IN (
        SELECT club_id FROM club_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Add comments" ON comments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Delete own comments" ON comments
  FOR DELETE USING (user_id = auth.uid());

-- Step 12: Trigger to auto-add creator as admin
CREATE OR REPLACE FUNCTION add_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO club_members (club_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_club_created
  AFTER INSERT ON clubs
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_admin();
