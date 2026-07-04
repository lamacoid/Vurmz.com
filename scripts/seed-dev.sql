-- LOCAL-ONLY dev seed (seed-dev skill). Safe to re-run.
INSERT OR IGNORE INTO invoices (id, number, customer_id, status, subtotal_cents, tax_cents, total_cents, amount_paid_cents, due_date, notes, sent_at, paid_at, created_at, updated_at) VALUES
('inv_seed_1001', 'INV-1001', 'cus_dn688nppmtzqb94cc5e5yk2m', 'paid', 18500, 0, 18500, 18500, date('now','-12 days'), 'Crew knife engraving, 12 knives.', datetime('now','-20 days'), datetime('now','-15 days'), datetime('now','-21 days'), datetime('now','-15 days')),
('inv_seed_1002', 'INV-1002', 'cus_q27rvfa1pe6rhakynabs5wvz', 'sent', 9000, 0, 9000, 0, date('now','-10 days'), 'Service tags, pack of 30.', datetime('now','-18 days'), NULL, datetime('now','-18 days'), datetime('now','-18 days'));
INSERT OR IGNORE INTO invoice_items (id, invoice_id, description, qty, unit_price_cents, total_cents, position) VALUES
('invi_seed_1', 'inv_seed_1001', 'Crew knife engraving', 12, 1200, 14400, 0),
('invi_seed_2', 'inv_seed_1001', 'Deep marking add-on', 12, 300, 3600, 1),
('invi_seed_3', 'inv_seed_1002', 'Stainless service tags (pack of 10)', 3, 3000, 9000, 0);
