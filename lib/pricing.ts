// ═══════════════════════════════════════════
// VURMZ PRICING. SINGLE SOURCE OF TRUTH.
// Two customer lanes share one catalog: Individual (posted, no haggling)
// and Business (volume tiers on bulk items, NET-30 via the existing
// invoice_later fulfillment method). Every price rendered on the site
// MUST import from this file.
// ═══════════════════════════════════════════

export const SIGNATURE = {
  name: "Signature",
  tagline: "Custom work, made to order",
  startingAt: 35, // locked 2026-06-11: $35 bring-your-own floor (was 50)
  unit: "per item",
  bullets: [
    "No setup fees",
    "Single items welcome",
    "Next-day turnaround",
    "Free hand-delivery in South Denver metro",
  ],
} as const

export const CATALOG = {
  pens: {
    name: "Branded Pens",
    pack: 15,
    packPrice: [45, 112.5] as const,
    perItem: [3, 7.5] as const,
    options: [
      { label: "Text only", price: 3 },
      { label: "+ Logo", price: 2, modifier: true },
      { label: "+ Second line", price: 0.5, modifier: true },
      { label: "+ Both sides", price: null, note: "Fully loaded" },
    ],
  },
  coasters: {
    name: "Coasters",
    pack: 15,
    packPrice: [60, 90] as const,
    perItem: [4, 6] as const,
    materials: [
      { label: "Pine / Bamboo", price: 4 },
      { label: "Oak / Acacia", price: 5 },
      { label: "Natural Slate", price: 5 },
      { label: "Stainless Steel", price: 6 },
    ],
  },
  keychains: {
    name: "Keychains",
    pack: 15,
    packPrice: [45, 60] as const,
    perItem: [3, 4] as const,
    materials: [
      { label: "Acrylic", price: 3 },
      { label: "Wood", price: 4 },
      { label: "Metal", price: 4 },
    ],
    addOns: { sameOnBack: 2, differentOnBack: 3 },
  },
  cards: {
    name: "Metal Business Cards",
    pack: 10,
    // $2.50/card matches the approved July 2026 sheet's $25 pack of 10
    // (the D1 SKU). This was left at $3 in the sweep; fixed 2026-07-16.
    matteBlackBase: 2.5,
    matteBlackLoaded: 6,
    stainlessBase: 12,
    stainlessLoaded: 15,
    addOns: { logo: 1, qrCode: 1, backSide: 1 },
  },
  knife: {
    name: "Knife Marking",
    base: 20,
    unit: "per knife (bring your own)",
    // Repriced 2026-07-03 (approved sheet): $20/$12/$6 beats the mail-in
    // market's $35/$15/$7 without the two-way shipping or the two weeks.
    crew: { minQty: 4, perKnife: 12 },
    fullKitchen: { minQty: 10, perKnife: 6 },
    options: [
      { label: "Name near handle (most common)", price: 20 },
      { label: "Crew rate (4+ knives)", price: 12, note: "per knife" },
      { label: "Full kitchen (10+ knives)", price: 6, note: "per knife" },
      { label: "+ Deep marking", price: 5, modifier: true },
      { label: "+ Second line / logo", price: 3, modifier: true },
      { label: "Kitchen crew pickup (South Denver)", price: 0, note: "Free" },
    ],
  },
  tool: {
    name: "Tool Marking",
    base: 15,
    unit: "per tool",
    minimum: 4,
    // Jobsite ladder mirrors the knife crew ladder (the $8 deep rate is
    // Zach's number, locked 2026-06-12).
    crew: { minQty: 4, perPiece: 12 },
    jobsite: { minQty: 10, perPiece: 8 },
    note: "4-piece minimum for free delivery",
  },
  serviceTags: {
    name: "Metal Service Tags",
    // Top of range = 10 stainless fully loaded at $15/tag (the approved
    // stainlessLoaded rate). Was 180 from the pre-July stainless price.
    range: [30, 150] as const,
    options: [
      { label: "Anodized aluminum (text)" },
      { label: "+ Logo / QR / back", price: 1, modifier: true },
      { label: "Stainless steel" },
      { label: "3M adhesive backing", note: "Included" },
    ],
  },
  signatureTiles: {
    name: "Signature Tiles",
    unit: "per tile",
    note: "Custom design, quote",
  },
} as const

export const SOURCING = {
  label: "Concierge sourcing",
  fee: 25,
  description:
    "I'll find it, buy it, engrave it, and deliver it. $25 flat finder's fee plus the cost of the item.",
} as const

// Lowered $75 -> $50 in the July 2026 repricing (approved sheet): the
// cost of free delivery is time and gas, not money, and a lower bar makes
// the cart's free-delivery nudge attainable on a single item. Must match
// lib/checkout/fulfillment.ts (fee is $0 at subtotalCents >= threshold).
export const DELIVERY = {
  freeThreshold: 50,
  area: "South Denver metro",
} as const

