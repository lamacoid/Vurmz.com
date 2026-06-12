-- Catalog load — 2026-06-11 overnight session.
-- Locked decisions applied: $35 BYO floor, survival knife $45 one-off (1 published
-- + 4 drafts to flip live as each sells), pine set $36, brushed set + caddy $58,
-- pens $6 single / $45 pack-of-15, new Pens + Metal Cards categories.
-- Seed copy from tools/seed_catalog.py (the catalog reviewed in the engraving
-- session), with prices reconciled to the locked sheet.
-- Idempotent: INSERT OR IGNORE for categories, INSERT OR REPLACE for products
-- (these prd_/cat_ ids are owned by this script).

INSERT OR IGNORE INTO categories (id, slug, name, description, position, is_published, audience, created_at, updated_at) VALUES
('cat_pens', 'pens', 'Branded Pens', 'Soft-touch metal stylus pens engraved with your name or logo. Singles or packs of 15.', 80, 1, 'shop', datetime('now'), datetime('now')),
('cat_metal_cards', 'metal-cards', 'Metal Business Cards', 'Anodized aluminum and stainless steel cards engraved with your info. Packs of 10 or singles.', 90, 1, 'shop', datetime('now'), datetime('now'));

-- (id, slug, name, description, short_description, category_id, audience, price_cents,
--  pack_size, position, is_published, made_to_order, lead_time_days, weight_grams,
--  hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at)

-- ---- Coasters --------------------------------------------------------------
INSERT OR REPLACE INTO products (id, slug, name, description, short_description, category_id, audience, price_cents, pack_size, position, is_published, made_to_order, lead_time_days, weight_grams, hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at) VALUES
('prd_slate_coaster', 'engraved-slate-coaster-set', 'Slate Coasters — Set of 4',
 'Four genuine slate coasters, 4 inches across, with a raw stone edge and soft cork backing that won’t scratch a surface. We laser-etch your name, monogram, logo, or art straight into the stone — permanent, dishwasher-tough, impossible to ignore on a coffee table. Pick your text and font above; all four are cut to match.' || char(10) || char(10) || 'Keep a set on hand. Gift a set that lasts.',
 'Jet-black 4″ natural slate with cork feet. Your design etched in for good.',
 'cat_coasters', 'shop', 3400, 4, 10, 1, 1, 3, 640, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_gold_ss_coaster', 'gold-stainless-coaster-set', 'Gold Stainless Coasters — Set of 4',
 'A four-piece set of 3.5″ gold-finish stainless steel coasters with a mirror shine that makes engraving pop. Rust-proof, heat-proof, and heavy enough to feel premium in the hand. Your design comes through crisp and bright against the gold.' || char(10) || char(10) || 'The set that makes a bar cart look expensive.',
 'Mirror-gold 3.5″ stainless. Bold, modern, basically bulletproof.',
 'cat_coasters', 'shop', 4400, 4, 20, 1, 1, 3, 520, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_brushed_ss_coaster', 'brushed-stainless-coaster-set', 'Brushed Stainless Coasters — Set of 4 + Caddy',
 'Four 3.5″ brushed stainless coasters with a soft satin grain that hides smudges and reads high-end, stacked in a matching caddy that keeps the set together on the bar. The laser leaves a clean, frosted mark that contrasts beautifully with the brushed finish. Built for daily use, dressed for company.' || char(10) || char(10) || 'Quietly the nicest coasters in the room.',
 'Satin-brushed stainless with a matching caddy. Understated, premium.',
 'cat_coasters', 'shop', 5800, 4, 30, 1, 1, 3, 640, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_pine_coaster', 'pine-wood-coaster-set', 'Pine Wood Coasters — Set of 4',
 'Four solid pine coasters cut square with gently rounded edges — warm, light, ready for your mark. We finish them three ways: clean natural, rich stain, or a smoky scorched edge for that woodshop look. Tell us your finish in the order notes.' || char(10) || char(10) || 'Real wood, real character, made to order.',
 'Square pine, softened edges, ¼″ solid. Natural, stained, or scorched.',
 'cat_coasters', 'shop', 3600, 4, 40, 1, 1, 4, 300, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL);

