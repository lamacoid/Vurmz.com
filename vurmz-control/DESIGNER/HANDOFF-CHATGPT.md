# VURMZ Designer: brief for a second model

You are helping build a customer design tool for VURMZ, a one-person laser
engraving business in Centennial, Colorado (www.vurmz.com). The owner is
Zach. Another assistant (Claude) is writing the application code and owns
everything that touches the website, the database, payments, and customer
data. Your job is to produce the pieces that have clean edges: image assets,
SVG templates, one self-contained code module, and honest critique. Your
output comes back to Zach as files. Nothing you make goes on the site until
Claude has reviewed and integrated it.

Read all of this before producing anything. Ask Zach for anything marked
"attach" if he has not attached it.

---

## 1. What the tool is

A customer picks a product from the menu (a pen, a metal card, a slate
coaster, a cutting board) and puts their own mark on it: text in a font
they choose, a logo they upload, or a design from the shop's library. They
see the result on a high quality image of the real object. When they order,
the laser-ready file is generated automatically and lands on Zach's order
ticket. If they do not order, the design still saves to a folder for them
and for Zach.

The tool is not a drawing program. Every layout decision is made by a
template. The customer chooses a template, types, uploads, and looks. It
has to be beautiful, calm, and obvious on a phone. Nothing to learn.

Two rules that came out of a failed first attempt in July:

- **No canvas dragging.** People do not want to design. They want to see.
- **Previews never lie.** The image shows the exact colour the laser
  produces on that material. See section 3. This is the most important
  rule in this document.

---

## 2. Brand

**Palette.** The site sits on one ground, oatmeal paper, with deep teal ink.
There is no dark mode. Deep teal is used as a surface (bands, feature
cards), never as a mode the page flips into.

| Role | Hex | Use |
|---|---|---|
| Oatmeal paper (ground) | #DED6C3 | Page background. Everything sits on it. |
| Surface (cards) | #FFFDF8 | Panels and cards on the paper. |
| Deep teal (ink) | #16525C | Text, headings. |
| Deepest teal (feature) | #123F47 | Dark bands, footer. |
| Soft ink | #4F5D5B | Secondary text. |
| Signal teal | #7FCFD4 | The one bright colour. Means "true right now": selected, live, active. Used on almost nothing, so it stays bright. Never body text on paper. |
| Dusty coral (action) | #C67A6F | The one thing to click on a view. Fill with white text. Hover #B0675D. |
| Laser red | #FF2A2A | Workshop surfaces only: cut lines, registration marks, mark zones in diagrams. Never decorative. |

Do not add a colour. Do not use gradients, drop shadows, glows, or emoji.

**Type.** Fraunces for display (headings), Inter for everything else.
Sentence case. Two weights: regular and semibold. The customer engraving
fonts are a separate catalog of 59 faces and are not UI type.

**Voice.** Plain, first person, short. Like a nice restaurant menu. No hype
words (premium, elevate, the best, worth it). No comparisons to other shops.
The name is always VURMZ, all caps. **No em-dashes anywhere, in any copy,
label, comment, or file.** Use a period, a comma, or parentheses.

**Feel.** Quiet luxury that a plumber is comfortable in. Frames, slight
colour shifts, quiet type. Flat buttons. No depth, no gloss, no texture on
controls.

---

## 3. Material truths (the previews must honour these)

The laser does not add colour. It removes or changes the surface. What the
customer sees on screen must be what the material actually does.

