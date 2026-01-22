-- Migration 001: Add missing columns and tables for VURMZ backend overhaul
-- Run this against your D1 database

-- Add missing columns to quotes table
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS payment_url TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS payment_link_id TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS customer_token TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS response_sent_at TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS accepted_at TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS completed_at TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS invoice_url TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS price REAL;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS square_payment_id TEXT;

-- Add missing columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS square_payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receipt_sent INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS receipt_sent_at TEXT;

-- Create sessions table for proper auth
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_type TEXT CHECK (user_type IN ('admin', 'customer')),
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create payments table to track all payments
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  quote_id TEXT,
  order_id TEXT,
  customer_id TEXT NOT NULL,
  square_payment_id TEXT UNIQUE,
  square_order_id TEXT,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  paid_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (quote_id) REFERENCES quotes(id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  receipt_number TEXT UNIQUE NOT NULL,
  order_id TEXT,
  payment_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  amount REAL NOT NULL,
  tax REAL DEFAULT 0,
  total REAL NOT NULL,
  sent_at TEXT,
  pdf_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (payment_id) REFERENCES payments(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_square_payment_id ON payments(square_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_quote_id ON payments(quote_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_receipts_order_id ON receipts(order_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payment_id ON receipts(payment_id);
CREATE INDEX IF NOT EXISTS idx_quotes_payment_link_id ON quotes(payment_link_id);

-- Order activity/timeline table
CREATE TABLE IF NOT EXISTS order_activity (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_activity_order_id ON order_activity(order_id);

-- Site configuration table for CMS
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY,
  config_data TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);
