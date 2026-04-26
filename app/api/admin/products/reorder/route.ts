import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { reorderProducts } from '@/lib/db/repos/products'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const schema = z.object({
  items: z.array(z.object({ id: z.string(), position: z.number() })).min(1).max(500),
})

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = schema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    }
    await reorderProducts(body.data.items)
    await audit({
      actorType: 'admin',
      actorId: session.email ?? null,
      action: 'product.reorder',
      targetType: 'product',
      diff: { count: body.data.items.length },
      ip: getClientIp(req),
      userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
