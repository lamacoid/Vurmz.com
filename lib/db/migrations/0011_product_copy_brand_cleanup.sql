-- Product copy brand-rule cleanup, found while verifying the pricing
-- rebuild (2026-07-02). The earlier em-dash sweep this session covered
-- source code and page copy, but never checked D1 product data, so these
-- em-dashes (and two banned hype words, "premium" and "bulletproof") sat
-- live in the catalog. Text-only fixes: no prices, slugs, or logic change.

UPDATE products SET
  name = 'Survival Knife (Personalized)',
  description = 'A rugged full-tang survival / hunting knife, deep-engraved on the blade or handle with your name, initials, coordinates, or a short message. Five are prepped and ready right now. When they’re gone, they’re gone until the next batch.' || char(10) || char(10) || 'A blade that’s actually yours. Add your text above.'
  WHERE id IN ('prd_survival_knife', 'prd_survival_knife_2', 'prd_survival_knife_3', 'prd_survival_knife_4', 'prd_survival_knife_5');

UPDATE products SET
  description = 'A charming white mini mailbox that doubles as a card box, gift box, or just-because keepsake. We can engrave a 4×3 panel on the side, or a tidy 2×2 on the front or back: names, a date, a little message. Tell us where you want it in the notes.' || char(10) || char(10) || 'Weddings, anniversaries, new homes: this one lands.',
  short_description = 'A keepsake mini mailbox, engraved for the gift that gets the “awww.”'
  WHERE id = 'prd_mini_mailbox';

UPDATE products SET
  name = 'Bring Your Own Item Engraving',
  description = 'Bring your own item and we’ll engrave it: tumblers, flasks, knives, tools, lighters, watches, pet tags, instruments, that thing your grandfather left you. Metal, wood, glass, leather, acrylic, slate. If it’s solid, we can mark it. Drop it off in the South Denver metro or ship it in.' || char(10) || char(10) || 'Add your text and font above to get started; final pricing depends on size and material. When in doubt, just ask. The $35 is a starting point.',
  short_description = 'Tumbler, flask, knife, heirloom? Bring it, we’ll laser it clean. From $35.'
  WHERE id = 'prd_byo_engraving';

UPDATE products SET
  description = 'Fine-detail laser marking for jewelry and small metal keepsakes: rings (inside or out), pendants, lockets, bar necklaces, ID and pet tags, cuffs and bracelets. Names, dates, coordinates, a short quote, or your own handwriting and a fingerprint turned into metal. Bring your own piece or ask and I’ll source a blank.' || char(10) || char(10) || 'The detail that turns metal into a memory. Add your text above; final price depends on the piece, from $35.',
  short_description = 'Rings, pendants, dog tags, bracelets: names, dates, coordinates, even handwriting. From $35.'
  WHERE id = 'prd_jewelry_marking';

UPDATE products SET
  description = 'A weighted metal pen with a grippy soft-touch coating that feels like suede, tipped with a capacitive stylus for phones and tablets. We laser your name or logo into the barrel: crisp, permanent, professional. Stocked in a range of colors; name your pick in the notes.' || char(10) || char(10) || 'The giveaway people actually keep. Ask about bulk.'
  WHERE id = 'prd_softtouch_pen';

UPDATE products SET
  name = 'Soft-Touch Stylus Pens (Pack of 15)',
  description = 'The bulk version of the soft-touch stylus pen: fifteen weighted metal pens with the suede-feel coating and capacitive stylus tip, each engraved with the same name, logo, or line of text. The price that makes them a giveaway: $3 a pen.' || char(10) || char(10) || 'Mix of colors available; name your preference in the order notes. Need a logo or both sides marked? Text me and I’ll quote the add-ons.'
  WHERE id = 'prd_pen_pack15';

UPDATE products SET
  description = 'A laser-engraved tag built to carry an Apple AirTag: your name, number, or a short message marked permanently so the tracker and the label work together. Clip it to keys, a backpack, luggage, or a pet collar. AirTag not included.' || char(10) || char(10) || 'Add your text above and I’ll engrave it to match.'
  WHERE id = 'prd_airtag_tag';

UPDATE products SET
  description = 'Custom signage and decor cut from quality plywood and solid wood stock we keep on hand. Names, addresses, bar signs, nursery decor, shop signs: you bring the words and the vibe, we design and engrave. Sizes and shapes to fit your space.' || char(10) || char(10) || 'Made to order, built to hang for years. Tell us what you’re picturing in the notes.'
  WHERE id = 'prd_wood_sign';

