-- Saved designs (2026-09-13). Every design a customer makes in the designer
-- autosaves here whether or not they order: guests by an unguessable token
-- kept in their browser, accounts by customer id. When an order is placed
-- the row is linked to it. Guest rows with no email age out; rows with an
-- email or a customer stay. Zach reads this as the admin Designs room.
CREATE TABLE IF NOT EXISTS designs (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
  guest_token TEXT,
  email TEXT,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  kind TEXT NOT NULL DEFAULT 'card',
  design TEXT NOT NULL,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_designs_customer ON designs(customer_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_designs_token ON designs(guest_token, product_id);
CREATE INDEX IF NOT EXISTS idx_designs_updated ON designs(updated_at DESC);
