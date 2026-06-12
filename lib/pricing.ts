// ═══════════════════════════════════════════
// VURMZ PRICING — SINGLE SOURCE OF TRUTH
// Two tiers: Signature (custom $35+) and Basic (stock packs & straightforward marking)
// Every price rendered on the site MUST import from this file.
// ═══════════════════════════════════════════

export const TIERS = {
  signature: {
    name: "Signature",
    tagline: "Custom work on your item",
    startingAt: 35, // locked 2026-06-11: $35 bring-your-own floor (was 50)
    unit: "per item",
    bullets: [
      "No setup fees",
      "Single items welcome",
      "Next-day turnaround",
      "Free hand-delivery in South Denver metro",
    ],
  },
  basic: {
    name: "Basic",
    tagline: "Stock items & straightforward marking",
    unit: "varies — see below",
  },
} as const

export const STOCK = {
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
  },
} as const

export const MARKING = {
  knife: {
    name: "Knife Marking",
    base: 25,
    unit: "per knife (bring your own)",
    // Crew ladder locked 2026-06-12: $8 full-kitchen rate is Zach's number;
    // $15 mid tier protects 4-9 knife jobs and tracks the mail-in market.
    crew: { minQty: 4, perKnife: 15 },
    fullKitchen: { minQty: 10, perKnife: 8 },
    options: [
      { label: "Name near handle (most common)", price: 25 },
      { label: "Crew rate (4+ knives)", price: 15, note: "per knife" },
      { label: "Full kitchen (10+ knives)", price: 8, note: "per knife" },
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
    note: "4-piece minimum for free delivery",
  },
} as const

export const TRADES = {
  serviceTags: {
    name: "Metal Service Tags",
    range: [30, 180] as const,
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
    note: "Custom design — quote",
  },
} as const

export const SOURCING = {
  label: "Concierge sourcing",
  fee: 25,
  description:
    "I'll find it, buy it, engrave it, and deliver it. $25 flat finder's fee + cost of item.",
} as const

export const DELIVERY = {
  freeThreshold: 100,
  area: "South Denver metro",
} as const

// ─── Legacy compatibility ───
// These re-exports match the old lib/products.ts shape so existing imports keep working
// while we migrate pages to the new structure.
export const SIGNATURE = {
  startingPrice: TIERS.signature.startingAt,
  description: TIERS.signature.tagline,
  includes: TIERS.signature.bullets,
} as const

export const BASIC = {
  pens: {
    name: STOCK.pens.name,
    packSize: STOCK.pens.pack,
    basePerItem: STOCK.pens.perItem[0],
    withLogo: 5,
    fullyLoaded: STOCK.pens.perItem[1],
    get basePackPrice() { return this.basePerItem * this.packSize },
    get logoPackPrice() { return this.withLogo * this.packSize },
    get fullyLoadedPackPrice() { return this.fullyLoaded * this.packSize },
    addOns: { secondLine: 0.5, logo: 2, bothSides: 2 },
    description: 'Metal stylus pens with your text or logo',
  },
  coasters: {
    name: STOCK.coasters.name,
    packSize: STOCK.coasters.pack,
    materials: { wood: 4, hardwood: 5, slate: 5, steel: 6 },
    get basePackPrice() { return this.materials.wood * this.packSize },
    description: 'Wood, slate, or steel with your logo',
  },
  keychains: {
    name: STOCK.keychains.name,
    packSize: STOCK.keychains.pack,
    materials: { acrylic: 3, wood: 4, metal: 4 },
    addOns: { sameOnBack: 2, differentOnBack: 3 },
    get basePackPrice() { return this.materials.metal * this.packSize },
    description: 'Metal, wood, or acrylic with your logo',
  },
  knives: {
    name: MARKING.knife.name,
    perKnife: MARKING.knife.base,
    addOns: { deepMark: 5, secondLine: 3 },
    description: 'Bring your own blade. Names near the handle, logos, custom text.',
  },
  cards: {
    name: 'Metal Business Cards',
    packSize: 10,
    matteBlackBase: 3,
    matteBlackLoaded: 6,
    stainlessBase: 15,
    stainlessLoaded: 18,
    addOns: { logo: 1, qrCode: 1, backSide: 1 },
    description: 'Anodized aluminum or stainless steel cards with your info engraved.',
  },
  tools: {
    name: MARKING.tool.name,
    perPiece: MARKING.tool.base,
    minimum: MARKING.tool.minimum,
    description: 'Names, IDs, or company info on power tools and equipment.',
  },
} as const

export const LEAVE_YOUR_MARK = {
  serviceTags: {
    name: TRADES.serviceTags.name,
    packSize: 10,
    matteBlackBase: 3,
    matteBlackLoaded: 6,
    stainlessBase: 15,
    stainlessLoaded: 18,
    addOns: { logo: 1, qrCode: 1, backSide: 1 },
    description: 'Credit card-sized metal tags with 3M adhesive backing.',
  },
  signatureTiles: {
    name: TRADES.signatureTiles.name,
    price: 15,
    description: 'Small engraved tile with your logo or mark.',
  },
} as const

// Format a dollar amount with always-two decimals.
const usd = (n: number) => `$${n.toFixed(2)}`
const usdMod = (n: number) => `+$${n.toFixed(2)}`

// ─── Pricing Page Cards ───

export const BASIC_PRICING_CARDS = [
  {
    category: STOCK.pens.name,
    packNote: `Pack of ${STOCK.pens.pack}`,
    packTotal: `${usd(STOCK.pens.packPrice[0])} – ${usd(STOCK.pens.packPrice[1])}`,
    items: [
      { name: 'Text only', price: usd(STOCK.pens.perItem[0]), note: '' },
      { name: '+ Logo', price: usdMod(2), note: '' },
      { name: '+ Second line', price: usdMod(0.5), note: '' },
      { name: '+ Both sides', price: usdMod(2), note: '' },
      { name: 'Fully loaded', price: usd(STOCK.pens.perItem[1]), note: '' },
    ],
  },
  {
    category: STOCK.coasters.name,
    packNote: `Pack of ${STOCK.coasters.pack}`,
    packTotal: `${usd(STOCK.coasters.packPrice[0])} – ${usd(STOCK.coasters.packPrice[1])}`,
    items: STOCK.coasters.materials.map(m => ({ name: m.label, price: usd(m.price), note: '' })),
  },
  {
    category: STOCK.keychains.name,
    packNote: `Pack of ${STOCK.keychains.pack}`,
    packTotal: `${usd(STOCK.keychains.packPrice[0])} – ${usd(STOCK.keychains.packPrice[1])}`,
    items: STOCK.keychains.materials.map(m => ({ name: m.label, price: usd(m.price), note: '' })),
  },
  {
    category: MARKING.knife.name,
    packNote: MARKING.knife.unit,
    packTotal: '',
    items: MARKING.knife.options.map(o => {
      const opt = o as { label: string; price: number | null; modifier?: boolean; note?: string }
      return {
        name: opt.label,
        price: opt.note === 'Free' ? 'Free' : opt.price == null ? '' : opt.modifier ? usdMod(opt.price) : usd(opt.price),
        note: opt.note || '',
      }
    }),
  },
  {
    category: MARKING.tool.name,
    packNote: `${MARKING.tool.minimum} piece minimum for free delivery`,
    packTotal: '',
    items: [
      { name: 'Name / ID marking', price: usd(MARKING.tool.base), note: '' },
    ],
  },
  {
    category: BASIC.cards.name,
    packNote: `Pack of ${BASIC.cards.packSize} · credit card sized`,
    packTotal: `${usd(BASIC.cards.matteBlackBase * BASIC.cards.packSize)} – ${usd(BASIC.cards.stainlessLoaded * BASIC.cards.packSize)}`,
    items: [
      { name: 'Anodized aluminum (text)', price: usd(BASIC.cards.matteBlackBase), note: '' },
      { name: '+ Logo / QR / back side', price: usdMod(BASIC.cards.addOns.logo), note: 'each' },
      { name: 'Stainless steel', price: usd(BASIC.cards.stainlessBase), note: '' },
      { name: 'Stainless fully loaded', price: usd(BASIC.cards.stainlessLoaded), note: '' },
    ],
  },
]

export const LEAVE_YOUR_MARK_CARDS = [
  {
    category: TRADES.serviceTags.name,
    packNote: 'Pack of 10 · credit card sized',
    packTotal: `${usd(TRADES.serviceTags.range[0])} – ${usd(TRADES.serviceTags.range[1])}`,
    items: [
      { name: 'Anodized aluminum (text)', price: usd(3), note: '' },
      { name: '+ Logo / QR / back', price: usdMod(1), note: '' },
      { name: 'Stainless steel', price: usd(15), note: '' },
      { name: '3M adhesive backing', price: 'Included', note: '' },
    ],
  },
  {
    category: TRADES.signatureTiles.name,
    packNote: 'Per tile',
    packTotal: '',
    items: [
      { name: 'Logo on tile', price: usd(15), note: 'Your logo, set into your work' },
      { name: 'Custom design', price: 'Quote', note: '' },
    ],
  },
]
