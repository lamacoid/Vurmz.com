-- Builder templates for the slate coasters: the gift layouts people
-- actually ask for. Positions in real inches on the 4x4 face.

UPDATE products SET
  metadata = json_set(COALESCE(metadata, '{}'), '$.builder.templates', json('[
    {"key":"family","label":"Family name","elements":[
      {"kind":"text","text":"The Your-Names","fontValue":"zen-kurenaido","xIn":0.4,"yIn":1.55,"wIn":3.2,"hIn":0.5,"rotationDeg":0},
      {"kind":"text","text":"est. 2026","fontValue":"zen-kurenaido","xIn":1.3,"yIn":2.25,"wIn":1.4,"hIn":0.22,"rotationDeg":0}
    ]},
    {"key":"monogram","label":"Big monogram","elements":[
      {"kind":"text","text":"D","fontValue":"zen-kurenaido","xIn":1.2,"yIn":0.9,"wIn":1.6,"hIn":2.2,"rotationDeg":0}
    ]},
    {"key":"bar","label":"Home bar","elements":[
      {"kind":"text","text":"THE DEMILLO BAR","fontValue":"zen-kurenaido","xIn":0.35,"yIn":1.45,"wIn":3.3,"hIn":0.34,"rotationDeg":0},
      {"kind":"text","text":"pour something good","fontValue":"zen-kurenaido","xIn":0.7,"yIn":2.0,"wIn":2.6,"hIn":0.18,"rotationDeg":0}
    ]}
  ]')),
  updated_at = datetime('now')
WHERE id = 'prd_slate_coaster';
