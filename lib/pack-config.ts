// Pack configuration for VURMZ products
// Promotional items are sold in packs of 15
export const PACK_CONFIG = {
  pens: {
    name: 'Branded Pens',
    itemsPerPack: 15,
    basePrice: 45, // 15 x $3 base
    basePricePerItem: 3,
    description: '15 custom engraved pens',
    minPacks: 1,
    maxPacks: 10,
    dynamicPricing: true, // Price depends on options
  },
  'business-cards': {
    name: 'Metal Business Cards',
    itemsPerPack: 15,
    basePrice: 75, // 15 x $5 base
    basePricePerItem: 5,
    description: '15 premium metal cards',
    minPacks: 1,
    maxPacks: 10,
    dynamicPricing: true,
  },
  coasters: {
    name: 'Custom Coasters',
    itemsPerPack: 15,
    basePrice: 60, // 15 x $4 base (wood)
    basePricePerItem: 4,
    description: '15 engraved coasters',
    minPacks: 1,
    maxPacks: 10,
    dynamicPricing: true, // Price varies by material: wood $4, slate $5, steel $6
  },
  nameplates: {
    name: 'Name Plates',
    itemsPerPack: 5,
    basePrice: 40, // 5 x $8 base (2x8)
    basePricePerItem: 8,
    description: '5 desk/door name plates',
    minPacks: 1,
    maxPacks: 20,
    dynamicPricing: true, // Price varies by size: 2x8 $8, 2x10 $10, +$2 for logo
  },
  signs: {
    name: 'Signage',
    itemsPerPack: 1,
    basePrice: 8,
    basePricePerItem: 8,
    description: 'Custom engraved signs',
    minPacks: 1,
    maxPacks: 50,
    dynamicPricing: true,
    // Fixed size pricing: 4x2=$8, 6x2=$10, 6x4=$14, 8x4=$18, 8x6=$24, 10x6=$30, 12x8=$40, 12x12=$50
    // Volume discounts: 10+ (5%), 25+ (10%), 50+ (15%), 100+ (20%)
  },
  tags: {
    name: 'Industrial Tags',
    itemsPerPack: 1,
    basePrice: 3,
    basePricePerItem: 3,
    description: 'Durable industrial tags',
    minPacks: 1,
    maxPacks: 100,
    dynamicPricing: true,
    // Fixed size pricing: 1x0.5=$3, 1.5x0.75=$3, 2x1=$4, 3x1=$5, 3x1.5=$6, 1"rd=$3, 1.5"rd=$4, 2"rd=$5
    // Volume discounts: 10+ (5%), 25+ (10%), 50+ (15%), 100+ (20%)
  },
}

export type ProductType = keyof typeof PACK_CONFIG

/**
 * Calculate the total price for a given number of packs
 * @param productType - The type of product
 * @param numPacks - The number of packs to purchase
 * @param pricePerItem - Optional custom price per item (for dynamic pricing)
 * @returns The total price in dollars
 */
export function calculatePackTotal(
  productType: ProductType,
  numPacks: number,
  pricePerItem?: number
): number {
  const config = PACK_CONFIG[productType]
  if (!config) {
    throw new Error(`Invalid product type: ${productType}`)
  }

  // Clamp numPacks to valid range
  const validPacks = Math.max(config.minPacks, Math.min(config.maxPacks, numPacks))

  // Use dynamic price per item if provided, otherwise use base price
  const itemPrice = pricePerItem ?? config.basePricePerItem
  const packPrice = itemPrice * config.itemsPerPack

  return packPrice * validPacks
}

/**
 * Calculate pack price from per-item price
 */
export function getPackPrice(productType: ProductType, pricePerItem?: number): number {
  const config = PACK_CONFIG[productType]
  if (!config) {
    throw new Error(`Invalid product type: ${productType}`)
  }
  const itemPrice = pricePerItem ?? config.basePricePerItem
  return itemPrice * config.itemsPerPack
}

/**
 * Get a human-readable label showing pack quantity and total items
 * @param productType - The type of product (pens, coasters, signs, tags)
 * @param numPacks - The number of packs
 * @returns A formatted string like "2 packs (30 pens)"
 */
export function getPackQuantityLabel(productType: ProductType, numPacks: number): string {
  const config = PACK_CONFIG[productType]
  if (!config) {
    throw new Error(`Invalid product type: ${productType}`)
  }

  const totalItems = numPacks * config.itemsPerPack
  const packWord = numPacks === 1 ? 'pack' : 'packs'

  // Determine the item name based on product type
  const itemNames: Record<ProductType, string> = {
    pens: 'pens',
    'business-cards': 'cards',
    coasters: 'coasters',
    nameplates: 'plates',
    signs: 'signs',
    tags: 'tags',
  }

  const itemName = itemNames[productType]

  return `${numPacks} ${packWord} (${totalItems} ${itemName})`
}

/**
 * Format the pack price for display
 * @param productType - The type of product (pens, coasters, signs, tags)
 * @returns A formatted price string like "$50/pack"
 */
export function formatPackPrice(productType: ProductType): string {
  const config = PACK_CONFIG[productType]
  if (!config) {
    throw new Error(`Invalid product type: ${productType}`)
  }

  return `$${config.basePrice}/pack`
}
