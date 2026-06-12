# VURMZ — Session Log, 2026-06-11

## 1. Full site audit (state-of-codebase report)
Ran 5 parallel deep-dive agents + live `wrangler` verification against production.

- **Frontend/SEO** — pages, metadata, sitemap, robots, redirects. Found www-vs-non-www canonical split, city-page JSON-LD URL bug, `/services/materials` missing from sitemap + zero H1, privacy/terms/unsubscribe rendering with no header/footer.
- **Shop/checkout** — traced full cart→Square→order flow. It's complete and correct code, but: no `order_id` on payments table, no sales tax, webhook only finalizes invoices (not shop orders), `invoice_later` never auto-invoices.
- **Admin** — full CRUD mostly present. Found two parallel "jobs" systems on two different databases, two disconnected messaging systems, and three content editors (nav/settings/theme) the public site ignores.
- **Account/integrations** — confirmed all d8544bc fixes landed correctly (incl. per-ID ownership checks). New **HIGH**: public `/api/media/[...key]` serves private customer files unauthenticated (IDOR). Plus unwired CSRF and admin magic-link logged.
- **Infra/code quality** — Sentry wired but dead in prod (reads DSN from wrong place); dead heavy deps (three.js/@react-three/swr never imported); ESLint scans build artifacts; `npm run db:seed` points at a missing file. Typecheck passes clean.

**Live production checks (verified, not inferred):**
- `vurmz-core` D1: **0 products, 0 orders, 7 categories, 1 customer** — the shop is empty.
- Secrets **set**: ADMIN_PASSWORD_HASH, RESEND_API_KEY, SQUARE_ACCESS_TOKEN/APPLICATION_ID/LOCATION_ID/ENVIRONMENT.
- Secrets **missing**: SQUARE_WEBHOOK_SIGNATURE_KEY, RESEND_AUDIENCE_ID, OWNER_KEY, SENTRY_DSN — each breaks something (webhook, newsletter 500, etc.).

Delivered a prioritized punch list (fix-first / fix-later / nice-to-have). Headline: **well-built codebase, near-empty production state.**

## 2. Catalog planning
- Mapped the inventory brain-dump (coasters, knives, pens, cards, keychains, cutting boards, etc.) to the 7 live categories; pulled pricing lanes from `lib/pricing.ts`.
- Flagged two conflicts: **$35 vs $50/$25** bring-your-own pricing, and pens/metal cards having no category home.

## 3. Decisions locked
- **$35** is the new bring-your-own floor (retiring $50); **$25/knife** stays.
- **Buy-now for stocked items, text-to-order for sourced/custom.**
- **Create two new categories: Pens + Metal Cards.**
- **Survival knives = one-off** (5, sell out); **chef knives = restockable.**

## 4. Pricing sheet built
Full per-SKU pricing anchored to the lanes + lux margin + free-delivery-over-$100. Buy-now table (pine $36/set, gold SS $16, brushed SS+caddy $58, survival knife $45, AirTag tag $15, pens $6/$45, etc.) and text-to-order table (cutting boards from $45, chef knives from $55, concierge sourcing $25+item). Chef-knife exact pricing pending the actual blades.

## 5. Order-sheet architecture decided
Verified Option B (order sheet + auto-charge) is **~85% already built**: per-item engraving text+font picker, order notes box, Square auto-charge, and it all renders on the admin order detail. **The one gap:** photo/logo upload is locked behind customer login — guests can't attach an image at checkout.

## 6. Approved batch (queued, not yet started)
Greenlit: **(1)** load catalog + create the 2 categories, **(2)** build guest photo upload at checkout → R2 → order → admin, **(3)** flip $50→$35 site-wide.

---

**State at end of session: nothing written to production, no code changed.** Audit done, plan + pricing locked, build batch queued.

## Carry-over from the parallel deploy-CI session (same day)
- `CLOUDFLARE_ACCOUNT_ID` GitHub secret **set**; `CLOUDFLARE_API_TOKEN` **still missing** — deploy workflow run 27316351766 stays red until Zach creates a token (dash.cloudflare.com/profile/api-tokens → Account → Cloudflare Pages → Edit) and runs `gh secret set CLOUDFLARE_API_TOKEN`.
- Known production bug, spawned as its own task: legacy `public/_redirects` rules (`/contact`, `/pricing`, `/gifts`, …) 404 in production because the next-on-pages worker shadows the file; fix is moving them into `next.config.ts` `redirects()`.
