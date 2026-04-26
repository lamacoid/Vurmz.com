import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb, nowIso } from '@/lib/db/client'

export const runtime = 'edge'

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  premium: z.boolean().optional(),
  position: z.number().optional(),
  hero_image: z.string().optional(),
  hero_thumbnail: z.string().optional(),
})

const addSkusSchema = z.object({
  skus: z.array(z.string().min(1)),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await params
    const db = getDb()

    const section = await db.prepare(
      `SELECT * FROM jds_catalog_sections WHERE id = ?`
    ).bind(id).first()

    if (!section) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
    }

    const skus = await db.prepare(
      `SELECT * FROM jds_catalog_skus WHERE section_id = ? ORDER BY position, sku`
    ).bind(id).all()

    return NextResponse.json({
      ok: true,
      data: { section, skus: skus.results || [] },
    })
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await params
    const body = await req.json().catch(() => null)

    // Handle adding SKUs
    if (body?.skus && Array.isArray(body.skus)) {
      const parsed = addSkusSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ ok: false, error: 'Invalid SKUs' }, { status: 422 })
      }
      const db = getDb()
      const maxPos = await db.prepare(
        `SELECT COALESCE(MAX(position), 0) as mp FROM jds_catalog_skus WHERE section_id = ?`
      ).bind(id).first<{ mp: number }>()

      const stmt = db.prepare(
        `INSERT OR IGNORE INTO jds_catalog_skus (section_id, sku, position) VALUES (?, ?, ?)`
      )
      const batch = parsed.data.skus.map((sku, i) =>
        stmt.bind(id, sku, (maxPos?.mp ?? 0) + i + 1)
      )
      await db.batch(batch)
      return NextResponse.json({ ok: true })
    }

    // Handle updating section metadata
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: parsed.error.issues } }, { status: 422 })
    }

    const db = getDb()
    const fields = parsed.data
    const sets: string[] = []
    const vals: unknown[] = []

    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) {
        sets.push(`${key} = ?`)
        vals.push(key === 'premium' ? (val ? 1 : 0) : val)
      }
    }

    if (sets.length === 0) {
      return NextResponse.json({ ok: true })
    }

    sets.push('updated_at = ?')
    vals.push(nowIso())
    vals.push(id)

    await db.prepare(
      `UPDATE jds_catalog_sections SET ${sets.join(', ')} WHERE id = ?`
    ).bind(...vals).run()

    return NextResponse.json({ ok: true })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await params
    const db = getDb()
    const url = new URL(req.url)
    const sku = url.searchParams.get('sku')

    if (sku) {
      // Delete a specific SKU from this section
      await db.prepare(
        `DELETE FROM jds_catalog_skus WHERE section_id = ? AND sku = ?`
      ).bind(id, sku).run()
    } else {
      // Delete the entire section and its SKUs
      await db.batch([
        db.prepare(`DELETE FROM jds_catalog_skus WHERE section_id = ?`).bind(id),
        db.prepare(`DELETE FROM jds_catalog_sections WHERE id = ?`).bind(id),
      ])
    }

    return NextResponse.json({ ok: true })
  })
}
