-- Finish-level inventory (2026-07-16). Stock is real per color/finish where
-- that matters (pens, cards): one row per (product, variant, finish), with
-- finish NULL meaning whole-product stock, exactly as before. The shop only
-- offers finishes that have a stocked row; no inventory row, no chip.
ALTER TABLE inventory ADD COLUMN finish TEXT;

DROP INDEX IF EXISTS uq_inventory_product_variant;
CREATE UNIQUE INDEX IF NOT EXISTS uq_inventory_product_variant_finish ON inventory(
  COALESCE(product_id, ''), COALESCE(variant_id, ''), COALESCE(finish, '')
);
