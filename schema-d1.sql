-- VURMZ Website D1 Schema

-- Users table (admin accounts)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'EMPLOYEE',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'CO',
  zip TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  project_description TEXT NOT NULL,
  material TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  artwork_files TEXT DEFAULT '[]',
  status TEXT DEFAULT 'PENDING',
  estimated_price REAL,
  turnaround TEXT DEFAULT 'STANDARD',
  delivery_method TEXT DEFAULT 'PICKUP',
  how_heard_about_us TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  quote_id TEXT UNIQUE,
  project_description TEXT NOT NULL,
  material TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  artwork_files TEXT DEFAULT '[]',
  price REAL NOT NULL,
  status TEXT DEFAULT 'PENDING',
  due_date TEXT,
  delivery_method TEXT DEFAULT 'PICKUP',
  delivery_notes TEXT,
  lightburn_file_url TEXT,
  production_notes TEXT,
  laser_type TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (quote_id) REFERENCES quotes(id)
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  cost_per_unit REAL NOT NULL,
  unit TEXT DEFAULT 'each',
  quantity_in_stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  order_id TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  amount REAL NOT NULL,
  tax REAL DEFAULT 0,
  total REAL NOT NULL,
  status TEXT DEFAULT 'UNPAID',
  paid_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  industry TEXT,
  location TEXT,
  featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  location TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Settings table (single row)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  business_name TEXT DEFAULT 'VURMZ LLC',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT 'info@vurmz.com',
  address TEXT DEFAULT '',
  city TEXT DEFAULT 'Centennial',
  state TEXT DEFAULT 'CO',
  zip TEXT DEFAULT '80016',
  service_radius INTEGER DEFAULT 15,
  min_order_free_delivery REAL DEFAULT 100,
  delivery_fee REAL DEFAULT 15,
  sales_tax_rate REAL DEFAULT 0.0875,
  business_hours TEXT DEFAULT 'Mon-Fri 9am-6pm, Sat by appointment',
  primary_color TEXT DEFAULT '#1a1a1a',
  logo_url TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Insert default settings
INSERT OR IGNORE INTO settings (id, business_name) VALUES ('default', 'VURMZ LLC');

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO users (id, email, password, name, role)
VALUES ('admin', 'admin@vurmz.com', '$2a$10$rQZQ9xH8F5K5K5K5K5K5KuK5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Admin', 'ADMIN');
