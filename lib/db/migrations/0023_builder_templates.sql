-- Builder templates: pre-built layouts so the canvas never starts blank.
-- Cards get three classic business-card layouts; the mailbox gets the
-- family-name gift layout. Positions are real inches on the product.

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder.templates', json('[
    {"key":"classic","label":"Name, title, contact","elements":[
      {"kind":"text","text":"Your name","fontValue":"zen-kurenaido","xIn":0.4,"yIn":0.72,"wIn":2.575,"hIn":0.3,"rotationDeg":0},
      {"kind":"text","text":"What you do","fontValue":"zen-kurenaido","xIn":0.4,"yIn":1.1,"wIn":2.575,"hIn":0.16,"rotationDeg":0},
      {"kind":"text","text":"555-555-5555 · you@email.com","fontValue":"zen-kurenaido","xIn":0.4,"yIn":1.6,"wIn":2.575,"hIn":0.13,"rotationDeg":0}
    ]},
    {"key":"bold","label":"Big centered name","elements":[
      {"kind":"text","text":"YOUR NAME","fontValue":"zen-kurenaido","xIn":0.3,"yIn":0.85,"wIn":2.775,"hIn":0.42,"rotationDeg":0}
    ]},
    {"key":"corner","label":"Name up top, contact below","elements":[
      {"kind":"text","text":"Your name","fontValue":"zen-kurenaido","xIn":0.3,"yIn":0.35,"wIn":2,"hIn":0.26,"rotationDeg":0},
      {"kind":"text","text":"555-555-5555 · you@email.com","fontValue":"zen-kurenaido","xIn":1.05,"yIn":1.68,"wIn":2,"hIn":0.13,"rotationDeg":0}
    ]}
  ]')),
  updated_at = datetime('now')
WHERE id IN ('prd_anodized_card', 'prd_metal_card_business_pack10');

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder.templates', json('[
    {"key":"family","label":"Family name + est. date","elements":[
      {"kind":"text","text":"The Your-Names","fontValue":"zen-kurenaido","xIn":0.5,"yIn":1.05,"wIn":3,"hIn":0.45,"rotationDeg":0},
      {"kind":"text","text":"est. 2026","fontValue":"zen-kurenaido","xIn":1.25,"yIn":1.75,"wIn":1.5,"hIn":0.22,"rotationDeg":0}
    ]},
    {"key":"message","label":"A short message","elements":[
      {"kind":"text","text":"You''ve got mail","fontValue":"zen-kurenaido","xIn":0.5,"yIn":1.2,"wIn":3,"hIn":0.35,"rotationDeg":0}
    ]}
  ]')),
  updated_at = datetime('now')
WHERE id = 'prd_mini_mailbox';
