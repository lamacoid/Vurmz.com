# VURMZ Brand Binder
## 05 · Logo and marks

> Plain language, no em-dashes. Captures what is decided and what still needs producing.

### The logo
**The logo is the VURMZ wordmark** in the thin geometric all-caps letterforms, with the **RM ligature** (the R's leg flows into the M as one connected form). That join is the signature. **This is the one and only logo. No variants, no second mark.**

**How it is built:** the wordmark is set in **Zen Kurenaido** (Google Fonts), the thin even-stroke face. The **R and M were hand-edited** so the R's leg joins the M into the ligature. So the logo can be re-set or extended from Zen Kurenaido plus that custom RM join, and a clean palette SVG is straightforward to produce.

**Signature presentation:** on the landing page the wordmark runs with the animated teal-gradient "dynamic lighting" through it (the masked blob animation in the hero). That is the hero form of the same logo, not a different logo.

"VURMZ | Laser Engraving" is just the wordmark plus a descriptor for context (SEO, first impression). It is a use of the logo, not a separate one.

### Casing
VURMZ is always all caps. "Vurmz" in casual typing is fine, but the mark and brand name are VURMZ.

### Files in the repo
- `public/images/vurmz-logo-full.svg` — the lockup, vector. Note: its source fill is a legacy orange `#FF8C42`, recolored in CSS, not a real palette file.
- `public/images/vurmz-logo-text.png` — used as the animated hero mask.
- Standalone RM-ligature mark: Zach has it, currently a raster grey export. No clean palette SVG in the repo yet.

### Color
- On dark (teal): the logo is white / oatmeal.
- On paper (light): currently forced to black via `--logo-filter` (interim, readable but off-brand). Target is a proper deep-teal version.

### Clear space and size
- Keep clear space around the mark equal to the cap height of the V.
- Minimum on screen: do not render the wordmark below about 90px wide.

### Misuse (do not)
- Recolor outside the palette, add gradients, shadows, or glow.
- Stretch, skew, rotate, or rebuild the ligature by hand.
- Place dark-on-dark or light-on-light. Use the right version for the surface.

### Open (one cleanup task)
The small static placements (header, footer) currently rely on CSS filters over the legacy-orange source SVG, which makes the wordmark plain black on paper in light mode (interim). Cleanup: produce a clean palette SVG of the wordmark so those small placements show deep teal on light and white on dark, matching the brand. The animated landing version stays as is.

---
**Status:** logo is decided and in use (the wordmark, animated on the landing). One cleanup task above.
