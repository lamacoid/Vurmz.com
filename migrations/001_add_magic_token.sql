-- Add magic token columns for passwordless auth
ALTER TABLE users ADD COLUMN magic_token TEXT;
ALTER TABLE users ADD COLUMN magic_token_expires TEXT;
