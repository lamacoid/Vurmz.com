# VURMZ Brand Binder — Claude Design brief

Build the binder in **Claude Design** (claude.ai/design), not Canva. It is
brand-aware (the Design System feature), runs Opus 4.8, and "Document" is the
right template for a binder ("Slides" if you want a deck instead).

Content source for all of this is the 10 layers in this folder
(01-FOUNDATION ... 10-TOKENS).

## Step 1: Set up the VURMZ Design System (reusable for every future design)

Colors and their roles:

```
Oatmeal / paper (light bg)        #DED6C3
Deep teal / ink (text)            #16525C
Deepest teal (dark bands, footer) #123F47
Soft ink (muted text)             #4F5D5B
Surface / cards                   #FFFDF8
Glassy teal (accent, dark only)   #7FCFD4
Dusty coral (CTA only)            #C67A6F
Laser red (precision marks)       #FF2A2A
```

Type: Fraunces (display/headings), Inter (body).

Logo: `vurmz-wordmark.svg` (in `public/images/`, or
`https://www.vurmz.com/images/vurmz-wordmark.svg`). Black is fine for now; a deep
teal version and a reversed white version are a later nice-to-have.

## Step 2: Binder prompt (template = Document)

```
Build a brand binder (brand guidelines) for VURMZ, a one-person laser engraving
business in Centennial, Colorado. Use the VURMZ design system for all color and
type. Multi-page, clean editorial layout, generous whitespace, calm like a
refined restaurant menu. Do not use em-dashes anywhere. Use the VURMZ wordmark on
the cover and the logo page.

Cover: the VURMZ wordmark, subtitle "Brand Binder", and "Local. Thoughtful. Fast."

1. Foundation. A one-person laser engraving shop in Centennial, CO (south Denver
metro). Serves local businesses with recurring branded/promo work across all
industries, and individuals with gifts and bring-your-own engraving. Posted
prices, 24 to 72 hour turnaround, hand-delivered. Brand idea: machine precision,
human hands. VURMZ is the umbrella; today it is one arm, "VURMZ | Laser Engraving".
Audience: mainly small local businesses (recurring), then individuals/gifts.
Vibe: one person who cares, fast, direct, collaborative; every job gets a proof
to approve before anything is cut.

2. Verbal. Pillars: Local. Thoughtful. Fast. Tagline: "Let's put your ___ on
something." Bring-your-own line: "make yours... yours". Voice: plain, first
person, concise. No AI-sounding or cheesy language, no hype words, no comparisons
to other shops. Banned: premium, elevate, bulletproof, the best, worth it. Never
use em-dashes. The name is always VURMZ, all caps.

3. Color. A swatch grid showing each palette color with its hex and role. Explain
the two modes: light is paper with teal ink (default, warm "paper and clay"),
dark flips to deep teal with light text (glassy, backlit). Ratio: ~55% oatmeal,
30% teal, 12% coral, 3% laser red.

4. Type. Fraunces for display/headings, Inter for body. Large confident headings.

5. Logo. The VURMZ wordmark, set in Zen Kurenaido with a hand-edited R-M ligature
(the R's leg flows into the M). One logo, no variants. Clear space = cap height
of the V. Minimum ~90px wide. Deep teal on paper, white/oatmeal on dark. Do not
recolor outside the palette, stretch, skew, or rebuild the ligature.

6. Motif. A laser-red framing/registration mark (the thin red outline the laser
traces around a shape), used sparingly for precision.

7. Imagery. Real work only, never generic stock. Honest over polished: actual
engraved pieces in real settings. Hero photos sit behind a teal film as dark
banners with light text.

8. Layout. Light = warm paper and clay with subtle texture; dark = glassy teal.
Banded sections, generous spacing, menu-like restraint.

9. Applications. Metal business card, social templates, email signature, Google
Business Profile, favicon. Footer credit: "Powered by VURMZ | webWorks".

Keep all copy concise.
```
