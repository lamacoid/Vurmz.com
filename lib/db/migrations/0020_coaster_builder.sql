-- The slate coaster gets the real Builder (task #42 rollout): a true
-- round 4-inch slate surface you design on directly, with drag/resize,
-- upload-your-own-logo, and the design library demoted to optional.
-- Replaces the thin text-only engraving picker on this product.
-- Jet-black natural slate: dark surface, so the laser mark reads LIGHT.

UPDATE products SET metadata = json_set(COALESCE(metadata, '{}'), '$.builder', json('{
  "mode":"canvas","shape":"circle","widthIn":4,"heightIn":4,
  "materials":[
    {"key":"slate","label":"Slate","surface":"#1a1a1c","mark":"light"}
  ]
}')), updated_at = datetime('now') WHERE id = 'prd_slate_coaster';
