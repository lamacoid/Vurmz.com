import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomer } from '@/lib/auth/customer'
import { getDb } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const patchSchema = z.object({
  label: z.string().trim().min(1).max(40).optional(),
  line1: z.string().trim().min(1).max(120).optional(),
  line2: z.string().trim().max(120).nullable().optional(),
  city: z.string().trim().min(1).max(80).optional(),
  state: z.string().trim().min(1).max(40).optional(),
  postalCode: z.string().trim().min(3).max(20).optional(),
  country: z.string().trim().length(2).optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  isDefault: z.boolean().optional(),
})

const fieldMap: Record<string, string> = {
  label: 'label',
  line1: 'line1',
  line2: 'line2',
  city: 'city',
  state: 'state',
  postalCode: 'postal_code',
  country: 'country',
  phone: 'phone',
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCustomer(req)
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })

    const db = getDb()
    const owned = await db.prepare(
      'SELECT id FROM shipping_addresses WHERE id = ? AND customer_id = ?'
    ).bind(id, session.customer.id).first<{ id: string }>()
    if (!owned) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })

    const sets: string[] = []
    const binds: unknown[] = []
    for (const [k, col] of Object.entries(fieldMap)) {
      const v = (body.data as Record<string, unknown>)[k]
      if (v !== undefined) { sets.push(`${col} = ?`); binds.push(v) }
    }

    const stmts = []
    if (body.data.isDefault === true) {
      stmts.push(
        db.prepare('UPDATE shipping_addresses SET is_default = 0 WHERE customer_id = ?').bind(session.customer.id)
      )
      sets.push('is_default = ?'); binds.push(1)
    }
    if (sets.length > 0) {
      binds.push(id)
      stmts.push(
        db.prepare(`UPDATE shipping_addresses SET ${sets.join(', ')} WHERE id = ?`).bind(...binds)
      )
    }
    if (stmts.length > 0) await db.batch(stmts)

    await audit({
      actorType: 'customer', actorId: session.customer.id,
      action: 'address.update', targetType: 'shipping_address', targetId: id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCustomer(req)
    const { id } = await ctx.params
    const db = getDb()
    const row = await db.prepare(
      'SELECT is_default FROM shipping_addresses WHERE id = ? AND customer_id = ?'
    ).bind(id, session.customer.id).first<{ is_default: 0 | 1 }>()
    if (!row) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })

    const stmts = [
      db.prepare('DELETE FROM shipping_addresses WHERE id = ?').bind(id),
    ]
    // If we deleted the default, promote the most recent remaining address.
    if (row.is_default === 1) {
      stmts.push(
        db.prepare(
          `UPDATE shipping_addresses SET is_default = 1
           WHERE id = (SELECT id FROM shipping_addresses WHERE customer_id = ? ORDER BY created_at DESC LIMIT 1)`
        ).bind(session.customer.id)
      )
    }
    await db.batch(stmts)

    await audit({
      actorType: 'customer', actorId: session.customer.id,
      action: 'address.delete', targetType: 'shipping_address', targetId: id,
      diff: {}, ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
