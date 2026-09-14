# Expanded VURMZ product handoff

Zach confirmed fiber, CO2 and diode lasers, with a broader scope covering metal, wood, ABS signage, knives and flatware. This package expands the files for Claude. It does not change the website.

## What was added

- 8 signage templates: warning/access, caution/wet floor, notice/staff only, keep clear, office plaque, business hours, equipment identification and custom message.
- 8 cutting-board templates: family kitchen, Chop it, Live laugh leftovers, snack board, butter, seasoned with love, gather and a family recipe title.
- 8 metal templates: service label, serial plate, asset tag, two pet-tag layouts, two keychain layouts and a plant marker.
- 8 knife/flatware templates: chef name, kitchen crew, pocket initials, knife gift message, knife owner label, flatware name, flatware initials and flatware gift set.
- 4 wood-sign templates: family name, workshop, welcome and custom sign.

With the original cards, this is 52 editable SVG layouts and 52 PNG layout previews. The text-to-path module is unchanged.

## Proposed product menu

`product-catalog.json` includes 38 entries across knives/flatware, wood/kitchen, signs/labels, metal gifts and other engraving surfaces. These are proposed customer choices, not a list of stocked SKUs. A null `templateKey` means no template has yet been supplied for that entry. The catalog can point either to original card template keys or new template keys.

`product-template-manifest.json` indexes the 36 added layouts. Each family also has its own manifest. It records sample size, slots, material-reference colors, unresolved specifications and release status. Actual stock and bring-your-own flows remain Claude's application work.

## Scaling and release

Knives and flatware vary too much to invent an object outline or printable dimensions. Those eight SVGs use a normalized 1000 x 240 artwork zone, with no physical width/height. Uniformly scale and place this artwork into a shop-verified area. Check font size in millimeters after scaling. Do not pass normalized values to a millimeter export unchanged. Do not stretch text nonuniformly.

All other new templates use explicitly provisional reference dimensions. Signage uses an assumed 300 x 200 mm master. Cutting boards and wood signs use the representative sizes in the supplied brief. Metal sizes follow the brief where available. A safe rectangle in these files is a layout margin, not a verified fixture boundary. Holes, rivets, clips, cutting edges, bevels, grooves and mounting exclusions need real-product measurements.

The recipe keepsake layout is a title layout. A full handwritten recipe requires the customer's uploaded artwork and a measured board area. No handwritten recipe asset is fabricated here.

## Material appearance

- ABS face/core combinations were not provided. Sign previews show black artwork on a neutral surface, not a promised engraving result. Exact stock composition and process suitability require shop confirmation.
- Wood uses the brief's reference surface #b98c52 and burn #232028. No grain, board photo or calibrated material plate is implied.
- Dark anodized aluminum reference proofs use #1c1c1e with #C9CACC marks.
- The silver anodized plant-marker example uses #c8c9cb with #B4B6B9. This is deliberately low contrast. Its actual stock finish is still unconfirmed.
- Stainless, knife finishes, flatware and bare aluminum keychain finishes remain unresolved. Their previews are monochrome artwork only.
- Owning fiber, CO2 and diode lasers does not determine a material's final appearance or safe process. No machine, power, speed or pass settings have been invented.

Warning-sign samples are editable layout concepts. Confirm the wording, hazard, symbols and any applicable requirements for the intended installation before sale or use. They are not certified safety-sign designs.

## Checks

All 36 new templates were rendered at 1200 px wide. Text bounds and text overlap checks passed against their provisional layout margins. The five family contact sheets were visually inspected. Object plates, real-world readability at the final size, machine processing and material tests are pending.

Nothing was uploaded to the shop, attached to an order or published.
