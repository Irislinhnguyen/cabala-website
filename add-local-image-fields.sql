-- Add local image storage fields to courses table
ALTER TABLE courses ADD COLUMN "localImagePath" TEXT;
ALTER TABLE courses ADD COLUMN "imageMimeType" TEXT;
ALTER TABLE courses ADD COLUMN "imageLastModified" TIMESTAMP(3);
ALTER TABLE courses ADD COLUMN "imageFileSize" INTEGER;

-- Add comments for clarity
COMMENT ON COLUMN courses."localImagePath" IS 'Path to locally stored image file relative to public directory';
COMMENT ON COLUMN courses."imageMimeType" IS 'Image MIME type (image/jpeg, image/png, etc.)';
COMMENT ON COLUMN courses."imageLastModified" IS 'Last modified timestamp from Moodle for change detection';
COMMENT ON COLUMN courses."imageFileSize" IS 'File size in bytes for comparison during sync';