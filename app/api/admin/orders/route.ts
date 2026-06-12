import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { listOrders, listOrderItemFlags, type OrderStatus } from '@/lib/db/repos/orders'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const status = url.searchParams.get('status') as OrderStatus | null
    const limit = Math.min(500, Number(url.searchParams.get('limit') ?? 200))
    const offset = Number(url.searchParams.get('offset') ?? 0)
    const [orders, flags] = await Promise.all([
      listOrders({ status: status ?? undefined, limit, offset }),
      listOrderItemFlags(),
    ])
    // Decorate with what the board cards need: personalization flags from the
    // items plus attachments/proof straight off the order metadata.
    const decorated = orders.map(o => {
      const meta = (o.metadata ?? {}) as { attachments?: unknown[]; proof?: { status?: string } }
      return {
        ...o,
        hasText: flags[o.id]?.hasText ?? false,
        hasElement: flags[o.id]?.hasElement ?? false,
        attachmentCount: Array.isArray(meta.attachments) ? meta.attachments.length : 0,
        proofStatus: meta.proof?.status ?? null,
      }
    })
    return NextResponse.json({ ok: true, data: { orders: decorated } })
  })
}
