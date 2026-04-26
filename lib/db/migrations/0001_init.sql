-- 0001_init.sql
-- Chunk 0 — Foundation schema for vurmz-core
-- All tables for the CMS, commerce, customer portal, and audit system.
-- Forward-only. Never edit a migration after it has been applied.

-- ============================================================
-- MIGRATIONS TRACKING
-- ============================================================
CREATE TABLE IF NOT EXISTS _migrations (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  applied_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- CONTENT SYSTEM
-- ============================================================

-- pages: every routable page on the public site
CREATE TABLE IF NOT EXISTS pages (
  id                TEXT PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,
  title             TEXT NOT NULL,
  meta_description  TEXT,
  og_image_id       TEXT,
  published_blocks  TEXT NOT NULL DEFAULT '[]',
  draft_blocks      TEXT NOT NULL DEFAULT '[]',
  version           INTEGER NOT NULL DEFAULT 1,
  is_published      INTEGER NOT NULL DEFAULT 0 CHECK (is_published IN (0, 1)),
  noindex           INTEGER NOT NULL DEFAULT 0 CHECK (noindex IN (0, 1)),
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now')),
  published_at      TEXT,
  deleted_at        TEXT
);
CREATE INDEX IF NOT EXISTS idx_pages_slug          ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_is_published  ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_pages_deleted_at    ON pages(deleted_at);

-- page_snapshots: history for undo/redo
CREATE TABLE IF NOT EXISTS page_snapshots (
  id          TEXT PRIMARY KEY,
  page_id     TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  blocks      TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  created_by  TEXT
);
CREATE INDEX IF NOT EXISTS idx_page_snapshots_page_id ON page_snapshots(page_id, created_at DESC);

-- site_theme: single-row design tokens
CREATE TABLE IF NOT EXISTS site_theme (
  id          TEXT PRIMARY KEY,
  colors      TEXT NOT NULL DEFAULT '{}',
  fonts       TEXT NOT NULL DEFAULT '{}',
  spacing     TEXT NOT NULL DEFAULT '{}',
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- site_settings: arbitrary key/value site-wide config
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- navigation: header + footer nav links
CREATE TABLE IF NOT EXISTS navigation (
  id          TEXT PRIMARY KEY,
  placement   TEXT NOT NULL CHECK (placement IN ('header', 'footer', 'footer-legal', 'mobile')),
  position    REAL NOT NULL,
  label       TEXT NOT NULL,
  href        TEXT NOT NULL,
  parent_id   TEXT REFERENCES navigation(id) ON DELETE CASCADE,
  opens_new_tab INTEGER NOT NULL DEFAULT 0 CHECK (opens_new_tab IN (0, 1)),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_navigation_placement ON navigation(placement, position);

-- redirects: editable URL redirects
CREATE TABLE IF NOT EXISTS redirects (
  id          TEXT PRIMARY KEY,
  from_path   TEXT NOT NULL UNIQUE,
  to_path     TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302, 307, 308)),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- MEDIA LIBRARY (R2-backed)
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id          TEXT PRIMARY KEY,
  r2_key      TEXT NOT NULL UNIQUE,
  filename    TEXT NOT NULL,
  mime_type   TEXT NOT NULL,
  size_bytes  INTEGER NOT NULL,
  width       INTEGER,
  height      INTEGER,
  alt_text    TEXT NOT NULL DEFAULT '',
  folder      TEXT NOT NULL DEFAULT '',
  tags        TEXT NOT NULL DEFAULT '[]',
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
  uploaded_by TEXT,
  deleted_at  TEXT
);
CREATE INDEX IF NOT EXISTS idx_media_folder      ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_at ON media(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_deleted_at  ON media(deleted_at);

-- ============================================================
-- PRODUCT CATALOG (CRUD in Chunk 2)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  description   TEXT,
  hero_media_id TEXT REFERENCES media(id) ON DELETE SET NULL,
  position      REAL NOT NULL DEFAULT 0,
  is_published  INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_categories_slug     ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_position ON categories(position);

CREATE TABLE IF NOT EXISTS products (
  id           TEXT PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  category_id  TEXT REFERENCES categories(id) ON DELETE SET NULL,
  price_cents  INTEGER NOT NULL DEFAULT 0,
  pack_size    INTEGER NOT NULL DEFAULT 1 CHECK (pack_size >= 1),
  position     REAL NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  metadata     TEXT NOT NULL DEFAULT '{}',
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))  ,
  deleted_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_products_slug       ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_position   ON products(position);
CREATE INDEX IF NOT EXISTS idx_products_published  ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);