-- ---- Knives: 5 physical units, one-off model. #1 published; flip a draft live
-- in the admin each time one sells. ------------------------------------------
INSERT OR REPLACE INTO products (id, slug, name, description, short_description, category_id, audience, price_cents, pack_size, position, is_published, made_to_order, lead_time_days, weight_grams, hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at) VALUES
('prd_survival_knife', 'survival-knife-personalized', 'Survival Knife — Personalized',
 'A rugged full-tang survival / hunting knife, deep-engraved on the blade or handle with your name, initials, coordinates, or a short message. Five are prepped and ready right now — when they’re gone, they’re gone until the next batch.' || char(10) || char(10) || 'A blade that’s actually yours. Add your text above.',
 'Full-tang survival blade, engraved with your name. Only 5 in this run.',
 'cat_knives', 'shop', 4500, 1, 10, 1, 1, 5, 380, NULL, 1, '{}', datetime('now'), datetime('now'), NULL, NULL),
('prd_survival_knife_2', 'survival-knife-personalized-2', 'Survival Knife — Personalized',
 'A rugged full-tang survival / hunting knife, deep-engraved on the blade or handle with your name, initials, coordinates, or a short message. Five are prepped and ready right now — when they’re gone, they’re gone until the next batch.' || char(10) || char(10) || 'A blade that’s actually yours. Add your text above.',
 'Full-tang survival blade, engraved with your name. Only 5 in this run.',
 'cat_knives', 'shop', 4500, 1, 11, 0, 1, 5, 380, NULL, 1, '{}', datetime('now'), datetime('now'), NULL, NULL),
('prd_survival_knife_3', 'survival-knife-personalized-3', 'Survival Knife — Personalized',
 'A rugged full-tang survival / hunting knife, deep-engraved on the blade or handle with your name, initials, coordinates, or a short message. Five are prepped and ready right now — when they’re gone, they’re gone until the next batch.' || char(10) || char(10) || 'A blade that’s actually yours. Add your text above.',
 'Full-tang survival blade, engraved with your name. Only 5 in this run.',
 'cat_knives', 'shop', 4500, 1, 12, 0, 1, 5, 380, NULL, 1, '{}', datetime('now'), datetime('now'), NULL, NULL),
('prd_survival_knife_4', 'survival-knife-personalized-4', 'Survival Knife — Personalized',
 'A rugged full-tang survival / hunting knife, deep-engraved on the blade or handle with your name, initials, coordinates, or a short message. Five are prepped and ready right now — when they’re gone, they’re gone until the next batch.' || char(10) || char(10) || 'A blade that’s actually yours. Add your text above.',
 'Full-tang survival blade, engraved with your name. Only 5 in this run.',
 'cat_knives', 'shop', 4500, 1, 13, 0, 1, 5, 380, NULL, 1, '{}', datetime('now'), datetime('now'), NULL, NULL),
('prd_survival_knife_5', 'survival-knife-personalized-5', 'Survival Knife — Personalized',
 'A rugged full-tang survival / hunting knife, deep-engraved on the blade or handle with your name, initials, coordinates, or a short message. Five are prepped and ready right now — when they’re gone, they’re gone until the next batch.' || char(10) || char(10) || 'A blade that’s actually yours. Add your text above.',
 'Full-tang survival blade, engraved with your name. Only 5 in this run.',
 'cat_knives', 'shop', 4500, 1, 14, 0, 1, 5, 380, NULL, 1, '{}', datetime('now'), datetime('now'), NULL, NULL);

