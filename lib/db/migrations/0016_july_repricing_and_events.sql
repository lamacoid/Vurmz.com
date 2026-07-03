-- July 2026 repricing (approved sheet, vurmz-control/PRICING-PROPOSAL-2026-07.md)
-- plus the conversion-events table the masterplan requires BEFORE prices
-- move, so the change is measurable.

-- Price cuts on the posted-price battlegrounds.
UPDATE products SET price_cents = 2800, updated_at = datetime('now') WHERE id = 'prd_pine_coaster';       -- $36 -> $28
UPDATE products SET price_cents = 2500, updated_at = datetime('now') WHERE id = 'prd_metal_card_business_pack10'; -- $30 -> $25
UPDATE products SET price_cents = 3000, updated_at = datetime('now') WHERE id = 'prd_metal_labels_pack10'; -- $40 -> $30

-- New consumer SKUs the analysis exposed as gaps.
INSERT OR IGNORE INTO media (id, r2_key, filename, mime_type, size_bytes, width, height, alt_text, folder, tags, uploaded_at)
VALUES
('med_pet_tags_colors', 'media/e4/33/e433d9ea02e469dd3b155f93a3919ad0fa178e2acde7825737638e39aa17c209.jpg', 'pet-tags-small-collar.jpg', 'image/jpeg', 253127, 2000, 2000,
 'Anodized aluminum pet tags in eight colors', 'products', '["product","tags","pets"]', datetime('now')),
('med_dog_tag_red', 'media/90/7c/907c541b1fb73aa4e0b3e407920e912a4bbf1aa31796e0d34282232b53bd90b6.jpg', 'dog-tag-red.jpg', 'image/jpeg', 132717, 2000, 2000,
 'Red anodized dog tag', 'products', '["product","tags","pets"]', datetime('now'));

INSERT OR IGNORE INTO products (
  id, slug, name, description, short_description, category_id, audience,
  price_cents, pack_size, position, is_published, made_to_order,
  lead_time_days, weight_grams, hero_media_id, one_off, metadata,
  created_at, updated_at, deleted_at, sold_at
) VALUES
('prd_pet_tag', 'engraved-pet-tag',
 'Engraved Pet Tag',
 'An anodized aluminum tag engraved with your pet''s name and your number, in eight colors. The slide tags fit small collars, which most tag racks skip. Engraving is included; there is nothing extra to add at checkout.',
 'Anodized aluminum, eight colors, engraving included. Slide tags fit small collars.',
 'cat_labels_tags', 'shop', 1200, 1, 40, 1, 1, 2, 15, 'med_pet_tags_colors', 0, '{}',
 datetime('now'), datetime('now'), NULL, NULL),

('prd_keychain_single', 'engraved-keychain',
 'Engraved Keychain',
 'One keychain, engraved with a name, date, or a design from the library. Engraving is included. Also sold by the pack for events and crews; ask about volume.',
 'One keychain, engraved, ready in a couple days. Engraving included.',
 'cat_keychains', 'shop', 1000, 1, 35, 1, 1, 2, 30, NULL, 0, '{}',
 datetime('now'), datetime('now'), NULL, NULL);

INSERT OR IGNORE INTO product_images (id, product_id, media_id, position, is_primary) VALUES
('pimg_pet_tag_colors', 'prd_pet_tag', 'med_pet_tags_colors', 0, 1),
('pimg_pet_tag_red', 'prd_pet_tag', 'med_dog_tag_red', 1, 0);

-- Conversion events: same shape philosophy as pageviews, written by the
-- public /api/track beacon. Measured funnel: add_to_cart -> begin_checkout
-- -> purchase.
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT NOT NULL,
  name       TEXT NOT NULL,
  path       TEXT NOT NULL DEFAULT '',
  value_cents INTEGER,
  meta       TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_date_name ON events(date, name);
