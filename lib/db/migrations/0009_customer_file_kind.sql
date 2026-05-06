-- Distinguishes generic per-job uploads ('file') from persistent brand
-- assets pinned to the customer profile ('reference'). The /account/files
-- page surfaces 'file' rows; the profile page surfaces 'reference' rows
-- (logos, design references, brand assets — capped at 5).
ALTER TABLE customer_files ADD COLUMN kind TEXT NOT NULL DEFAULT 'file'
  CHECK (kind IN ('file', 'reference'));

CREATE INDEX IF NOT EXISTS idx_customer_files_kind
  ON customer_files(customer_id, kind, uploaded_at DESC);
