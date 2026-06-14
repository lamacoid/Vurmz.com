# Usability crawl & assessment — 2026-06-13

Crawled all public routes + ran real-browser flow checks. Overall: the site is
healthy and the information architecture is finally clean. The remaining issues
are mostly content (photos) and one styling tweak, not broken functionality.

## What's working (verified)
- **All 24 routes return 200** (after the normal trailing-slash 308). No broken
  links, no 404s. Old URLs (`/pricing`, `/services/pricing`, `/shop/knives`,
  `/shop/devices`, `/shop/contact`, `/contact`, etc.) all redirect correctly.
- **No console errors** on home, shop, product, or checkout pages.
- **Add-to-cart → checkout works end to end**: item persists, fulfillment
  options load, payment/invoice step renders.
- **IA is clean now**: one-page home, pricing lives on /services, buy-now
  products on /shop, no duplicate "Pricing" nav.
- Strengths a customer feels: posted prices (no quote-form wall), the proof-
  photo promise, text-to-order, the design library + live preview.

## Issues, by priority

### 1. HIGH — every product shows "No photo" (conversion killer)
All 22 products render a grey "No photo" box. This is the single biggest drag
on the shop: people don't buy what they can't see. Not a code bug — needs hero
images uploaded in admin → Products. Fastest path: shoot the wood panels + a
few coaster/pen/knife pieces in daylight, upload. Owner task.

### 2. MEDIUM — GlassImage teal film is too heavy on the new dark base
The "frosted teal glass" overlay (opacity ~0.42 on cards) was tuned for the
old lighter base. On the new deeper #1A4F48 the recent-work and category images
read dark/murky until you hover. Easy fix: drop the card film opacity (e.g.
0.42 → ~0.22) so photos read at rest. ~1 line in GlassImage. Say the word.

### 3. MEDIUM — verify on a real phone
Responsive breakpoints + a mobile hamburger menu exist in code, but automated
mobile capture wasn't reliable here. Pull the site up on your phone and check:
hero logo size, the sticky services quick-nav scroll, the product grid columns,
and the checkout form. Report anything cramped and I'll fix it.

### 4. LOW — neon teal (#2FE6C4) on cream surfaces
The accent is tuned for dark backgrounds. On the few cream/light cards (shop
cross-link, etc.) teal text/links have lower contrast. Spot-check; if any look
washed I'll darken teal just for light surfaces.

### 5. LOW — taxes still not collected at checkout
Unchanged from before — once you set the Square rate, I wire it in. Legal item.

## Not issues (deliberate)
- Home + /shop both show recent work + categories — mild overlap, fine for a
  first visit; they serve different depths.
- "No photo" on the design-library thumbnails is intentional (watermarked art).

## Recommendation
The build is in good shape. The order of impact is unambiguous: **photos (#1)**
dwarfs everything else. After that, the glass-film lightening (#2) is the
highest design ROI and it's mine to do in two minutes whenever you want it.
