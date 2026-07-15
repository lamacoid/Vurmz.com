-- Builder rollout, batch 1: the two products whose dimensions are already
-- established facts (no guessing, per the slate coaster lesson).
--
-- 1. Metal Business Cards (Pack of 10): the copy says it is "the bulk
--    version of the single wallet card", so it gets the wallet card's
--    builder config verbatim (same blank, same six anodized colors).
-- 2. Personalized Mini Mailbox: the copy states the engraving area is
--    "a 4x3 panel on the side". White painted surface, mark reads dark.

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder',
    (SELECT json_extract(metadata, '$.builder') FROM products WHERE id = 'prd_anodized_card')),
  updated_at = datetime('now')
WHERE id = 'prd_metal_card_business_pack10';

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder', json('{
    "mode":"canvas","shape":"rect","widthIn":4,"heightIn":3,
    "materials":[
      {"key":"white","label":"White","surface":"#F2F0EB","mark":"dark"}
    ]
  }')),
  updated_at = datetime('now')
WHERE id = 'prd_mini_mailbox';
