-- 3D engraving preview (task #52): point the slate coaster at its GLB
-- model. Presence of builder.model3d turns on the "See it in 3D" view.

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder.model3d', '/models/slate-coaster.glb'),
  updated_at = datetime('now')
WHERE id = 'prd_slate_coaster';
