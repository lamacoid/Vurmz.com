-- The ledger (2026-11-06). One place every dollar in or out lands.
-- Append only. Cash basis. See vurmz-control/PIPELINE.md section 2 and 7.
--
-- posting_key is the idempotency key: one row per real-world money event
-- (square:<payment_id>, cash:<order_id>, invoice:<invoice_id>, ...). A retry
-- of any settle path is a no-op because the key already exists.
--
-- kind:   sale (+), refund (-), fee (-), payout (transfer, not income),
--         expense (-), adjustment (either sign, always with a note)
-- method: card, cash, invoice, square_invoice, venmo, other
-- source: checkout, admin_cash, invoice_paid, account_pay, square_webhook,
--         square_sync, backfill, manual
CREATE TABLE IF NOT EXISTS ledger (
  id            TEXT PRIMARY KEY,
  posting_key   TEXT NOT NULL UNIQUE,
  occurred_at   TEXT NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN ('sale','refund','fee','payout','expense','adjustment')),
  amount_cents  INTEGER NOT NULL,
  tax_cents     INTEGER NOT NULL DEFAULT 0,
  method        TEXT NOT NULL DEFAULT 'other',
  category      TEXT NOT NULL DEFAULT '',
  order_id      TEXT REFERENCES orders(id) ON DELETE SET NULL,
  invoice_id    TEXT REFERENCES invoices(id) ON DELETE SET NULL,
  payment_id    TEXT REFERENCES payments(id) ON DELETE SET NULL,
  customer_id   TEXT REFERENCES customers(id) ON DELETE SET NULL,
  source        TEXT NOT NULL DEFAULT 'manual',
  external_id   TEXT,
  receipt_key   TEXT,
  note          TEXT NOT NULL DEFAULT '',
  created_by    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ledger_order ON ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_ledger_invoice ON ledger(invoice_id);
CREATE INDEX IF NOT EXISTS idx_ledger_occurred ON ledger(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_kind ON ledger(kind, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_external ON ledger(external_id);

-- Zero tax has to mean something. none = not determined, collected = tax
-- was charged (orders.tax_cents), exempt = customer is exempt.
ALTER TABLE orders ADD COLUMN tax_status TEXT NOT NULL DEFAULT 'none';
