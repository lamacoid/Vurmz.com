# Reserve item photos, the shopping list

The site is wired for a product photo per reserve piece (2026-11-01).
Drop a file at `public/reserve/items/<slug>.jpg` and add
`photo: '/reserve/items/<slug>.jpg'` to that piece in `lib/sourcing.ts`.
The item photo then wins over the category photo on the shop tiles and
the reserve page. Until then each piece shows its category photograph.

Run this from a session with open internet (not a cloud container; the
egress proxy blocks brand sites). Maker product pages have the shots;
keep them roughly 4:3 and under 300 KB.

Note on rights: these are the makers' marketing photos. Common practice
for a shop that sells the real piece, but they are the brands' images.
If a maker ever objects, pull that one file and the category photo takes
over again with no code change.

The pieces, by slug:

- ridge-wallet-aluminum, ridge-wallet-titanium, ridge-wallet-carbon-fiber (Ridge)
- bellroy-slim-sleeve (Bellroy)
- yeti-rambler-20, yeti-tundra-45 (Yeti)
- stanley-quencher-40 (Stanley)
- snow-peak-titanium-cup (Snow Peak)
- leatherman-wave-plus (Leatherman)
- victorinox-huntsman (Victorinox)
- opinel-no-08 (Opinel)
- buck-110-folding-hunter (Buck)
- spyderco-delica-4, spyderco-paramilitary-2 (Spyderco)
- benchmade-bugout, benchmade-940-osborne (Benchmade)
- chris-reeve-small-sebenza-31 (Chris Reeve)
- shun-classic-8-chef, shun-premier-8-chef (Shun)
- miyabi-birchwood-8-chef (Miyabi)
- wusthof-classic-ikon-8-chef (Wusthof)
- smithey-no-10-skillet, smithey-no-12-skillet (Smithey)
- john-boos-maple-board, john-boos-reversible-maple-24x18 (John Boos)
- zippo-brushed-chrome (Zippo)
- fisher-bullet-space-pen (Fisher)
- tactile-turn-bolt-action (Tactile Turn)
- moleskine-classic (Moleskine)

Only the pieces flagged `reserve: true` show on the site today; the rest
are queued data. Photograph the flagged ones first.