// ─── Business / recurring lane ──────────────────────────────────────────
// Volume tiers apply to per-unit bulk items: pens, coasters, keychains,
// metal cards, service tags. Tiers are computed off EFFECTIVE UNIT COUNT,
// not cart quantity. For a pack SKU (e.g. pens pack of 15), effective
// units = qty (packs in cart) * packSize. Callers must do that
// multiplication before calling businessUnitPrice.
export const BUSINESS = {
  tiers: [
    { name: "Starter", minUnits: 15, maxUnits: 49, discount: 0 },
    { name: "Regular", minUnits: 50, maxUnits: 149, discount: 0.10 },
    { name: "Standing", minUnits: 150, maxUnits: 249, discount: 0.15 },
    // 250+ is exactly the order size the promo industry lives on; 20% off
    // with no setup fee and free delivery is the "frustrating" tier.
    { name: "Standing Plus", minUnits: 250, maxUnits: null, discount: 0.20 },
  ],
  // Any recurring or standing order qualifies for Standing-tier terms
  // (free delivery any size, NET-30) regardless of a single order's unit
  // count. Zach sets this when he tags a customer/order as recurring,
  // it is not derived from qty alone.
  freeDeliveryAnySize: true,
  netTermsDays: 30,
  // No setup or design fee. Screen printing and embroidery charge setup
  // because a physical plate or a digitized stitch file has a real
  // production cost per design. Fiber laser engraving has none, the
  // laser just runs a different file. There is no matching cost, so
  // there is not a fee for it.
  setupFee: 0,
} as const

/**
 * Per-unit price for a business or recurring order, in the same unit as
 * basePriceCents (cents in, cents out; whole dollars in, whole dollars
 * out, caller's choice, just be consistent).
 *
 * qty is EFFECTIVE UNITS, not cart line quantity. For pack SKUs, pass
 * qty * packSize.
 *
 * Below 15 units this returns the base price unchanged. The business
 * lane starts at the Starter floor; single-digit orders are priced at
 * the individual per-item rate.
 */
export function businessUnitPrice(basePriceCents: number, qty: number): number {
  const tier = businessTierFor(qty)
  const discount = tier ? tier.discount : 0
  return Math.round(basePriceCents * (1 - discount))
}

/** Which named tier a given effective unit count falls into, for display. */
export function businessTierFor(qty: number): (typeof BUSINESS.tiers)[number] | null {
  if (qty < BUSINESS.tiers[0].minUnits) return null
  return [...BUSINESS.tiers].reverse().find(t => qty >= t.minUnits) ?? null
}

// ─── Rush fee ────────────────────────────────────────────────────────────
// Documented rates, not yet wired into checkout automation. Zach quotes
// this manually via admin quotes/invoices for now.
export const RUSH = {
  nextBusinessDay: 25,
  sameDay: 35,
  unit: "flat, per order",
} as const

// ─── Sales tax ───────────────────────────────────────────────────────────
// orders.tax_cents and invoices.tax_cents exist in D1, and the admin
// invoice/quote APIs already accept taxCents for manual entry. Shop
// checkout does not compute tax and this file does not define a rate.
// Colorado sales tax is jurisdiction-specific (state, county, Centennial
// municipal, and any special district), and needs Zach plus an
// accountant to confirm before any automatic calculation ships. See
// vurmz-control/PRICING.md.

// Shared list of what a contact-form visitor can say they're interested
// in. Built from the catalog names so the option labels can't drift from
// the real product names, and used by both the form and the API route
// that validates submissions against it.
export const CONTACT_PRODUCT_OPTIONS = [
  `${CATALOG.pens.name} (pack)`,
  `${CATALOG.serviceTags.name} (pack)`,
  `${CATALOG.coasters.name} (pack)`,
  `${CATALOG.keychains.name} (pack)`,
  CATALOG.knife.name,
  CATALOG.tool.name,
  CATALOG.signatureTiles.name,
  `Custom Engraving ($${SIGNATURE.startingAt}+)`,
  "Business / Recurring Order",
  "Concierge Sourcing",
  "Other",
] as const

// Format a dollar amount with always-two decimals.
const usd = (n: number) => `$${n.toFixed(2)}`
const usdMod = (n: number) => `+$${n.toFixed(2)}`

// ─── Pricing page cards: Individual lane ────────────────────────────────

