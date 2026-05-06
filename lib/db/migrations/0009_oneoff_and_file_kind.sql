-- One-off / unique product listings. When one_off = 1, only one of these
-- exists. Once a checkout consumes it, sold_at is stamped and the product
-- is hidden from the shop and unpublished.
ALTER TABLE products ADD COLUMN one_off INTEGER NOT NULL DEFAULT 0 CHECK (one_off IN (0, 1));
ALTER TABLE products ADD COLUMN sold_at TEXT;

CREATE INDEX IF NOT EXISTS idx_products_one_off ON products(one_off);
CREATE INDEX IF NOT EXISTS idx_products_sold_at ON products(sold_at);

-- Distinguishes generic per-job uploads ('file') from persistent brand
-- assets pinned to the customer profile ('reference'). The /account/files
-- page surfaces 'file' rows; the profile page surfaces 'reference' rows
-- (logos, design references, brand assets — capped at 5).
ALTER TABLE customer_files ADD COLUMN kind TEXT NOT NULL DEFAULT 'file'
  CHECK (kind IN ('file', 'reference'));

CREATE INDEX IF NOT EXISTS idx_customer_files_kind
  ON customer_files(customer_id, kind, uploaded_at DESC);
