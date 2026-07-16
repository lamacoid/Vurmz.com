-- 3D preview for the stylus pens: the mark wraps the barrel
-- (markCylinder radius from the silhouette profile, 0.195in).

UPDATE products SET
  metadata = json_set(json_set(COALESCE(metadata, '{}'),
    '$.builder.model3d', '/models/stylus-pen.glb'),
    '$.builder.markCylinder', json('{"radiusIn":0.195}')),
  updated_at = datetime('now')
WHERE id IN ('prd_softtouch_pen', 'prd_pen_pack10', 'prd_pen_pack15');
