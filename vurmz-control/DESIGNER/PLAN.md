# The Designer: build plan

Started 2026-09-13. Zach: "a really easy to use and beautiful and strong
and capable design tool for my customers to test out ideas or submit
orders." The file is the product: what the customer sees and what Zach
loads into the laser are the same data. No canvas, no dragging. Templates
make every layout decision. Previews never lie about the material.

## Phases

**1. Cards (this pass).** Anodized wallet cards, 16 templates from the
handoff, six stocked colours, name in the customer's font, logo into the
emblem slot, live preview, laser SVG generated at order time and attached
to the ticket. Autosave to the browser only.

**2. Saved designs.** `designs` table. Autosave for guests (token) and
accounts (customer id). Customer "Designs" list under account files.
Admin "Designs" room: every design anyone made, ordered or not, with a
text-them button.

**3. Pens, coasters, boards.** Plates rendered from the GLB models (top
view, mark zone JSON). Pen mark projected onto the cylinder. Templates per
product family, same slot contract.

**4. Bring your own.** Photo upload, four-corner mark zone, scale
reference, placement numbers on the ticket.

## Phase 1 pieces

- `lib/designer/text-to-path.ts` (handoff module, opentype.js).
- `lib/designer/templates/cards/*.svg` (handoff) compiled by
  `scripts/build-designer-templates.mjs` into `templates.generated.ts`.
- `lib/designer/card.ts`: the design record, preview SVG (screen), laser
  SVG (mm, outlines, layers), sample data (long-dead famous names with
  modern titles, Zach's rule 2026-09-13).
- `components/designer/CardDesigner.tsx`: the UI, mounted on card
  products in place of the template picker.
- `/api/orders`: `design` per item, laser SVG written to R2 under
  `orders/<order>/`, attached to the ticket. Admin ticket renders the
  preview and links the file.

## Rules carried over

- Anodized always marks bare-alu silver: #C9CACC on dark, #B4B6B9 on the
  silver card. Never another colour.
- Colour chips come from stocked inventory when rows exist; otherwise the
  six builder materials, black matte first.
- Fonts for outlining must be TTF or OTF. Zen Kurenaido's TTF is at
  `public/fonts/ZenKurenaido-Regular.ttf` (OFL). woff2 cannot be outlined.
- Never `next/dynamic` in the shop tree (edge bundle drops the chunk).
  Import heavy modules inside effects.
- Uploads: SVG passes through, PNG/JPG embedded. Same `checkout/` and
  `customer/` prefixes as every other file.
