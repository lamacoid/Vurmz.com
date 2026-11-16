# The VURMZ pipeline: one order, start to finish, books that fill themselves

Written 2026-11-05 from Zach's ask: "an actual software workflow for
orders. It needs to auto fill a spreadsheet with everything I need for
bookkeeping and an order book. A simple to navigate UI to control and
manage my entire business. Integrate Square for billing." Plus: Claude
and Codex working the same pipeline, each at the station it is good at.

This builds on ADMIN-CHARTER.md (the kitchen rail, five rooms, one NEXT
button) and RAIL-SYSTEM-PLAN.md (the seven invariants). It does not
replace them. Read those first if you are new here.

One rule above all: **the order row in vurmz-core is the fact.** Tickets,
books, the spreadsheet, invoices, job folders, and the artwork station
all derive from it. Nothing is typed twice. Nothing lives only in a UI.

---

## 1. The shape of an order (the VURMZ-specific part)

Every piece of work, however it arrives, becomes ONE ticket and walks
the same seven stations. A ticket is an `orders` row. Service jobs and
quotes are not separate pipelines; they are doors into this one.

```
  ARRIVE      QUOTE       APPROVE      MAKE        CHECK      DELIVER     SETTLE
  (intake)    (price)     (proof)      (engrave)   (qa)       (hand off)  (money)
  ───────┬────────┬───────────┬───────────┬──────────┬───────────┬──────────┬──→ done
   new   │  new   │ confirmed │in_progress│  ready   │ delivered │ delivered│  off the rail
         │ +quote │  +proof   │           │          │           │ +settled │
```

Status values stay the seven the database already enforces
(`new, confirmed, in_progress, ready, delivered, cancelled, refunded`).
The stations in between (quote, proof, qa, settle) live in
`orders.metadata`, where proof and payment already do. No schema break.

### The doors (how work arrives)

| Door | Today | After |
|---|---|---|
| Shop checkout, paid by card | order `new` then `confirmed`, payment row | unchanged |
| Shop checkout, invoice later | order `new`, no invoice, chased by hand | invoice drafted automatically, ticket shows "Send invoice" |
| /engrave photo form, contact form | KV card, expires in 90 days, dead end | card gets one tap: "Make a quote". Customer upserted, quote drafted, photo attached to the quote |
| Text, walk-in, phone, Bark | admin order wizard | unchanged, plus the wizard can start from a quote |
| Reserve a piece | quote created | quote converts to an order (bug fixed, see 5) |
| Standing business account | manual | order wizard flag already exists; recurring is a later phase |

### The stations (what each one means and who works it)

| Station | Ticket state | Gate to pass | Worked by |
|---|---|---|---|
| ARRIVE | `new` | customer known, what they want captured | Claude (inbox triage), Zach |
| QUOTE | `new` + quote | price computed from lib/pricing, tier applied, sent | Claude drafts, Zach taps send |
| APPROVE | `confirmed` + proof needed/sent/approved | customer said yes to the proof | **Codex makes the proof**, Zach sends it |
| MAKE | `in_progress` | job folder exists, cut file open in LightBurn | **Codex preps vectors + .lbrn2**, Zach engraves |
| CHECK | `ready` | inventory deducted (exists), finished photo in the job folder | Zach |
| DELIVER | `delivered` | delivery run (exists) or pickup | Zach |
| SETTLE | `delivered` + settled | money recorded in the ledger (card, cash, invoice, Square) | Square webhook, Zach's cash tap |

A ticket leaves the rail only when it is made, delivered, and paid.
That is the existing I5 invariant and it stays.

### The two agents

- **Claude** (this session, Claude Code): the site, the database, the
  admin, money, books, inbox triage, quotes, copy. Anything on
  vurmz.com or in D1 goes through Claude.
- **Codex** (ChatGPT desktop + `codex` CLI): artwork. Customer file in,
  clean one-tone vector out, dimensioned proof, `.lbrn2` saved into the
  job folder and the Design Library. Codex never touches the site or
  the database; it reads and writes job folders only.
