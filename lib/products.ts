// SINGLE SOURCE OF TRUTH FOR ALL PRODUCT PRICING
// All pages must import from here - no hardcoded prices anywhere else

export const PRODUCTS = {
  pens: {
    name: 'Branded Pens',
    packSize: 15,
    basePerItem: 3,      // 1 line of text
    withLogo: 5,         // base + logo ($2)
    fullyLoaded: 7.50,   // logo + 2nd line + both sides
    get basePackPrice() { return this.basePerItem * this.packSize },      // $45
    get logoPackPrice() { return this.withLogo * this.packSize },         // $75
    get fullyLoadedPackPrice() { return this.fullyLoaded * this.packSize }, // $112.50
    addOns: {
      secondLine: 0.50,
      logo: 2,
      bothSides: 2,
    },
    displayPrice: '$45/15',           // Starting price for display
    displayPriceWithLogo: '$75/15',   // Common config price
    description: 'Metal stylus pens with your text or logo',
  },

  businessCards: {
    name: 'Metal Business Cards',
    packSize: 10,
    matteBlackBase: 3,    // Text only
    matteBlackLoaded: 6,  // Text + logo + QR + back
    stainlessBase: 15,    // Premium material
    stainlessLoaded: 18,  // Premium fully loaded
    addOns: {
      logo: 1,
      qrCode: 1,
      backSide: 1,
    },
    get basePackPrice() { return this.matteBlackBase * this.packSize }, // $30
    displayPrice: '$30/10',
    description: 'Anodized aluminum or stainless steel',
  },

  coasters: {
    name: 'Coasters',
    packSize: 15,
    materials: {
      wood: 4,      // Pine, bamboo
      hardwood: 5,  // Oak, acacia
      slate: 5,
      steel: 6,     // Silver or gold
    },
    get basePackPrice() { return this.materials.wood * this.packSize }, // $60
    displayPrice: '$60/15',
    description: 'Wood, slate, or steel with your logo',
  },

  keychains: {
    name: 'Keychains',
    packSize: 15,
    materials: {
      acrylic: 3,
      wood: 4,
      metal: 4,
    },
    addOns: {
      sameOnBack: 2,
      differentOnBack: 3,
    },
    get basePackPrice() { return this.materials.metal * this.packSize }, // $60
    displayPrice: '$60/15',
    description: 'Metal or wood with your logo',
  },

  namePlates: {
    name: 'Name Plates',
    packSize: 5,
    sizes: {
      standard: 6,    // 3" x 1"
      large: 7.50,    // 3.5" x 1.5"
      executive: 9,   // 3.5" x 2"
      desk2x8: 8,     // 2" x 8" desk plate
      desk2x10: 10,   // 2" x 10" desk plate
    },
    attachments: {
      pin: 0,
      clip: 1,
      magnetic: 2,
    },
    get basePackPrice() { return this.sizes.standard * this.packSize }, // $30
    displayPrice: 'from $6/plate',
    description: 'Desk or door name plates',
  },

  knives: {
    name: 'Knife Engraving',
    packSize: 1, // Individual
    base: 15,
    addOns: {
      deepMark: 5,
      secondLine: 3,
    },
    fullyLoaded: 23,
    displayPrice: 'from $15',
    description: 'Chef knives, pocket knives, any blade',
  },

  tools: {
    name: 'Tool Marking',
    packSize: 1,
    base: 10,
    displayPrice: 'from $10',
    description: 'Power tools and equipment marking',
  },

  industrialLabels: {
    name: 'Industrial Labels',
    packSize: 1,
    equipmentNameplates: { min: 8, max: 15 },
    arcFlashLabels: { min: 12, max: 20 },
    valveTags: { min: 5, max: 10 },
    volumeDiscounts: {
      '10+': 0.05,
      '25+': 0.10,
      '50+': 0.15,
      '100+': 0.20,
    },
    displayPrice: 'Quote',
    description: 'Equipment nameplates, arc flash, valve tags',
  },
} as const

// Helper to format pack price display
export function formatPackPrice(product: keyof typeof PRODUCTS): string {
  const p = PRODUCTS[product]
  if ('basePackPrice' in p && typeof p.basePackPrice === 'number') {
    return `$${p.basePackPrice}/${p.packSize}`
  }
  return p.displayPrice
}

// Products displayed on homepage
export const HOMEPAGE_PRODUCTS = [
  {
    name: PRODUCTS.pens.name,
    price: PRODUCTS.pens.displayPriceWithLogo,  // $75/15 with logo
    note: 'With logo'
  },
  {
    name: PRODUCTS.businessCards.name,
    price: PRODUCTS.businessCards.displayPrice,
    note: 'Pack of 10'
  },
  {
    name: PRODUCTS.coasters.name,
    price: PRODUCTS.coasters.displayPrice,
    note: 'Wood, slate, steel'
  },
  {
    name: PRODUCTS.namePlates.name,
    price: PRODUCTS.namePlates.displayPrice,
    note: 'Desk or door'
  },
  {
    name: PRODUCTS.knives.name,
    price: PRODUCTS.knives.displayPrice,
    note: 'Any blade'
  },
  {
    name: PRODUCTS.keychains.name,
    price: PRODUCTS.keychains.displayPrice,
    note: 'Metal or wood'
  },
]

