import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomer } from '@/lib/auth/customer'
import { getDb, nowIso } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

interface MethodRow { id: string; brand: string | null; last4: string | null; exp_month: number | null; exp_year: number | null; is_default: 0 | 1 }

export async function GET(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const db = getDb()
    const { results } = await db.prepare(
      'SELECT id, brand, last4, exp_month, exp_year, is_default FROM payment_methods WHERE customer_id = ? AND deleted_at IS NULL ORDER BY is_default DESC, id'
    ).bind(session.customer.id).all<MethodRow>()
    return NextResponse.json({
      ok: true,
      data: {
        customer: {
          id: session.customer.id,
          name: session.customer.name,
          email: session.customer.email,
          phone: session.customer.phone,
          company: session.customer.company,
        },
        paymentMethods: results.map(r => ({
          id: r.id, brand: r.brand, last4: r.last4,
          expMonth: r.exp_month, expYear: r.exp_year, isDefault: r.is_default === 1,
        })),
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}

const patchSchema = z.object({
  name: z.string().max(200).optional(),
  phone: z.string().max(30).nullable().optional(),
  company: z.string().max(200).nullable().optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const db = getDb()
    const sets: string[] = []
    const binds: unknown[] = []
    if (body.data.name !== undefined) { sets.push('name = ?'); binds.push(body.data.name) }
    if (body.data.phone !== undefined) { sets.push('phone = ?'); binds.push(body.data.phone) }
    if (body.data.company !== undefined) { sets.push('company = ?'); binds.push(body.data.company) }
    if (sets.length === 0) return NextResponse.json({ ok: true })
    sets.push('updated_at = ?'); binds.push(nowIso())
    binds.push(session.customer.id)
    await db.prepare(`UPDATE customers SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run()
    await audit({
      actorType: 'customer', actorId: session.customer.id,
      action: 'profile.update', targetType: 'customer', targetId: session.customer.id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