| Material | Products | Surface | What the mark looks like |
|---|---|---|---|
| Anodized aluminum, dark (black matte, black gloss, blue, red, purple) | Cards, pet tags, plant markers | see hex list below | ALWAYS bare aluminum silver, #C9CACC. The dye is removed. Whatever the card colour, the mark is silver. |
| Anodized aluminum, pale (silver) | Cards | #c8c9cb | Slightly darker silver, #B4B6B9. Low contrast, and that is the truth. |
| Soft-touch coated pen (aluminum barrel under the coating) | Stylus pens | six barrel colours below | Silver, #C9CACC on dark barrels, #B4B6B9 on pale barrels. |
| Stainless steel | Equipment labels, service tags, stainless coasters | brushed or mirror steel | Annealed: a matte dark grey oxide, not metallic, not silver. Exact hex to confirm with Zach. Do not render it shiny. |
| Slate | Slate coasters | #56575c, square, thin (about 0.2 in), sheared edges | A pale frost, #EDE9DF. The stone is exposed under the surface. |
| Wood (pine, bamboo, panel) | Coasters, cutting boards, panels, signs | natural, #b98c52 as a reference | A burn, #232028, darker with more power. Never a colour. |
| Mirror | Mirrors | mirror | Engraved from the back, the silvering removed. Appears as frosted glass from the front. |
| Powder-coated tumbler | Tumblers | any coat colour | Coating removed to bare stainless. Silver. |

Card colours (anodized): black-matte #1c1c1e, black-gloss #111114, silver
#c8c9cb, blue #2a5d8f, red #a03030, purple #5a3a7e.

Pen barrel colours (soft-touch): charcoal #4a4a4f, gray #9a9aa0, sage
#a9b3a4, powder blue #b9c8d8, blush #d9a8a3, cream #e6dfd0.

If you are unsure how a material marks, say so and leave it out. Never
invent a finish.

---

## 4. Deliverable A: object plates (renders)

A "plate" is one image of one object, plus a small JSON file that tells the
software where the mark zone is in that image and how big the object really
is. The software composites the customer's design into the zone.

**Zach will attach** the existing 3D models (stylus-pen.glb, wallet-card.glb,
slate-coaster.glb, wood-panel.glb) and any photos he has. Use the models
for exact shape. The pen model is the real pen: 5.5 by 0.55 inches, barrel
radius 0.195 inches, the mark wraps a cylinder.

**Render rules, every plate:**
- Straight-on, orthographic or near it (long lens), object centred. This
  is a placement view, so the mark zone must be a flat parallelogram in the
  image with no perspective. A second three-quarter "hero" angle per object
  is welcome but optional.
- Transparent background PNG. 2400 px on the long edge. sRGB.
- One soft light from upper left, a faint contact shadow under the object
  only. No environment, no props, no hands, no text, no logos.
- The object's true colour (use the hex tables above as the reference).
  Where a product has several colours (cards, pens), render one plate per
  colour, same camera, same framing, pixel-aligned so the colour can be
  swapped without the object moving.
- No mark on the object. The plate is blank. The software adds the mark.

**Per-plate JSON** (same base filename, `.json`):
```json
{
  "product": "stylus-pen",
  "variant": "charcoal",
  "image": "stylus-pen_charcoal_top.png",
  "imagePx": [2400, 320],
  "objectMm": [139.7, 13.97],
  "objectPx": [[60, 40], [2340, 40], [2340, 280], [60, 280]],
  "markZoneMm": { "x": 20, "y": 3.5, "w": 60, "h": 7 },
  "markZonePx": [[404, 100], [1436, 100], [1436, 220], [404, 220]],
  "surface": "cylinder",
  "cylinderRadiusMm": 4.95,
  "markColor": "#C9CACC"
}
```
`objectPx` and `markZonePx` are four corners, top-left first, clockwise.
`objectMm` is the real size so the software can derive scale. `surface` is
`flat` or `cylinder`. For the pen the mark zone is the printable band on
the barrel, not the clip or the tip.

**The plate list, in priority order:**

1. Stylus pen, six barrel colours, top view. Real shape from the model.
   This is the common soft-touch stylus promo pen: rubberised barrel,
   chrome clip and tip, capacitive stylus on the cap end. Supplier photos
   of it are everywhere. Use them freely as reference for the clip, the
   tip, and the proportions, then render your own plate. Do not deliver a
   supplier's photo as the asset.
2. Anodized wallet card, six colours, 3.375 by 2.125 in, corner radius
   0.125 in. Face on.