- **The handoff is a folder, not a conversation.** Each ticket gets
  `vurmz-control/JOBS/<order-number>-<slug>/` with a `ticket.md` (the
  spec, written by Claude from the order row) and an `ART-REQUEST.md`
  for Codex. Codex writes into `art/` and appends to `HANDOFF.md`.
  Claude reads `art/` back, attaches the proof to the order, and
  advances the ticket. Either agent can be swapped out without the
  other noticing, because the contract is files.

```
JOBS/VZ-1042-thunderridge-tumblers/
  ticket.md          who / what / with / when / worth, from the order row
  ART-REQUEST.md     what Codex should produce, sizes, material, marks
  HANDOFF.md         append-only log: who did what, when
  source/            customer's original files (pulled from R2)
  art/               Codex output: vector.svg, proof.png, cut.lbrn2
  finished/          Zach's photo of the finished piece
```

---

## 2. Money: one ledger, then the books

The audit found money settling by three paths with no common record:
card payments (a `payments` row), cash taps (a flag in metadata), and
"mark invoice paid" (a status change). Revenue only sees the first.

### The ledger (new table, additive migration)

`ledger` is the one place every dollar in or out lands. Append only.

| column | meaning |
|---|---|
| id, occurred_at | when the money moved |
| kind | `sale`, `refund`, `fee`, `payout`, `expense`, `adjustment` |
| amount_cents | positive in, negative out |
| method | `card`, `cash`, `invoice`, `square_invoice`, `other` |
| order_id, invoice_id, payment_id, customer_id | links, nullable |
| category | books category: `engraving`, `materials`, `delivery`, `software`, `equipment`, `fees`, `tax`, ... |
| tax_cents | sales tax collected on this line, when known |
| source | `checkout`, `admin_cash`, `invoice_paid`, `square_webhook`, `square_sync`, `manual` |
| external_id | Square payment, payout, or refund id; unique when present |
| note, created_by | |

Every settle path writes one ledger row, inside the same request:
checkout card charge, cash tap, invoice marked paid, Square webhook.
Backfill once from existing `payments`, settled orders, and paid
invoices. Revenue and Money read the ledger from then on.

### Expenses (the other half of the books)

A one-screen form in Money: date, amount, category, note, optional
photo of the receipt (R2). Writes a `ledger` row of kind `expense`.
Materials already have `cost_cents`; when an order moves to `ready`
and inventory is deducted, a `cost of goods` line is written
automatically from the material cost. Zach never does arithmetic.

### Square, fully wired

