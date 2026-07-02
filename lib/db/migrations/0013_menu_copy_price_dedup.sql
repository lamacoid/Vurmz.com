-- Design-critique fix (2026-07-02): on the menu layout the price sits at
-- the end of every line, so card one-liners that also state the price say
-- it twice ("From $45." next to $45). Trim the price out of the copy; the
-- long description keeps its pricing context for the product page. The
-- pen pack's "$3/pen" stays: it explains the pack price rather than
-- repeating it.

UPDATE products SET short_description = 'Rings, pendants, dog tags, bracelets: names, dates, coordinates, even handwriting.'
  WHERE id = 'prd_jewelry_marking';

UPDATE products SET short_description = 'Small-batch wood signs, cut and engraved to your words.'
  WHERE id = 'prd_wood_sign';

UPDATE products SET short_description = 'Stocked wood panels, your design. From a desk piece to wall art.'
  WHERE id = 'prd_wood_panel_art';

UPDATE products SET short_description = 'Your photo, burned into the grain. Portraits, pets, places.'
  WHERE id = 'prd_photo_on_wood';

UPDATE products SET short_description = 'One item, one spot, within a palm-sized mark. A little more for big or complicated.'
  WHERE id = 'prd_engrave_your_item';
