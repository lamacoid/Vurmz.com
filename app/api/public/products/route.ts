import { NextRequest, NextResponse } from 'next/server'
import { listProducts, listCategories } from '@/lib/db/repos/products'
import { getMediaByIds } from '@/lib/db/repos/media'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const categorySlug = url.searchParams.get('category') ?? undefined
  const limit = Math.min(100, Number(url.searchParams.get('limit') ?? 48))
  // "shop" or "services" — each returns products visible on that side (including "both")
  const audienceFilter = url.searchParams.get('audience') === 'services'
    ? ('services_visible' as const)
    : ('shop_visible' as const)

  const cats = await listCategories({ includeUnpublished: false })
  const cat = categorySlug ? cats.find(c => c.slug === categorySlug) : undefined
  const products = await listProducts({
    categoryId: cat?.id,
    audience: audienceFilter,
    includeUnpublished: false,
    limit,
  })

  const heroIds = products.map(p => p.heroMediaId).filter(Boolean) as string[]
  const mediaById = await getMediaByIds(heroIds)
  const withHeroes = products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    priceCents: p.priceCents,
    packSize: p.packSize,
    madeToOrder: p.madeToOrder,
    leadTimeDays: p.leadTimeDays,
    oneOff: p.oneOff,
    heroUrl: p.heroMediaId ? mediaById.get(p.heroMediaId)?.url ?? null : null,
    categoryId: p.categoryId,
  }))

  return new NextResponse(JSON.stringify({ ok: true, data: { products: withHeroes } }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
