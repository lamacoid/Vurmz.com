import type { ProductRow, CategoryRow } from '../types'
import { getDb, newId, nowIso } from '../client'

export type Audience = 'shop' | 'services' | 'both'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  categoryId: string | null
  audience: Audience
  priceCents: number
  packSize: number
  position: number
  isPublished: boolean
  madeToOrder: boolean
  leadTimeDays: number
  weightGrams: number
  heroMediaId: string | null
  oneOff: boolean
  soldAt: string | null
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  heroMediaId: string | null
  position: number
  isPublished: boolean
}

interface ProductRowExtended extends ProductRow {
  short_description?: string
  made_to_order?: number
  lead_time_days?: number
  weight_grams?: number
  hero_media_id?: string | null
  audience?: Audience
  one_off?: number
  sold_at?: string | null
}

function hydrateProduct(row: ProductRowExtended): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    shortDescription: row.short_description ?? '',
    categoryId: row.category_id,
    audience: (row.audience ?? 'shop') as Audience,
    priceCents: row.price_cents,
    packSize: row.pack_size,
    position: row.position,
    isPublished: row.is_published === 1,
    madeToOrder: (row.made_to_order ?? 0) === 1,
    leadTimeDays: row.lead_time_days ?? 0,
    weightGrams: row.weight_grams ?? 0,
    heroMediaId: row.hero_media_id ?? null,
    oneOff: (row.one_off ?? 0) === 1,
    soldAt: row.sold_at ?? null,
    metadata: JSON.parse(row.metadata) as Record<string, unknown>,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function hydrateCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    heroMediaId: row.hero_media_id,
    position: row.position,
    isPublished: row.is_published === 1,
  }
}

// ----- categories ------------------------------------------------------

export async function listCategories(opts: { includeUnpublished?: boolean } = {}): Promise<Category[]> {
  const db = getDb()
  const sql = opts.includeUnpublished
    ? 'SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY position, name'
    : 'SELECT * FROM categories WHERE deleted_at IS NULL AND is_published = 1 ORDER BY position, name'
  const { results } = await db.prepare(sql).all<CategoryRow>()
  return results.map(hydrateCategory)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM categories WHERE slug = ? AND deleted_at IS NULL LIMIT 1')
    .bind(slug)
    .first<CategoryRow>()
  return row ? hydrateCategory(row) : null
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM categories WHERE id = ? AND deleted_at IS NULL LIMIT 1')
    .bind(id)
    .first<CategoryRow>()
  return row ? hydrateCategory(row) : null
}

