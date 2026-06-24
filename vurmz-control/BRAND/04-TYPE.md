# VURMZ Brand Binder
## 04 · Type

> Plain language, no em-dashes. Documents the type already in use.

### The three faces

**Fraunces (display serif).** The headline face. Hero lines, section headings, the rotating "Let's put your ___ on something" tagline. Its real italic carries the rotating word and any emphasis. Loaded as `var(--font-display)` (next/font, Google). Display only, never body.

**Inter (body and UI).** Everything else: body copy, labels, buttons, nav, forms, prices. Clean and quiet so Fraunces and the work do the talking. Loaded as the default body font (next/font, Google).

**Kerf (house engraving font).** VURMZ Originals, exclusive to VURMZ, generated in `/tools/kerf`. It is the signature face shown first in the engraving picker. This is a brand asset and a product feature, not a UI font. Do not use it for site chrome.

### Scale (from the live site)
- Hero / big display: `text-3xl sm:text-4xl lg:text-5xl`, Fraunces, semibold.
- Section heading (h2): `text-2xl sm:text-3xl`, Fraunces or Inter bold.
- Body: `text-base` / `text-sm`, Inter, line height relaxed.
- Eyebrow / kicker: `text-xs font-mono uppercase tracking-[0.2em]` in the eyebrow color.
- Micro: `text-[11px]` / `text-xs` for notes and captions.

### Rules
- Fraunces for display, Inter for body. Do not mix them up.
- Sentence case for body and headings. Pillars and eyebrows may be all caps.
- Two weights mostly: regular and semibold. Avoid heavy black weights.
- The large font catalog in `lib/fonts.ts` + `app/fonts.css` is the CUSTOMER engraving font picker (what a buyer can choose for their mark). It is a product feature, separate from brand type. Do not pull those faces into the site UI.

---
**Status:** documents current type. Open later: a printed type spec if needed for physical materials.
