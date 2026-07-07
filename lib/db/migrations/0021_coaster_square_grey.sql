-- Slate coaster corrections (Zach): the coasters are SQUARE, not round,
-- and natural slate is GREY, not jet-black. Fix the Builder shape and
-- surface color, and the product copy that wrongly said "jet-black."

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder', json('{
    "mode":"canvas","shape":"rect","widthIn":4,"heightIn":4,
    "materials":[
      {"key":"slate","label":"Slate","surface":"#56575c","mark":"light"}
    ]
  }')),
  short_description = 'Natural grey slate, 4-inch square, cork feet. Etched to order.',
  description = 'Four square slate coasters, 4 inches, raw stone edge and cork backing that won''t scratch a surface. Your name, monogram, logo, or art etched into the stone. All four cut to match.',
  updated_at = datetime('now')
WHERE id = 'prd_slate_coaster';