3. Slate coaster, 4 by 4 in square, sheared edges, 0.2 in thick. Face on.
4. Pine wood coaster, 4 by 4 in square, softened edges, 0.25 in thick.
5. Brushed stainless coaster, 3.5 in round.
6. Cutting boards. These are generic blanks and supplier photos are
   everywhere, same as the pens. Reference them, render your own. Three
   shapes cover nearly everything people bring: a plain rectangle with
   rounded corners (12 by 8 in, bamboo), a paddle board with a handle
   (14 by 8 in, maple), and a round board (12 in, acacia or walnut). Real
   boards vary; the customer picks the closest shape and the software
   scales it to the size they enter.
7. Stainless equipment label, 3 by 1 in, rounded corners, brushed.
8. Anodized pet tag, 1.25 in round, black and silver.
9. Engraved keychain, aluminum bar, 2 by 0.5 in.
10. Mini mailbox, white, 4 by 3 in door face.
11. Wood panel, 12 by 12 in, natural.
12. Wood sign, 12 by 6 in, natural.
13. Wood plant marker (stake), 6 by 1 in face.
14. Aluminum plant marker, 6 by 1 in face, silver.

Deliver as a zip: `plates/<product>/<product>_<variant>_<view>.png` and
`.json` beside each.

---

## 5. Deliverable B: card templates (SVG)

The card is a wallet-sized anodized aluminum card, 3.375 by 2.125 in
(85.725 by 53.975 mm), corner radius 0.125 in. It is engraved on one side
in one tone (silver on the card colour). There is no second colour, no
grey, no halftone. Hierarchy comes from size and spacing only.

**House rules for every template:**
- One tone. Hierarchy by size, at least a 3 to 1 ratio between the biggest
  and smallest text.
- At most four zones. One alignment axis per card.
- Safe margin 0.2 in (5.08 mm) on all sides.
- Smallest text: 6 pt for sans, 10 pt for serif. Name 10 to 12 pt unless
  the template is built around a big name.
- QR codes at least 0.8 in with a quiet zone.
- The customer's chosen font applies to the **name** element only. Every
  other element uses Inter.
- No icons, no clip art inside the templates. An emblem slot is a slot for
  the customer's own logo.

**Business card layouts** (turn each of these eight into an SVG):
1. **Crest.** Centred emblem or initials, company in small caps, hairline
   rule, name in serif, title, one contact line.
2. **Divider.** Vertical hairline at 40/60. Left: monogram and company.
   Right: name, title, up to three contact rows.
3. **Letterhead.** All flush left. Company small caps with a rule, gap,
   name serif and title, contacts at the bottom.
4. **Monogram.** One initial about 1.4 in tall, may crop the edge. Small
   lower-right block: name, title, two contacts.
5. **Frame.** Double hairline border inset 0.125 in. Centred company, name,
   title, contact. No emblem.
6. **Band.** A 0.4 in etched band down the left edge (a simple dot or line
   texture, low power). Rest flush left.
7. **Scan.** Left: company, name, title, phone. Right: 0.8 in QR and URL.
8. **Signature.** Name large in a script face, centred. Title in
   letterspaced caps. One contact line.

**Not business cards.** The card is a credit-card sized piece of metal and
people use it for other things. Design eight more, same rules, one SVG
each: membership card, gift card with a value line, referral card,
warranty card left with an install, spec or cut-sheet card, loyalty punch
card (a row of circles to be marked later), "if found" contact card for a
bag or keys, and a coordinates card (a place and a date). Keep them plain.
Nothing cute.

**SVG contract, every template:**
- `viewBox="0 0 85.725 53.975"`, units are millimetres. Width and height
  attributes in mm.
- Everything black `#000` on a transparent background. The software
  recolours to the material's mark colour. No fills except the marks
  themselves. No strokes wider than 0.2 mm except deliberate rules.
- Text as `<text>` elements, not outlines, with `data-slot` on each:
  `name`, `title`, `company`, `contact-1`, `contact-2`, `contact-3`,
  `url`, `tagline`, `value`, `date`, `place`. Font as `font-family="Inter"`
  with the size in mm (`font-size="3.5"` is about 10 pt).
