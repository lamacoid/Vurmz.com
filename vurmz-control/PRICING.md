# Pricing Guide

Rebuilt 2026-07-02. Replaces the old fragmented pricing (a stale
`lib/products.ts`, mismatched free-delivery numbers between the code and this
doc, and bulk pricing that existed in copy with no real product behind it).
This is the current, single description of how VURMZ prices things.

## Where prices actually live

- **`lib/pricing.ts`** is the source of truth for everything that isn't a
  literal shop SKU: the Signature/bring-your-own floor, knife and tool
  marking, service tags, sourcing fees, the free-delivery threshold, and the
  business volume tiers. Every page that shows a price imports from here.
- **The D1 `products` table** holds the actual purchasable shop catalog
  (coasters, the survival knife, the business packs, etc). Edit these in
  **admin → Products**, not in code.
- There is no `lib/products.ts` anymore. It was a duplicate of `lib/pricing.ts`
  that had drifted (it still said the Signature floor was $50 after the real
  floor moved to $35). Deleted, not archived.

## The two ways VURMZ sells

**Individual** — posted prices, no haggling, no minimum. This is nearly
everything on the site today: the $35 bring-your-own floor, $25/knife (with
crew rates at 4+ and 10+), $15/tool, packs of pens/coasters/keychains/cards,
service tags, and the one-off shop catalog. These numbers are checked against
the real market (Etsy, national marketplaces, local quote-only competitors)
and are already competitive. Don't discount them; see the Playbook's "answer
is the work" note.

**Business / recurring** — real volume tiers for local businesses buying
in bulk (pens, coasters, keychains, metal cards, service tags):

| Tier | Units | Discount | Extras |
|---|---|---|---|
| Starter | 15 to 49 | Standard bulk rate (0% off) | |
| Regular | 50 to 149 | 10% off | |
| Standing | 150+, or any recurring/standing account | 15% off | Free delivery at any size, NET-30 terms |

- Discounts apply to **effective units**, not cart quantity. A pack-of-15
  pens SKU bought at cart quantity 10 is 150 effective units (Standing), not
  10. See `businessUnitPrice()` / `businessTierFor()` in `lib/pricing.ts`.
- **No setup or design fee, ever.** Screen printing and embroidery charge
  setup because a physical plate or a digitized stitch file has a real
  per-design production cost. A fiber laser just runs a different file, so
  there's no matching cost to charge for.
- **NET-30** reuses the existing "send me an invoice" checkout option
  (`invoice_later` fulfillment method), nothing new to build.
- **Admin-mediated for now.** There's no self-serve "I'm a business" toggle
  on the public checkout. You apply the tier yourself when building a quote
  or invoice for a customer you know is buying in volume or ordering on a
  schedule. The pricing functions in `lib/pricing.ts` are there to compute
  the right number consistently; nothing forces a customer into a tier
  automatically.
- Two real SKUs exist for this: **Coasters, Business Pack of 15** ($60) and
  **Metal Business Cards, Pack of 10** ($30), both `audience: 'services'` in
  D1 so they don't clutter the consumer shop grid but are fully buyable at
  their own product page.

## Free delivery

**$50+**, South Denver metro, since the July 2026 repricing. (History: this
doc once said $100 while the code enforced $75; the July sheet then cut $75
to $50.) $50 is the one number, everywhere: `lib/pricing.ts`
(`DELIVERY.freeThreshold`), the services page, the homepage, the city pages,
the terms page, and the Google Business Profile copy.

## Rush orders

Documented rates, not yet automated in checkout: **$25 flat for next-business-day,
$35 flat for same-day**, per order. Quote these manually if a customer asks
for a rush job. (`RUSH` in `lib/pricing.ts` if you want the constants.)

## Sales tax: not done yet

`orders.tax_cents` and `invoices.tax_cents` exist in the database, and you
can enter a tax amount by hand on an admin-created invoice. Shop checkout
does **not** compute or charge tax automatically. Colorado sales tax is
jurisdiction-specific (state, county, Centennial's own municipal rate, and
possibly a special district depending on delivery address), so this needs
you and an accountant (or the CO Department of Revenue) to confirm the real
rate before it gets wired into checkout math. This is the Playbook's
roadmap item #1 for a reason. No placeholder rate lives anywhere in the code
on purpose, a copied placeholder becoming a real number by accident is worse
than leaving it blank.

## How to change a price

**Anything in `lib/pricing.ts`** (Signature floor, knife/tool rates, service
tags, sourcing fee, delivery threshold, business tiers):
1. Open `lib/pricing.ts`, find the value, change it.
2. `npm run typecheck && npm run build` to confirm nothing broke.
3. Deploy.

**An actual shop product's price** (coasters, the survival knife, the
business packs, anything a customer buys through `/shop/p/[slug]`):
1. Go to **admin → Products**, open the product, change the price, save.
   No deploy needed, it's a database edit and takes effect immediately.


## July 2026 repricing (approved 2026-07-03, PRICING-PROPOSAL-2026-07.md)
Knives $20/$12/$6. Stainless cards $12 base / $15 loaded. Metal labels
$30 per pack of 10 ($3/tag), $2/tag messaging at 100+ (admin-quoted).
Anodized card business pack $25/10. Pine coaster set $28. Free delivery
threshold $50. New tier: Standing Plus, 250+ units, 20% off, free
delivery + NET-30. New SKUs: engraved pet tag $12, single keychain $10.
Framing shipped: "the engraving is included", "no setup fee, no minimums,
no shipping" strips on services pages. Held: BYO $35, boards, stainless
coaster sets, photo panel, sourcing (premium shelf and Q4 protection).
