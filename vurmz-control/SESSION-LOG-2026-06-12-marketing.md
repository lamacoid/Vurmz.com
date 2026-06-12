# VURMZ — Marketing Night, 2026-06-12

Brief: marketing help, detailed plan, test orders, lead generator, market
research, "wake up to a fully functioning site." Rate limits hit twice
overnight (as predicted); work resumed automatically each time.

## Delivered
1. **3 TEST orders on production** — V-260612-KYRQ ($39, hand-deliver evening
   window + photo attachment + Kerf engraving), V-260612-8NCN ($12, pickup,
   Coolvetica engraving ×2), V-260612-2WFN ($45, pen pack). All invoice-later:
   **zero charges**. They're on the admin board in `new`; confirmation emails
   went to zach+test1/2/3@, owner notifications to zach@. Cancel them whenever.
   Every pipeline piece verified in prod D1: engraving text/font, attachment
   key, delivery window/note.
2. **Lead engine** — `vurmz-control/LEADS.md` + `leads.csv`: 30 researched
   leads (15 trades, 10 restaurants/breweries, 5 venues/planners), each with a
   sourced "why" and first touch. `/leads` skill for refreshes + **scheduled
   weekly run Mondays 7am** (runs while the app is open; first run pre-approval
   recommended — click "Run now" once in the Scheduled sidebar).
   Realtor/office segment pending (limit) — Monday fills it.
3. **Market research** — `vurmz-control/MARKET-RESEARCH.md`, confidence-labeled.
   Headlines: every nearby competitor hides pricing (your posted $35/$25 is the
   moat); Mile High's default is 3–5 days vs your next-day; knife volume gap at
   2+ blades (consider a crew tier); November is the B2C year; prep live by
   October; $10k+/mo solo shops run on repeat B2B.
4. **Marketing kit** — `MARKETING/outreach.md` (5 segment scripts),
   `MARKETING/gbp.md` (paste-ready Google Business Profile), `MARKETING/social.md`
   (10 posts mapped to portfolio photos).
5. **Newsletter fail-soft** — signups no longer 500 without RESEND_AUDIENCE_ID;
   visitor succeeds, you get a manual-add flag email. Code committed
   (`bd2f51c`); deploy was blocked by a **Cloudflare Pages API outage** (3×
   504s on their side) — an automatic retry loop is running and it will land
   when their API recovers. Everything else was already live.

## Honest corrections given (and stand by)
- Automated lead scraping/outreach would violate platform ToS and spam law and
  damage the one-real-guy brand; built researched-list + personal-outreach +
  weekly-refresh instead.
- Test orders used invoice-later because Square is in production — a "test"
  card charge is real money.

## For Zach this morning (priority order)
1. Review the 3 TEST orders in admin (then cancel them).
2. 5 first-touches from LEADS.md (scripts in outreach.md). The Centennial
   trades (Van Genderen, Hytek, Promise Electric) are walking distance.
3. GBP setup from gbp.md (~20 min) — still the single highest-leverage task.
4. Product photos (carried over — still the site's weakest point).
5. Decide: knife crew tier pricing (research says yes); "gold SS $16" mystery;
   sales tax (still outstanding, still the legal one).

## Open threads
- Newsletter deploy lands automatically when Cloudflare recovers (check:
  `curl -X POST https://www.vurmz.com/api/newsletter` should stop saying
  "service not configured").
- Events/markets list + realtor leads: Monday's /leads run or ask anytime.
- Weekly leads task needs one "Run now" pre-approval click to run unattended.
