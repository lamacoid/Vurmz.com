# VURMZ Brand Binder
## 08 · Layout

> How pages are built. Plain language, no em-dashes. Documents the live system.

### Grid and width
- Content sections: centered, `max-w-6xl`, padding `px-4 sm:px-6 lg:px-8`.
- Header and footer: `max-w-7xl`.
- One column of content on a generous margin. Let it breathe.

### Section rhythm
- Vertical padding: `py-12 sm:py-16` (some heroes and CTAs use `py-14 sm:py-20`).
- On the homepage, sections butt against thin divider lines with no gap.
- Alternate the page surface and feature surface for rhythm. In light mode most sections are paper, the footer and hero are dark. In dark mode the old teal bands return.

### Surfaces and shape
- Corner radius: `rounded-sm` everywhere. Tight corners are the VURMZ shape. Pills only for the text bubble and small toggles.
- Cards: `bg-[var(--surface)]` + `border border-[var(--hairline)]` + the `.puffy` raise.
- Hairlines: `border-[var(--hairline)]`, never heavy borders.

### Components
- **Header:** fixed, full nav at the `lg` breakpoint (hamburger below). Logo left, nav center, right cluster is Cart, Account, and the blue iMessage-style text pill. `components/SiteHeader.tsx`.
- **Footer:** deep teal in both modes, four columns (Products, Business, About, Service Area), the slogan, and the "Powered by VURMZ | webWorks" credit. `components/SiteFooter.tsx`.
- **Hero:** dark photo banner with the teal film, light text, slim vignette into the page. `SiteHero` (shop/services) and the homepage hero.
- **Buttons:** primary is a coral fill with `.puffy-btn`. Secondary is an outline (`border-[var(--ink)]`). White text on coral.
- **Cards in grids:** product and category cards, `.puffy`, coral hover border.

### Spacing and motion
- Spacing in rem for vertical rhythm, px for component-internal gaps.
- Everything lifts on a fixed overhead light (the puffy system). Keep it subtle.

### Rules
- Keep it roomy and aligned. Tight radius, thin hairlines, soft lift.
- Use the tokens and the shared components, do not hardcode new colors or one-off card styles.

---
**Status:** documents the live layout system.
