import { listProducts, type Product } from '@/lib/db/repos/products'

/**
 * The Items list, in one place (2026-11-15).
 *
 * Which products count as a listed item is decided by category here, never
 * by hiding rows in the database. The Items page, the "you might also like"
 * links on a product page, and the sitemap all read this, so a product is
 * either listed everywhere or nowhere.
 */
export const ITEM_CATEGORIES = new Set(['cat_coasters', 'cat_pens', 'cat_metal_cards', 'cat_labels_tags', 'cat_keychains'])

/** A pack of ten or more is a business run. Smaller is a single or a set. */
export const RUN_SIZE = 10

export function isListedItem(p: Product): boolean {
  return !!p.categoryId && ITEM_CATEGORIES.has(p.categoryId)
}

/** Published, unsold products that belong on the Items list. Throws if the catalog cannot be read. */
export async function listItems(): Promise<Product[]> {
  const all = await listProducts({ limit: 200 })
  return all.filter(isListedItem)
}

/**
 * Up to `max` other listed items for a product page: the same category
 * first, then the rest, cheapest first within each. Never throws; a
 * product page must render even if this list cannot be read.
 */
export async function relatedItems(product: Product, max = 4): Promise<Product[]> {
  try {
    const others = (await listItems()).filter(p => p.id !== product.id)
    const rank = (p: Product) => (p.categoryId === product.categoryId ? 0 : 1)
    return others.sort((a, b) => rank(a) - rank(b) || a.priceCents - b.priceCents).slice(0, max)
  } catch {
    return []
  }
}