-- ---- Gifts ($35 BYO floor applied) ------------------------------------------
INSERT OR REPLACE INTO products (id, slug, name, description, short_description, category_id, audience, price_cents, pack_size, position, is_published, made_to_order, lead_time_days, weight_grams, hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at) VALUES
('prd_mini_mailbox', 'personalized-mini-mailbox', 'Personalized Mini Mailbox',
 'A charming white mini mailbox that doubles as a card box, gift box, or just-because keepsake. We can engrave a 4×3 panel on the side, or a tidy 2×2 on the front or back — names, a date, a little message. Tell us where you want it in the notes.' || char(10) || char(10) || 'Weddings, anniversaries, new homes — this one lands.',
 'A keepsake mini mailbox — engraved for the gift that gets the “awww.”',
 'cat_gifts', 'shop', 3800, 1, 10, 1, 1, 4, 350, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_byo_engraving', 'bring-your-own-item-engraving', 'Bring Your Own Item — Engraving',
 'Bring your own item and we’ll engrave it: tumblers, flasks, knives, tools, lighters, watches, pet tags, instruments, that thing your grandfather left you. Metal, wood, glass, leather, acrylic, slate — if it’s solid, we can mark it. Drop it off in the South Denver metro or ship it in.' || char(10) || char(10) || 'Add your text and font above to get started; final pricing depends on size and material. When in doubt, just ask — the $35 is a starting point.',
 'Tumbler, flask, knife, heirloom? Bring it — we’ll laser it clean. From $35.',
 'cat_gifts', 'shop', 3500, 1, 20, 1, 1, 3, 200, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_jewelry_marking', 'custom-jewelry-marking', 'Custom Jewelry Marking',
 'Fine-detail laser marking for jewelry and small metal keepsakes — rings (inside or out), pendants, lockets, bar necklaces, ID and pet tags, cuffs and bracelets. Names, dates, coordinates, a short quote, or your own handwriting and a fingerprint turned into metal. Bring your own piece or ask and I’ll source a blank.' || char(10) || char(10) || 'The detail that turns metal into a memory. Add your text above; final price depends on the piece — from $35.',
 'Rings, pendants, dog tags, bracelets — names, dates, coordinates, even handwriting. From $35.',
 'cat_gifts', 'shop', 3500, 1, 30, 1, 1, 4, 30, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL);

-- ---- Pens (new category): $6 single / $45 pack of 15 -------------------------
INSERT OR REPLACE INTO products (id, slug, name, description, short_description, category_id, audience, price_cents, pack_size, position, is_published, made_to_order, lead_time_days, weight_grams, hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at) VALUES
('prd_softtouch_pen', 'soft-touch-stylus-pen', 'Soft-Touch Stylus Pen',
 'A weighted metal pen with a grippy soft-touch coating that feels like suede, tipped with a capacitive stylus for phones and tablets. We laser your name or logo into the barrel — crisp, permanent, professional. Stocked in a range of colors; name your pick in the notes.' || char(10) || char(10) || 'The giveaway people actually keep. Ask about bulk.',
 'Velvet soft-touch metal pen + touchscreen stylus. Your name, etched clean.',
 'cat_pens', 'shop', 600, 1, 10, 1, 1, 2, 30, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_pen_pack15', 'soft-touch-stylus-pens-pack-15', 'Soft-Touch Stylus Pens — Pack of 15',
 'The bulk version of the soft-touch stylus pen: fifteen weighted metal pens with the suede-feel coating and capacitive stylus tip, each engraved with the same name, logo, or line of text. The price that makes them a giveaway — $3 a pen.' || char(10) || char(10) || 'Mix of colors available; name your preference in the order notes. Need a logo or both sides marked? Text me and I’ll quote the add-ons.',
 'Fifteen soft-touch stylus pens, engraved to match. $3/pen.',
 'cat_pens', 'shop', 4500, 15, 20, 1, 1, 3, 450, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL);

-- ---- Metal Cards (new category) ----------------------------------------------
INSERT OR REPLACE INTO products (id, slug, name, description, short_description, category_id, audience, price_cents, pack_size, position, is_published, made_to_order, lead_time_days, weight_grams, hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at) VALUES
('prd_anodized_card', 'anodized-aluminum-wallet-card', 'Anodized Aluminum Wallet Card',
 'A slim, indestructible wallet card in anodized aluminum, the same size as a credit card. The laser strips the color anodize to a bright silver mark, so your text, art, or QR code reads sharp and stays forever. Huge range of colors in stock.' || char(10) || char(10) || 'EDC keepsakes, business cards that don’t bend, message cards that outlive the moment.',
 'Credit-card-sized anodized aluminum. Laser pops bright on color — wallet-ready.',
 'cat_metal_cards', 'shop', 1800, 1, 10, 1, 1, 2, 15, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL);

-- ---- Keychains / tags ---------------------------------------------------------
INSERT OR REPLACE INTO products (id, slug, name, description, short_description, category_id, audience, price_cents, pack_size, position, is_published, made_to_order, lead_time_days, weight_grams, hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at) VALUES
('prd_airtag_tag', 'engraved-airtag-tag', 'Engraved AirTag Tag',
 'A laser-engraved tag built to carry an Apple AirTag — your name, number, or a short message marked permanently so the tracker and the label work together. Clip it to keys, a backpack, luggage, or a pet collar. AirTag not included.' || char(10) || char(10) || 'Add your text above and I’ll engrave it to match.',
 'Holds an AirTag, carries your name. Keys, bags, pet collars.',
 'cat_keychains', 'shop', 1500, 1, 10, 1, 1, 2, 20, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL);