- The logo slot is a `<rect data-slot="emblem">` with no fill and
  `data-fit="contain"`. The QR slot is `<rect data-slot="qr">`. The
  monogram is `<text data-slot="monogram">`.
- A `<rect id="safe">` drawn at the safe margin, no fill, no stroke, for
  the software to read.
- Sample text in every slot so the template previews as a finished card.
  Use "Alex Rivera", "Rivera Plumbing", "Owner", "(720) 555-0139",
  "alex@riveraplumbing.com", "riveraplumbing.com". Never a real person.
- Also deliver `templates/manifest.json`: an array of
  `{ key, label, kind: "business" | "other", slots: [...], description }`.

Deliver as `templates/<key>.svg` plus the manifest, and one PNG preview
per template at 1200 px wide so Zach can look at them without opening
the SVGs.

---

## 6. Deliverable C: one code module, text to vector

The laser file needs text as outlines, not live text. Write a
self-contained module that turns a font file and a string into an SVG
path in millimetres.

**Constraints:** TypeScript, ES module, must run in a browser and in a
Cloudflare Worker. No Node APIs, no `fs`, no `canvas`, no DOM. The only
allowed dependency is `opentype.js` (MIT). Fonts arrive as an
`ArrayBuffer` of a TTF or OTF file.

**Interface:**
```ts
export interface TextToPathOptions {
  font: ArrayBuffer            // TTF or OTF
  text: string                 // may contain \n for multiple lines
  sizeMm: number               // cap height is NOT the size; use em size like CSS
  letterSpacingMm?: number     // default 0
  lineHeight?: number          // multiple of size, default 1.2
  align?: 'left' | 'center' | 'right'   // default 'left'
}
export interface TextPath {
  d: string                    // SVG path data, mm units, y down, origin top-left of the text block
  widthMm: number
  heightMm: number
  lines: number
}
export function textToPath(opts: TextToPathOptions): TextPath
export function fitTextToBox(
  opts: Omit<TextToPathOptions, 'sizeMm'> & { boxMm: { w: number; h: number }; maxSizeMm: number; minSizeMm: number }
): TextPath & { sizeMm: number; fits: boolean }
```
`fitTextToBox` shrinks from `maxSizeMm` until the text fits the box or
reaches `minSizeMm`, and reports `fits: false` if it still does not.

**Tests** (vitest): a single glyph produces a non-empty path; width grows
with letter spacing; two lines produce two rows with the right line
height; `align: 'center'` centres the shorter line; `fitTextToBox`
returns `fits: false` below the minimum; a font with kerning applies it
(width of "AV" is less than "A" plus "V"). Use any open licence font for
tests (Inter is fine) and include it.

Deliver as `text-to-path/index.ts`, `text-to-path/index.test.ts`, and a
`README.md` with two usage examples. No other files.

---

## 7. Deliverable D: critique

Zach will send you screenshots of the tool as screens are finished, and
later a link to the live tool.

For screenshots: at most five findings, ranked by how much they would
confuse a first-time visitor on a phone. Each finding is one sentence
naming the problem and one sentence saying what to change. No praise, no
summary, no preamble.

For the live tool: try to break it. Wrong file types, a 40 MB PNG, a
2,000 character name, an SVG with embedded scripts, switching products
mid-design, refreshing halfway, back button, two tabs. Report what
happened, in the order you tried it.

---

## 8. Formats the tool accepts

Customer uploads: SVG (passes through as vector), PNG and JPG (embedded as
raster, engraved as an image). PDF later. You do not need to handle
uploads; this is so your templates and plates make sense with both.

---

## 9. What not to do

- Do not write React, Next.js, or anything that touches the website.
- Do not write to a database or call any API.
- Do not invent a material, a colour, or a product that is not in this
  document. Ask.
- Do not put a real person's name, phone, or email in sample content.
- Do not use em-dashes.
- Do not use stock photography or any asset you do not have the right to
  hand over.

When something in this brief is ambiguous, say what you assumed in one
line and keep going.