1. **Webhook signature key** set as a Pages secret so Square events
   stop being rejected. (Needs the key from the Square developer
   dashboard, Zach's account.)
2. Webhook handles `payment.*` for orders as well as invoices
   (`reference_id` is an order id or an invoice id; look up both).
3. Webhook handles `refund.*` and `payout.*` so refunds, fees, and
   deposits to the bank land in the ledger on their own.
4. **Square sync** (admin button + weekly scheduled run): pulls
   payments, refunds, and payouts since the last sync through the
   Square API and reconciles against the ledger by `external_id`.
   Catches anything the webhook missed. Idempotent.
5. **Square Invoices** (phase 3): send invoices through Square so the
   customer pays on Square's page and the webhook closes the loop.
   Today's Resend email + site pay page stays as the default until
   then; nothing breaks either way.

### The books (the spreadsheet)

The charter said "no spreadsheet, ever" and meant: Zach never
maintains one. He still needs one to hand an accountant and to see
the whole year at a glance. So the spreadsheet is **generated, never
edited**. The ledger is the truth; the workbook is a view of it.

`npm run books` builds `VURMZ Books <year>.xlsx` from the live
database, with these tabs:

| tab | one row per |
|---|---|
| Order book | order: number, date, customer, what, qty, subtotal, tax, delivery, total, status, paid on, method |
| Income | ledger sale/refund line |
| Expenses | ledger expense line, with category |
| Square | payouts and fees, reconciled |
| Customers | customer: lifetime value, order count, last order (computed here, and written back to `customers` so the admin stops showing 0) |
| Sales tax | month: taxable sales, tax collected, by jurisdiction once rates are confirmed |
| P&L | month: income, cost of goods, expenses, net |

Delivery: a "Download books" button in Money (xlsx from the worker),
and a weekly scheduled task that uploads the same workbook to Zach's
Google Drive as a Google Sheet (so it opens on the phone). On demand:
"Claude, refresh the books."

Sales tax rates are NOT invented. The column exists and fills with
whatever was charged (zero today). Wiring real Colorado rates into
checkout stays Playbook item 1 and needs the accountant's number.

---

## 3. The UI: five rooms, as the charter says

Nav goes from 15 items to 5 plus a gear. Every existing page keeps
working under its old URL; this is a re-grouping, not a rebuild.

| room | what is in it | today's pages that fold in |
|---|---|---|
| **Today** | the rail, three numbers, decision cards (new message, new order, overdue invoice) | dashboard (exists) + inbox cards |
| **Work** | every ticket, any state, kanban on desktop and list on phone; the delivery run; job folder + "Open in LightBurn" (Mac only) | orders, service-jobs, quotes |
| **Store** | listings, photos, prices, inventory, materials, designs | products, inventory, materials, designs |
| **People** | one page per person: thread, orders, money | customers, inbox, messages |
| **Money** | owed, earned, expenses, Square, books download, invoices | invoices, revenue, export |
| gear | pages, media, theme, navigation, settings, analytics | content/*, analytics |

Removed: the legacy `/admin/jobs` page and its API (orphaned, writes
to a different database). Service jobs stop being a separate list;
they are tickets of channel `service`.

Fixes that ride along: inbox cards become customers and quotes in one
tap; quote convert creates an order (not just an invoice); invoice
"send" reports failure when the email key is missing; invoices go
`overdue` on their own; `customers` stats stop reading 0; badges on
nav actually count.

---

## 4. Build order (each phase ships and verifies on its own)

**Phase 1: Money truth and the books.** Ledger migration + backfill,
every settle path writes it, Square webhook key + order payments +
refunds + payouts, Square sync, expenses form, `npm run books` with the
seven tabs, Money room reads the ledger. Verify: every test order on
prod reconciles to the cent between the board, Money, and the workbook.

**Phase 2: The Now corner, then one door, one rail.**

*The Now corner* (Zach, 2026-11-06: "an urgent corner where the next
step is stated. Do nothing else until it is done. A bump system, like a
kitchen display"). Same spot on every admin page, one card, one
sentence, one button. It is the single most urgent next action across
the whole business, drawn from one ordered queue; bumping it (doing it)
slides the next one in. Ranking: money collectable now, then a proof a
customer is waiting on, then a job due today, then a new message, then
a late order. Each card carries the reason and the clock. Bump means
done, not seen: the button performs the step. The only other option is
"park until <time>", and it comes back. Nothing is dismissed into
nowhere. On the phone the corner is the whole screen until it is empty,
then "Nothing urgent. Board is clear." The rest of the page is dimmed
while the corner has a card. This is built first because it does the
most for Zach (see memory: ADHD, design for it).

*The pizza line* (Zach, 2026-11-06: orders should run through the shop
almost identically to how Pizza Hut does). The seven stations already
match register, make line, oven, cut table, dispatch, driver. What we
take from it: (1) clocks on every card: time at this station and time
to promise, with a target per station. Zach approved these defaults
2026-11-06 (they live in one place in code, lib/admin/targets.ts, so
they can be tuned without touching the board):
  quote sent      4 hr from arrival
  proof sent     24 hr from the customer's yes
  made           48 hr from proof approval
  delivered      24 hr from ready
  paid           by delivery; an invoice is overdue at 14 days
Green under 70% of target, yellow to 100%, red past it; the reds feed
the Now corner. (2) A real promise time on every order, set
at arrival from the lane (24/48/72 hr), shown to the customer. (3) One
card, a different face per station: the make view shows cut file and
material, the dispatch view shows address and phone, never everything
at once. The Work room orders by promise time, oldest first.

Then: inbox card to quote in one tap, quote to order, invoice_later
auto-drafts, service jobs fold into tickets, legacy jobs removed, nav to
five rooms, customer stats, overdue sweep. Verify: a fake /engrave
submission walks every station locally, and the Now corner names the
right next step at each one.

**Phase 3: The shop floor.** Job folder script, `ART-REQUEST.md`
contract, `codex exec` wrapper (needs `codex login` once), proof
attach from `art/`, "Open in LightBurn", finished photo into the
folder. Verify: one real job (the stainless oil tags) end to end.

**Phase 4: Polish.** Square Invoices, recurring standing orders,
Google Sheet upload on schedule, and the **receipt card**: Zach's call
(2026-11-06) is that every delivery ticket and receipt is an engraved
anodized aluminum card, not paper. A "Receipt card" button on a Ready
ticket generates the cut file from the order row (VURMZ mark, order
number, date, what, total, QR to the customer's account page), deducts
one anodized blank from inventory, and the card goes in the box. Every
delivery then carries a sample of the work. Codex lays out the card.

Rules while building: migrations additive only; `npm run db:backup`
before any remote write; nothing deployed without Zach's go; no
em-dashes; copy in the house voice.

---

## 5. What Zach has to do (nobody else can)

1. `codex login` in Terminal (opens a browser sign-in). Unblocks the
   artwork station.
2. Square developer dashboard: create the webhook subscription for
   `https://www.vurmz.com/api/webhooks/square/` (payment, refund,
   payout events) and hand over the signature key. I can walk you
   through it on screen.
3. `sudo xcodebuild -license` once, so plain git and python work.
4. Decide the Google Drive folder the books should land in (or let me
   make "VURMZ Books" at the top level).
5. Later: the real Colorado sales tax rate from an accountant.

---

## 6. The training manual

The plain-language version of all of this, written for a helper on
day one, is `HOW-A-JOB-GETS-DONE.md` in this folder. Keep the two in
step: when a station or button changes here, change it there.

---

## 7. Second opinion (GPT-6.1, 2026-11-06) and what changed

Claude pasted this design into ChatGPT and asked for blunt notes.
Eleven came back. Taken, with the change each one made:

1. **Money movement is not accounting.** Sales tax is a liability,
   payouts are transfers, and an auto COGS line double-counts materials
   already expensed when bought. Change: the books are **cash basis**.
   Ledger kinds are `sale`, `refund`, `expense`, `fee`, `payout`,
   `adjustment`; `payout` is a transfer and never counts as income;
   tax collected is its own column and its own tab; the automatic
   cost-of-goods line is dropped (materials are an expense when bought).
2. **"Same request" is not atomic.** Square can charge while the D1
   write fails. Change: one `settle()` function is the only writer;
   every ledger row carries a unique `posting_key`
   (`square:<payment_id>`, `cash:<order_id>:<n>`, `invoice:<id>`), so
   a retry is a no-op; checkout stores the Square idempotency key on
   the order before charging and reuses it.
3. **Webhook failure design.** Square retries for 24h, sends dupes,
   and does not order events. Change: persist the raw event first
   (exists), return 200 on a duplicate, process only `COMPLETED`
   payments and `COMPLETED` refunds, never regress a newer state.
4. **Reconciliation.** "Since last sync" misses late-changing objects.
   Change: sync windows overlap by 7 days, paginate with Square
   cursors, checkpoint only after success, and unmatched money lands
   in an **exceptions list** in Money instead of being guessed.
5. **Real shop money is messy.** Deposits, partial payments, partial
   refunds, split tenders. Change: `settled` is no longer a flag. It
   is **derived**: sum of ledger for the order >= order total. Partial
   shows as "owes $X". Refunds never erase delivery history.
6. **Backfill carefully.** Change: backfill is a dry-run script that
   prints before/after totals, writes with posting keys so it is
   restartable, and runs on local first.
7. **D1 limits.** Bounded queries, indexes on `ledger(order_id)`,
   `ledger(occurred_at)`, `ledger(posting_key)`; use `batch()` for
   multi-row writes.
8. **Do not build xlsx in the worker.** next-on-pages is deprecated;
   Workers have CPU and memory limits. Change: `npm run books` runs on
   the Mac (or a scheduled Claude task), uploads the workbook to R2 and
   Drive, and Money shows "Books, updated <date>" with a link. The
   worker never generates a spreadsheet. Pages to Workers migration is
   noted as its own task, not part of this.
9. **Tax and workbook hygiene.** Change: orders carry
   `tax_status` (`none`, `collected`, `exempt`) so zero means
   something; customer stats are computed into `customers`, not only
   in the export; every text cell is escaped for formula injection.
10. **Folder contract is thin.** Change (phase 3): each job folder
    also gets `job.json` (order id, spec revision, dimensions, units,
    material, file hashes, state). R2 is the durable copy; the Mac
    folder is a working copy. `.lbrn2` from Codex is reviewed in
    LightBurn before it is treated as ready.
11. **Tests before polish.** Change: phase 1 includes tests for
    duplicate webhook, out-of-order webhook, charge-then-DB-failure,
    partial refund, and double cash tap.

Not taken: Workers migration now (separate task), Square Invoices
before phase 4, splitting the ledger into a full double-entry book
(cash basis is enough for a shop this size; the accountant can post
from the tabs).

---

## 8. Phase 1 status (2026-11-06)

Built locally, verified locally, NOT deployed, NOT committed:

- `lib/db/migrations/0032_ledger.sql` (ledger table, `orders.tax_status`)
- `lib/money/ledger.ts` (post, posting keys, SETTLED_SQL, summaries)
- `lib/money/settle.ts` (one function per settle path, all idempotent)
- Checkout card, cash tap, mark-invoice-paid, customer invoice pay, and
  the Square webhook all write the ledger. Dashboard, order page, and
  revenue read it. `settleOrderCash` is gone.
- Webhook handles payment, refund, and payout events; dedupes on event
  id; retries only after a recorded failure.
- `lib/payments/square-sync.ts` + `POST /api/admin/square/sync`
  (overlapping 7-day window, cursor paging, checkpoint on success).
- `GET/POST /api/admin/ledger` (summary, lines, expenses, adjustments).
- Money room at `/admin/revenue` (nav label "Money").
- `npm run books` (scripts/books.ts, exceljs) writes
  `vurmz-control/BOOKS/VURMZ Books <year>.xlsx`, uploads to R2 `books/`,
  records `site_settings.books_last`, writes customer stats back.
  `GET /api/admin/books` serves it.
- `npm run ledger:backfill -- --local|--remote [--dry]`.

Tests run on local (all pass): double cash tap posts once; duplicate
webhook event deduped; out-of-order PENDING after COMPLETED ignored;
same payment on a new event id posts once; bad signature 401; partial
refund delivered twice posts once and does not un-settle the order;
payout posts as a transfer; double expense submit posts once.

To ship (in this order, each on Zach's go):
1. `npm run db:backup`, then `npm run db:migrate:remote`.
2. `npm run ledger:backfill -- --remote --dry`, read it, then without
   `--dry`.
3. Deploy. (Before the backfill runs on prod, delivered-paid orders
   would show as unpaid under the new rule. Migrate and backfill first.)
4. Set `SQUARE_WEBHOOK_SIGNATURE_KEY` as a Pages secret and the webhook
   subscription in Square (payment.*, refund.*, payout.*).
5. `npm run books` once, then weekly.

Not in phase 1: a scheduled Square sync (Pages has no cron; the Monday
checklist covers it until a Worker cron exists), the Google Sheet upload.
