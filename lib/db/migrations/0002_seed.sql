-- 0002_seed.sql
-- Idempotent seed data: default theme, business info, navigation.
-- Uses INSERT OR IGNORE / ON CONFLICT so re-runs are safe.

-- Default theme ---------------------------------------------------------------
INSERT OR IGNORE INTO site_theme (id, colors, fonts, spacing, updated_at) VALUES (
  'default',
  json_object(
    'bg',            '#1a2f2e',
    'bg_alt',        '#243B39',
    'teal_primary',  '#6BB8B2',
    'teal_muted',    '#3CB9B2',
    'coral_cta',     '#C46B4D',
    'coral_accent',  '#B16558',
    'cream',         '#F0E6D3',
    'cream_muted',   '#6B6259',
    'text_heading',  '#F0E6D3',
    'text_body',     '#9CA3AF',
    'text_muted',    '#6B7280',
    'border',        'rgba(255,255,255,0.06)'
  ),
  json_object(
    'heading', '"Inter", system-ui, sans-serif',
    'body',    '"Inter", system-ui, sans-serif',
    'mono',    '"JetBrains Mono", ui-monospace, monospace'
  ),
  json_object(
    'container_max', '72rem',
    'radius_sm',     '2px',
    'radius_md',     '6px',
    'radius_lg',     '12px'
  ),
  datetime('now')
);

-- Business info --------------------------------------------------------------
INSERT INTO site_settings (key, value, updated_at) VALUES (
  'business_info',
  json_object(
    'name',        'VURMZ',
    'legal_name',  'VURMZ LLC',
    'tagline',     'Laser engraving for small business.',
    'description', 'Premium laser engraving services in Centennial, Colorado. Branded pens, metal business cards, industrial labels, knife engraving, and more.',
    'phone',       '(719) 257-3834',
    'phone_clean', '7192573834',
    'email',       'zach@vurmz.com',
    'address',     'Centennial, CO',
    'full_address','Centennial, CO 80112',
    'city',        'Centennial',
    'state',       'Colorado',
    'state_abbr',  'CO',
    'url',         'https://vurmz.com',
    'coords',      json_object('lat', 39.58, 'lng', -104.87),
    'founder',     json_object('name', 'Zach', 'full_name', 'Zach DeMillo')
  ),
  datetime('now')
) ON CONFLICT(key) DO NOTHING;

INSERT INTO site_settings (key, value, updated_at) VALUES (
  'service_areas',
  json_array('Centennial','Littleton','Lone Tree','Parker','Highlands Ranch','Englewood','Castle Rock','Aurora','Greenwood Village','Cherry Hills','Denver'),
  datetime('now')
) ON CONFLICT(key) DO NOTHING;

INSERT INTO site_settings (key, value, updated_at) VALUES (
  'social_links',
  json_object('instagram','','facebook','','linkedin',''),
  datetime('now')
) ON CONFLICT(key) DO NOTHING;

-- Services header navigation -------------------------------------------------
INSERT INTO navigation (id, placement, position, label, href, opens_new_tab, created_at, updated_at) VALUES
  ('nav_hdr_pricing',   'header', 10, 'Pricing',   '/services/pricing',   0, datetime('now'), datetime('now')),
  ('nav_hdr_portfolio', 'header', 20, 'Portfolio', '/services/portfolio', 0, datetime('now'), datetime('now')),
  ('nav_hdr_community', 'header', 30, 'Community', '/services/centennial',0, datetime('now'), datetime('now')),
  ('nav_hdr_contact',   'header', 40, 'Contact',   '/services/contact',   0, datetime('now'), datetime('now')),
  ('nav_hdr_shop',      'header', 50, 'Shop',      '/shop',               0, datetime('now'), datetime('now'))
ON CONFLICT(id) DO NOTHING;

-- Footer navigation ----------------------------------------------------------
INSERT INTO navigation (id, placement, position, label, href, opens_new_tab, created_at, updated_at) VALUES
  ('nav_ftr_services',  'footer', 10, 'Services',  '/services',           0, datetime('now'), datetime('now')),
  ('nav_ftr_portfolio', 'footer', 20, 'Portfolio', '/services/portfolio', 0, datetime('now'), datetime('now')),
  ('nav_ftr_pricing',   'footer', 30, 'Pricing',   '/services/pricing',   0, datetime('now'), datetime('now')),
  ('nav_ftr_shop',      'footer', 40, 'Shop',      '/shop',               0, datetime('now'), datetime('now')),
  ('nav_ftr_contact',   'footer', 50, 'Contact',   '/services/contact',   0, datetime('now'), datetime('now')),
  ('nav_ftr_privacy',   'footer-legal', 10, 'Privacy', '/privacy', 0, datetime('now'), datetime('now')),
  ('nav_ftr_terms',     'footer-legal', 20, 'Terms',   '/terms',   0, datetime('now'), datetime('now'))
ON CONFLICT(id) DO NOTHING;

-- Placeholder pages (block-based rendering flip happens in Chunk 1) ----------
INSERT INTO pages (id, slug, title, meta_description, published_blocks, draft_blocks, version, is_published, created_at, updated_at, published_at) VALUES
  ('pg_home',       'home',              'VURMZ — Laser engraving for small business',
    'Premium laser engraving in Centennial, Colorado. Branded pens, metal business cards, industrial labels, and custom engravings.',
    '[]', '[]', 1, 1, datetime('now'), datetime('now'), datetime('now')),
  ('pg_about',      'about',             'About VURMZ',
    'Meet Zach DeMillo, the laser engraver behind VURMZ.',
    '[]', '[]', 1, 1, datetime('now'), datetime('now'), datetime('now')),
  ('pg_shop_home',  'shop',              'Shop — VURMZ',
    'Engraved gifts, personalized knives, custom coasters, and home decor. Pricing up front.',
    '[]', '[]', 1, 1, datetime('now'), datetime('now'), datetime('now')),
  ('pg_services',   'services',          'Services — VURMZ',
    'Branded products, service tags, industrial marking. Hand-delivered in Centennial, CO.',
    '[]', '[]', 1, 1, datetime('now'), datetime('now'), datetime('now'))
ON CONFLICT(id) DO NOTHING;
