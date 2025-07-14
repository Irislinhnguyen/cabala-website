-- Add missing image fields to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS "moodleImageUrl" TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS "overviewFiles" JSONB;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS "moodleTags" TEXT[] DEFAULT '{}';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS "customTags" TEXT[] DEFAULT '{}';