export async function createCategory(input: {
  slug: string
  name: string
  description?: string
  position?: number
}): Promise<Category> {
  const db = getDb()
  const id = newId('cat')
  const now = nowIso()
  await db
    .prepare(
      `INSERT INTO categories (id, slug, name, description, position, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, input.slug, input.name, input.description ?? null, input.position ?? 0, now, now)
    .run()
  const row = await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first<CategoryRow>()
  return hydrateCategory(row!)
}

export async function updateCategory(id: string, patch: Partial<Pick<Category, 'slug' | 'name' | 'description' | 'heroMediaId' | 'position' | 'isPublished'>>): Promise<void> {
  const db = getDb()
  const sets: string[] = []
  const binds: unknown[] = []
  if (patch.slug !== undefined) { sets.push('slug = ?'); binds.push(patch.slug) }
  if (patch.name !== undefined) { sets.push('name = ?'); binds.push(patch.name) }
  if (patch.description !== undefined) { sets.push('description = ?'); binds.push(patch.description) }
  if (patch.heroMediaId !== undefined) { sets.push('hero_media_id = ?'); binds.push(patch.heroMediaId) }
  if (patch.position !== undefined) { sets.push('position = ?'); binds.push(patch.position) }
  if (patch.isPublished !== undefined) { sets.push('is_published = ?'); binds.push(patch.isPublished ? 1 : 0) }
  if (sets.length === 0) return
  sets.push('updated_at = ?'); binds.push(nowIso())
  binds.push(id)
  await db.prepare(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
}

export async function softDeleteCategory(id: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE categories SET deleted_at = ? WHERE id = ?').bind(nowIso(), id).run()
}

// ----- products --------------------------------------------------------

export async function listProducts(opts: {
  categoryId?: string
  audience?: Audience | 'shop_visible' | 'services_visible'
  includeUnpublished?: boolean
  includeSold?: boolean
  limit?: number
  offset?: number
  search?: string
} = {}): Promise<Product[]> {
  const db = getDb()
  const limit = opts.limit ?? 200
  const offset = opts.offset ?? 0
  const conds = ['deleted_at IS NULL']
  const binds: unknown[] = []
  if (!opts.includeUnpublished) conds.push('is_published = 1')
  if (!opts.includeSold) conds.push('sold_at IS NULL')
  if (opts.categoryId) { conds.push('category_id = ?'); binds.push(opts.categoryId) }
  if (opts.audience === 'shop_visible') {
    conds.push("audience IN ('shop', 'both')")
  } else if (opts.audience === 'services_visible') {
    conds.push("audience IN ('services', 'both')")
  } else if (opts.audience === 'shop' || opts.audience === 'services' || opts.audience === 'both') {
    conds.push('audience = ?'); binds.push(opts.audience)
  }
  if (opts.search) {
    conds.push('(lower(name) LIKE ? OR lower(slug) LIKE ?)')
    const q = `%${opts.search.toLowerCase()}%`
    binds.push(q, q)
  }
  const sql = `SELECT * FROM products WHERE ${conds.join(' AND ')} ORDER BY position, name LIMIT ? OFFSET ?`
  const { results } = await db.prepare(sql).bind(...binds, limit, offset).all<ProductRowExtended>()
  return results.map(hydrateProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM products WHERE slug = ? AND deleted_at IS NULL LIMIT 1')
    .bind(slug)
    .first<ProductRowExtended>()
  return row ? hydrateProduct(row) : null
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getDb()
  const row = await db
    .prepare('SELECT * FROM products WHERE id = ? AND deleted_at IS NULL LIMIT 1')
    .bind(id)
    .first<ProductRowExtended>()
  return row ? hydrateProduct(row) : null
}

export interface CreateProductInput {
  slug: string
  name: string
  description?: string
  shortDescription?: string
  categoryId?: string | null
  audience?: Audience
  priceCents: number
  packSize: number
  position?: number
  isPublished?: boolean
  madeToOrder?: boolean
  leadTimeDays?: number
  weightGrams?: number
  heroMediaId?: string | null
  oneOff?: boolean
  metadata?: Record<string, unknown>
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const db = getDb()
  const id = newId('prd')
  const now = nowIso()
  const oneOff = input.oneOff ? 1 : 0
  // One-off items are unique — pack size is always 1.
  const packSize = oneOff ? 1 : input.packSize
  await db
    .prepare(
      `INSERT INTO products (
        id, slug, name, description, short_description, category_id, audience,
        price_cents, pack_size, position, is_published,
        made_to_order, lead_time_days, weight_grams, hero_media_id, one_off,
        metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.slug,
      input.name,
      input.description ?? '',
      input.shortDescription ?? '',
      input.categoryId ?? null,
      input.audience ?? 'shop',
      input.priceCents,
      packSize,
      input.position ?? 0,
      input.isPublished === false ? 0 : 1,
      input.madeToOrder ? 1 : 0,
      input.leadTimeDays ?? 0,
      input.weightGrams ?? 0,
      input.heroMediaId ?? null,
      oneOff,
      JSON.stringify(input.metadata ?? {}),
      now,
      now
    )
    .run()
  const created = await getProductById(id)
  if (!created) throw new Error('Failed to create product')
  return created
}

export async function updateProduct(id: string, patch: Partial<CreateProductInput>): Promise<void> {
  const db = getDb()
  const sets: string[] = []
  const binds: unknown[] = []
  const map: Array<[keyof CreateProductInput, string]> = [
    ['slug', 'slug'],
    ['name', 'name'],
    ['description', 'description'],
    ['shortDescription', 'short_description'],
    ['categoryId', 'category_id'],
    ['audience', 'audience'],
    ['priceCents', 'price_cents'],
    ['packSize', 'pack_size'],
    ['position', 'position'],
    ['leadTimeDays', 'lead_time_days'],
    ['weightGrams', 'weight_grams'],
    ['heroMediaId', 'hero_media_id'],
  ]
  for (const [key, col] of map) {
    if (patch[key] !== undefined) { sets.push(`${col} = ?`); binds.push(patch[key] as unknown) }
  }
  if (patch.isPublished !== undefined) { sets.push('is_published = ?'); binds.push(patch.isPublished ? 1 : 0) }
  if (patch.madeToOrder !== undefined) { sets.push('made_to_order = ?'); binds.push(patch.madeToOrder ? 1 : 0) }
  if (patch.oneOff !== undefined) {
    sets.push('one_off = ?'); binds.push(patch.oneOff ? 1 : 0)
    // Force pack_size to 1 when flipping a product to one-off.
    if (patch.oneOff) { sets.push('pack_size = ?'); binds.push(1) }
  }
  if (patch.metadata !== undefined) { sets.push('metadata = ?'); binds.push(JSON.stringify(patch.metadata)) }
  if (sets.length === 0) return
  sets.push('updated_at = ?'); binds.push(nowIso())
  binds.push(id)
  await db.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
}

export async function softDeleteProduct(id: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE products SET deleted_at = ? WHERE id = ?').bind(nowIso(), id).run()
}

export async function restoreProduct(id: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE products SET deleted_at = NULL WHERE id = ?').bind(id).run()
}

/**
 * Clear sold_at on a one-off product so the admin can re-list it (e.g. if
 * the order was cancelled).
 */
export async function clearProductSold(id: string): Promise<void> {
  const db = getDb()
  await db.prepare('UPDATE products SET sold_at = NULL, updated_at = ? WHERE id = ?').bind(nowIso(), id).run()
}

/**
 * Stamp a one-off product as sold. Also unpublishes it so the shop hides it
 * (admin can still view and "unsell" via clearing sold_at).
 */
export async function markProductSold(id: string): Promise<void> {
  const db = getDb()
  const now = nowIso()
  await db
    .prepare('UPDATE products SET sold_at = ?, is_published = 0, updated_at = ? WHERE id = ? AND one_off = 1 AND sold_at IS NULL')
    .bind(now, now, id)
    .run()
}

export async function reorderProducts(items: Array<{ id: string; position: number }>): Promise<void> {
  const db = getDb()
  const now = nowIso()
  await db.batch(
    items.map(it =>
      db.prepare('UPDATE products SET position = ?, updated_at = ? WHERE id = ?').bind(it.position, now, it.id)
    )
  )
}

// ============================================================
// PACK-SIZE VARIANTS (activated 2026-07-03, migration 0015)
// A variant is an additional pack option with an ABSOLUTE price:
// "pack of N at $X total". The product's own priceCents/packSize
// stay the default option; products without variant rows behave
// exactly as before.
// ============================================================

export interface ProductVariant {
  id: string
  productId: string
  name: string
  packSize: number
  priceCents: number
  position: number
  isPublished: boolean
}

interface VariantRow {
  id: string
  product_id: string
  name: string
  pack_size: number
  price_cents: number
  position: number
  is_published: number
}

function hydrateVariant(row: VariantRow): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    packSize: row.pack_size,
    priceCents: row.price_cents,
    position: row.position,
    isPublished: row.is_published === 1,
  }
}

