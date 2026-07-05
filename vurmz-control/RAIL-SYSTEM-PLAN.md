# The Rail: failsafe order and bookkeeping system (planned 2026-07-05)

Zach's spec, verbatim: a full order and bookkeeping system that basically
handles itself, through the rail, like a bump system. Pizza-dispatch
model with promise-date timing. Failsafe: NOTHING can get lost.

## Part 1: The invariants (what "nothing gets lost" means in code)

Every phase below is built to preserve these seven guarantees. Any
change that would violate one is wrong by definition.

**I1. One source of truth.** The order row in D1 (vurmz-core) is the
fact. Rail tickets, books, inventory moves, and invoices all derive from
it. Nothing is ever entered twice; nothing exists only in a UI.

**I2. Orders are never deleted.** Cancelled and refunded are states, not
removals. Every order that ever existed is queryable forever. The rail
shows every non-terminal order; there is no way for an open order to be
invisible.

**I3. Legal transitions only.** The status machine is enforced in one
place (lib/admin/next-action.ts is the read side; the PATCH route gets a
matching write-side guard). An order can never jump states or enter an
undefined one. The DB CHECK constraint (7 statuses) stays as the last
line of defense.

**I4. Bumps are idempotent.** Every bump carries the status it believes
the order is in (compare-and-swap). A double-tap, a bounced USB button,
or two open tabs cannot double-advance a ticket: the second write sees a
mismatch, does nothing, and refreshes the view. No side effect (books,
inventory) can fire twice for the same transition.

**I5. Money must settle before a ticket leaves the rail.** A delivered
order that is not paid does not disappear; it grows a COLLECT step and
stays visible until payment is recorded (Square webhook, invoice paid,
or an audited mark-cash). The rail being empty MEANS everything is made,
delivered, and paid.

**I6. Every transition is audit-logged** (already true for status and
proof). The books are reconstructable from the audit trail alone. New
side effects (inventory moves, payment marks, price overrides) each log
who, when, what, and the before/after.

**I7. One-step undo.** Mistakes with a big button are certain. Every
bump has a legal reverse transition available on the order page (not the
rail, to keep the rail one-button), audited, which also reverses that
step's side effects (restock what a ready-bump consumed, and so on).

## Part 2: The build, step by step (each phase ships and verifies alone)

### Phase A: The order wizard (entry from anywhere)

The gap: phone, walk-in, and Bark orders cannot enter the system today.

- `POST /api/admin/orders` (route exists with GET; add POST behind
  withAdminAuth). Zod body: customer (existing id OR new name/email/
  phone), lines (catalog line: productId/variantId/qty, OR custom line:
  name/qty/unitPriceCents), fulfillment method, business flag, payment
  expectation (already-paid-cash | invoice-later | collect-later), notes.
- Pricing is server-authoritative through the SAME path as public
  checkout: validateCart computes catalog lines (sale prices, pack math,
  business tiers), so admin orders can never disagree with web pricing.
  Price overrides are allowed (Zach is the merchant) but stored WITH the
  computed price in item metadata and audit-logged as an override (I6).
- Customer: upsertCustomerByEmail (exists). Walk-ins without email get a
  synthesized placeholder flagged in metadata so they still link to a
  customer record (I1); email can be filled in later.
- Order lands: channel 'admin', status 'new' (or 'confirmed' when
  payment = already-paid-cash, matching the no-'paid'-status model),
  metadata.payment = {expectation, markedBy, at}. Appears on the rail
  immediately as a normal ticket.
- Page `/admin/orders/new`: customer search-or-create, product picker
  with live computed prices, qty steppers, custom line rows, per-line
  engraving text+font, fulfillment, payment expectation, one Create
  button. Draft AUTOSAVES to localStorage on every change and restores
  on reload (nothing lost to a dropped phone call mid-entry).
- Verify: create an order each way locally (catalog, custom, override,
  walk-in no email, cash vs invoice-later), watch each land on the rail,
  bump one through its whole life.

### Phase B: Settlement on the rail (books that keep themselves)

- Payment state derives from three sources into one field the rail
  reads: Square payment (webhook, exists), linked invoice paid (exists
  in invoices), metadata.payment cash marks (new).
- nextAction() gains the collect gate: status delivered/picked-up AND
  not settled produces "Collect payment" as the ticket's one button,
  offering exactly two actions: Send invoice (auto-generates a draft
  invoice from the order's real items via the existing invoices repo,
  links invoice id into order metadata, sends with the existing branded
  email) or Mark paid cash (audited). Ticket leaves the rail only when
  settled (I5).
- Revenue page keys off settled orders + paid invoices (verify the
  existing queries agree with the new settlement definition; fix there,
  not with a second ledger).
- Verify: wizard order with invoice-later, bump to delivered, watch the
  collect step appear, send the invoice, mark it paid, watch the ticket
  leave and the revenue number move. Repeat with cash.

### Phase C: Bump hardening (the failsafe mechanics)

- PATCH gains compare-and-swap: body carries expectedStatus; a mismatch
  returns 409 with the current state and the UI silently refreshes (I4).
