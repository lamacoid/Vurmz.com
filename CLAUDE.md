# VURMZ — project guide for Claude / Cowork

Read this first. It says what VURMZ is, where everything lives, how to build and ship, and the rules. Plain language, no em-dashes (that is a hard rule here, see Conventions).

## What VURMZ is

VURMZ is a one-person laser engraving business in Centennial, Colorado (south Denver metro), run by Zach. It serves local businesses (recurring promo and branded work, all industries) and individuals (gifts, bring-your-own engraving). Posted prices, fast turnaround (24 to 72 hours), hand-delivered.

VURMZ is the parent name. Today it is one arm, "VURMZ | Laser Engraving". The brand pillars are **Local. Thoughtful. Fast.** The full brand system lives in `vurmz-control/BRAND/` (read it before writing any copy or touching design).

This repo is the live website: **www.vurmz.com**.

## Stack

- **Next.js (App Router)** deployed to **Cloudflare Pages** via `@cloudflare/next-on-pages`.
- **Cloudflare D1** database named `vurmz-core` (products, orders, customers, invoices, messages). Pages that touch D1 must set `export const runtime = 'edge'`.
- **Cloudflare R2** for media. Public media is the `media/` prefix; private uploads use `checkout/` and `customer/` prefixes (gated).
- **Square** for payments, in PRODUCTION mode. Real charges. For test orders use the invoice-later path, never a live card.
- `trailingSlash: true`. The next-on-pages worker owns all routes (`_routes.json: ["/*"]`).

## Repo map

- `app/` — the site (App Router).
  - `app/page.tsx` — homepage. `app/shop/` — store. `app/services/` — business services + sub-pages. `app/about/`, `app/(legal)/` — privacy/terms/unsubscribe. `app/account/` — customer accounts. `app/checkout/` — checkout. `app/admin/` — admin dashboard (behind login). `app/api/` — API routes. `app/brand/` — internal brand board (noindex).
  - `app/globals.css` — Tailwind v4 + the design tokens (see Color below). `app/layout.tsx` — root layout, fonts, LaserCursor.
- `components/` — shared UI. `components/shop/` — store components. Key ones: `SiteHeader`, `SiteFooter`, `SiteHero`, `RotatingHeroBg`, `CategoryCard`, `EngravingPicker`, `LaserCursor`.
- `lib/` — data + logic: `site-info.ts`, `pricing.ts`, `categories.ts`, `portfolio.ts`, `about.ts`, `fonts.ts`, `hero-words.ts`, `db/` repos, `checkout/`, `cart/`.
- `scripts/` — build/data scripts (catalog SQL, design catalog, seed, db tools).
- `public/images/` — logos (`vurmz-logo-full.svg` is the wordmark lockup; note its source fill is a legacy orange, force-recolored in CSS), `vurmz-logo-text.png` (hero mask).
- `functions/`, `wrangler.toml`, `next.config.ts` — Cloudflare + Next config.
- `vurmz-control/` — the business control room (NOT shipped to the site). Brand, marketing, leads, research, pricing, deploy notes, session logs. **Start here for business context:** `vurmz-control/README.md`, `PLAYBOOK.md`, `PAGES.md`, `SITE-INFO.md`, `DEPLOY.md`, `BRAND/`.

## Build and deploy

Local dev: `npm run dev`.

Ship to production (the sequence that works):
```
npm run build
npm run pages:build
wrangler pages deploy .vercel/output/static --project-name=vurmz-website --branch=main --commit-dirty=true
```
There is also `npm run pages:deploy`. Commit and push to `main` separately (see Conventions for commit rules). `RUNBOOK.md` and `vurmz-control/DEPLOY.md` have more.

Typecheck: `npm run typecheck` (run `rm -rf .next/types` first if stale types error). Lint: `npm run lint`.

## Database (D1: vurmz-core)

- Migrate: `npm run db:migrate:local` / `db:migrate:remote`. List: `db:list:*`.
- Query: `wrangler d1 execute vurmz-core --remote --command "SELECT ..."` (add `--json` for parsing).
- **Back up before any write to remote:** `npm run db:backup` (or the `backup-db` skill).
- Order status model: there is no `paid` status. Paid shop orders advance to `confirmed`.

## Color: dual light/dark (shipped 2026-06-22)

The site is theme-aware via CSS tokens in `app/globals.css`. **Light mode is the default: paper (oatmeal) with teal ink. Dark mode flips to the old deep-teal look.** Driven by `prefers-color-scheme`.

Use the tokens, not hardcoded hex: `var(--page)`, `var(--ink)`, `var(--ink-soft)`, `var(--surface)`, `var(--hairline)`, `var(--feature)`, `var(--feature-deep)`, `var(--feature-ink)`, `var(--eyebrow)`, `--logo-filter`. Coral (`#C67A6F`) and laser red (`#FF2A2A`) are the same in both modes. Heroes stay dark photo banners with light text in both modes; the footer stays deep teal.

Palette and the full ratio/rules: `vurmz-control/BRAND/03-COLOR.md`.

## Conventions and hard rules

These are Zach's standing rules. Follow them in code, copy, and commits.

- **Voice / copy:** plain, first person ("I"/"you"), concise like a nice restaurant menu. NO AI-sounding or cheesy language. NO hype words (premium, bulletproof, elevate, worth it, the best). NO comparing to competitors ("unlike the big shops", "others do X") — it is all Zach. Never claim "worth it"; the customer decides. Full verbal system: `vurmz-control/BRAND/02-VERBAL.md`.
- **NO EM-DASHES anywhere** (chat, copy, code comments, docs). Use periods, commas, or parentheses.
- **Muted tones.** The palette is glassy teal / dusty coral / oatmeal, plus the one laser-red accent. Do not add a new bright color.
- **Commits:** plain messages. Do NOT add `Co-Authored-By: Claude / Anthropic` trailers. Branch off `main` for non-trivial work; only commit or push when asked.
- **Redirects:** add them in `next.config.ts` `redirects()`, NOT `public/_redirects` and NOT a Server Component `redirect()` (the worker shadows both).
- **Honesty in product copy:** say what a thing actually is. Do not overstate materials or capabilities.

## Brand binder

`vurmz-control/BRAND/` is the source of truth for identity:
- `01-FOUNDATION.md` — what VURMZ is, audience, the vibe, the promise, tone, boundaries.
- `02-VERBAL.md` — pillars, taglines, banned words, grammar, casing (VURMZ is all caps).
- `03-COLOR.md` — palette, roles, ratio, light/dark, paper texture.
Logo, type, layout, and applications layers are still to be built.

## Gotchas

- D1 pages need `runtime = 'edge'`.
- Square is production. Do not place real test charges.
- Many colors used to be hardcoded hex; site-wide color changes have historically been done with a scripted sweep across `app/` + `components/` + `globals.css`. The dual-mode rollout moved most of these to tokens.
- The `/leads` skill refreshes the local-business lead list (weekly) into `vurmz-control/LEADS.md` + `leads.csv`. Other skills exist for deploy, smoke test, invoices, inbox, etc.
