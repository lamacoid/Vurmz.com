# VURMZ Playbook — running the business, not just the laser

Written 2026-06-12. You're new to running a business; this is the boring,
repeatable stuff that compounds. None of it requires new code. Re-read monthly.

## The one number that matters right now
**First 10 paying orders.** Not traffic, not followers. Everything below is in
service of that. The site can now take money end to end — the bottleneck is
people knowing you exist.

## Week one (do these once)
1. **Google Business Profile.** Free, and for "laser engraving near me" it IS
   your marketing. Create/claim at business.google.com — category "Laser
   engraving service", service area = your 11 cities, link www.vurmz.com, phone
   as text-preferred. Upload 10 portfolio photos from /public/portfolio. This
   single listing will likely out-pull the website for local discovery.
2. **Product photos** (see overnight report). Phone camera + daylight +
   plain background is plenty. Shoot the 5 coaster/knife/pen hero items first.
3. **Square**: confirm sales tax settings with an accountant or the CO
   Department of Revenue — retail sales tax + the Colorado retail delivery fee
   probably apply. I'll wire collection into checkout when you say go.
4. **Set the missing secrets** (overnight report list) so the webhook,
   newsletter, and error reporting actually run.

## The review engine (steal this verbatim)
After every delivered order, text the customer next day:
> "Hey, it's Zach from VURMZ. Hope the [item] landed well. If you've got 60
> seconds, a Google review genuinely keeps the lights on for a one-person shop:
> [your GBP review link]. Either way — thanks for the business."
5 reviews beats a thousand dollars of ads for local search. Put the link in
your phone's text shortcuts. Ask every single time; the ask is the system.

## Weekly rhythm (30 min, pick a day)
- Open **admin → Orders**: anything stuck in `new`/`confirmed` more than 2 days?
- Open **admin → Inbox**: respond to everything, even "no".
- One **portfolio photo** posted to GBP (doubles as your content marketing).
- Glance at `/admin/analytics`: which pages get visits but no texts? That page's
  CTA or pricing is the suspect.

## Pricing spine (already locked — defend it)
$35 BYO floor · $25/knife · packs for volume · $25 sourcing fee · free delivery
over $100. When someone pushes back on price, the answer is the work: "that's
the rate — here's a photo of what you get." Discounting a one-person shop's
labor is a habit that never reverses. Raise prices when you're booked solid for
two weeks straight.

## When an order goes wrong (it will)
Fix it fast and visibly: re-run the piece or refund, same day, no argument
under $100. The recovery story is what they tell people, and a one-person shop
lives on referrals. (The site already promises this in the Satisfaction box.)

## Feature roadmap I'd build next (my recommendation, in order)
1. **Sales tax in checkout** — legal exposure, do first once you confirm rates.
2. **Auto-invoice for `invoice_later` orders** — money you're currently chasing
   by hand.
3. **Review-request automation** — email via Resend N days after `delivered`
   (the manual text above until then).
4. **Inventory counts** on restockable SKUs (the table exists, no UI) — stops
   overselling tumblers/pens when volume picks up.
5. **Abandoned checkout nudge** — later; needs traffic before it pays.

## What NOT to spend time on yet
Paid ads (no reviews yet) · social media presence beyond GBP posts · more
website redesigns (it's good — sell with it) · new equipment (book the current
machines solid first).
