// ═══════════════════════════════════════════
// VURMZ PRICING — SINGLE SOURCE OF TRUTH
// Two tiers: Basic (stock items + marking) and Signature (custom $50+)
// ═══════════════════════════════════════════

// ─── Signature Tier ───
// Custom work: bring your own item, one-of-a-kind, creative projects
export const SIGNATURE = {
  startingPrice: 50,
  description: 'Custom engraving on your item. One person, start to finish.',
  includes: [
    'No setup fees',
    'No minimums',
    'Next-day turnaround',
    'Free hand-to-hand delivery in the South Denver metro',
  ],
} as const

// ─── Basic Tier ───
// Stock items I keep on hand + straightforward marking services

export const BASIC = {
  pens: {
    name: 'Branded Pens',
    tier: 'basic' as const,
    packSize: 15,
    basePerItem: 3,
    withLogo: 5,
    fullyLoaded: 7.50,
    get basePackPrice() { return this.basePerItem * this.packSize },
    get logoPackPrice() { return this.withLogo * this.packSize },
    get fullyLoadedPackPrice() { return this.fullyLoaded * this.packSize },
    addOns: { secondLine: 0.50, logo: 2, bothSides: 2 },
    description: 'Metal stylus pens with your text or logo',
  },

  businessCards: {
    name: 'Metal Cards',
    tier: 'basic' as const,
    packSize: 10,
    matteBlackBase: 3,
    matteBlackLoaded: 6,
    stainlessBase: 15,
    stainlessLoaded: 18,
    addOns: { logo: 1, qrCode: 1, backSide: 1 },
    get basePackPrice() { return this.matteBlackBase * this.packSize },
    description: 'Business cards, membership tokens, VIP passes, loyalty cards — multiple colors available.',
  },

  coasters: {
    name: 'Coasters',
    tier: 'basic' as const,
    packSize: 15,
    materials: { wood: 4, hardwood: 5, slate: 5, steel: 6 },
    get basePackPrice() { return this.materials.wood * this.packSize },
    description: 'Wood, slate, or steel with your logo',
  },

  keychains: {
    name: 'Keychains',
    tier: 'basic' as const,
    packSize: 15,
    materials: { acrylic: 3, wood: 4, metal: 4 },
    addOns: { sameOnBack: 2, differentOnBack: 3 },
    get basePackPrice() { return this.materials.metal * this.packSize },
    description: 'Metal, wood, or acrylic with your logo',
  },

  knives: {
    name: 'Knife Marking',
    tier: 'basic' as const,
    perKnife: 25,
    addOns: { deepMark: 5, secondLine: 3 },
    description: 'Bring your own blade. Names near the handle, logos, custom text. I can pick up from a whole kitchen crew and return next day.',
    note: 'Per knife · bring your own blade',
  },

  tools: {
    name: 'Tool Marking',
    tier: 'basic' as const,
    perPiece: 15,
    minimum: 4,
    description: 'Names, IDs, or company info on power tools and equipment.',
    note: '4 piece minimum for free delivery',
  },
} as const

// ─── Pricing Page Data ───

export const BASIC_PRICING_CARDS = [
  {
    category: BASIC.pens.name,
    packNote: `Packs of ${BASIC.pens.packSize}`,
    items: [
      { name: 'Text only', price: `$${BASIC.pens.basePerItem}`, note: `$${BASIC.pens.basePackPrice}/pack` },
      { name: '+ Logo', price: `+$${BASIC.pens.addOns.logo}`, note: '' },
      { name: '+ Second line', price: `+$${BASIC.pens.addOns.secondLine}`, note: '' },
      { name: '+ Both sides', price: `+$${BASIC.pens.addOns.bothSides}`, note: '' },
      { name: 'Fully loaded', price: `$${BASIC.pens.fullyLoaded}`, note: `$${BASIC.pens.fullyLoadedPackPrice}/pack` },
    ],
  },
  {
    category: BASIC.businessCards.name,
    packNote: 'Packs of 10',
    items: [
      { name: 'Anodized aluminum (text)', price: `$${BASIC.businessCards.matteBlackBase}`, note: '$30/pack' },
      { name: '+ Logo / QR / back', price: '+$1 each', note: '' },
      { name: 'Stainless steel', price: `$${BASIC.businessCards.stainlessBase}`, note: '$150/pack' },
    ],
  },
  {
    category: BASIC.coasters.name,
    packNote: `Packs of ${BASIC.coasters.packSize}`,
    items: [
      { name: 'Pine / Bamboo', price: `$${BASIC.coasters.materials.wood}`, note: '' },
      { name: 'Oak / Acacia', price: `$${BASIC.coasters.materials.hardwood}`, note: '' },
      { name: 'Natural Slate', price: `$${BASIC.coasters.materials.slate}`, note: '' },
      { name: 'Stainless Steel', price: `$${BASIC.coasters.materials.steel}`, note: '' },
    ],
  },
  {
    category: BASIC.keychains.name,
    packNote: `Packs of ${BASIC.keychains.packSize}`,
    items: [
      { name: 'Acrylic', price: `$${BASIC.keychains.materials.acrylic}`, note: '' },
      { name: 'Wood', price: `$${BASIC.keychains.materials.wood}`, note: '' },
      { name: 'Metal', price: `$${BASIC.keychains.materials.metal}`, note: '' },
    ],
  },
  {
    category: BASIC.knives.name,
    packNote: 'Bring your own · per knife',
    items: [
      { name: 'Name near handle', price: '$25', note: 'Most common' },
      { name: '+ Deep marking', price: `+$${BASIC.knives.addOns.deepMark}`, note: '' },
      { name: '+ Second line / logo', price: `+$${BASIC.knives.addOns.secondLine}`, note: '' },
      { name: 'Kitchen crew pickup', price: 'Free', note: 'South Denver metro' },
    ],
  },
  {
    category: BASIC.tools.name,
    packNote: `$${BASIC.tools.perPiece}/piece · ${BASIC.tools.minimum} minimum`,
    items: [
      { name: 'Name / ID marking', price: `$${BASIC.tools.perPiece}`, note: 'Per piece' },
      { name: 'Free delivery', price: '4+ pieces', note: 'South Denver metro' },
    ],
  },
]