-- ---- Art & Home Decor ----------------------------------------------------------
INSERT OR REPLACE INTO products (id, slug, name, description, short_description, category_id, audience, price_cents, pack_size, position, is_published, made_to_order, lead_time_days, weight_grams, hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at) VALUES
('prd_wood_sign', 'custom-wood-sign', 'Custom Wood Sign',
 'Custom signage and decor cut from quality plywood and solid wood stock we keep on hand. Names, addresses, bar signs, nursery decor, shop signs — you bring the words and the vibe, we design and engrave. Sizes and shapes to fit your space.' || char(10) || char(10) || 'Made to order, built to hang for years. Tell us what you’re picturing in the notes.',
 'Small-batch wood signs, cut and engraved to your words. From $32.',
 'cat_decor', 'shop', 3200, 1, 10, 1, 1, 5, 250, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_vinyl_decal', 'custom-vinyl-decal', 'Custom Vinyl Decal',
 'Precision-cut vinyl decals for cars, laptops, windows, walls, tumblers, and gear — up to 12×12″. We stock a deep range of colors and finishes (matte, gloss, metallic) and can source any specific color or pattern you need. Send your art or describe it in the notes and we’ll handle the rest.' || char(10) || char(10) || 'Weatherproof, clean-lined, and stuck on right.',
 'Any design, up to 12×12″. Colors stocked — or we source your exact shade.',
 'cat_decor', 'shop', 1200, 1, 20, 1, 1, 3, 30, NULL, 0, '{"engravable": false}', datetime('now'), datetime('now'), NULL, NULL),

('prd_iron_on', 'custom-iron-on-transfer', 'Custom Iron-On Transfer',
 'Heat-press iron-on transfers for apparel and fabric — shirts, hoodies, totes, hats, team merch. Single pieces or small runs, in the colors you want. Send your design in the notes and we’ll cut and weed it ready to press (or press it for you).' || char(10) || char(10) || 'Turn a blank tee into your thing.',
 'Press-ready iron-ons for tees, totes, and merch. Your art, your colors.',
 'cat_decor', 'shop', 1000, 1, 30, 1, 1, 3, 20, NULL, 0, '{"engravable": false}', datetime('now'), datetime('now'), NULL, NULL),

('prd_wood_plant_marker', 'wood-plant-markers', 'Wood Plant Markers — Set of 6',
 'A set of six solid wood plant markers, laser-engraved with whatever you’re growing — herbs, veggies, flowers, seed starts. Clean and rustic, and a serious upgrade from a faded marker on a popsicle stick. List your plant names in the engraving box (comma-separated) or the order notes and I’ll cut one per marker.' || char(10) || char(10) || 'Made for raised beds, gifts for the gardener, and seed-starting season.',
 'Six wood garden stakes, engraved with your herbs and veggies. Tidy beds, happy gardener.',
 'cat_decor', 'shop', 2200, 6, 40, 1, 1, 4, 120, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_alu_plant_marker', 'aluminum-plant-markers', 'Aluminum Plant Markers — Set of 6',
 'Six anodized aluminum plant markers built to live outside for years: rustproof, UV-proof, and engraved deep so the labels never wash out or fade. The modern, permanent answer to plant tags. List one plant name per marker in the engraving box or the order notes.' || char(10) || char(10) || 'For the gardener who’s done re-labeling every spring.',
 'Six weatherproof aluminum garden stakes. Engraved deep — won’t fade in sun or rain.',
 'cat_decor', 'shop', 3000, 6, 50, 1, 1, 4, 150, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL),

('prd_wood_diffuser', 'scent-infused-wood-diffuser', 'Scent-Infused Wood Diffuser — Coming Soon',
 'A clean take on the reed diffuser: scent infused into natural wood — no oily mess, no spills, just a slow, even release. In development now.' || char(10) || char(10) || 'Want first dibs? Text me and I’ll put you on the list.',
 'Non-oily, slow-release scented wood. Launching soon.',
 'cat_decor', 'shop', 2400, 1, 60, 0, 1, 0, 150, NULL, 0, '{}', datetime('now'), datetime('now'), NULL, NULL);
