-- Commercial-grade listings, part 1 of the schema (2026-07-03).
-- The 0001 schema already shipped dormant product_variants and
-- product_images tables; this migration activates them.
--
-- Variants become PACK-SIZE OPTIONS with ABSOLUTE pricing: a variant is
-- "pack of N at $X total", not a delta off the base price (the old
-- price_cents_delta column stays but is dead; absolute prices are what the
-- admin form's unit-price auto-calc produces and what validateCart reads).
-- A product's own price_cents/pack_size remain the DEFAULT option, so
-- every existing product and the whole checkout path is unchanged until a
-- product actually has variant rows.
--
-- product_images needs no changes: (product_id, media_id, position,
-- is_primary) is exactly the gallery model. hero_media_id remains the
-- primary-image pointer (menu and cart thumbnails read it); the admin form
-- keeps it in sync with the first gallery slot.

ALTER TABLE product_variants ADD COLUMN pack_size INTEGER NOT NULL DEFAULT 1;
ALTER TABLE product_variants ADD COLUMN price_cents INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product   ON product_images(product_id);
