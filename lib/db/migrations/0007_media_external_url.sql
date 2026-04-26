-- 0007_media_external_url.sql
-- Let media rows point at externally-hosted URLs (e.g. /public/portfolio/*.jpg)
-- without needing to copy into R2. When external_url is NULL, the public
-- reader falls back to /api/media/<r2_key>.

ALTER TABLE media ADD COLUMN external_url TEXT;
