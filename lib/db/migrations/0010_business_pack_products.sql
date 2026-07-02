-- Business pack products, part of the pricing rebuild (2026-07-02).
-- Adds real, purchasable D1 products for the bulk business-pack pricing
-- that already existed in lib/pricing.ts copy (bulk coasters $4/ea in
-- packs of 15, bulk metal cards $3/ea in packs of 10) but had no matching
-- SKU. audience='services' keeps them off the consumer /shop grid (which
-- filters shop_visible = audience IN ('shop','both')) while still fully
-- reachable and purchasable at their own /shop/p/[slug] page. Named
-- "Business Pack" to stay visually distinct from the retail boxed sets.
-- No schema change: volume-tier discounting is computed in application
-- code (lib/pricing.ts businessUnitPrice) from qty * pack_size, not stored
-- per-row here.

INSERT OR IGNORE INTO products (
  id, slug, name, description, short_description, category_id, audience,
  price_cents, pack_size, position, is_published, made_to_order,
  lead_time_days, weight_grams, hero_media_id, one_off, metadata,
  created_at, updated_at, deleted_at, sold_at
) VALUES
('prd_coaster_business_pack15', 'coasters-business-pack-15',
 'Coasters (Business Pack of 15)',
 'Fifteen pine coasters, engraved to match, for restaurants, bars, and offices that need a real quantity rather than a gift set. Ask about volume pricing for standing orders of 50 or more.',
 'Fifteen pine coasters, engraved to match. Volume pricing available.',
 'cat_coasters', 'services', 6000, 15, 50, 1, 1, 5, 2250, NULL, 0, '{}',
 datetime('now'), datetime('now'), NULL, NULL),

('prd_metal_card_business_pack10', 'metal-cards-business-pack-10',
 'Metal Business Cards (Pack of 10)',
 'Ten anodized aluminum wallet cards engraved with your name, title, or QR code, the bulk version of the single wallet card, priced for handing out. Ask about volume pricing for larger runs.',
 'Ten anodized aluminum cards, engraved to match. Volume pricing available.',
 'cat_metal_cards', 'services', 3000, 10, 20, 1, 1, 3, 150, NULL, 0, '{}',
 datetime('now'), datetime('now'), NULL, NULL);

-- While touching these categories: the retail coaster sets and the single
-- wallet card had em-dashes in their names/copy, against the site's brand
-- rule (no em-dashes anywhere). Fixed to commas/parens/colons in place.

UPDATE products SET name = 'Slate Coasters (Set of 4)',
  description = 'Four genuine slate coasters, 4 inches across, with a raw stone edge and soft cork backing that won''t scratch a surface. We laser-etch your name, monogram, logo, or art straight into the stone: permanent, dishwasher-tough, impossible to ignore on a coffee table. Pick your text and font above; all four are cut to match.' || char(10) || char(10) || 'Keep a set on hand. Gift a set that lasts.'
  WHERE id = 'prd_slate_coaster';

UPDATE products SET name = 'Gold Stainless Coasters (Set of 4)'
  WHERE id = 'prd_gold_ss_coaster';

UPDATE products SET name = 'Brushed Stainless Coasters (Set of 4 + Caddy)'
  WHERE id = 'prd_brushed_ss_coaster';

UPDATE products SET name = 'Pine Wood Coasters (Set of 4)',
  description = 'Four solid pine coasters cut square with gently rounded edges: warm, light, ready for your mark. We finish them three ways: clean natural, rich stain, or a smoky scorched edge for that woodshop look. Tell us your finish in the order notes.' || char(10) || char(10) || 'Real wood, real character, made to order.'
  WHERE id = 'prd_pine_coaster';

UPDATE products SET short_description = 'Credit-card-sized anodized aluminum. Laser pops bright on color, wallet-ready.'
  WHERE id = 'prd_anodized_card';
