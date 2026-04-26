-- JDS-sourced catalog sections (shop catalog + B2B materials)
CREATE TABLE IF NOT EXISTS jds_catalog_sections (
  id TEXT PRIMARY KEY,
  catalog TEXT NOT NULL CHECK(catalog IN ('shop', 'materials')),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  premium INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  hero_image TEXT NOT NULL DEFAULT '',
  hero_thumbnail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- SKUs assigned to each catalog section
CREATE TABLE IF NOT EXISTS jds_catalog_skus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id TEXT NOT NULL REFERENCES jds_catalog_sections(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  thumbnail TEXT NOT NULL DEFAULT '',
  in_stock INTEGER NOT NULL DEFAULT 1,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(section_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_jds_catalog_skus_section ON jds_catalog_skus(section_id);
CREATE INDEX IF NOT EXISTS idx_jds_catalog_sections_catalog ON jds_catalog_sections(catalog);
