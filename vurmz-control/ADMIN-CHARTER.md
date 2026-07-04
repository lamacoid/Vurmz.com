# THE ADMIN CHARTER
## A prompt to myself: build Zach's personal Squarespace

Written 2026-07-03 at Zach's direction: "write a prompt to yourself in a
way that will result in the most powerful helpful and simple admin for me
to run the site with." This document IS that prompt. When executing any
admin work, re-read this first. Everything else is commentary.

---

## Who you are building for (never forget this)

One person. A chef for fifteen years before this. He runs a laser, a
delivery car, and a phone. He is standing at the machine with gloves on,
or driving, or at a customer's door. He did not get into this to do
admin work; every minute in the admin is a minute not engraving or
selling. He is smart as hell and allergic to complexity that serves the
software instead of him. When he says "amateur hour," he means: I opened
a screen and had to think about how the software works instead of what
my business needs next.

The bar: his grandmother could run the store from her phone, AND a
Fortune-500 ops team would nod at the rigor underneath.

## The disease being cured

The admin today is a database with buttons. Fourteen nav items, one per
table: Orders, Products, Invoices, Quotes, Customers, Messages,
Inventory, Materials, Service jobs, Pages, Media, Theme, Navigation,
Analytics. That is how ENGINEERS organize software. Nobody's DAY is
shaped like a schema. Squarespace and Shopify win because their admin is
organized around what the person is trying to DO, and every flow
finishes the thought: it never dumps you in a table and wishes you luck.

## The North Star: the kitchen rail

Zach ran kitchens. A kitchen has ONE organizing object: the ticket. It
says what to make, for whom, by when, with what modifications. Tickets
hang on a rail in fire order. You look at the rail and know your whole
day. You never open a "customers module" during service.

The admin becomes a rail of tickets. Every piece of work, whatever its
database name (shop order, service job, quote-turned-job, invoice
follow-up), renders as a TICKET with the same anatomy:

  WHO      name, phone tap-to-text, returning-customer flag
  WHAT     photo of the product + the exact engraving (text, font
           rendered in that font, design thumbnail, placement diagram
           when the Builder ships)
  WITH     material/blank needed, which file to open in LightBurn
  WHEN     due date, traffic-light urgency (green/amber/red), promised
           vs elapsed
  WORTH    the money: total, paid/unpaid, margin
  NEXT     exactly one primary action button, computed from state:
           "Send proof" -> "Mark approved" -> "Start engraving" ->
           "Out for delivery" -> "Delivered, get paid" -> done.

The ticket's NEXT button is the whole UX thesis: the admin always knows
what the next step is, computes it, and offers exactly it. Zach never
diagnoses state from a status dropdown.

## The five rooms (IA: 14 nav items become 5)

1. **TODAY** (home). The rail: tickets in fire order. Above it, three
   numbers max (owed to you, due today, new since yesterday). Below it,
   anything that needs a decision (new message, new order, overdue
   invoice) as inbox-zero cards with one-tap actions. Today answers
   "what do I do right now" in five seconds, on a phone, in a parking
   lot.
2. **WORK** (the rail, expanded). All tickets, filterable by state.
   Kanban on desktop, list on phone. Includes what are now Orders +
   Service jobs + accepted Quotes; those tables remain underneath but
   the seam is invisible.
3. **STORE**. Listings (the marketplace form), photos, prices, the menu
   order. Everything about what is FOR SALE.
4. **PEOPLE**. Customers and Messages merged into one thread-first
   view: a person, their conversation, their orders, their money, on
   one page. Compose email lives here (shipped 2026-07-03).
5. **MONEY**. Invoices, revenue, payouts, the funnel (events table),
   tax when it arrives. Every number the business earns or is owed.

Pages/Media/Theme/Navigation/Settings collapse into a gear menu; they
are set-and-forget, not daily rooms.

## Wizards (Zach's explicit ask): guided flows that finish the thought

Every multi-step task becomes a wizard with numbered steps, progress,
back buttons, and NOTHING optional shown before it is needed. The rule:
a wizard ends with the thing DONE (sent, saved, scheduled), never with
"now go to another screen."

- **New job wizard** ("someone wants something"): who (pick or create
  customer inline) -> what (pick product or freeform + engraving
  details) -> price (AUTO-COMPUTED, see below, editable) -> how they
  pay (invoice now / pay on delivery / already paid) -> when (due date
  with a load-aware suggestion: "you have 3 jobs due Thursday") ->
  DONE: ticket on the rail, invoice drafted if chosen, confirmation
  text/email offered.
- **Quote wizard**: same spine, ends with a branded quote emailed and a
  follow-up nudge scheduled ("no reply in 4 days -> Today card").
- **Proof wizard**: attach/snap photo -> one tap sends the branded
  proof email/text -> ticket advances to "waiting on approval" ->
  approval reply advances it again.
- **Delivery run wizard**: pick today's deliverable tickets -> it
  orders them into a route (addresses on a map link) -> each drop:
  "Delivered" tap -> triggers get-paid step or receipt.
- **New listing wizard**: exists (marketplace form); absorb it, add
  the photo pipeline hook and Builder-zone step when those land.

## Automatic calculations (the other explicit ask): Zach never does arithmetic

Inventory of every number the system computes the moment it can:
- Price of any job: from lib/pricing (catalog rates, BYO floor, knife/
  tool ladders, add-ons) + volume tier auto-applied from quantity
  (BusinessTierHint exists; make it automatic-with-override everywhere,
  not a hint button).
- Per-unit price shown beside every pack price, everywhere (form does
  this now; extend to quotes, invoices, tickets).
- Margin per ticket: price minus blank cost (add a simple cost field to
  products; default costs for BYO = $0). Zach sees WORTH, decides
  faster.
