# VURMZ Master Plan, July 2026

Written 2026-07-03. The operating standard for every section: hold VURMZ
against the enterprise version of the same thing, list what the enterprise
version REQUIRES, mark what exists, build the gap. Nothing here is
aspirational filler; every item names files and has a definition of done.

The one-line strategy: VURMZ wins on structure, not spend. No rent
premium, no employees, no shipping, no setup fees, near-zero marginal
cost per engraved piece. Every workstream below converts one of those
structural advantages into something a customer can see.

---

## A. The Builder (customer design and preview tool) — task #42

**Enterprise reference:** Zakeke, Customily, Nike By You, Vistaprint's
studio. What they all share, which is the required-aspects list:

| Required aspect | Enterprise standard | VURMZ today | Plan |
|---|---|---|---|
| Interactive canvas | drag, resize, rotate, snap | free-text "placement" field | Konva.js (MIT) canvas |
| Product-true preview | photo or 3D with correct proportions | static "YOUR TEXT HERE" box | photo-mapped 2.5D per product |
| Real dimensions | text sized in real units on the product | none | dimensions in product metadata |
| Engraving zone | design constrained to the engravable area | none | per-product zone polygon |
| Text + font | live font rendering | exists (Kerf + catalog fonts) | reuse lib/fonts |
| Art library | clipart/upload | exists (503-design library) | reuse DesignElementPicker |
| Mobile touch | pinch/drag on phones | n/a | Konva supports; test hard |
| Output to production | print-ready file | engraving text in order metadata | zone+position coords in metadata, admin renders placement diagram |
| Admin zone editor | vendor tool to define zones | none | draw-the-zone tool in ProductForm (phase 2) |

**Decisions already made:** rip the MIT engines (Konva for 2D, three.js
decals later for tumblers/curved goods), build only the VURMZ layer.
2.5D photo-overlay first; the studio photos are straight-on, which is
exactly the geometry photo-mapping needs.

**The data contract (shared with section B):** product.metadata gains
`builder: { widthIn, heightIn, zone: {x,y,w,h} in photo pixel coords,
photoMediaId }`. The Builder reads it; the spec table displays widthIn/
heightIn; the admin form edits it. One schema, three consumers.

**Phases:**
1. **B1 (build now):** BuilderCanvas client component on /shop/p/[slug]
   replacing the static preview WHEN the product has builder metadata.
   Konva stage over the product photo; text element draggable/scalable
   inside the zone; font picker reuse; design-element drag-in; live
   real-unit readout ("engraving is 2.1in wide"). Cart metadata gains
   `engraving.position: {xIn, yIn, wIn, rotationDeg}`. Fallback for
   products without metadata: current EngravingPicker unchanged.
2. **B2:** admin zone editor (drag a rectangle on the product photo in
   ProductForm, type real dimensions once). Roll out to "most stocked
   products" (Zach's directive) as metadata entry, no code per product.
3. **B3 (only where earned):** three.js decal preview for curved goods.
   Needs a glTF model per product class (cylinder for tumblers is
   parametric, no modeling needed).
4. **Admin output:** order detail "What to make" card renders the
   placement diagram (photo + zone + positioned text) so production
   matches the customer's preview. This closes the loop; without it the
   Builder is decoration.

**Definition of done (B1):** a customer on the labels page drags their
company name across the label photo, sees "1.8in wide, centered", adds to
cart; the order email and admin order page show the same placement.

---

## B. Commercial-grade listings (PIM) — task #43, finish it

**Enterprise reference:** the anatomy of a Shopify/Target/Amazon PDP.

| Required aspect | Enterprise | VURMZ today | Plan |
|---|---|---|---|
| Photo gallery | 5-8 images, zoom | SHIPPED (12 slots, thumbnails) | done |
| Variants | size/color matrix | SHIPPED (pack sizes) | done |
| Price clarity | unit pricing, from-pricing | SHIPPED (form auto-calc, "from $X") | menu needs from-pricing |
| Spec table | dimensions, material, weight | none visible | REQUIRED, feeds Builder |
| Highlights | 3-5 scannable bullets | prose only | add highlights[] to metadata |
| Inventory | stock counts, low-stock | none (made-to-order model) | skip; made-to-order IS the model, say it honestly |
| Reviews | stars, count | testimonials EMPTY (Zach-blocked) | collect 3 real quotes, render on PDP |
| Q&A | buyer questions | contact links | good enough for a solo shop |
| SEO | structured data per product | page metadata only | add Product JSON-LD (price, availability, image) |
| Related items | cross-sell row | none | "goes well with" row from same category, cheap win |

**Build list (in order):**
1. Spec table: `metadata.specs: {material, widthIn, heightIn, thicknessIn,
   weight}` rendered as a quiet menu-styled table under The Details;
   admin form fields in More details. Shares dimensions with the Builder.
2. Product JSON-LD on /shop/p/[slug] (Google shows price + photo in
   results; free traffic, zero risk).
