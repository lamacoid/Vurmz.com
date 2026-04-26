import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const db = getDb()
  const url = new URL(req.url)
  const catalog = url.searchParams.get('catalog') ?? 'materials'

  const sections = await db.prepare(
    `SELECT * FROM jds_catalog_sections WHERE catalog = ? ORDER BY position, name`
  ).bind(catalog).all()

  const result = []
  for (const sec of sections.results || []) {
    const skus = await db.prepare(
      `SELECT sku, name, description, image, thumbnail, in_stock
       FROM jds_catalog_skus WHERE section_id = ? ORDER BY position, sku`
    ).bind(sec.id).all()

    result.push({
      id: sec.id,
      name: sec.name,
      description: sec.description,
      premium: !!(sec.premium as number),
      itemCount: skus.results?.length || 0,
      heroImage: sec.hero_image || '',
      heroThumbnail: sec.hero_thumbnail || '',
      products: (skus.results || []).map((s: Record<string, unknown>) => ({
        sku: s.sku,
        name: s.name,
        description: s.description,
        image: s.image,
        thumbnail: s.thumbnail,
        inStock: !!(s.in_stock as number),
      })),
    })
  }

  return NextResponse.json(
    { sections: result, totalProducts: result.reduce((a, s) => a + s.itemCount, 0) },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600' } }
  )
}