export const INDIVIDUAL_PRICING_CARDS = [
  {
    category: CATALOG.pens.name,
    packNote: `Pack of ${CATALOG.pens.pack}`,
    packTotal: `${usd(CATALOG.pens.packPrice[0])} – ${usd(CATALOG.pens.packPrice[1])}`,
    items: [
      { name: 'Text only', price: usd(CATALOG.pens.perItem[0]), note: '' },
      { name: '+ Logo', price: usdMod(2), note: '' },
      { name: '+ Second line', price: usdMod(0.5), note: '' },
      { name: '+ Both sides', price: usdMod(2), note: '' },
      { name: 'Fully loaded', price: usd(CATALOG.pens.perItem[1]), note: '' },
    ],
  },
  {
    category: CATALOG.coasters.name,
    packNote: `Pack of ${CATALOG.coasters.pack}`,
    packTotal: `${usd(CATALOG.coasters.packPrice[0])} – ${usd(CATALOG.coasters.packPrice[1])}`,
    items: CATALOG.coasters.materials.map(m => ({ name: m.label, price: usd(m.price), note: '' })),
  },
  {
    category: CATALOG.keychains.name,
    packNote: `Pack of ${CATALOG.keychains.pack}`,
    packTotal: `${usd(CATALOG.keychains.packPrice[0])} – ${usd(CATALOG.keychains.packPrice[1])}`,
    items: CATALOG.keychains.materials.map(m => ({ name: m.label, price: usd(m.price), note: '' })),
  },
  {
    category: CATALOG.knife.name,
    packNote: CATALOG.knife.unit,
    packTotal: '',
    items: CATALOG.knife.options.map(o => {
      const opt = o as { label: string; price: number | null; modifier?: boolean; note?: string }
      return {
        name: opt.label,
        price: opt.note === 'Free' ? 'Free' : opt.price == null ? '' : opt.modifier ? usdMod(opt.price) : usd(opt.price),
        note: opt.note || '',
      }
    }),
  },
  {
    category: CATALOG.tool.name,
    packNote: `${CATALOG.tool.minimum} piece minimum for free delivery`,
    packTotal: '',
    items: [
      { name: 'Name / ID marking', price: usd(CATALOG.tool.base), note: '' },
      { name: `Crew rate (${CATALOG.tool.crew.minQty}+ tools)`, price: usd(CATALOG.tool.crew.perPiece), note: 'per tool' },
      { name: `Jobsite rate (${CATALOG.tool.jobsite.minQty}+ tools)`, price: usd(CATALOG.tool.jobsite.perPiece), note: 'per tool' },
    ],
  },
  {
    category: CATALOG.cards.name,
    packNote: `Pack of ${CATALOG.cards.pack} · credit card sized`,
    packTotal: `${usd(CATALOG.cards.matteBlackBase * CATALOG.cards.pack)} – ${usd(CATALOG.cards.stainlessLoaded * CATALOG.cards.pack)}`,
    items: [
      { name: 'Anodized aluminum (text)', price: usd(CATALOG.cards.matteBlackBase), note: '' },
      { name: '+ Logo / QR / back side', price: usdMod(CATALOG.cards.addOns.logo), note: 'each' },
      { name: 'Stainless steel', price: usd(CATALOG.cards.stainlessBase), note: '' },
      { name: 'Stainless fully loaded', price: usd(CATALOG.cards.stainlessLoaded), note: '' },
    ],
  },
]

export const TRADES_PRICING_CARDS = [
  {
    category: CATALOG.serviceTags.name,
    packNote: 'Pack of 10 · credit card sized',
    packTotal: `${usd(CATALOG.serviceTags.range[0])} – ${usd(CATALOG.serviceTags.range[1])}`,
    items: [
      { name: 'Anodized aluminum (text)', price: usd(3), note: '' },
      { name: '+ Logo / QR / back', price: usdMod(1), note: '' },
      { name: 'Stainless steel', price: usd(CATALOG.cards.stainlessBase), note: '' },
      { name: '3M adhesive backing', price: 'Included', note: '' },
    ],
  },
  {
    category: CATALOG.signatureTiles.name,
    packNote: 'Per tile',
    packTotal: '',
    items: [
      { name: 'Logo on tile', price: usd(15), note: 'Your logo, set into your work' },
      { name: 'Custom design', price: 'Quote', note: '' },
    ],
  },
]

// ─── Pricing page cards: Business lane (new) ────────────────────────────
// Renders the 3-tier ladder on /services#business.
export const BUSINESS_TIER_CARDS = BUSINESS.tiers.map(t => ({
  name: t.name,
  range: t.maxUnits ? `${t.minUnits} to ${t.maxUnits} units` : `${t.minUnits}+ units`,
  discount: t.discount === 0 ? 'Standard bulk rate' : `${Math.round(t.discount * 100)}% off`,
  freeDelivery: t.name.startsWith('Standing'),
  netTerms: t.name.startsWith('Standing'),
}))