- Write-side transition guard: the PATCH validates the requested change
  is legal from the current state using the same table nextAction reads
  (I3). One shared transition map, two consumers.
- One-step undo on the order detail page: "Undo last step" computes the
  legal reverse, applies it CAS-style, audit-logs it as an undo (I7).
- Verify: hammer the same bump twice concurrently (curl race) and
  confirm single advance; attempt an illegal jump via curl and confirm
  409; undo a step and confirm the audit trail shows both moves.

### Phase D: Delivery runs (out for delivery)

- No schema change: a run is metadata (run id, startedAt) stamped onto
  ready tickets chosen for the run. The rail renders them as OUT FOR
  DELIVERY, grouped. Avoids touching the DB status CHECK; revisit a real
  status only if metadata proves limiting.
- "Start a run" on Today: pick ready tickets, one tap opens Apple Maps
  with the stops (address data already on orders), tickets flip to the
  run. Delivering each stop is the normal delivered bump (which may open
  the collect step per Phase B).
- Verify: two orders into a run, maps handoff link correct, bump both
  delivered, one cash one invoice.

### Phase E: Inventory as a side effect

- On the ready bump (the moment material is truly consumed), decrement
  linked inventory exactly once: item metadata gets inventoryApplied
  flag; the decrement is skipped if already applied (I4), reversed by
  undo (I7), audit-logged (I6).
- Requires product-to-inventory links; where none exists the bump does
  nothing (inventory is opt-in per product, never a blocker).
- Verify: bump to ready twice (CAS race), confirm single decrement;
  undo, confirm restock.

### Phase F: The bump bar

- Today page keydown listener (configurable key, default one a cheap
  USB HID button sends). Press = advance the TOP ticket's next action,
  through the same CAS PATCH as the on-screen button. A 1.5s on-screen
  confirmation flash names what just advanced, so a mis-bump is noticed
  and undoable.
- Patch-type actions only; link-type actions (send proof) flash "needs
  you" instead of navigating, so the button never opens UI mid-engraving.

## Part 3: Sequencing and safety rails for the build itself

1. Phases ship in order A, B, C, D, E, F; each is one deploy, verified
   locally with real clicks before it ships (390px first, per charter).
2. D1 backup before any migration; Phases A-D need NO schema migration
   (metadata-first design is deliberate); E may add an inventory-link
   column (backup + local-first migration).
3. No payment code paths are touched beyond reading settlement state;
   Square flows stay frozen (standing rule).
4. Every phase updates the charter's status line so the plan and the
   code never drift.

## Part 4: Reliability layer (added 2026-07-05; Zach's clarification:
## "strong and full of redundancy so I don't get errors")

**I8. Zach never sees a raw error while working.** Every failure either
retries itself to success, degrades to a queued retry with a calm
one-line note, or explains itself in plain words with a recovery action.
An error screen during production work is a bug by definition.

What this means concretely, layered from the metal up:

1. **Storage redundancy is already real and should be leaned on, not
   rebuilt.** Cloudflare D1 has built-in Time Travel (point-in-time
   restore of the whole database to any minute in the last 30 days) and
   R2 is 11-nines durable. Add to that our file backups before every
   migration. Action: document the Time Travel restore command in
   RUNBOOK.md and schedule an automatic weekly db:backup so the local
   file copies stop depending on memory.

2. **Bumps retry themselves.** The rail's PATCH calls get automatic
   retry with backoff (3 attempts) on network/5xx failures. Because
   bumps are CAS-idempotent (I4), retrying is always safe: the worst
   case is a no-op. While a retry is pending the ticket shows a quiet
   "saving..." state, never an alert.

3. **A pending-writes queue that survives refresh.** If retries exhaust
   (dead spot in the shop, Cloudflare hiccup), the bump is parked in
   localStorage and replayed on the next page load or connectivity
   return. The ticket shows "queued, will send itself" and the rail
   keeps working. Nothing requires Zach to remember to redo anything.

4. **Side effects never break the core.** Audit writes, email nudges,
   inventory moves: all wrapped fail-soft (audit already is). An order
   bump succeeds even if its side effect fails; failed side effects are
   recorded in order metadata as pending and re-applied by the next bump
   or page load (self-healing, not silent loss: I6 still holds).

5. **Optimistic UI with truth reconciliation.** The rail updates
   instantly on tap, then reconciles against the server response; a CAS
   conflict refreshes the ticket to reality with a one-line note. Fast
   in the hand, correct in the ledger.

6. **Errors page Zach only when they matter.** Sentry reportError is
   wired; verify coverage on all admin mutation routes. Repeated
   failures (a queue that will not drain) surface ONE plain-language
   banner on Today: "Something is not saving. Your work is safe and
   queued. Text Claude." Not a stack trace, ever.

7. **Scheduled smoke.** The existing /smoke health check runs on a
   weekly schedule and reports only on failure.

Build placement: items 2, 3, 5 land inside Phase C (bump hardening),
which becomes "Phase C: bump hardening and reliability." Items 1, 6, 7
are a half-day hygiene pass that can ship any time. Item 4 lands with
each side effect as its phase ships (B: settlement, E: inventory).
