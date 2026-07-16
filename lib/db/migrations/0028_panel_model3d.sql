-- 3D preview for the 12x12 wood panel (burn marks dark on oak, the
-- polarity default, so no markColor needed).

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder.model3d', '/models/wood-panel.glb'),
  updated_at = datetime('now')
WHERE id = 'prd_wood_panel_art';