CREATE TABLE IF NOT EXISTS product_variants (
  id                 TEXT PRIMARY KEY,
  product_id         TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  sku                TEXT,
  price_cents_delta  INTEGER NOT NULL DEFAULT 0,
  position           REAL NOT NULL DEFAULT 0,
  is_published       INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at         TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id, position);

CREATE TABLE IF NOT EXISTS product_images (
  id          TEXT PRIMARY KEY,
  product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_id    TEXT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  position    REAL NOT NULL DEFAULT 0,
  is_primary  INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1))
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id, position);
CREATE UNIQUE INDEX IF NOT EXISTS uq_product_images_pair ON product_images(product_id, media_id);

-- ============================================================
-- CUSTOMERS + PORTAL AUTH (portal UI in Chunk 3)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id                     TEXT PRIMARY KEY,
  email                  TEXT NOT NULL UNIQUE,
  name                   TEXT NOT NULL DEFAULT '',
  phone                  TEXT,
  company                TEXT,
  square_customer_id     TEXT,
  tags                   TEXT NOT NULL DEFAULT '[]',
  notes                  TEXT NOT NULL DEFAULT '',
  lifetime_value_cents   INTEGER NOT NULL DEFAULT 0,
  order_count            INTEGER NOT NULL DEFAULT 0,
  email_verified_at      TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at           TEXT,
  deleted_at             TEXT
);
CREATE INDEX IF NOT EXISTS idx_customers_email      ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_square     ON customers(square_customer_id);

