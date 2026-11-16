# How a job gets done at VURMZ

Plain steps, start to finish. Written so a new helper could follow it
on day one. Keep it next to the machine.

The one rule: **every job is one card on the board** (the admin at
vurmz.com/admin). The card tells you what to do next. If something
is not on the board, it does not exist. Put it on the board first.

Steps marked (soon) are being built right now. Until then the step is
done by hand the way the note says.

---

## The seven stops

Every job goes through the same seven stops, in this order:

1. **It comes in.** Someone wants something.
2. **Price it.** Tell them what it costs.
3. **They say yes.** They approve the price and the look.
4. **Make it.** Engrave it.
5. **Check it.** Look it over, photograph it.
6. **Hand it over.** Deliver or pick up.
7. **Get paid.** Money is in the jar.

A job is finished only when all seven are done. The board will not
let a card fall off until then.

---

## Stop 1: It comes in

Jobs arrive five ways. Whatever way it came, the goal is the same:
one card on the board with the person's name, how to reach them,
and what they want.

**They bought it on the shop.**
Nothing to do. The card is already on the board. If they paid by
card, stops 2, 3, and 7 are already done too.

**They sent the photo form on the site, or the contact form.**
It shows up in Today as a new message card.
- Read it.
- Answer from the message itself: write the reply, tap "Attach a file"
  if you are sending artwork, a proof, or a PDF (up to 5 files, 10 MB),
  then "Send reply". It goes from VURMZ and their answer comes back to
  zach@vurmz.com. Never answer customers from any other mail account.
- Tap "Make a quote" on the card. (soon) Until then: open People,
  add them as a customer, then open Work and start a quote.
- If it is spam or not a job, tap "Not a job".

**They texted, called, or walked in.**
- Open Work, tap "New order".
- Fill in: name, phone or email, what they want, how many, which
  material, when they need it.
- If they sent a file (logo, design, photo), attach it to the card.
  Do not leave it in your texts.

**They reserved a piece from the shop (made to order).**
A quote card appears. Treat it like a text that came in.

**It is a standing business account (same thing every month).**
Open Work, tap "New order", and flip the "standing account" switch.
The price comes from their account, not the shop.

Checklist before leaving stop 1:
- [ ] Name
- [ ] A way to reach them
- [ ] What they want, how many, what it goes on
- [ ] When they need it
- [ ] Their file, if they have one, attached to the card

---

## Stop 2: Price it

- Open the card. Tap "Quote".
- The price fills in from the price list (lib/pricing on the site,
  PRICING.md in this folder). Do not make up a number. If the job
  is not on the list, use the closest thing and add a note.
- Business accounts get their tier price automatically.
- Add delivery if it is outside the normal area.
- Tap "Send quote". It goes to their email or you text it to them.
  Say what it costs and when they will have it. Nothing else.

If the quote is just a reserve for a shop piece, the price is the
shop price. Send it.

---

## Stop 3: They say yes

Two things have to be true: they agreed to the price, and they
agreed to the look.

**The price.**
- Card payment on the shop: done already.
- Everything else: when they say yes (text, email, in person), tap
  "Approved" on the card. The card moves to Confirmed.
- If the job is over $100 or they are new: tap "Send invoice" so
  there is a deposit or a bill on record before you cut anything.

**The look (the proof).**
- Tap "Request artwork" on the card. This makes a job folder on
  the Mac (vurmz-control/JOBS/<order number>) with the job spec and
  their file inside. (soon) Until then: make the folder by hand,
  copy their file into `source/`.
- Codex (the ChatGPT app) turns their file into a clean vector and
  a proof picture. You do not need to do this part. If Codex is not
  set up, do it in LightBurn yourself.
- Open `art/proof.png`. Is the spelling right? Is the size right?
  Is the logo the right way up? If anything is wrong, fix it before
  the customer sees it.
- Tap "Send proof". The card now says "Waiting on customer".
- When they say "looks good", tap "Proof approved".

Never cut without a proof approval on the card. Not even for a
friend. If they say "just do it, I trust you", tap "Proof approved"
yourself and write "customer waived proof" in the note.

---

## Stop 4: Make it

- Tap "Start". The card moves to In progress.
- Tap "Open in LightBurn". The cut file (`art/cut.lbrn2`) opens.
  (soon) Until then: open it from the job folder.
