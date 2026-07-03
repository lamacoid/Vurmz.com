-- Metal labels: the adhesive-backed stainless labels from the 2026-07-02
-- product shoot, listed on the business side (audience='services' keeps
-- them off the consumer shop menu while the /shop/p/ page stays live and
-- purchasable). The finished example is the VURMZ plate on the shop's own
-- diode laser. New "Labels & Tags" category so round tags and friends have
-- a home later; it renders nowhere until a shop-visible product joins it.
-- Photos were uploaded to R2 ahead of this migration (media/products/*).

INSERT OR IGNORE INTO categories (id, slug, name, description, position, is_published, created_at, updated_at)
VALUES ('cat_labels_tags', 'labels-tags', 'Labels & Tags',
        'Engraved metal labels and tags for equipment, gear, and product.',
        90, 1, datetime('now'), datetime('now'));

-- Keys are content-addressed (media/aa/bb/<sha256>.<ext>): the public
-- /api/media route's IDOR gate only serves that shape.
INSERT OR IGNORE INTO media (id, r2_key, filename, mime_type, size_bytes, width, height, alt_text, folder, tags, uploaded_at)
VALUES
('med_metal_label_black', 'media/ad/04/ad04f51666544fb7fe4b9fbd031c9745fa136b387b48b7cb8042d6324beff6a7.jpg', 'metal-label-black.jpg', 'image/jpeg', 195125, 2000, 2000,
 'Black stainless metal label with adhesive foam backing', 'products', '["product","labels"]', datetime('now')),
('med_metal_label_steel', 'media/71/6e/716ef003cfa05d6072189454065c7fb3fb810c53d54ee8fd91102df43b25c412.jpg', 'metal-label-steel.jpg', 'image/jpeg', 298852, 2000, 2000,
 'Brushed stainless metal label with adhesive foam backing', 'products', '["product","labels"]', datetime('now'));

INSERT OR IGNORE INTO products (
  id, slug, name, description, short_description, category_id, audience,
  price_cents, pack_size, position, is_published, made_to_order,
  lead_time_days, weight_grams, hero_media_id, one_off, metadata,
  created_at, updated_at, deleted_at, sold_at
) VALUES
('prd_metal_labels_pack10', 'metal-labels-pack-10',
 'Metal Equipment Labels (Pack of 10)',
 'Ten stainless steel labels engraved with your logo, name, or asset info, each with 3M foam adhesive backing: peel, press, done. Black or brushed steel, a few stock sizes. Put your name on your equipment, your tools, your product. There is one on my own laser.' || char(10) || char(10) || 'Ask about volume pricing for standing orders of 50 or more.',
 'Ten stainless labels, engraved to match, 3M adhesive backing. Volume pricing available.',
 'cat_labels_tags', 'services', 4000, 10, 30, 1, 1, 3, 400, 'med_metal_label_black', 0, '{}',
 datetime('now'), datetime('now'), NULL, NULL);
