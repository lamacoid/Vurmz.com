-- Two records missed in 0011: prd_wood_plant_marker's name still had an
-- em-dash (only its description was fixed), and prd_brushed_ss_coaster's
-- short_description used the banned word "premium" (CLAUDE.md).

UPDATE products SET name = 'Wood Plant Markers (Set of 6)'
  WHERE id = 'prd_wood_plant_marker';

UPDATE products SET short_description = 'Satin-brushed stainless with a matching caddy. Understated and built to last.'
  WHERE id = 'prd_brushed_ss_coaster';
