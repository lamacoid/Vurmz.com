// ═══════════════════════════════════════════
// VURMZ PRICING — SINGLE SOURCE OF TRUTH
// Three lanes: Signature (custom $50+), Basic (stock packs), Leave Your Mark (tradespeople)
// ═══════════════════════════════════════════

// ─── Signature ───
export const SIGNATURE = {
  startingPrice: 50,
  description: 'Custom engraving on your item. One person, start to finish.',
  includes: [
    'No setup fees',
    'Single items welcome',
    'Next-day turnaround',
    'Free hand-to-hand delivery in the South Denver metro',
  ],
} as const

// ─── Basic ───
export const BASIC = {
  pens: {
    name: 'Branded Pens',
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

  coasters: {
    name: 'Coasters',
    packSize: 15,
    materials: { wood: 4, hardwood: 5, slate: 5, steel: 6 },
    get basePackPrice() { return this.materials.wood * this.packSize },
    description: 'Wood, slate, or steel with your logo',
  },

  keychains: {
    name: 'Keychains',
    packSize: 15,
    materials: { acrylic: 3, wood: 4, metal: 4 },
    addOns: { sameOnBack: 2, differentOnBack: 3 },
    get basePackPrice() { return this.materials.metal * this.packSize },
    description: 'Metal, wood, or acrylic with your logo',
  },

  knives: {
    name: 'Knife Marking',
    perKnife: 25,
    addOns: { deepMark: 5, secondLine: 3 },
    description: 'Bring your own blade. Names near the handle, logos, custom text. I can pick up from a whole kitchen crew and return next day.',
  },

  tools: {
    name: 'Tool Marking',
    perPiece: 15,
    minimum: 4,
    description: 'Names, IDs, or company info on power tools and equipment.',
  },
} as const

// ─── Leave Your Mark ───
export const LEAVE_YOUR_MARK = {
  serviceTags: {
    name: 'Metal Service Tags',
    packSize: 10,
    matteBlackBase: 3,
    matteBlackLoaded: 6,
    stainlessBase: 15,
    stainlessLoaded: 18,
    addOns: { logo: 1, qrCode: 1, backSide: 1 },
    description: 'Credit card-sized metal tags. Company info, service date, callback schedule. Stainless steel or anodized aluminum with 3M adhesive backing.',
  },

  signatureTiles: {
    name: 'Signature Tiles',
    price: 15,
    description: 'Small engraved tile with your logo or mark. Set into your finished work — floors, backsplashes, stonework. Like signing a painting.',
  },
} as const

// ─── Pricing Page Cards ───

export const BASIC_PRICING_CARDS = [
  {
    category: BASIC.pens.name,
    packNote: `Pack of ${BASIC.pens.packSize}`,
    packTotal: `$${BASIC.pens.basePackPrice} – $${BASIC.pens.fullyLoadedPackPrice}`,
    items: [
      { name: 'Text only', price: `$${BASIC.pens.basePerItem}`, note: '' },
      { name: '+ Logo', price: `+$${BASIC.pens.addOns.logo}`, note: '' },
      { name: '+ Second line', price: `+$${BASIC.pens.addOns.secondLine}`, note: '' },
      { name: '+ Both sides', price: `+$${BASIC.pens.addOns.bothSides}`, note: '' },
      { name: 'Fully loaded', price: `$${BASIC.pens.fullyLoaded}`, note: '' },
    ],
  },
  {
    category: BASIC.coasters.name,
    packNote: `Pack of ${BASIC.coasters.packSize}`,
    packTotal: `$${BASIC.coasters.materials.wood * BASIC.coasters.packSize} – $${BASIC.coasters.materials.steel * BASIC.coasters.packSize}`,
    items: [
      { name: 'Pine / Bamboo', price: `$${BASIC.coasters.materials.wood}`, note: '' },
      { name: 'Oak / Acacia', price: `$${BASIC.coasters.materials.hardwood}`, note: '' },
      { name: 'Natural Slate', price: `$${BASIC.coasters.materials.slate}`, note: '' },
      { name: 'Stainless Steel', price: `$${BASIC.coasters.materials.steel}`, note: '' },
    ],
  },
  {
    category: BASIC.keychains.name,
    packNote: `Pack of ${BASIC.keychains.packSize}`,
    packTotal: `$${BASIC.keychains.materials.acrylic * BASIC.keychains.packSize} – $${BASIC.keychains.materials.metal * BASIC.keychains.packSize}`,
    items: [
      { name: 'Acrylic', price: `$${BASIC.keychains.materials.acrylic}`, note: '' },
      { name: 'Wood', price: `$${BASIC.keychains.materials.wood}`, note: '' },
      { name: 'Metal', price: `$${BASIC.keychains.materials.metal}`, note: '' },
    ],
  },
  {
    category: BASIC.knives.name,
    packNote: 'Bring your own · per knife',
    packTotal: '',
    items: [
      { name: 'Name near handle', price: '$25', note: 'Most common' },
      { name: '+ Deep marking', price: `+$${BASIC.knives.addOns.deepMark}`, note: '' },
      { name: '+ Second line / logo', price: `+$${BASIC.knives.addOns.secondLine}`, note: '' },
      { name: 'Kitchen crew pickup', price: 'Free', note: 'South Denver metro' },
    ],
  },
  {
    category: BASIC.tools.name,
    packNote: `${BASIC.tools.minimum} piece minimum for free delivery`,
    packTotal: '',
    items: [
      { name: 'Name / ID marking', price: `$${BASIC.tools.perPiece}`, note: '' },
    ],
  },
]

export const LEAVE_YOUR_MARK_CARDS = [
  {
    category: LEAVE_YOUR_MARK.serviceTags.name,
    packNote: 'Pack of 10 · credit card sized',
    packTotal: `$${LEAVE_YOUR_MARK.serviceTags.matteBlackBase * LEAVE_YOUR_MARK.serviceTags.packSize} – $${LEAVE_YOUR_MARK.serviceTags.stainlessLoaded * LEAVE_YOUR_MARK.serviceTags.packSize}`,
    items: [
      { name: 'Anodized aluminum (text)', price: `$${LEAVE_YOUR_MARK.serviceTags.matteBlackBase}`, note: '' },
      { name: '+ Logo / QR / back', price: '+$1', note: '' },
      { name: 'Stainless steel', price: `$${LEAVE_YOUR_MARK.serviceTags.stainlessBase}`, note: '' },
      { name: '3M adhesive backing', price: 'Included', note: '' },
    ],
  },
  {
    category: LEAVE_YOUR_MARK.signatureTiles.name,
    packNote: 'Per tile',
    packTotal: '',
    items: [
      { name: 'Logo on tile', price: `$${LEAVE_YOUR_MARK.signatureTiles.price}`, note: 'Your logo, set into your work' },
      { name: 'Custom design', price: 'Quote', note: '' },
    ],
  },
]