UPDATE products SET
  description = 'Precision-cut vinyl decals for cars, laptops, windows, walls, tumblers, and gear, up to 12×12″. We stock a deep range of colors and finishes (matte, gloss, metallic) and can source any specific color or pattern you need. Send your art or describe it in the notes and we’ll handle the rest.' || char(10) || char(10) || 'Weatherproof, clean-lined, and stuck on right.',
  short_description = 'Any design, up to 12×12″. Colors stocked, or we source your exact shade.'
  WHERE id = 'prd_vinyl_decal';

UPDATE products SET
  description = 'Heat-press iron-on transfers for apparel and fabric: shirts, hoodies, totes, hats, team merch. Single pieces or small runs, in the colors you want. Send your design in the notes and we’ll cut and weed it ready to press (or press it for you).' || char(10) || char(10) || 'Turn a blank tee into your thing.'
  WHERE id = 'prd_iron_on';

UPDATE products SET
  description = 'A set of six solid wood plant markers, laser-engraved with whatever you’re growing: herbs, veggies, flowers, seed starts. Clean and rustic, and a serious upgrade from a faded marker on a popsicle stick. List your plant names in the engraving box (comma-separated) or the order notes and I’ll cut one per marker.' || char(10) || char(10) || 'Made for raised beds, gifts for the gardener, and seed-starting season.'
  WHERE id = 'prd_wood_plant_marker';

UPDATE products SET
  name = 'Aluminum Plant Markers (Set of 6)',
  short_description = 'Six weatherproof aluminum garden stakes. Engraved deep, won’t fade in sun or rain.'
  WHERE id = 'prd_alu_plant_marker';

UPDATE products SET
  name = 'Scent-Infused Wood Diffuser (Coming Soon)',
  description = 'A clean take on the reed diffuser: scent infused into natural wood, no oily mess, no spills, just a slow, even release. In development now.' || char(10) || char(10) || 'Want first dibs? Text me and I’ll put you on the list.'
  WHERE id = 'prd_wood_diffuser';

UPDATE products SET
  name = 'Wood Panel Art: Your Design',
  description = 'I keep wood panels in a variety of sizes on hand, ready to become whatever you need. Pick any design from the library above, send me your own art, or just describe the idea, I''ll put it on wood. Tell me the size you''re picturing in the instructions (small desk piece to statement wall art) and I''ll confirm the panel and the final price on your proof. Nothing engraves until you approve it.' || char(10) || char(10) || 'From $45. Final price depends on panel size and detail. The proof comes first either way.'
  WHERE id = 'prd_wood_panel_art';

UPDATE products SET
  description = 'A photograph, laser-engraved into a wood panel: portraits, pets, weddings, the house you grew up in. I process the photo for contrast, then burn it into the grain one fine line at a time. Photo work is the slowest thing I do: a detailed image is hours on the machine, not minutes, so it''s priced accordingly.' || char(10) || char(10) || 'From $75, and the final number tracks panel size and detail: a small portrait runs near the floor, a large high-detail piece runs more. High-contrast photos with good lighting translate best; attach yours at checkout and I''ll tell you straight if it''ll work and what it''ll cost before anything runs. You approve the proof first, always.',
  short_description = 'Your photo, burned into the grain. Portraits, pets, places. From $75.'
  WHERE id = 'prd_photo_on_wood';

UPDATE products SET
  name = 'Engrave Your Item ($35)',
  description = 'Bring me your thing and I''ll mark it for good. A knife, a laptop or tablet, a tumbler or flask, a tool, a lighter, a watch, the heirloom your grandfather left you. Metal, wood, glass, leather, acrylic, slate, plastic. If it''s solid and fits the bed, it marks.' || char(10) || char(10) || 'The $35 covers one item, one spot, your text or one design from the library, within a palm-sized mark, that''s most jobs. Add your text or pick a design above, pay the $35 to lock it in, and tell me what you''re bringing in the instructions. Bigger marks, both sides, deep marking, full wraps, or a logo I have to rebuild add a little. I confirm any extra on the proof photo before anything runs. Drop off in the South Denver metro or ship it in.',
  short_description = 'Your thing, engraved. $35 flat within size, a little more for big or complicated.'
  WHERE id = 'prd_engrave_your_item';

-- Two banned-brand-word fixes (no hype words per CLAUDE.md), same pass:
UPDATE products SET
  description = 'A four-piece set of 3.5″ gold-finish stainless steel coasters with a mirror shine that makes engraving pop. Rust-proof, heat-proof, and heavy enough to feel substantial in the hand. Your design comes through crisp and bright against the gold.' || char(10) || char(10) || 'The set that makes a bar cart look expensive.',
  short_description = 'Mirror-gold 3.5″ stainless. Bold, modern, built to last.'
  WHERE id = 'prd_gold_ss_coaster';