export async function listVariants(productId: string, opts: { includeUnpublished?: boolean } = {}): Promise<ProductVariant[]> {
  const db = getDb()
  const pub = opts.includeUnpublished ? '' : 'AND is_published = 1'
  const { results } = await db
    .prepare(`SELECT * FROM product_variants WHERE product_id = ? ${pub} ORDER BY position, pack_size`)
    .bind(productId)
    .all<VariantRow>()
  return results.map(hydrateVariant)
}

export async function getVariantById(id: string): Promise<ProductVariant | null> {
  const db = getDb()
  const row = await db.prepare('SELECT * FROM product_variants WHERE id = ? LIMIT 1').bind(id).first<VariantRow>()
  return row ? hydrateVariant(row) : null
}

/** Admin save: replace a product's variant set wholesale (delete + insert). */
export async function replaceVariants(
  productId: string,
  variants: Array<{ name: string; packSize: number; priceCents: number }>
): Promise<void> {
  const db = getDb()
  const stmts = [db.prepare('DELETE FROM product_variants WHERE product_id = ?').bind(productId)]
  variants.forEach((v, i) => {
    stmts.push(
      db
        .prepare(
          'INSERT INTO product_variants (id, product_id, name, pack_size, price_cents, position, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)'
        )
        .bind(newId('var'), productId, v.name, v.packSize, v.priceCents, i)
    )
  })
  await db.batch(stmts)
}

