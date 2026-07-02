/**
 * Server-side cart validation — re-reads product prices from D1 so the
 * client can't tamper with amounts sent to the order API.
 */
import { getProductById } from '@/lib/db/repos/products'
import { businessUnitPrice } from '@/lib/pricing'

export interface ClientCartItem {
  productId: string
  qty: number
}

export interface ValidatedCartItem {
  productId: string
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
    // One-off items can only ever be qty 1.
    const qty = product.oneOff ? 1 : Math.min(raw.qty, 999)
    const unitPriceCents = opts.isBusinessOrder && !product.oneOff
      ? businessUnitPrice(product.priceCents, qty * product.packSize)
      : product.priceCents
    items.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      qty,
      unitPriceCents,
      packSize: product.packSize,
      weightGrams: product.weightGrams,
      oneOff: product.oneOff,
    })
  }
  const subtotalCents = items.reduce((s, i) => s + i.unitPriceCents * i.qty, 0)
  const totalWeightGrams = items.reduce((s, i) => s + i.weightGrams * i.qty, 0)
  return { items, subtotalCents, totalWeightGrams, unavailable }
}
