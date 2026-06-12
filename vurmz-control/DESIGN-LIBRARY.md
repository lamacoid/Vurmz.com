# Design-element library — how it works, licensing, scaling

Built 2026-06-12. The builder now has a curated design library (213 elements,
8 categories) customers can add to an engraving — the premium "icon library"
pattern (Benchmade, YETI galleries). Sourced from your purchased Etsy library
via the file organizer.

## The licensing posture (read this)
These are purchased Etsy SVGs. Typical craft/commercial licenses **allow** using
the art to make physical products you sell, and **forbid** redistributing the
digital file. The build is designed to stay on the allowed side:

- **Only raster PNG previews are ever served** (from R2, like a product photo).
  The customer picks a thumbnail; they never receive the vector.
- **The source vectors never touch the web.** They live on your Mac; the
  `id → source path` map is `vurmz-control/design-sources.json`, which is
  **gitignored** (not in the public GitHub repo).
- **The customer receives an engraved product**, which is the licensed use.

What you still owe: **spot-check the licenses on your biggest bundles.** A few
Etsy shops restrict use in "customizable templating tools." If any of your
sets say that, pull them (tell me which category/files and I'll remove them).
I curated from generic craft categories (animals, florals, borders, emblems)
to minimize this risk, but I can't read 31k individual licenses.

## Fulfilling an order with a design
The admin order page shows: the thumbnail, the label ("Animal 1"), and the id
(`de_…`). To get the real cut file:
```
node scripts/find-design.mjs de_42946ff39b341d0b
# → /Users/.../Design Library/01-Animals-Wildlife/Animal-Skeletons/...-17.svg
```
Open that SVG in LightBurn and engrave. (You can also recognize most designs by
the thumbnail and find them in the organizer app.)

## Trademark/quality screen (2026-06-12)
Per Zach: generic design elements only, no characters/branded art. Two passes:
1. **Filename + organizer-tag scan** of all selected files against ~90
   trademark terms (Disney/Marvel/Nintendo/sports/brand names): 2 hits, both
   false positives (a Halloween "spider", a "frozen"-food file).
2. **Visual review** of every thumbnail via contact sheets: pulled 13 items —
   one cartoon duck face (Daffy/Donald territory, hiding in a generically-named
   "Tattoo-Style" bundle), two sneaker silhouettes (logo-adjacent), and ten
   off-category/UI-icon junk pieces (gift-with-checkmark icons, hourglass,
   balloon dog, etc.).
Catalog is now **200 elements**. Lesson recorded: any future additions need the
visual pass, not just the name scan — characters hide in generically-named
bundles. Removed ids are listed in the git history of this commit.

## What's in the library now
503 elements: Florals & Botanical 93, Patterns & Shapes 77, Symbols & Clipart 55, Gothic 53, Mountains & Outdoors 45, Bones & Anatomy 29, Home & Decor 28, Animals 27, Emblems & Crests 26, Holiday & Seasonal 24, Food & Drink 23, Frames & Borders 23. Labels are
`<Category> N` — in a visual picker the thumbnail is the real selector.
Three screening rounds done (17 trademark/quality pulls + 23 generic-round
pulls, all baked into the pipeline DENYLIST). Dog-breed art is parked for a
future Pets category.


## Scaling it (when you want more)
Everything is one script. To add more per category, or new categories:
1. Edit the `CATEGORIES` / `PER_CAT` list in
   `scripts/build-design-catalog.mjs` (it pulls from your organizer's
   `library.json`, SVG only, skips the unsorted "Downloads-To-Sort" bucket).
2. `node scripts/build-design-catalog.mjs <perCategory>` — renders thumbnails to
   `/tmp/vurmz-design-thumbs/`, rewrites `lib/design/catalog.json` and the
   gitignored source map.
3. Upload the new thumbs to R2 (the script prints the manifest; the upload loop
   is `wrangler r2 object put vurmz-media/<key> --file=<png> --remote`).
4. Commit `lib/design/catalog.json`, deploy.

Caveats before you 10× it: (a) more than ~400 elements wants pagination/lazy
categories in the picker — say the word and I'll add it; (b) the "Downloads-To-
Sort" 17.5k bucket needs sorting in the organizer first or the quality drops;
(c) keep an eye on the licensing note above as you pull from more bundles.

## My recommendation
213 is a strong launch. Don't rush to thousands — curated reads more premium
(the research backs this: Mark & Graham ships ~50 monograms, Knife Depot 10
fonts). Watch which designs actually get picked on real orders, then expand the
categories customers use. Quality of the thumbnail set matters more than count.
