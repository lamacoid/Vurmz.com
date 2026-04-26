import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { listOrders, type OrderStatus } from '@/lib/db/repos/orders'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const status = url.searchParams.get('status') as OrderStatus | null
    const limit = Math.min(500, Number(url.searchParams.get('limit') ?? 200))
    const offset = Number(url.searchParams.get('offset') ?? 0)
    const orders = await listOrders({ status: status ?? undefined, limit, offset })
    return NextResponse.json({ ok: true, data: { orders } })
  })
}
