// Pack configuration for VURMZ products
export const PACK_CONFIG = {
  pens: {
    name: 'Branded Pens',
    itemsPerPack: 15,
    basePrice: 50,
    description: '15 custom engraved pens',
    minPacks: 1,
    maxPacks: 10,
  },
  coasters: {
    name: 'Custom Coasters',
    itemsPerPack: 15,
    basePrice: 50,
    description: '15 laser-engraved coasters',
    minPacks: 1,
    maxPacks: 10,
  },
  signs: {
    name: 'Signage',
    itemsPerPack: 5,
    basePrice: 75,
    description: '5 custom engraved signs',
    minPacks: 1,
    maxPacks: 20,
  },
  tags: {
    name: 'Industrial Tags',
    itemsPerPack: 5,
    basePrice: 40,
    description: '5 durable industrial tags',
    minPacks: 1,
    maxPacks: 20,
  },
}

export type ProductType = keyof typeof PACK_CONFIG

/**
 * Calculate the total price for a given number of packs
 * @param productType - The type of product (pens, coasters, signs, tags)
 * @param numPacks - The number of packs to purchase
 * @returns The total price in dollars
 */
export function calculatePackTotal(productType: ProductType, numPacks: number): number {
  const config = PACK_CONFIG[productType]
  if (!config) {
    throw new Error(`Invalid product type: ${productType}`)
  }

  // Clamp numPacks to valid range
  const validPacks = Math.max(config.minPacks, Math.min(config.maxPacks, numPacks))

  return config.basePrice * validPacks
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
    coasters: 'coasters',
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
