-- 3D preview for the metal cards: one tintable GLB serves all six
-- anodized finishes (the viewer tints materials named 'tintable').

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder.model3d', '/models/wallet-card.glb'),
  updated_at = datetime('now')
WHERE id IN ('prd_anodized_card', 'prd_metal_card_business_pack10');
