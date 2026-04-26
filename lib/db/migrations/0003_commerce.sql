-- 0003_commerce.sql
-- Add made-to-order flags, shipping weight, and cart tables for Chunks 2 & 4.

-- ------------------------------------------------------------------
-- Extend products for made-to-order + shipping
-- ------------------------------------------------------------------
ALTER TABLE products ADD COLUMN made_to_order   INTEGER NOT NULL DEFAULT 0 CHECK (made_to_order IN (0, 1));
ALTER TABLE products ADD COLUMN lead_time_days  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN weight_grams    INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN hero_media_id   TEXT REFERENCES media(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN short_description TEXT NOT NULL DEFAULT '';

-- Variants need a price override if set, else product price + delta
ALTER TABLE product_variants ADD COLUMN metadata TEXT NOT NULL DEFAULT '{}';

-- ------------------------------------------------------------------
-- Guest carts (anonymous checkout) + logged-in customer carts
-- Cart lives server-side so multi-device checkout works; the client
-- keeps a localStorage copy for fast render.
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carts (
  id           TEXT PRIMARY KEY,
  customer_id  TEXT REFERENCES customers(id) ON DELETE SET NULL,
  guest_token  TEXT UNIQUE,
  items        TEXT NOT NULL DEFAULT '[]',   -- JSON array of { productId, variantId?, qty, unit_price_cents, name, metadata }
  notes        TEXT NOT NULL DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_carts_customer    ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_carts_guest_token ON carts(guest_token);
CREATE INDEX IF NOT EXISTS idx_carts_expires     ON carts(expires_at);

-- ------------------------------------------------------------------
-- Shipping addresses (saved per customer) + fulfillment options on orders
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id           TEXT PRIMARY KEY,
  customer_id  TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label        TEXT NOT NULL DEFAULT 'Home',
  line1        TEXT NOT NULL,
  line2        TEXT,
  city         TEXT NOT NULL,
  state        TEXT NOT NULL,
  postal_code  TEXT NOT NULL,
  country      TEXT NOT NULL DEFAULT 'US',
  phone        TEXT,
  is_default   INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_addresses_customer ON shipping_addresses(customer_id);

-- ------------------------------------------------------------------
-- Extend orders with fulfillment info
-- ------------------------------------------------------------------
ALTER TABLE orders ADD COLUMN fulfillment_method TEXT NOT NULL DEFAULT 'ship'
  CHECK (fulfillment_method IN ('ship','hand_deliver','pickup','uber_direct','invoice_later'));
ALTER TABLE orders ADD COLUMN fulfillment_address TEXT;    -- JSON blob snapshot of address
ALTER TABLE orders ADD COLUMN fulfillment_fee_cents INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN fulfillment_eta TEXT;        -- ISO datetime
ALTER TABLE orders ADD COLUMN tracking_number TEXT;
ALTER TABLE orders ADD COLUMN uber_delivery_id TEXT;       -- Uber Direct tracking id

-- ------------------------------------------------------------------
-- Made-to-order options — configurable per product (JSON schema per item)
-- Example: coasters have material=pine|oak|slate|steel; keychains have
-- material=acrylic|wood|metal. Stored on product.metadata so one migration
-- is enough.
-- ------------------------------------------------------------------
