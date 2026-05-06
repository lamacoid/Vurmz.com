-- 0009_one_off_products.sql
-- One-off / unique product listings. When `one_off = 1`, only one of these
-- exists. Once a checkout consumes it, `sold_at` is stamped and the product
-- is hidden from the shop and unpublished. The pack_size is forced to 1
-- by application code on these products.

ALTER TABLE products ADD COLUMN one_off INTEGER NOT NULL DEFAULT 0 CHECK (one_off IN (0, 1));
ALTER TABLE products ADD COLUMN sold_at TEXT;

CREATE INDEX IF NOT EXISTS idx_products_one_off ON products(one_off);
CREATE INDEX IF NOT EXISTS idx_products_sold_at ON products(sold_at);
