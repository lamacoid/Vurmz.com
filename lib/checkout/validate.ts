/**
 * Server-side cart validation — re-reads product prices from D1 so the
 * client can't tamper with amounts sent to the order API.
 */
import { getProductById } from '@/lib/db/repos/products'

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
}

export interface ValidatedCart {
  items: ValidatedCartItem[]
  subtotalCents: number
  totalWeightGrams: number
}

export async function validateCart(clientItems: ClientCartItem[]): Promise<ValidatedCart> {
  const items: ValidatedCartItem[] = []
  for (const raw of clientItems) {
    if (!raw.productId || !Number.isFinite(raw.qty) || raw.qty <= 0) continue
    const product = await getProductById(raw.productId)
    if (!product || !product.isPublished) continue
    items.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      qty: Math.min(raw.qty, 999),
      unitPriceCents: product.priceCents,
      packSize: product.packSize,
      weightGrams: product.weightGrams,
    })
  }
  const subtotalCents = items.reduce((s, i) => s + i.unitPriceCents * i.qty, 0)
  const totalWeightGrams = items.reduce((s, i) => s + i.weightGrams * i.qty, 0)
  return { items, subtotalCents, totalWeightGrams }
}
