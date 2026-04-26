-- 0005_portal.sql — supporting tables for portal + invoice features.

-- Sequence table for human-readable invoice numbers
CREATE TABLE IF NOT EXISTS counters (
  key        TEXT PRIMARY KEY,
  value      INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO counters (key, value) VALUES ('invoice_number', 1000);

-- Helpful indices for customer-scoped queries (no-op if already there)
CREATE INDEX IF NOT EXISTS idx_invoices_paid_at ON invoices(paid_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_created ON orders(customer_id, created_at DESC);