// Services page list
export const SERVICES_LIST = [
  {
    name: PRODUCTS.pens.name,
    price: PRODUCTS.pens.displayPrice,  // $45/15 base
    description: PRODUCTS.pens.description,
    note: 'Add logo +$2/pen',
  },
  {
    name: PRODUCTS.businessCards.name,
    price: PRODUCTS.businessCards.displayPrice,
    description: PRODUCTS.businessCards.description,
  },
  {
    name: PRODUCTS.tools.name,
    price: PRODUCTS.tools.displayPrice,
    description: PRODUCTS.tools.description,
  },
  {
    name: PRODUCTS.knives.name,
    price: PRODUCTS.knives.displayPrice,
    description: PRODUCTS.knives.description,
  },
  {
    name: `${PRODUCTS.coasters.name} & ${PRODUCTS.keychains.name}`,
    price: PRODUCTS.coasters.displayPrice,
    description: 'Your logo on useful items',
  },
  {
    name: PRODUCTS.industrialLabels.name,
    price: PRODUCTS.industrialLabels.displayPrice,
    description: PRODUCTS.industrialLabels.description,
  },
]

// Pricing page detailed breakdown
export const PRICING_DETAILS = {
  pens: {
    category: PRODUCTS.pens.name,
    packNote: `Sold in packs of ${PRODUCTS.pens.packSize}`,
    items: [
      { name: 'Base pen (text only)', price: `$${PRODUCTS.pens.basePerItem}`, note: `= $${PRODUCTS.pens.basePackPrice}/pack` },
      { name: '+ Second line', price: `+$${PRODUCTS.pens.addOns.secondLine}`, note: '' },
      { name: '+ Logo', price: `+$${PRODUCTS.pens.addOns.logo}`, note: '' },
      { name: '+ Both sides', price: `+$${PRODUCTS.pens.addOns.bothSides}`, note: '' },
      { name: 'Fully loaded (logo + 2nd line + both sides)', price: `$${PRODUCTS.pens.fullyLoaded}`, note: `= $${PRODUCTS.pens.fullyLoadedPackPrice}/pack` },
    ],
  },
  businessCards: {
    category: PRODUCTS.businessCards.name,
    packNote: `Sold in packs of 10`,
    items: [
      { name: 'Matte Black (text only)', price: `$${PRODUCTS.businessCards.matteBlackBase}`, note: `= $30/pack` },
      { name: '+ Logo', price: `+$${PRODUCTS.businessCards.addOns.logo}`, note: '' },
      { name: '+ QR Code', price: `+$${PRODUCTS.businessCards.addOns.qrCode}`, note: '' },
      { name: '+ Back side', price: `+$${PRODUCTS.businessCards.addOns.backSide}`, note: '' },
      { name: 'Stainless Steel', price: `$${PRODUCTS.businessCards.stainlessBase}`, note: `= $150/pack` },
    ],
  },
  coasters: {
    category: PRODUCTS.coasters.name,
    packNote: `Sold in packs of ${PRODUCTS.coasters.packSize}`,
    items: [
      { name: 'Pine / Bamboo', price: `$${PRODUCTS.coasters.materials.wood}`, note: '' },
      { name: 'Oak / Acacia', price: `$${PRODUCTS.coasters.materials.hardwood}`, note: '' },
      { name: 'Natural Slate', price: `$${PRODUCTS.coasters.materials.slate}`, note: '' },
      { name: 'Stainless Steel', price: `$${PRODUCTS.coasters.materials.steel}`, note: '' },
    ],
  },
  keychains: {
    category: PRODUCTS.keychains.name,
    packNote: `Sold in packs of ${PRODUCTS.keychains.packSize}`,
    items: [
      { name: 'Acrylic', price: `$${PRODUCTS.keychains.materials.acrylic}`, note: '' },
      { name: 'Wood', price: `$${PRODUCTS.keychains.materials.wood}`, note: '' },
      { name: 'Metal', price: `$${PRODUCTS.keychains.materials.metal}`, note: '' },
      { name: '+ Same on back', price: `+$${PRODUCTS.keychains.addOns.sameOnBack}`, note: '' },
    ],
  },
  knives: {
    category: PRODUCTS.knives.name,
    packNote: 'Per knife',
    items: [
      { name: 'Base engraving', price: `$${PRODUCTS.knives.base}`, note: 'Name or text' },
      { name: '+ Deep marking', price: `+$${PRODUCTS.knives.addOns.deepMark}`, note: '' },
      { name: '+ Second line', price: `+$${PRODUCTS.knives.addOns.secondLine}`, note: '' },
    ],
  },
  industrial: {
    category: PRODUCTS.industrialLabels.name,
    packNote: 'Volume discounts available',
    items: [
      { name: 'Equipment Nameplates', price: `$${PRODUCTS.industrialLabels.equipmentNameplates.min}-${PRODUCTS.industrialLabels.equipmentNameplates.max}`, note: 'ABS or metal' },
      { name: 'Arc Flash Labels', price: `$${PRODUCTS.industrialLabels.arcFlashLabels.min}-${PRODUCTS.industrialLabels.arcFlashLabels.max}`, note: 'NFPA compliant' },
      { name: 'Valve Tags', price: `$${PRODUCTS.industrialLabels.valveTags.min}-${PRODUCTS.industrialLabels.valveTags.max}`, note: 'Color coded' },
    ],
  },
}

// Pack size constant for messaging
export const PROMO_PACK_SIZE = 15

// Quick facts for display
export const QUICK_FACTS = {
  pensPack: `$${PRODUCTS.pens.basePackPrice}`,         // $45
  pensWithLogoPack: `$${PRODUCTS.pens.logoPackPrice}`, // $75
  coastersPack: `$${PRODUCTS.coasters.basePackPrice}`, // $60
  keychainsPack: `$${PRODUCTS.keychains.basePackPrice}`, // $60
  packSize: PROMO_PACK_SIZE,
}
