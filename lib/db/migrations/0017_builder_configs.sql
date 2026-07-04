-- The Builder goes live on its first two products (task #42, canvas mode).
-- Config rides products.metadata.builder; no schema change. Mark polarity:
-- colored anodized strips to bare aluminum (light mark); wood burns dark.

UPDATE products SET metadata = json_set(COALESCE(metadata,'{}'), '$.builder', json('{
  "mode":"canvas","shape":"rounded-rect","widthIn":3.375,"heightIn":2.125,"cornerRadiusIn":0.125,
  "materials":[
    {"key":"black-matte","label":"Black, matte","surface":"#1c1c1e","mark":"light"},
    {"key":"black-gloss","label":"Black, gloss","surface":"#111114","mark":"light","gloss":true},
    {"key":"silver","label":"Silver","surface":"#c8c9cb","mark":"dark"},
    {"key":"blue","label":"Blue","surface":"#2a5d8f","mark":"light"},
    {"key":"red","label":"Red","surface":"#a03030","mark":"light"},
    {"key":"purple","label":"Purple","surface":"#5a3a7e","mark":"light"}
  ]
}')), updated_at = datetime('now') WHERE id = 'prd_anodized_card';

UPDATE products SET metadata = json_set(COALESCE(metadata,'{}'), '$.builder', json('{
  "mode":"canvas","shape":"rect","widthIn":12,"heightIn":12,
  "materials":[
    {"key":"wood","label":"Natural wood","surface":"#b98c52","mark":"dark"}
  ]
}')), updated_at = datetime('now') WHERE id = 'prd_wood_panel_art';
