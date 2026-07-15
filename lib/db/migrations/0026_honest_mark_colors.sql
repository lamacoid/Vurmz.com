-- Honest mark colors (Zach): anodized aluminum ALWAYS marks bare-alu
-- silver, whatever the dye color; polarity alone was lying in the
-- previews. markColor rides each material; renderers fall back to the
-- old polarity defaults when absent (slate frost, wood burn unchanged).
-- Stainless products, when listed, carry annealing options as separate
-- material entries (black / gold / blue mark colors).

-- The metal cards: six anodized finishes, one silver mark. The silver
-- card's mark is a touch deeper so tone-on-tone stays visible on screen,
-- which matches the matte etch on satin silver.
UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder.materials', json('[
    {"key":"black-matte","label":"Black, matte","surface":"#1c1c1e","mark":"light","markColor":"#C9CACC"},
    {"key":"black-gloss","label":"Black, gloss","surface":"#111114","mark":"light","markColor":"#C9CACC","gloss":true},
    {"key":"silver","label":"Silver","surface":"#c8c9cb","mark":"dark","markColor":"#B4B6B9"},
    {"key":"blue","label":"Blue","surface":"#2a5d8f","mark":"light","markColor":"#C9CACC"},
    {"key":"red","label":"Red","surface":"#a03030","mark":"light","markColor":"#C9CACC"},
    {"key":"purple","label":"Purple","surface":"#5a3a7e","mark":"light","markColor":"#C9CACC"}
  ]')),
  updated_at = datetime('now')
WHERE id IN ('prd_anodized_card', 'prd_metal_card_business_pack10');

-- The soft-touch pens: aluminum barrel under the coating, marks silver.
UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder.materials', json('[
    {"key":"charcoal","label":"Charcoal","surface":"#4a4a4f","mark":"light","markColor":"#C9CACC"},
    {"key":"gray","label":"Gray","surface":"#9a9aa0","mark":"light","markColor":"#B4B6B9"},
    {"key":"sage","label":"Sage","surface":"#a9b3a4","mark":"light","markColor":"#C9CACC"},
    {"key":"powder","label":"Powder blue","surface":"#b9c8d8","mark":"dark","markColor":"#B4B6B9"},
    {"key":"blush","label":"Blush","surface":"#d9a8a3","mark":"dark","markColor":"#B4B6B9"},
    {"key":"cream","label":"Cream","surface":"#e6dfd0","mark":"dark","markColor":"#B4B6B9"}
  ]')),
  updated_at = datetime('now')
WHERE id IN ('prd_softtouch_pen', 'prd_pen_pack10', 'prd_pen_pack15');