- Delivery: free/$5 computed from subtotal + standing status; route
  grouping suggests delivery days ("3 tickets within 2 miles Thursday").
- Due-date load: jobs/day count warns before he promises a hot Friday.
- Invoice math: line totals, tax field, partial payments, days overdue,
  and "worth chasing" sort (amount x days).
- Money dashboard: owed / earned this week / this month vs last, funnel
  conversion from the events table. No spreadsheet, ever.

## Enterprise parity checklist (what Squarespace/Shopify have that this must match)

- Global search (⌘K exists; make it find EVERYTHING: tickets, people,
  listings, by any fragment, instantly).
- Undo. Every destructive or state-advancing action offers a 10-second
  undo toast. No confirm-dialog forests; act + undo beats ask + act.
- Autosave everywhere. No lost work, no explicit save buttons except
  Publish-class actions.
- Speed: every room paints under 1s on phone; optimistic UI on all
  taps.
- Mobile-first literally: design every screen at 390px FIRST; desktop
  is the enhancement. Zach runs this business from his pocket.
- Notifications that matter: new order/message/approval -> one email
  (later push) with a deep link to the exact ticket.
- Empty states that teach: every empty room says what will appear and
  offers the one action that fills it.
- No dead ends: every screen has an obvious way forward and back.
- Undoable data model: soft-delete everywhere it isn't already.

## Two-way customer messaging (added 2026-07-03, Zach found the hole)

There are TWO message systems and they do not meet: the contact-form KV
inbox (admin sees it, replies leave as email) and the customer-portal D1
messages (customers write from /account/messages; the admin cannot reply
into the thread or start one). The fix, pulled forward ahead of the
Phase 3 People room because it is a functional hole, not polish:
- One thread per person in the admin, unifying portal messages and
  contact-form messages chronologically.
- Admin can REPLY into the portal thread and START a new thread to any
  customer; the customer gets a branded email nudge ("Zach sent you a
  message") deep-linking to their portal.
- The compose-email feature (shipped 2026-07-03) remains for people
  without accounts; the thread view shows which channel each message
  used.

## Attach-anything messages with smart routing (added 2026-07-03)

The customer composer gains an ATTACH menu: proof photo (from the order's
proof workflow or fresh upload), a quote (renders as a branded summary
card with line items and total, not a bare link), an invoice, any
photo/file. The channel routes ITSELF: customer has a portal account ->
portal message + branded email nudge; no account -> branded email only.
Zach writes to a PERSON and attaches a THING; the system picks the pipe.
Plumbing notes: messages.attachments column exists unused; quotes/
invoices/proofs are existing records to reference by id; R2 for files;
renderBrandedEmail already takes a CTA. Builds right after the Today
rail, before the rooms consolidation.

## Connected to the shop floor (added 2026-07-03: "the native Mac app")

VURMZ Library.app (the design-asset organizer) was never connected to
the site; its rebuild is task #40. The connection Zach actually wants is
order-to-laser, in minutes-saved order:
1. **Auto job folders + LightBurn launch**: ticket start creates a local
   folder (order number, customer file, resolved design CUT FILE from
   the library source map, ticket.txt with text/font/placement);
   "Start engraving" opens it in LightBurn.
2. **Print the ticket**: kitchen-style physical ticket at the machine,
   big type, one button from the rail.
3. **Menu-bar companion**: today's rail + badge on new order/message,
   click-through to the ticket. (Native Swift or Tauri; source in git.)
4. **Proof photo from phone to ticket**: snap, attach, send-proof in
   one more tap.
5. **Delivery run to Apple Maps** with stops pre-ordered.
These ride behind the web admin's API; the Mac layer stays thin.

## Non-negotiables

- Payments/webhook/checkout logic untouched; presentation only.
- Renovate, don't nuke: the repos, tables, and APIs stay; this is an
  experience rebuild on the same data. Migrations additive.
- D1 backup before every schema touch. Undo manifests for data moves.
- Voice: plain language, no jargon, buttons say what happens ("Send the
  proof", not "Update status"). No em-dashes. Cockpit dark theme stays.
- Verify with EYES: local admin login now works (.dev.vars); nothing
  ships without being seen at 390px and 1280px. The blind era is over.

## Execution order (each phase ships alone, Zach feels it same-day)

1. **The Ticket + Today.** Build the ticket component and the Today
   rail on existing data (orders + service_jobs unified read model).
   NEXT-action state machine. This alone kills most of amateur hour.
2. **New job wizard + auto-pricing service** (one pricing function the
   whole admin calls; quotes/invoices/tickets all use it).
3. **Rooms consolidation:** nav 14 -> 5, People merge (customer +
   thread), Money merge. Delete nothing; re-home everything.
4. **Proof + delivery wizards** (the daily-loop killers).
5. **Undo + autosave + search-everything + speed pass.**
6. **Polish to Squarespace-grade:** micro-states, empty states,
   keyboard flow, then a full phone-in-hand walkthrough test with Zach.

## Definition of done (run these as literal scenarios)

- Maria's coaster inquiry arrives -> Zach, on his phone, taps once into
  the message, once on "Make it a job," walks the wizard in under 60
  seconds, and a priced ticket with a drafted confirmation sits on the
  rail. He never saw a table.
- Thursday morning: Today shows 4 tickets in fire order, one amber. He
  knows his whole day in five seconds.
- A knife crew quote: quantities in, tier price auto-applied, quote
  emailed branded, follow-up scheduled. Zero arithmetic.
- End of week, Money answers "how did we do" in three numbers and one
  chart without a single click deeper.
- Grandma test: she processes a real order proof-to-delivered with no
  instruction beyond "tap the big button."
