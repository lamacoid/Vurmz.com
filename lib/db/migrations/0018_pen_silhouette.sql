-- The first silhouette product (task #42): the soft-touch stylus pen.
-- Outline drawn in inch units (5.5 x 0.55 horizontal): rubber stylus
-- dome, cap with clip step, barrel, taper to the ballpoint tip. Zones sit
-- on the barrel where the fiber laser actually reaches. Soft-touch
-- coating lasers to bare metal, so dark barrels mark light; the pale
-- barrels read dark.

UPDATE products SET metadata = json_set(COALESCE(metadata,'{}'), '$.builder', json('{
  "mode":"silhouette",
  "widthIn":5.5,"heightIn":0.55,
  "outlinePath":"M 0.30 0.05 L 1.50 0.05 L 1.55 0.08 L 4.70 0.08 Q 5.10 0.08 5.30 0.19 L 5.48 0.26 L 5.48 0.29 L 5.30 0.36 Q 5.10 0.47 4.70 0.47 L 1.55 0.47 L 1.50 0.50 L 0.30 0.50 Q 0.06 0.50 0.06 0.275 Q 0.06 0.05 0.30 0.05 Z M 0.50 0.05 L 1.35 0.05 L 1.35 0.13 L 0.60 0.13 Q 0.50 0.13 0.50 0.09 Z",
  "layouts":[
    {"key":"name","label":"One line","zones":[{"xIn":1.95,"yIn":0.16,"wIn":2.45,"hIn":0.23,"kind":"text"}]},
    {"key":"two-lines","label":"Two lines","zones":[{"xIn":1.95,"yIn":0.11,"wIn":2.45,"hIn":0.14,"kind":"text"},{"xIn":1.95,"yIn":0.30,"wIn":2.45,"hIn":0.14,"kind":"text"}]}
  ],
  "materials":[
    {"key":"charcoal","label":"Charcoal","surface":"#4a4a4f","mark":"light"},
    {"key":"gray","label":"Gray","surface":"#9a9aa0","mark":"light"},
    {"key":"sage","label":"Sage","surface":"#a9b3a4","mark":"light"},
    {"key":"powder","label":"Powder blue","surface":"#b9c8d8","mark":"dark"},
    {"key":"blush","label":"Blush","surface":"#d9a8a3","mark":"dark"},
    {"key":"cream","label":"Cream","surface":"#e6dfd0","mark":"dark"}
  ]
}')), updated_at = datetime('now') WHERE id IN ('prd_softtouch_pen', 'prd_pen_pack15');
