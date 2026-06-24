# VURMZ Brand Binder
## 10 · Tokens (code)

> The design tokens that make the brand real in code. Plain language, no em-dashes. Defined in `app/globals.css`.

### How it works
The site is theme-aware through CSS custom properties. Light mode is the default (paper with teal ink). Dark mode flips to the old teal look via `@media (prefers-color-scheme: dark)`. Same palette, the background and ink roles swap. **Use the tokens, never hardcoded hex.**

### Color tokens (light default / dark flip)
- `--page` paper `#DED6C3` / teal `#16525C`  (page background)
- `--ink` teal `#16525C` / oatmeal `#DED6C3`  (primary text)
- `--ink-soft` `#4F5D5B` / oatmeal 72%  (secondary text)
- `--surface` near-white `#FFFDF8` / `#123F47`  (cards)
- `--hairline` teal 14% / white 8%  (thin borders)
- `--feature` `#16525C` / `#123F47`  (dark feature blocks)
- `--feature-deep` `#123F47` / `#0E333A`  (footer, deepest)
- `--feature-ink` `#DED6C3` both  (text on feature/dark)
- `--feature-soft` oatmeal 72% both
- `--feature-accent` `#7FCFD4` both  (glassy teal accent on dark)
- `--eyebrow` coral `#C67A6F` / glassy teal `#7FCFD4`
- `--header-bg`, `--header-border`, `--logo-filter` (header chrome; logo filter is black in light, white in dark)

### Constants (same in both modes)
- Coral CTA: `#C67A6F`, hover `#B0675D`, active `#99584F`.
- Laser red: `#FF2A2A` (motif only).

### Utility classes (in globals.css)
- `.band-teal`, `.band-teal-deep` — section bands. Paper in light, backlit teal in dark.
- `.puffy`, `.puffy-light`, `.puffy-btn` — the soft sticker raise with the fixed-sun gloss.
- Paper grain on `body` (light mode only).

### Rules
- New UI uses tokens: `bg-[var(--page)]`, `text-[var(--ink)]`, `border-[var(--hairline)]`, etc.
- Heroes stay dark (use `--feature-ink` for their text). Footer stays `--feature-deep`.
- Site-wide color changes historically used a scripted sweep across `app/` + `components/`; the dual-mode rollout moved most usage onto these tokens. Keep it that way.

---
**Status:** documents the shipped token system (dual light/dark, 2026-06-22).