- Pull the blank from the shelf. The card says which material and
  finish. Count out the quantity.
- Set the blank, focus, run a test on scrap if it is a material you
  have not run this week.
- Run the job.

If a blank is ruined, do not throw it out quietly. Add a note on the
card ("1 spoiled") so inventory and cost stay right.

---

## Stop 5: Check it

- Look at every piece under good light. Spelling. Depth. Alignment.
  Fingerprints. Edges.
- Wipe it down. Package it the way the card says (box, bag, none).
- Take one photo of the finished piece. Tap "Add finished photo" on
  the card. (soon) Until then: save it into the job folder as
  `finished/photo.jpg`.
- Tap "Ready". The card moves to Ready. This is also the moment
  inventory counts the blanks as used.

If a piece fails the check, make it again. Do not deliver a piece
you would not want to keep.

---

## Stop 6: Hand it over

Two ways:

**Delivery.**
- Open Today, tap "Delivery run". Every Ready card with an address
  is on the list, in order.
- Deliver. At each stop, tap "Delivered" on that card.

**Pickup.**
- When they pick up, tap "Delivered".

Either way, the card moves to Delivered. If they still owe money,
the card stays on the board with a red "Unpaid" mark.

---

## Stop 7: Get paid

The goal is simple: every dollar lands in the money jar (the ledger
on the site). The card only leaves the board when it does.

- **Card on the shop:** already in the jar. Nothing to do.
- **Square tap or Square link:** Square tells the site on its own.
  Give it a minute. If the card still says Unpaid, open Money and
  tap "Sync Square now".
- **Cash or Venmo in hand:** tap "Paid in cash" on the card. Pick
  the method. That writes it to the jar.
- **Invoice:** when they pay, the site marks it. If they paid some
  other way, open the invoice and tap "Mark paid".

Never settle a job by just remembering you got paid. Tap the button.

If an invoice is more than two weeks late, the card shows "Overdue"
in Money. Send the reminder from there. Be polite and short.

---

## Every week (Monday, 20 minutes)

1. Open Today. Anything with a red mark gets handled first:
   unpaid, overdue, proof waiting more than three days.
2. Open Money. Tap "Add expense" for every receipt from the week:
   blanks, shipping, software, gas for deliveries. Photo the
   receipt. Then throw the paper receipt in the box.
3. Tap "Sync Square now". It also copies over every invoice you wrote
   in the Square app (they show as SQ-numbers), so what people owe you
   counts on Today and in Money even when the invoice never touched this
   site. Check that Square deposits to the bank match what Money shows.
   If not, the sync tells you which one.
4. On the Mac, run `npm run books` (or ask Claude: "refresh the books"),
   then tap "Download workbook" in Money. Skim the P&L tab. If a number looks wrong,
   it is a missing expense or a job that was not settled. Fix the
   card, not the spreadsheet.
5. Check inventory in Store. Reorder what is under two weeks of
   stock.

## Every month

- Open Store, look at the shop. Anything out of stock should be
  marked out of stock or made to order.
- Send the books to the accountant (Download workbook in Money, email it).

## Every year

- Run the books for the full year in January. That is the tax file.

---

## Things you never do

- Never type a price from memory. It comes from the price list.
- Never cut without "Proof approved" on the card.
- Never settle a job without tapping the button.
- Never edit the spreadsheet. Fix the card or the jar, then
  download the books again.
- Never charge a real card to "test" anything. Square is live.
- Never promise a date you have not checked against the board.
- Never say "premium", "elevate", "worth it", or compare VURMZ to
  other shops. Say what the thing is.

## Where things live

- The board: vurmz.com/admin (Today, Work, Store, People, Money)
- Job folders: `vurmz-control/JOBS/<order number>-<name>/`
- Price list: `vurmz-control/PRICING.md`
- Materials and blanks: Store room in the admin
- The design library: `vurmz-control/Art Library/`
- Square: squareup.com dashboard (deposits, disputes)
- How the system works under the hood: `vurmz-control/PIPELINE.md`

## If something breaks

- Site down: check status, then text Zach.
- A card will not move: it is telling you a step is missing (no
  proof, no payment). Read the card.
- Square not matching: Money, "Sync Square". If still off, note it
  on the card and text Zach.
- Codex did not produce artwork: do the proof in LightBurn yourself,
  save it into `art/` in the job folder, carry on.
