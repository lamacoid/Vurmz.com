-- VURMZ Quotes Database Schema

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  product_type TEXT NOT NULL,
  quantity TEXT,
  description TEXT NOT NULL,
  turnaround TEXT,
  delivery_method TEXT,
  how_heard TEXT,
  status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
