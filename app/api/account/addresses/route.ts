import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomer } from '@/lib/auth/customer'
import { getDb, newId } from '@/lib/db/client'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

interface AddressRow {
  id: string
  label: string
  line1: string
  line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string | null
  is_default: 0 | 1
  created_at: string
}

function hydrate(r: AddressRow) {
  return {
    id: r.id,
    label: r.label,
    line1: r.line1,
    line2: r.line2,
    city: r.city,
    state: r.state,
    postalCode: r.postal_code,
    country: r.country,
    phone: r.phone,
    isDefault: r.is_default === 1,
    createdAt: r.created_at,
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const { results } = await getDb().prepare(
      'SELECT * FROM shipping_addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC'
    ).bind(session.customer.id).all<AddressRow>()
    return NextResponse.json({ ok: true, data: { addresses: results.map(hydrate) } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}

const createSchema = z.object({
  label: z.string().trim().min(1).max(40),
  line1: z.string().trim().min(1).max(120),
  line2: z.string().trim().max(120).nullable().optional(),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(40),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().length(2).default('US'),
  phone: z.string().trim().max(30).nullable().optional(),
  isDefault: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })

    const db = getDb()
    const id = newId('addr')
    const data = body.data

    // Make this the default if it's the customer's first address, or if explicitly requested.
    const existing = await db.prepare(
      'SELECT COUNT(*) AS n FROM shipping_addresses WHERE customer_id = ?'
    ).bind(session.customer.id).first<{ n: number }>()
    const shouldBeDefault = data.isDefault === true || (existing?.n ?? 0) === 0

    const stmts = []
    if (shouldBeDefault) {
      stmts.push(
        db.prepare('UPDATE shipping_addresses SET is_default = 0 WHERE customer_id = ?').bind(session.customer.id)
      )
    }
    stmts.push(
      db.prepare(
        `INSERT INTO shipping_addresses (id, customer_id, label, line1, line2, city, state, postal_code, country, phone, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id, session.customer.id, data.label, data.line1, data.line2 ?? null, data.city,
        data.state, data.postalCode, data.country, data.phone ?? null, shouldBeDefault ? 1 : 0,
      )
    )
    await db.batch(stmts)

    await audit({
      actorType: 'customer', actorId: session.customer.id,
      action: 'address.create', targetType: 'shipping_address', targetId: id,
      diff: data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { id } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
