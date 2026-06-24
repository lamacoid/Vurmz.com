# VURMZ Brand Binder
## 05 · Logo and marks

> Plain language, no em-dashes. Captures what is decided and what still needs producing.

### The marks
- **Standalone wordmark:** VURMZ, set in the thin geometric all-caps letterforms. The signature is the **RM ligature**: the R's leg flows straight into the M so "RM" reads as one connected form. This join is the one thing nobody else has. Keep it.
- **Lockup:** "VURMZ | Laser Engraving" with a pipe. VURMZ all caps, the descriptor in title case. The pipe lets the descriptor swap later without a rebrand.

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

### Open (production tasks)
1. Vectorize the standalone RM-ligature mark as a clean SVG and export palette versions (deep teal, oatmeal/white, single-color).
2. Make a real deep-teal light-mode logo and replace the interim black filter.
3. Retire or recolor the legacy-orange source in `vurmz-logo-full.svg`.
4. Decide if VURMZ needs a compact symbol (just the ligature, or a single glyph) for favicon, social avatar, and the app icon.

---
**Status:** rules and inventory documented. Production tasks above are open and need Zach.
