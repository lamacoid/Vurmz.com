# Sparrow Cleaning Co. — Raleigh, NC

A single-file marketing site for a house-cleaning business. Built to execute
**Step 1** of the playbook: *"Set up a simple website with AI before the week
is over."*

It is one self-contained `index.html` — no build step, no dependencies. Open it
in a browser to preview; drag the folder into Cloudflare Pages or Netlify to
deploy.

---

## Fill these in before you launch

Open `index.html`, find the `CONFIG` object near the bottom (in `<script>`):

| Field          | What to do |
|----------------|------------|
| `phoneDisplay` / `phoneHref` | Your real business number. Currently a placeholder `(919) 555-0142`. Get a line from **OpenPhone** (playbook step 7). |
| `email`        | Where booking emails land. Update the placeholder `hello@sparrowcleaningco.com`. |
| `web3formsKey` | Free key from [web3forms.com](https://web3forms.com) so form submissions email you. Leave blank and the form opens the customer's email app instead — the site still works on day one. |
| `bookingUrl`   | Once **Booking Koala** is set up, paste your scheduling link here and every "Book a cleaning" button routes customers straight to it. |

Also search the file for these and replace as needed:
- `sparrowcleaningco.com` — your real domain (in `<link rel="canonical">`, Open Graph, JSON-LD).
- The `<!-- ANALYTICS -->` comment in `<head>` — paste your Google tag / Google Ads conversion snippet here.
- Pricing in the **Pricing** section — confirm against your real Raleigh rates.

## Deploy

**Cloudflare Pages** (matches the rest of this repo's stack):
1. Create a Pages project, "Direct Upload."
2. Upload the `sparrow-cleaning/` folder contents.
3. Point your domain at it.

Or Netlify drag-and-drop, GitHub Pages — any static host works.

---

## Where this sits in the playbook

| Step | Status |
|------|--------|
| 1. Simple website | **Done — this site.** Fill in `CONFIG`, then deploy. |
| 2. Pick a market | Done — Raleigh, NC (population + household income + competition). |
| 3. Post an Indeed listing for cleaners | Your move — hire contractors. |
| 4. Google Local Service Ads | Your move — site is built to convert that traffic (LocalBusiness schema, fast load, clear CTAs). |
| 5. First booking in 30 days | The booking form + click-to-call are live. |
| 6. Reinvest into ads | Add your Google tag in `<head>` to track which ads convert. |
| 7. Booking Koala + Stripe + phone line | Wire `bookingUrl`, `web3formsKey`, and the real phone number into `CONFIG`. |
| 8–13. Scale | Operational — not a code task. |

## Notes

- No customer reviews are shown — the company is new, so the site leans on the
  insured / vetted / guarantee proof instead of inventing testimonials. Add a
  real reviews section once you have them.
- The `$30 off your first clean` offer appears in the announcement bar, hero
  card, and booking form. Change or remove it in `index.html` if needed.
