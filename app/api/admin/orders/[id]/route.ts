import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getOrderById, listOrderItems, updateOrderStatus, setOrderProof, type OrderStatus, type ProofStatus } from '@/lib/db/repos/orders'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const order = await getOrderById(id)
    if (!order) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    const items = await listOrderItems(id)
    return NextResponse.json({ ok: true, data: { order, items } })
  })
}

const patchSchema = z.object({
  status: z.enum(['new','confirmed','in_progress','ready','delivered','cancelled','refunded']).optional(),
  note: z.string().max(500).optional(),
  proof: z.enum(['needed', 'sent', 'approved']).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    if (body.data.status) {
      await updateOrderStatus(id, body.data.status as OrderStatus, {
        type: 'admin',
        id: session.email ?? null,
        note: body.data.note,
      })
      await audit({
        actorType: 'admin', actorId: session.email ?? null,
        action: 'order.status_change', targetType: 'order', targetId: id,
        diff: { status: body.data.status, note: body.data.note },
        ip: getClientIp(req), userAgent: getUserAgent(req),
      })
    }
    if (body.data.proof) {
      await setOrderProof(id, body.data.proof as ProofStatus, { id: session.email ?? null })
      await audit({
        actorType: 'admin', actorId: session.email ?? null,
        action: 'order.proof_change', targetType: 'order', targetId: id,
        diff: { proof: body.data.proof },
        ip: getClientIp(req), userAgent: getUserAgent(req),
      })
    }
    const order = await getOrderById(id)
    return NextResponse.json({ ok: true, data: { order } })
  })
}
