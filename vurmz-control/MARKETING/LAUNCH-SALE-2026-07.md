# Early Bird Gets the VURMZ (launch sale, live through July 31)

Shipped 2026-07-04. Everything here reverts by itself at midnight August 1
Denver time; nothing to remember.

## The numbers (live on vurmz.com/shop)

| Item | Launch price | Regular | Cap | Strikethrough? |
| --- | --- | --- | --- | --- |
| Slate Coasters (Set of 4) | $24 | $34 | none | Yes ($34 is a real former price) |
| Bamboo Cutting Board (new SKU) | $29 | $39 after July 31 | first 20 boards | No (never sold at $39) |
| Soft-Touch Stylus Pens, Pack of 10 (new SKU) | $20 | $30 after July 31 | first 10 packs | No |

## How the mechanic works (for future sales)

Any product can go on sale by putting this in its `metadata.sale` (admin
product form, or a migration):

```json
{"priceCents": 2400, "endsAt": "2026-08-01T06:00:00Z", "compareAt": true,
 "capUnits": 20, "capLabel": "first 20 boards"}
```

- `price_cents` on the product stays the REGULAR price. The sale price
  lives in metadata, so ending is automatic: menu, product page, and
  checkout all read `lib/sale.ts` against the same clock.
- `compareAt: true` earns the strikethrough. Only set it when the regular
  price was actually charged before. Honesty rule, not a style choice.
- `capUnits` counts real ordered units (cancelled and refunded excluded).
  When the cap is hit, the sale price stops applying by itself.
- `endsAt` is an instant. Midnight Denver = 06:00Z (summer).

## Google Business Profile post (paste into GBP > Add update)

Photo: slate-coasters or pens shot from ~/Desktop/vurmz-product-photos/

> Launch pricing through July 31 while I get VURMZ off the ground.
>
> Slate coaster sets (4) are $24 instead of $34. Ten engraved soft-touch
> pens for $20, first ten packs. A personalized bamboo cutting board for
> $29, first twenty boards.
>
> Engraving is included, you approve a proof photo before anything runs,
> and I hand-deliver in the south Denver metro.
>
> vurmz.com/shop

Button: "Order online" -> https://www.vurmz.com/shop/

## Instagram / Facebook post

Image: same product photo, or a screenshot of the menu's launch box.

> Early bird gets the VURMZ.
>
> Launch pricing through July 31: slate coaster sets $24 (down from $34),
> ten engraved pens for $20, personalized bamboo boards $29. First 20
> boards and first 10 pen packs, then that's it.
>
> Everything engraved here in Centennial, proof photo before anything
> runs, hand-delivered.
>
> Link in bio.

Hashtags (keep to a handful): #centennialcolorado #laserengraving
#shoplocaldenver #denvergifts

## Outreach tie-in

The 10 email drafts in OUTREACH-READY-2026-07-06.md now each carry a P.S.
with the pens and slate lines. Texts and walk-in scripts were left alone
on purpose (a P.S. reads wrong there; mention the pens verbally).

## After July 31

Nothing to do. Slate shows $34 again, the board becomes a regular $39
product, the pen 10-pack becomes $30, the menu box disappears. If a cap
sells out early the sale price stops on its own for that item. To end the
sale early, delete the `sale` key from the product's metadata.
