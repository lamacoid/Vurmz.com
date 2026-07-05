-- Early Bird Gets the VURMZ: the launch sale, through July 31.
-- The mechanic (lib/sale.ts): price_cents stays the regular price and
-- metadata.sale carries the launch price, the end instant, and an honest
-- cap. Menu, product page, and server-side cart validation all read the
-- same helper against the same clock, so every price reverts by itself at
-- midnight August 1 Denver time (06:00Z). Strikethrough only where the
-- regular price was really charged before (the slate set).

-- Slate coasters: $34 to $24 through July 31. Real former price.
UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.sale',
    json('{"priceCents":2400,"endsAt":"2026-08-01T06:00:00Z","compareAt":true}')),
  updated_at = datetime('now')
WHERE id = 'prd_slate_coaster';

-- Two forward-priced launch SKUs. No former price, so no strikethrough;
-- they simply carry a launch price with a date and a cap, and become
-- regular-priced products on August 1.
INSERT OR IGNORE INTO products (
  id, slug, name, description, short_description, category_id, audience,
  price_cents, pack_size, position, is_published, made_to_order,
  lead_time_days, weight_grams, hero_media_id, one_off, metadata,
  created_at, updated_at, deleted_at, sold_at
) VALUES
('prd_bamboo_board', 'bamboo-cutting-board',
 'Bamboo Cutting Board',
 'A bamboo cutting board engraved with whatever makes it theirs: a name, a date, a line in your handwriting, or a design from the library. Engraving is included.

Made to order; text me if you need it for a specific day.',
 'Bamboo, engraved with your text or a design. Engraving included.',
 'cat_gifts', 'shop', 3900, 1, 12, 1, 1, 2, 900, NULL, 0,
 '{"sale":{"priceCents":2900,"endsAt":"2026-08-01T06:00:00Z","compareAt":false,"capUnits":20,"capLabel":"first 20 boards"}}',
 datetime('now'), datetime('now'), NULL, NULL),

('prd_pen_pack10', 'soft-touch-stylus-pens-pack-10',
 'Soft-Touch Stylus Pens (Pack of 10)',
 'Ten weighted metal pens with the suede-feel coating and capacitive stylus tip, each engraved with the same name, logo, or line of text.

Mix of colors available; name your preference in the order notes. Need a logo or both sides marked? Text me and I''ll quote the add-ons.',
 'Ten soft-touch stylus pens, engraved to match.',
 'cat_pens', 'shop', 3000, 10, 21, 1, 1, 3, 300, NULL, 0,
 '{"sale":{"priceCents":2000,"endsAt":"2026-08-01T06:00:00Z","compareAt":false,"capUnits":10,"capLabel":"first 10 packs"}}',
 datetime('now'), datetime('now'), NULL, NULL);

-- The pack of 10 previews on the same pen silhouette as the other pen SKUs.
UPDATE products SET
  metadata = json_set(metadata, '$.builder',
    json(json_extract((SELECT metadata FROM products WHERE id = 'prd_pen_pack15'), '$.builder')))
WHERE id = 'prd_pen_pack10'
  AND json_extract(metadata, '$.builder') IS NULL
  AND (SELECT json_extract(metadata, '$.builder') FROM products WHERE id = 'prd_pen_pack15') IS NOT NULL;