// ============================================================
// PRODUCT IMAGE GALLERY (activated 2026-07-03)
// product_images was shipped dormant in 0001; hero_media_id stays
// the primary pointer (menu/cart thumbnails), kept in sync with
// the first gallery slot by the admin form.
// ============================================================

export interface ProductImage {
  mediaId: string
  position: number
  url: string
  altText: string
}

export async function listProductImages(productId: string): Promise<ProductImage[]> {
  const db = getDb()
  const { results } = await db
    .prepare(
      `SELECT pi.media_id, pi.position, m.r2_key, m.external_url, m.alt_text
       FROM product_images pi JOIN media m ON m.id = pi.media_id AND m.deleted_at IS NULL
       WHERE pi.product_id = ? ORDER BY pi.position`
    )
    .bind(productId)
    .all<{ media_id: string; position: number; r2_key: string; external_url: string | null; alt_text: string }>()
  return results.map(r => ({
    mediaId: r.media_id,
    position: r.position,
    url: r.external_url || `/api/media/${encodeURIComponent(r.r2_key)}`,
    altText: r.alt_text,
  }))
}

/** Admin save: replace a product's gallery wholesale, in the given order. */
export async function replaceProductImages(productId: string, mediaIds: string[]): Promise<void> {
  const db = getDb()
  const stmts = [db.prepare('DELETE FROM product_images WHERE product_id = ?').bind(productId)]
  mediaIds.forEach((mediaId, i) => {
    stmts.push(
      db
        .prepare('INSERT INTO product_images (id, product_id, media_id, position, is_primary) VALUES (?, ?, ?, ?, ?)')
        .bind(newId('pimg'), productId, mediaId, i, i === 0 ? 1 : 0)
    )
  })
  await db.batch(stmts)
}

/**
 * Units of a product ordered to date (cart qty, cancelled and refunded
 * orders excluded). Feeds capped launch sales: "first 20 boards" stays
 * honest because the sale price stops applying at 20.
 */
export async function soldUnitsFor(productId: string): Promise<number> {
  const db = getDb()
  const row = await db
    .prepare(
      `SELECT COALESCE(SUM(oi.qty), 0) AS units
       FROM order_items oi JOIN orders o ON o.id = oi.order_id
       WHERE oi.product_id = ? AND o.status NOT IN ('cancelled', 'refunded')`
    )
    .bind(productId)
    .first<{ units: number }>()
  return row?.units ?? 0
}

/** Lowest published variant price per product, one query for the whole
 *  menu: products whose cheapest pack undercuts the base price read
 *  "from $X" instead of quietly overstating. */
export async function lowestVariantPrices(): Promise<Record<string, number>> {
  const db = getDb()
  const { results } = await db
    .prepare('SELECT product_id, MIN(price_cents) AS low FROM product_variants WHERE is_published = 1 GROUP BY product_id')
    .all<{ product_id: string; low: number }>()
  const map: Record<string, number> = {}
  for (const r of results) map[r.product_id] = r.low
  return map
}
