# Pricing audit, 2026-07-16

> STATUS: findings + recommendations, awaiting Zach's sign-off on the
> "Decide" table. Consistency fixes (drift against the already-approved
> July 3 sheet) were applied same day; no new price took effect.
> Method mirrors PRICING-PROPOSAL-2026-07: fresh per-item market
> comparables (sourced, confidence-tagged), doctrine from
> MASTERPLAN-2026-07 section C. Sales reality: the store is effectively
> pre-revenue (3 test orders, one $32 invoice), so prices are judged on
> structure and market, not demand data.

## 1. Consistency fixes applied (approved-state restoration, not new prices)

| Where | Was | Now | Why |
|---|---|---|---|
| lib/pricing.ts `cards.matteBlackBase` | $3/card ($30/10 shown on /services) | $2.50/card ($25/10) | July 3 sheet approved $25/10; the D1 SKU already charged it. The services page contradicted the shop for two weeks. |
| TRADES card, stainless tag line | hardcoded $15 | $12 (reads `stainlessBase`) | July 3 approved $12 base / $15 loaded. |
| `serviceTags.range` top | $180 | $150 | Top = 10 stainless fully loaded at $15/tag. $180 was the pre-July price. |
| PRICING.md free-delivery section | said "$75 is the one number" under a "$50+" heading | $50 stated once, history noted | Doc bug from stacked edits. |

Lesson recorded: the July 3 sweep updated D1 but missed two lib/pricing.ts
constants. Any future repricing must grep lib/pricing.ts for every number on
the sheet before declaring done.

## 2. Structural checks

- Free delivery threshold: $50 in code and copy everywhere checked.
- Tiers: Starter 0% / Regular 10% / Standing 15% / Standing Plus 20%, all
  rendering, effective-unit math intact.
- Doctrine floor tension (CONFIRM WITH REAL BLANK COSTS): masterplan floors
  say nothing below 3x blank cost, with pen blanks estimated ~$1.50. If that
  estimate is right, even the base $3/pen sits at 2x, and Standing Plus
  ($2.40/pen) at 1.6x. Same at the deepest tier for pine coasters ($4 base,
  $3.20 at 20% off vs a $6 floor if blanks are really $2). Either the blank
  cost estimates are stale (likely: bulk pen blanks run well under $1.50) or
  the deep tiers are thinner than doctrine allows. ACTION: Zach lists real
  per-blank costs for pens, tags, coasters, cards; five minutes with
  receipts settles it. The new inventory form is the natural place to keep
  buying costs eventually.
- Stainless coaster split: business lane sells stainless coasters at $6/pc
  (pack of 15 = $90) while consumer sets run $11 to $14.50/pc. The gap is
  wide enough that a business buyer who finds both pages sees an
  inconsistency. Options: raise business stainless to $7 to 8/pc, or accept
  the split as pack economics. Zach's call, low urgency (no buyers yet).

## 3. Market comparables, July 2026 (fresh, sourced, confidence-tagged)

Full detail with links in the session record. Verdicts:

| Item | VURMZ | Market read | Verdict |
|---|---|---|---|
| Wallet card, single | $18 | $4 to $15 singles; $3.99 to 4.99 at the strongest national (HIGH) | OVER, 3 to 4x |
| Wallet cards, pack 10 | $25 | ~$2.39/card bulk channels (MEDIUM) | at market |
| AirTag tag | $15 | $6 to $20 Etsy (MEDIUM) | at market |
| Mini mailbox | $38 | $19.99 printed-kids comparable only (HIGH, weak twin) | over visible market, weak comparable |
| Alu plant markers, 6 | $30 | $19 to $24 specialist + ship (HIGH) | modestly over |
| Wood plant markers, 6 | $22 | ~$27 equivalent at PMall (HIGH) | at/under |
| Vinyl decal 12x12 | $12 | $12 to $30 one-color (HIGH) | bottom of market |
| Iron-on transfer | $10 | DTF $2 to $4 ganged; Etsy cut HTV $3 to $10 + ship (MEDIUM) | at market vs Etsy; DTF has commoditized the lane |
| Wood sign | from $32 | $35 local 5x7 posted (HIGH) | at market |
| Jewelry marking | from $35 | $30 to $60 mail-in/in-store (HIGH) | at market |
| Photo on wood | from $75 | $79.95 specialist 6x8 (HIGH) | at market |
| Wood panel art | from $45 | $44 to $73 local; Etsy wall size $90+ (HIGH) | at market entry |
| Slate coasters, 4 | $34 (sale $24) | $20 to $22 national engraved sets (HIGH) | OVER by $10 to $14 |
| Pine coasters, 4 | $28 | $25 to $37 Etsy (MEDIUM) | at market |
| Brushed SS + caddy, 4 | $58 | $25 to $52 spread (HIGH) | top of market |
| Gold SS, 4 | $44 | no solid gold comparable found (LOW) | unknown, inside general SS spread |
| Bamboo board | $39 (sale $29) | $49.99 strongest national (HIGH) | under |
| Keychain, single | $10 | $8 to $15 (MEDIUM) | at market |
| Pet tag | $12 | $6 to $10 + ship (MEDIUM) | at market delivered |
| Survival knife | $45 | $29.95 big national; Etsy $25 to $50 (MEDIUM/HIGH) | over the big comparable, inside Etsy |
| Pen, single | $6 | no single-pen channel exists | uncontested |
| Pens, per-unit | $3 ($2.50 at 100+) | 4imprint $1.95 effective at 100 + minimum (HIGH) | above cheapest bulk, wins on structure |

Battlegrounds (July 3 claims rechecked): knife mail-in $35 + two-way
shipping HOLDS (HIGH, Lazer Designs Denver). Industrial tag minimums
confirmed, per-tag dollar figure not re-readable this round (Seton blocks
fetches; MEDIUM/LOW). Promo pens: minimums and setup fees confirmed, but
entry pricing has softened to $1.65/pen at 100; "promo pens cost $2 to 4"
is no longer safe copy (site copy checked: it makes structural claims only,
nothing to fix).

Local context: no metro competitor posts granular retail prices; setup fees
and minimums are the norm (Lazer Designs $25+ first-order setup, Lantern
$50 minimum + $25 setup). The structural edge stands.

## 4. Decide (Zach's call, before/after per doctrine)

| Item | Now | Recommend | Reasoning |
|---|---|---|---|
| Wallet card, single | $18 | **$12** | 3 to 4x over the market single is the one real outlier in the catalog, and it sits two clicks from the $25/10 pack. $12 still carries a custom + hand-delivered premium. |
| Slate coasters, 4 | $34 reg | **$29 after the Aug 1 sale** | Doctrine: retail gifts at market. Nationals sit at $20 to $22 with template art; $29 prices the custom art and delivery without being 70% over. Avoids the $24 sale snapping back to $34. |
| Alu plant markers, 6 | $30 | **$28 or hold** | Small trim toward the specialist. Cosmetic; holding is defensible (deep engraving + delivery). |
| Bamboo board | $39 reg | **consider $44 after the sale** | Under the $49.99 national; room to move up in Q4 rather than down. |
| Survival knife | $45 | **hold** | 5 units, premium shelf, inside Etsy band. Watch the $29.95 national if restocking. |
| Mini mailbox | $38 | **hold** | Weak comparable; wait for a sale signal. |
| Brushed SS coasters | $58 | **hold** | Premium shelf; caddy and finish justify the top of the spread. |
| Everything else | | **hold** | At market or uncontested. |

Also queued for decision: post-sale prices generally (three launch sales end
2026-08-01) and the blank-cost confirmation in section 2.

## 5. What this audit did NOT do

No live price changed except the drift fixes in section 1 (which restore
prices Zach already approved on 2026-07-03). Sales tax remains open
(roadmap #1). Revisit consumer catalog pricing after Q4 per the July sheet;
this audit exists because the catalog roughly doubled since July 3, not to
relitigate held prices.