3. Highlights bullets (3-5, menu-case) between subtext and rule.
4. MenuShop "from $X" when variants exist (one grouped variants query).
5. Related-products row on PDP (same category, exclude self, max 3,
   menu-row style).
6. Category pages decision: /shop/[category] still uses the old photo
   grid. Either restyle to menu language or 301 them to /shop#menu-anchor.
   Recommend restyle AFTER photos land (they become the photo-forward
   view the menu deliberately isn't).

**Definition of done:** the labels PDP shows gallery, size options, spec
table, highlights, JSON-LD validates in Google's rich results test, and a
related row. That page becomes the template every listing inherits.

---

## C. Pricing: "almost silly to compete with"

**Enterprise reference (what we are pricing AGAINST):** the promo-products
industry (4imprint, local trophy shops) whose model is setup fees ($40-60
per design), minimums (50-100 units), 2-3 week turnaround, shipping on
top; Etsy sellers whose real price hides in $8-12 shipping and 1-2 week
delivery; mall kiosks charging $15-30 per engraving on YOUR item.

**The structural math that makes "silly" safe:** marginal cost per piece
is blank + minutes (pen ~$1.50, tag ~$0.50, coaster ~$2, card ~$0.75).
At any price above ~3x blank cost the margin is real because there is no
rent premium, no labor bill, no shipping, no setup amortization.

**The doctrine (pending final numbers from the market analysis in
flight):**
1. **Fight on structure, not sticker.** The headline is "no setup fee, no
   minimum, no shipping, proof before it runs, delivered in days" said on
   every services page. That combination is the thing competitors
   literally cannot copy without changing their business.
2. **Silly is surgical.** Aggression goes where it compounds: per-unit
   at volume (tags/labels/pens driving recurring B2B), the $35 BYO
   flat (the door), free sample economics (a $3 sample closes a $500/yr
   account). Retail gift prices (coaster sets, boards) stay at market;
   cutting those burns margin with no strategic gain and fights the
   lux-approachable brand.
3. **Psych points:** whole dollars everywhere (menu already does this),
   per-unit lines shown at volume ("$1.60 a tag at 150"), one flat
   number for the door ($35), NEVER "cheap" language; the price does the
   talking, the copy stays quiet.
4. **Floors:** nothing below 3x blank cost; one-off/BYO never below $25
   (protects the calendar from $10 jobs); volume tiers deepen instead of
   base prices dropping (15% at 150 can become 20-25% at 500 for standing
   accounts, which is "frustrating" to promo companies at exactly the
   order sizes they care about).
5. Every price change: update lib/pricing.ts + D1 + PRICING.md + services
   pages in ONE change (the 0010-0013 sweep pattern), with before/after
   table for Zach's sign-off first. Prices are Zach's final call.

**Definition of done:** a signed-off price sheet where, for each item, we
can name the competitor experience it embarrasses; deployed in one sweep.

---

## D. Product photos: the pipeline, not just the batch

**Enterprise reference:** retail photo ops. Their requirements: identical
framing and scale across the catalog, consistent grounds, 2000px+, subject
fills 65-75%, deskewed and leveled, color-managed, alt text everywhere,
and a REPEATABLE pipeline because catalogs never stop growing.

**The look (palette board on the Desktop, awaiting Zach's eye):** one warm
family, five grounds, assigned by contrast: cream #F0EAE0 (dark products),
oat #E2D7C3 (mid metals, anodized colors), peach #EAD3C0 (gift-coded
accent, sparingly), taupe #C7B6A1 (brass/golds), coffee #6E5A46 (pale
wood, hero shots). Solid grounds, soft contact shadow scaled to ground
lightness, auto-leveled rectangles, uniform 72% scale.

**The pipeline (this is the real deliverable):** a `photos` skill/script:
1. Pull new shots from Photos.app by date (the AppleScript export from
   the 2026-07-02 session, scripted).
2. Vision-mask (the maskgen Swift tool, built), with the pre-crop and
   fallback tricks from this session encoded, not rediscovered.
3. Auto-level (rotate to minimize bbox), grade, plate on the assigned
   ground, contact shadow, 2000px q90.
4. Contact sheet for a 30-second human review.
5. Upload to R2 (content-addressed keys, the 0014 lesson), insert media
   rows, ready to attach in the admin form.
Tomorrow's shoot should go from camera roll to attachable listing photos
in one command plus one review pass.

**Definition of done:** all current keepers re-plated on the approved
palette AND the next shoot processed end-to-end by the pipeline without
hand-editing masks.

---

## E. File organizer + design-asset re-catalog — task #40

**Enterprise reference:** a DAM (Eagle, Adobe Bridge, Brandfolder).
Requirements: instant search, visual previews, tags, dedupe, watch
folders for ingest, and an index that never goes stale.

**Current state (surveyed):** VURMZ Library.app (SwiftUI, Vision-tagging,
19MB JSON index) works but its SOURCE IS LOST (binary only). The library
is 120k files/60GB with a 35,807-file backlog; 23,730 duplicate basenames;
198 unextracted zips; the index is 4 months stale.