-- magic link tokens (one-shot, 15 min TTL)
CREATE TABLE IF NOT EXISTS customer_auth_tokens (
  id           TEXT PRIMARY KEY,
  customer_id  TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token_hash   TEXT NOT NULL UNIQUE,
  expires_at   TEXT NOT NULL,
  consumed_at  TEXT,
  ip           TEXT,
  user_agent   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_customer_auth_tokens_customer ON customer_auth_tokens(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_auth_tokens_expires  ON customer_auth_tokens(expires_at);

-- WebAuthn passkeys
CREATE TABLE IF NOT EXISTS customer_passkeys (
  id             TEXT PRIMARY KEY,
  customer_id    TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  credential_id  TEXT NOT NULL UNIQUE,
  public_key     TEXT NOT NULL,
  counter        INTEGER NOT NULL DEFAULT 0,
  transports     TEXT NOT NULL DEFAULT '[]',
  device_name    TEXT NOT NULL DEFAULT 'Unnamed device',
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_customer_passkeys_customer ON customer_passkeys(customer_id);

-- ============================================================
-- MESSAGES (threaded per customer)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id           TEXT PRIMARY KEY,
  customer_id  TEXT REFERENCES customers(id) ON DELETE SET NULL,
  direction    TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  channel      TEXT NOT NULL CHECK (channel IN ('web', 'email', 'admin', 'sms')),
  subject      TEXT,
  body         TEXT NOT NULL,
  attachments  TEXT NOT NULL DEFAULT '[]',
  is_read      INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0, 1)),
  metadata     TEXT NOT NULL DEFAULT '{}',
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_customer ON messages(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread   ON messages(is_read, created_at DESC);

-- ============================================================
-- CUSTOMER FILES (portal uploads, R2-backed)
-- ============================================================
CREATE TABLE IF NOT EXISTS customer_files (
  id           TEXT PRIMARY KEY,
  customer_id  TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  r2_key       TEXT NOT NULL UNIQUE,
  filename     TEXT NOT NULL,
  mime_type    TEXT NOT NULL,
  size_bytes   INTEGER NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  uploaded_at  TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_customer_files_customer ON customer_files(customer_id, uploaded_at DESC);

-- ============================================================
-- COMMERCE (Chunks 4 & 5 implement business logic)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,
  number          TEXT NOT NULL UNIQUE,
  customer_id     TEXT REFERENCES customers(id) ON DELETE SET NULL,
  email           TEXT NOT NULL,
  subtotal_cents  INTEGER NOT NULL DEFAULT 0,
  tax_cents       INTEGER NOT NULL DEFAULT 0,
  shipping_cents  INTEGER NOT NULL DEFAULT 0,
  total_cents     INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new','confirmed','in_progress','ready','delivered','cancelled','refunded'
  )),
  channel         TEXT NOT NULL DEFAULT 'shop' CHECK (channel IN ('shop','service','admin')),
  notes           TEXT NOT NULL DEFAULT '',
  metadata        TEXT NOT NULL DEFAULT '{}',
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status   ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created  ON orders(created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id               TEXT PRIMARY KEY,
  order_id         TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       TEXT REFERENCES products(id) ON DELETE SET NULL,
  variant_id       TEXT REFERENCES product_variants(id) ON DELETE SET NULL,
  name_snapshot    TEXT NOT NULL,
  qty              INTEGER NOT NULL CHECK (qty > 0),
  unit_price_cents INTEGER NOT NULL,
  metadata         TEXT NOT NULL DEFAULT '{}',
  position         REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS order_events (
  id           TEXT PRIMARY KEY,
  order_id     TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  from_status  TEXT,
  to_status    TEXT,
  actor_type   TEXT NOT NULL CHECK (actor_type IN ('admin','customer','system','webhook')),
  actor_id     TEXT,
  note         TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_events(order_id, created_at DESC);

CREATE TABLE IF NOT EXISTS invoices (
  id               TEXT PRIMARY KEY,
  number           TEXT NOT NULL UNIQUE,
  customer_id      TEXT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  order_id         TEXT REFERENCES orders(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft','sent','viewed','paid','partially_paid','overdue','void','refunded'
  )),
  subtotal_cents   INTEGER NOT NULL DEFAULT 0,
  tax_cents        INTEGER NOT NULL DEFAULT 0,
  total_cents      INTEGER NOT NULL DEFAULT 0,
  amount_paid_cents INTEGER NOT NULL DEFAULT 0,
  due_date         TEXT,
  square_invoice_id TEXT,
  square_order_id  TEXT,
  notes            TEXT NOT NULL DEFAULT '',
  sent_at          TEXT,
  viewed_at        TEXT,
  paid_at          TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status   ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE TABLE IF NOT EXISTS invoice_items (
  id               TEXT PRIMARY KEY,
  invoice_id       TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description      TEXT NOT NULL,
  qty              INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  unit_price_cents INTEGER NOT NULL,
  total_cents      INTEGER NOT NULL,
  position         REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id, position);

CREATE TABLE IF NOT EXISTS payments (
  id                TEXT PRIMARY KEY,
  invoice_id        TEXT REFERENCES invoices(id) ON DELETE SET NULL,
  customer_id       TEXT REFERENCES customers(id) ON DELETE SET NULL,
  amount_cents      INTEGER NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('pending','succeeded','failed','refunded','partially_refunded')),
  square_payment_id TEXT UNIQUE,
  square_receipt_url TEXT,
  method_brand      TEXT,
  method_last4      TEXT,
  metadata          TEXT NOT NULL DEFAULT '{}',
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_payments_invoice  ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);

CREATE TABLE IF NOT EXISTS payment_methods (
  id              TEXT PRIMARY KEY,
  customer_id     TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  square_card_id  TEXT NOT NULL UNIQUE,
  brand           TEXT,
  last4           TEXT,
  exp_month       INTEGER,
  exp_year        INTEGER,
  is_default      INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at      TEXT
);
CREATE INDEX IF NOT EXISTS idx_payment_methods_customer ON payment_methods(customer_id);

-- Square webhook event log (idempotency + audit)
CREATE TABLE IF NOT EXISTS square_events (
  id                TEXT PRIMARY KEY,
  event_type        TEXT NOT NULL,
  square_event_id   TEXT NOT NULL UNIQUE,
  payload           TEXT NOT NULL,
  signature_valid   INTEGER NOT NULL CHECK (signature_valid IN (0, 1)),
  processed_at      TEXT,
  error             TEXT,
  received_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_square_events_type ON square_events(event_type);

-- ============================================================
-- INVENTORY + MATERIALS (Chunk 6)
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  id           TEXT PRIMARY KEY,
  product_id   TEXT REFERENCES products(id) ON DELETE CASCADE,
  variant_id   TEXT REFERENCES product_variants(id) ON DELETE CASCADE,
  qty_on_hand  INTEGER NOT NULL DEFAULT 0,
  low_threshold INTEGER NOT NULL DEFAULT 0,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_inventory_product_variant ON inventory(
  COALESCE(product_id, ''), COALESCE(variant_id, '')
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id           TEXT PRIMARY KEY,
  inventory_id TEXT NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  change       INTEGER NOT NULL,
  reason       TEXT NOT NULL,
  actor_type   TEXT NOT NULL CHECK (actor_type IN ('admin','system','order','webhook')),
  actor_id     TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS materials (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  sku          TEXT UNIQUE,
  category     TEXT NOT NULL DEFAULT '',
  qty_on_hand  INTEGER NOT NULL DEFAULT 0,
  unit         TEXT NOT NULL DEFAULT 'pcs',
  cost_cents   INTEGER NOT NULL DEFAULT 0,
  supplier     TEXT,
  notes        TEXT NOT NULL DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at   TEXT
);

-- ============================================================
-- QUOTES + JOBS (service pipeline, Chunk 7)
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
  id           TEXT PRIMARY KEY,
  number       TEXT NOT NULL UNIQUE,
  customer_id  TEXT REFERENCES customers(id) ON DELETE SET NULL,
  email        TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new','drafting','sent','accepted','declined','expired','converted'
  )),
  total_cents  INTEGER NOT NULL DEFAULT 0,
  notes        TEXT NOT NULL DEFAULT '',
  expires_at   TEXT,
  accepted_at  TEXT,
  converted_order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_quotes_customer ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status   ON quotes(status);

CREATE TABLE IF NOT EXISTS quote_items (
  id               TEXT PRIMARY KEY,
  quote_id         TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description      TEXT NOT NULL,
  qty              INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  total_cents      INTEGER NOT NULL,
  position         REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS jobs (
  id           TEXT PRIMARY KEY,
  number       TEXT NOT NULL UNIQUE,
  order_id     TEXT REFERENCES orders(id) ON DELETE SET NULL,
  quote_id     TEXT REFERENCES quotes(id) ON DELETE SET NULL,
  customer_id  TEXT REFERENCES customers(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'intake' CHECK (status IN (
    'intake','proofing','approved','in_production','qa','ready','delivered','cancelled'
  )),
  priority     INTEGER NOT NULL DEFAULT 0,
  due_date     TEXT,
  notes        TEXT NOT NULL DEFAULT '',
  metadata     TEXT NOT NULL DEFAULT '{}',
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status, priority DESC);

CREATE TABLE IF NOT EXISTS job_events (
  id           TEXT PRIMARY KEY,
  job_id       TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  from_status  TEXT,
  to_status    TEXT,
  actor_type   TEXT NOT NULL,
  actor_id     TEXT,
  note         TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- AUDIT LOG (written by every admin mutation)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id           TEXT PRIMARY KEY,
  actor_type   TEXT NOT NULL CHECK (actor_type IN ('admin','customer','system','webhook')),
  actor_id     TEXT,
  impersonator_id TEXT,
  action       TEXT NOT NULL,
  target_type  TEXT NOT NULL,
  target_id    TEXT,
  diff         TEXT NOT NULL DEFAULT '{}',
  ip           TEXT,
  user_agent   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_actor   ON audit_log(actor_type, actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_target  ON audit_log(target_type, target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);
