import { NextRequest, NextResponse } from 'next/server'
import { requireCustomer } from '@/lib/auth/customer'
import { getDb } from '@/lib/db/client'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const db = getDb()
    const { results } = await db.prepare(
      `SELECT id, number, status, total_cents, fulfillment_method, created_at
       FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 100`
    ).bind(session.customer.id).all<{ id: string; number: string; status: string; total_cents: number; fulfillment_method: string; created_at: string }>()
    return NextResponse.json({
      ok: true,
      data: {
        orders: results.map(r => ({
          id: r.id, number: r.number, status: r.status,
          totalCents: r.total_cents, fulfillmentMethod: r.fulfillment_method, createdAt: r.created_at,
        })),
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
