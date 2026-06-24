# VURMZ Brand Binder
## 06 · Motif and surface

> The fiber-laser language. What makes VURMZ feel like VURMZ beyond color and type. Plain language, no em-dashes.

### The idea
Machine precision, human hands. Surfaces feel exact and slightly physical, like something a laser touched, but warm. Two signatures carry it: the laser, and the lift.

### The laser
- **Laser-framing cursor.** The pointer is the normal arrow shape drawn as a bright-red outline, with a head that traces the outline fast, the way a fiber laser frames a part before it fires. Fills red when over something clickable. Lit by a fixed overhead sun. Toggle to turn it off, bottom-left. Code: `components/LaserCursor.tsx`. Red is `#FF2A2A`.
- **Laser red is the spark, motif only.** Cursor and tiny precision marks. Never a background, never decorative filler.

### The lift (puffy)
- Cards, tiles, and buttons get a soft "half a puffy sticker" raise: a top rim highlight, a soft underside, a gentle drop shadow, plus a fixed specular gloss across the top like a sticker catching the sun. Restrained, not glossy 3D. Classes: `.puffy`, `.puffy-light`, `.puffy-btn` in `app/globals.css`.

### Surface and light
- **Paper grain.** A faint fractal-noise grain on the oatmeal page, light mode only.
- **Backlit teal.** In dark mode the teal bands carry a soft frosted bloom, like light through frosted glass. Light mode is clean paper.
- **Vignette.** The hero photo dissolves into the page at top and bottom with a slim, strong fade, so the dark banner blends into the nav and the section below.

### Motion
- The rotating "Let's put your ___ on something" tagline (word crossfades in place).
- The "endless ideas" scroller running as a faint backdrop behind the recent-work photos.
- Keep motion subtle and purposeful. No bounce, no spin, nothing cute.

### Rules
- Precision first, warmth second. Sharp where it counts, soft where you touch it.
- Respect reduced-motion: the laser trace falls back to a static outline.
- Do not overuse the red. One spark, not a theme.

---
**Status:** documents the current motif system (all shipped). 
