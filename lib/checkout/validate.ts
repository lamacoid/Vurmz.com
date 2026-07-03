/**
 * Server-side cart validation — re-reads product prices from D1 so the
 * client can't tamper with amounts sent to the order API.
 */
import { getProductById, getVariantById } from '@/lib/db/repos/products'
import { businessUnitPrice } from '@/lib/pricing'

export interface ClientCartItem {
  productId: string
  qty: number
  /** Optional pack-size option (product_variants row). Server-verified. */
  variantId?: string
}

export interface ValidatedCartItem {
  productId: string
  variantId: string | null
  name: string
  slug: string
  qty: number
  unitPriceCents: number
  packSize: number
  weightGrams: number
  oneOff: boolean
}

export interface ValidatedCart {
  items: ValidatedCartItem[]
  subtotalCents: number
  totalWeightGrams: number
  /** Items that were dropped because they're sold/unpublished/missing. */
  unavailable: Array<{ productId: string; reason: 'sold' | 'unpublished' | 'missing' }>
}

/**
 * isBusinessOrder applies the volume-tier discount (lib/pricing.ts
 * businessUnitPrice) to each line, keyed off EFFECTIVE UNITS: cart qty
 * times the product's pack size, not qty alone. A pack-of-15 SKU at
 * cart qty 10 is 150 effective units (Standing tier), not 10.
 * Admin-mediated for now: this is only ever set by an admin-created order,
 * never by the public checkout body directly.
 */
export async function validateCart(clientItems: ClientCartItem[], opts: { isBusinessOrder?: boolean } = {}): Promise<ValidatedCart> {
  const items: ValidatedCartItem[] = []
  const unavailable: ValidatedCart['unavailable'] = []
  for (const raw of clientItems) {
    if (!raw.productId || !Number.isFinite(raw.qty) || raw.qty <= 0) continue
    const product = await getProductById(raw.productId)
    if (!product) {
      unavailable.push({ productId: raw.productId, reason: 'missing' })
      continue
    }
    if (product.soldAt) {
      unavailable.push({ productId: raw.productId, reason: 'sold' })
      continue
    }
    if (!product.isPublished) {
      unavailable.push({ productId: raw.productId, reason: 'unpublished' })
      continue
    }
    // Pack-size option: the variant's price and pack override the product's
    // defaults. Everything is re-read from D1; a variant must belong to this
    // product and be published or the line is dropped.
    let variant = null
    if (raw.variantId) {
      variant = await getVariantById(raw.variantId)
      if (!variant || variant.productId !== product.id || !variant.isPublished) {
        unavailable.push({ productId: raw.productId, reason: 'missing' })
        continue
      }
    }
    const basePriceCents = variant ? variant.priceCents : product.priceCents
    const packSize = variant ? variant.packSize : product.packSize
    // Same suffix rule as the client: the chosen option replaces a pack/set
    // suffix baked into the product name rather than stacking behind it.
    const name = variant
      ? `${product.name.replace(/\s*\((?:pack|set) of \d+\)\s*$/i, '')} (${variant.name})`
      : product.name
    // One-off items can only ever be qty 1.
    const qty = product.oneOff ? 1 : Math.min(raw.qty, 999)
    const unitPriceCents = opts.isBusinessOrder && !product.oneOff
      ? businessUnitPrice(basePriceCents, qty * packSize)
      : basePriceCents
    // Per-unit weight scales with the pack when a variant changes the count.
    const weightGrams = variant && product.packSize > 0
      ? Math.round((product.weightGrams / product.packSize) * packSize)
      : product.weightGrams
    items.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      name,
      slug: product.slug,
      qty,
      unitPriceCents,
      packSize,
      weightGrams,
      oneOff: product.oneOff,
    })
  }
  const subtotalCents = items.reduce((s, i) => s + i.unitPriceCents * i.qty, 0)
  const totalWeightGrams = items.reduce((s, i) => s + i.weightGrams * i.qty, 0)
  return { items, subtotalCents, totalWeightGrams, unavailable }
}
