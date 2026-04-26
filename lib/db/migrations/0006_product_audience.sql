-- 0006_product_audience.sql
-- Separate B2C shop items from B2B services-side items.

ALTER TABLE products ADD COLUMN audience TEXT NOT NULL DEFAULT 'shop'
  CHECK (audience IN ('shop', 'services', 'both'));

CREATE INDEX IF NOT EXISTS idx_products_audience ON products(audience);

-- Same for categories so you can have a "shop only" or "services only" category
ALTER TABLE categories ADD COLUMN audience TEXT NOT NULL DEFAULT 'shop'
  CHECK (audience IN ('shop', 'services', 'both'));

CREATE INDEX IF NOT EXISTS idx_categories_audience ON categories(audience);
