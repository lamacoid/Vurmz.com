# VURMZ — Overnight Build Session, 2026-06-11 → 06-12

Zach went to bed; standing instruction was "make everything great and seamless,
think of new features, act as business + website consultant and doer."
Production D1 was backed up first: `backups/vurmz-core-2026-06-11-2148.sql`.

## Shipped to production (all verified live)

### 1. Security — HIGH fix
`/api/media/[...key]` served **any** R2 key unauthenticated, including private
`customer/…` files (IDOR from the audit). Now gated to the content-addressed
public `media/aa/bb/<sha256>` shape only. Verified: a real private object
returns 404 publicly while the admin route serves it with auth.

### 2. The greenlit batch — done
- **$35 bring-your-own floor** — `TIERS.signature.startingAt` + 8 hardcoded
  copies ($25/knife untouched). Bonus catch: the contact API allowlist had
  `Custom Engraving ($50+)` hardcoded — it would have rejected every contact
  form submission once the form rendered $35. Now derives from the same constant.
- **Pens + Metal Cards categories** — D1 rows (local + prod), static category
  entries with FAQs/JSON-LD, pricing lanes (`BASIC.cards`), pricing-page card,
  footer + sitemap. `/shop/pens/` and `/shop/metal-cards/` live.
- **Catalog loaded** — 22 products in production (17 published, 5 drafts) via
  idempotent `scripts/catalog-2026-06-11.sql`. The shop is no longer empty.
- **Guest photo upload at checkout** — the missing piece of the order sheet.
  `POST /api/checkout/upload` (rate-limited, image/PDF only, 10MB, private
  `checkout/` prefix) → attach up to 3 files in the notes step → keys validated
  and stored on the order → "Customer files" section on admin order detail via
  the new admin-only `/api/admin/r2/` streamer → owner email shows 📎 count.

### 3. SEO / correctness
- `siteInfo.url` → `https://www.vurmz.com` (was non-www; split JSON-LD/OG signal).
- City-page LocalBusiness JSON-LD URL was missing `/services/`.
- `/services/materials` added to sitemap (its H1 already existed — audit miss).
- privacy / terms / unsubscribe moved into an `(legal)` route group with the
  real site header/footer. URLs unchanged.
- Legacy root redirects (`/contact`, `/pricing`, `/gifts`, …) were already fixed
  by the spawned task earlier today — verified live, all 308 correctly.

### 4. Payments reconciliation (small, safe slice of the webhook gap)
Shop-order payments now write `{orderId, orderNumber}` into `payments.metadata`
(no schema migration). Square `reference_id` already carries the order id.

## Catalog decisions I made (review these)
| Item | Price | Note |
|---|---|---|
| Pine coaster set ×4 | **$36** | locked |
| Brushed SS set ×4 **+ caddy** | **$58** | locked; name/copy now mention the caddy |
| Gold SS coaster set ×4 | **$44** | seed price kept — your "$16 gold SS" line didn't map to a set; **resolve in admin** |
| Slate set ×4 | $34 | seed price, not in your locked list |
| Survival knife | **$45, one-off** | 1 published + 4 drafts; **publish the next draft each time one sells** (2 clicks in admin) |
| Soft-touch pen | **$6 single / $45 pack-15** | locked |
| BYO engraving / jewelry marking | **from $35** | raised from seed $15/$20 to honor the $35 floor |
| Anodized wallet card | $18 | seed price |
| Mini mailbox $38 · wood sign $32 · vinyl $12 · iron-on $10 · plant markers $22/$30 | seed prices | not in your locked list — adjust freely in admin |
| AirTag tag | **$15** | locked; I wrote new copy — review it |
| Diffuser | draft | unchanged |

Not loaded on purpose: chef knives (pricing pending the actual blades) and
cutting boards (text-to-order, from $45).

## Needs Zach (in priority order)
1. **Product photos.** All 17 published products show "No photo". Admin →
   Products → upload a hero image per product. Single highest-impact 30 minutes
   on the whole site.
2. **Secrets** (each one currently breaks something):
   `SQUARE_WEBHOOK_SIGNATURE_KEY` (webhook verify), `RESEND_AUDIENCE_ID`
   (newsletter 500s), `OWNER_KEY`, `SENTRY_DSN` — set with
   `npx wrangler pages secret put <NAME>`. Plus `CLOUDFLARE_API_TOKEN` GitHub
   secret for CI deploys (account ID is already set).
3. **Gold SS $16** — tell me what that line item actually was and I'll fix the
   catalog in one query.
4. **Sales tax** — checkout charges 0 tax today. Colorado retail + the state
   retail delivery fee almost certainly apply to shipped/delivered orders.
   Confirm obligations (accountant or CO DOR) and I'll wire collection next
   session. Don't let this linger once real orders flow.

## Deferred (known, documented, not tonight)
invoice_later auto-invoicing · webhook finalizing shop orders end-to-end ·
two parallel jobs systems · disconnected messaging systems · unused content
editors · Sentry DSN plumbing · dead deps (three.js etc.) · ESLint scanning
build artifacts · stale `vurmz-control/PRICING.md` + dead `lib/products.ts`.

## Commits (main)
`db16027` security+SEO+$35 · `a716d6b` catalog · `83c5d79` guest upload.
Deployed: `8e510658.vurmz-website.pages.dev` → www.vurmz.com. Smoke: 11/11
pages 200, IDOR gate verified, upload endpoint live, $35 rendering.
