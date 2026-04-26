import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb, newId, nowIso } from '@/lib/db/client'

export const runtime = 'edge'

const createSchema = z.object({
  catalog: z.enum(['shop', 'materials']),
  name: z.string().min(1).max(200),
  description: z.string().optional().default(''),
  premium: z.boolean().optional().default(false),
  skus: z.array(z.string()).optional().default([]),
})

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const db = getDb()
    const url = new URL(req.url)
    const catalog = url.searchParams.get('catalog') ?? 'materials'

    const sections = await db.prepare(
      `SELECT * FROM jds_catalog_sections WHERE catalog = ? ORDER BY position, name`
    ).bind(catalog).all()

    // Get SKU counts per section
    const counts = await db.prepare(
      `SELECT section_id, COUNT(*) as count FROM jds_catalog_skus GROUP BY section_id`
    ).all()
    const countMap: Record<string, number> = {}
    for (const row of counts.results) {
      countMap[row.section_id as string] = row.count as number
    }

    const data = (sections.results || []).map((s: Record<string, unknown>) => ({
      ...s,
      skuCount: countMap[s.id as string] || 0,
    }))

    return NextResponse.json({ ok: true, data: { sections: data } })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    }

    const db = getDb()
    const { catalog, name, description, premium, skus } = body.data
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    const now = nowIso()

    // Get max position
    const maxPos = await db.prepare(
      `SELECT COALESCE(MAX(position), 0) as mp FROM jds_catalog_sections WHERE catalog = ?`
    ).bind(catalog).first<{ mp: number }>()

    await db.prepare(
      `INSERT INTO jds_catalog_sections (id, catalog, name, description, premium, position, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, catalog, name, description, premium ? 1 : 0, (maxPos?.mp ?? 0) + 1, now, now).run()

    // Insert SKUs if provided
    if (skus.length > 0) {
      const stmt = db.prepare(
        `INSERT OR IGNORE INTO jds_catalog_skus (section_id, sku, position) VALUES (?, ?, ?)`
      )
      const batch = skus.map((sku, i) => stmt.bind(id, sku, i))
      await db.batch(batch)
    }

    return NextResponse.json({ ok: true, data: { id } }, { status: 201 })
  })
}
