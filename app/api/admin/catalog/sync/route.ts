import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb, getEnv, nowIso } from '@/lib/db/client'

export const runtime = 'edge'

const JDS_API = 'https://api.jdsapp.com/get-product-details-by-skus'

const syncSchema = z.object({
  sectionId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const body = syncSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 422 })
    }

    const db = getDb()
    const env = getEnv()
    const token = env.JDS_API_TOKEN

    if (!token) {
      return NextResponse.json({ ok: false, error: 'JDS_API_TOKEN not configured' }, { status: 500 })
    }

    const { sectionId } = body.data

    // Get all SKUs for this section
    const skuRows = await db.prepare(
      `SELECT sku FROM jds_catalog_skus WHERE section_id = ? ORDER BY position`
    ).bind(sectionId).all()

    const skus = (skuRows.results || []).map((r: Record<string, unknown>) => r.sku as string)
    if (skus.length === 0) {
      return NextResponse.json({ ok: true, data: { synced: 0 } })
    }

    // Pull from JDS API in batches of 50
    const allProducts: Record<string, unknown>[] = []
    for (let i = 0; i < skus.length; i += 50) {
      const batch = skus.slice(i, i + 50)
      const res = await fetch(JDS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, skus: batch }),
      })
      if (res.ok) {
        const data = await res.json() as Record<string, unknown>[]
        allProducts.push(...data)
      }
    }

    // Update SKU records with JDS data
    const stmt = db.prepare(
      `UPDATE jds_catalog_skus SET name = ?, description = ?, image = ?, thumbnail = ?, in_stock = ?
       WHERE section_id = ? AND sku = ?`
    )
    const updates = []
    let heroImage = ''
    let heroThumbnail = ''

    for (const product of allProducts) {
      if (product.name === 'unavailable') continue
      updates.push(
        stmt.bind(
          product.name as string,
          (product.description as string) || '',
          (product.image as string) || '',
          (product.thumbnail as string) || '',
          (product.availableQuantity as number) > 0 ? 1 : 0,
          sectionId,
          product.sku as string,
        )
      )
      if (!heroImage && product.image) {
        heroImage = product.image as string
        heroThumbnail = (product.thumbnail as string) || ''
      }
    }

    if (updates.length > 0) {
      await db.batch(updates)
    }

    // Update section hero image if we found one
    if (heroImage) {
      await db.prepare(
        `UPDATE jds_catalog_sections SET hero_image = ?, hero_thumbnail = ?, updated_at = ? WHERE id = ?`
      ).bind(heroImage, heroThumbnail, nowIso(), sectionId).run()
    }

    return NextResponse.json({
      ok: true,
      data: { synced: updates.length, total: skus.length },
    })
  })
}
