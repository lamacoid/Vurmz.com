-- 0004_seed_categories.sql
-- Seed shop categories matching the current static catalog in lib/categories.ts
-- Products are NOT seeded — Zach adds those via /admin/products with real prices.

INSERT OR IGNORE INTO categories (id, slug, name, description, position, is_published, created_at, updated_at) VALUES
  ('cat_gifts',      'gifts',      'Gifts & Keepsakes', 'Custom laser engraved gifts. Cutting boards, plaques, trophies, and personalized keepsakes.', 10, 1, datetime('now'), datetime('now')),
  ('cat_knives',     'knives',     'Knife Engraving',   'Bring your blade. Names, initials, logos near the handle. Kitchen crew pickup available.',         20, 1, datetime('now'), datetime('now')),
  ('cat_tumblers',   'tumblers',   'Tumblers & Bottles','Custom engraved tumblers and water bottles. Stainless steel, powder-coated, full-wrap available.', 30, 1, datetime('now'), datetime('now')),
  ('cat_coasters',   'coasters',   'Coasters',          'Laser engraved coasters. Wood, slate, or steel. Wedding favors, gifts, home decor.',               40, 1, datetime('now'), datetime('now')),
  ('cat_keychains',  'keychains',  'Keychains',         'Laser engraved keychains. Metal, wood, or acrylic.',                                               50, 1, datetime('now'), datetime('now')),
  ('cat_decor',      'decor',      'Art & Home Decor',  'Custom laser engraved art and home decor. Mirrors, metal artwork, custom pieces.',                 60, 1, datetime('now'), datetime('now')),
  ('cat_devices',    'devices',    'Device Engraving',  'MacBook, iPad, and laptop engraving. Permanent laser engraving on your device.',                    70, 1, datetime('now'), datetime('now'));