**Plan, in strict order:**
1. **Re-catalog the backlog** (no app changes yet): the `_Organized`
   subtree first (21,653 files, its secondary taxonomy maps ~1:1 onto the
   main 01-13 categories; script the mapping, spot-check via contact
   sheets), then contact-sheet visual triage for DESIGN ASSETS (11k) and
   99-NeedsManualReview (1,466). Every batch: undo manifest JSON before
   any move, no deletions ever, duplicates logged to a report.
2. **Rebuild the index** (build-index.py exists) and verify the existing
   app still works against it. Zach keeps his daily tool throughout.
3. **Rebuild the app WITH source this time.** Decision for Zach: SwiftUI
   rebuild (feels native, source in git) vs local web app (I can iterate
   it far faster, works on any machine). Either way the required aspects:
   search-as-you-type on the index, thumbnail grid, category+tag filters,
   favorites, open-in-LightBurn, a watch folder that ingests new
   downloads through the Vision tagger automatically (kills the backlog
   problem forever), and dedupe view driven by content hashes.
4. Zips: extract the 198 archives into a staging dir through the same
   ingest path (15GB; disk check first).

**Definition of done:** backlog under 1,000 files, index fresh, app
source in git, and a new Etsy download lands categorized without Zach
touching a folder.

---

## F. Marketing and revenue ops

**Enterprise reference:** a sales team's cadence tooling and a brand's
asset discipline. VURMZ's version already exists in pieces; the plan is
completion and rhythm.

1. **Send the batch:** 19 drafts staged for the week of July 6 (Zach
   sends, 5/day, CSV tracked). The follow-up pass July 13.
2. **Testimonials (Zach-blocked, again):** 3 one-line quotes from past
   customers. lib/testimonials.ts is EMPTY and it is the single highest
   ROI content gap on the site (renders on shop + PDPs the moment it has
   content).
3. **Sourcing for the Silver Stem pitch:** anodized grinder + metal tray
   blanks (fiber-markable) priced before the walk-in.
4. **GBP posts + photo refresh** once the restyled photos exist (same
   assets, second channel).
5. **The metal-labels wedge:** every trades reply gets the live product
   page link; it is the proof the whole B2B lane works self-serve.

---

## G. Platform hardening (the unglamorous enterprise-required list)

| Enterprise requirement | VURMZ state | Action |
|---|---|---|
| Sales tax | DEFERRED, no placeholder | THE blocker to scale. Colorado destination sourcing + Centennial home-rule is genuinely accountant territory: Zach books the accountant; meanwhile I wire the plumbing (tax_cents on shop orders, rate table by jurisdiction) so flipping it on is config, not a build |
| Backups | manual db:backup before writes | nightly automated D1 export (cron + R2 upload), 30-day retention |
| Monitoring | Sentry wired | add uptime check on / and /api/health (free tier), alert to email |
| Order lifecycle emails | confirm exists | add "proof ready" and "out for delivery" emails (proof workflow already in orders.metadata) |
| Analytics | basic | wire conversion events (add-to-cart, checkout start, purchase) so pricing/photo changes are MEASURABLE; without this the pricing experiment is blind |
| Rate limiting | login only | add to quote/order APIs (cheap, prevents abuse) |
| Legal | privacy/terms exist | review after tax lands |

---

## Sequencing (dependencies drawn, then the order)

Dependencies: photos → listings polish → Builder (photos are the Builder's
canvas); pricing analysis → price sweep (awaiting numbers); palette
sign-off → photo run (awaiting Zach); re-catalog is independent (fills
any idle capacity); analytics before pricing sweep (measure the change).

**Week of July 3-5 (now):**
1. Palette sign-off → full photo re-run + pipeline script (D)
2. Pricing numbers land → proposal table → Zach signs → one-sweep deploy (C)
3. Spec table + JSON-LD + highlights (B1-B3 of listings) — small, ships today-tomorrow
4. Analytics events (G) — before the price change goes live
5. Re-catalog `_Organized` batch 1 with undo manifest (E) — background grind

**Week of July 6-12:**
6. Outreach sends (F, Zach) while I build Builder B1 on the labels page
7. Builder B1 live on 2-3 products → Zach reaction → B2 zone editor
8. Menu from-pricing + related products + category-page decision (B4-B6)
9. Nightly backups + uptime monitor (G)

**Week of July 13+:**
10. Builder B2 rollout to most stocked products (the directive)
11. Organizer app rebuild (E3, after the SwiftUI-vs-web decision)
12. Tax plumbing behind config (G) + accountant booking (Zach)
13. Three.js tumbler preview (B3) only if B1 is converting

**Zach's open decisions, all small:** palette yes/no per ground; price
sheet sign-off when the table lands; organizer rebuild flavor (native vs
web); category pages restyle-or-retire; testimonials texts sent.

Everything else is mine to execute in the order above.
