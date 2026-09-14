# VURMZ Designer handoff

Prepared for Zach and Claude. Files only. Nothing in this handoff was published or connected to the website, payments, a database or customer records.

## Product expansion

See `product-expansion.md` for 36 additional layouts and a proposed 38-product customer menu. The package now contains 52 editable templates and 52 individual previews. Knife and flatware files use normalized artwork zones, not physical dimensions.

## Included

- `templates/`: 16 editable SVG layouts, 16 PNG previews at 1200 px wide, and `manifest.json`.
- `card-collection.png`: a visual index of all 16 layouts.
- `text-to-path/`: exactly `index.ts`, `index.test.ts` and `README.md`.
- `test-assets/`: licensed Inter, Fraunces and Allura fonts used for testing and preview rendering, with OFL notices.

## Pending input

Object plates are not included. Attach `stylus-pen.glb`, `wallet-card.glb`, `slate-coaster.glb`, `wood-panel.glb` and any real-product photos. No substitute shapes or unverified mark-zone coordinates have been invented. The stainless annealing color also needs Zach's confirmation. Screenshots or a live-tool link are needed for the separate critique.

The pen example JSON is illustrative, not calibrated. Its 7 mm band is a cylindrical surface distance. A straight-on image compresses that distance away from the centerline. Once the real model and printable band are confirmed, the compositor must project the design onto the cylinder rather than treating its full mark zone as a flat rectangular stretch.

## Template contract

All SVGs are 85.725 × 53.975 mm with that exact viewBox. Every engraving mark is black on transparency. No background or substrate is present in the editable SVGs. The invisible `safe` rectangle is inset by 5.08 mm.

Each `<text>` has a `data-slot` and millimeter font size. The selected customer font applies only to `name`; other text remains Inter. Fraunces is the sample name font for Crest and Letterhead. Allura is the sample name font for Signature. Load the font files before previewing or replacing sample text.

The top-level `data-zone` groups are the four-zone limit. A group may contain multiple related fields. Divider's two columns and Monogram's oversized initial plus right-hand block follow their explicit layout descriptions. All text remains inside the safe margin. Frame's borders and Band's 10.16 mm edge treatment are deliberate exceptions for decoration. Band uses solid, one-tone 0.15 mm rules, not grey, halftone or a simulated lower-power color. Power is a manufacturing decision, not encoded in these files.

Crest's emblem rectangle and initials occupy the same identity region. If an uploaded emblem is used, hide the `monogram` text. If no emblem is provided, show the initials and ignore the invisible emblem rectangle. Never engrave either slot rectangle.

Scan reserves a 30 × 30 mm QR slot. The PNG contains a real sample QR encoding `https://riveraplumbing.com`; the editable SVG contains only the specified slot, not an embedded sample QR. On substitution, preserve at least four clear modules on all sides and at least 20.32 mm active code width. The supplied preview has 25 active modules, 22.727 mm active width, and a four-module quiet zone. Inverted silver-on-black QR scanning still needs testing on the actual engraved blank.

Sample warranty and specification fields are fictional examples, not promises of coverage or validated equipment instructions.

## Preview truth

PNGs are flat layout proofs using the supplied black matte surface `#1c1c1e` and bare-aluminum mark `#C9CACC`. They are not calibrated object plates or photographs. The SVG marks remain `#000` for the host to recolor. Silver-card variants must use the lower-contrast `#B4B6B9` mark on `#c8c9cb`, not the dark-card preview colors.

## Validation performed

- All 16 templates checked for exact size, safe-area text bounds, minimum text size, at least 3:1 type hierarchy, no more than four grouped zones, and no overlapping text.
- All 16 PNG previews rendered with supplied fonts and the visual index inspected.
- The module passed 9 Vitest tests, including the six requested behaviors.
- The module and its test file passed strict TypeScript checking.
- The runtime module uses no Node, canvas, DOM, database or network APIs. The test file uses Node only to read the font fixture.
- Plate registration, physical engraving quality, production QR scanning, live customer flows and Cloudflare deployment were not tested. They are outside these standalone deliverables or require missing inputs.

## Source licenses

Inter: https://github.com/google/fonts/tree/main/ofl/inter
Fraunces: https://github.com/google/fonts/tree/main/ofl/fraunces
Allura: https://github.com/google/fonts/tree/main/ofl/allura

Inter and Fraunces are static regular instances made from the published variable fonts. The original copyright and OFL notices are included. No stock photography is included.
