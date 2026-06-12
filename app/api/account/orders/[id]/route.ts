import { NextRequest, NextResponse } from 'next/server'
import { requireCustomer } from '@/lib/auth/customer'
import { getOrderById, listOrderItems, listOrderEvents } from '@/lib/db/repos/orders'

export const runtime = 'edge'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCustomer(req)
    const { id } = await ctx.params
    const order = await getOrderById(id)
    if (!order || order.customerId !== session.customer.id) {
      return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    }
    const items = await listOrderItems(id)
    const events = await listOrderEvents(id)
    return NextResponse.json({ ok: true, data: { order, items, events } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
