import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getOrderById, listOrderItems, updateOrderStatus, setOrderProof, updateOrderStatusCas, setOrderProofCas, type OrderStatus, type ProofStatus } from '@/lib/db/repos/orders'
import { isLegalGuardedMove, isLegalGuardedProofMove } from '@/lib/admin/transitions'
import { getCustomerById, getCustomerByEmail } from '@/lib/db/repos/customers'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const order = await getOrderById(id)
    if (!order) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    const items = await listOrderItems(id)
    // Resolve who this is: prefer the linked customer record, fall back to a
    // record matching the order email (covers guest checkouts that later get a
    // customer row). Name also falls back to the ship-to name on the order.
    const c = order.customerId
      ? await getCustomerById(order.customerId)
      : await getCustomerByEmail(order.email)
    const customer = {
      id: c?.id ?? null,
      name: c?.name || order.fulfillmentAddress?.name || null,
      phone: c?.phone || order.fulfillmentAddress?.phone || null,
      company: c?.company ?? null,
      orderCount: c?.orderCount ?? 0,
      lifetimeValueCents: c?.lifetimeValueCents ?? 0,
    }
    return NextResponse.json({ ok: true, data: { order, items, customer } })
  })
}

const STATUSES = ['new','confirmed','in_progress','ready','delivered','cancelled','refunded'] as const
const PROOFS = ['needed', 'sent', 'approved'] as const

const patchSchema = z.object({
  status: z.enum(STATUSES).optional(),
  note: z.string().max(500).optional(),
  proof: z.enum(PROOFS).optional(),
  // The armored bump path (RAIL-SYSTEM-PLAN I3/I4): when the caller says
  // what state it saw, the write is compare-and-swap and the move must be
  // the legal forward bump or its exact undo. Without these fields the
  // change is a manual move (kanban drag, deliberate correction): allowed
  // from anywhere, audited as manual.
  expectedStatus: z.enum(STATUSES).optional(),
  expectedProof: z.enum(PROOFS).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    const actor = { type: 'admin' as const, id: session.email ?? null, note: body.data.note }

    if (body.data.status) {
      const to = body.data.status as OrderStatus
      const expected = body.data.expectedStatus as OrderStatus | undefined
      if (expected) {
        if (!isLegalGuardedMove(expected, to)) {
          return NextResponse.json({ ok: false, error: { code: 'ILLEGAL_TRANSITION', from: expected, to } }, { status: 409 })
        }
        const swapped = await updateOrderStatusCas(id, expected, to, actor)
        if (!swapped) {
          // Stale expectation: the order moved under the caller. Nothing was
          // written; hand back reality so the UI can refresh quietly.
          const current = await getOrderById(id)
          if (!current) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
          return NextResponse.json({ ok: false, error: { code: 'STALE', currentStatus: current.status }, data: { order: current } }, { status: 409 })
        }
      } else {
        await updateOrderStatus(id, to, actor)
      }
      await audit({
        actorType: 'admin', actorId: session.email ?? null,
        action: 'order.status_change', targetType: 'order', targetId: id,
        diff: { status: to, note: body.data.note, guarded: !!expected, ...(expected ? { from: expected } : { manual: true }) },
        ip: getClientIp(req), userAgent: getUserAgent(req),
      })
    }

    if (body.data.proof) {
      const to = body.data.proof as ProofStatus
      const expected = body.data.expectedProof as ProofStatus | undefined
      if (expected) {
        if (!isLegalGuardedProofMove(expected, to)) {
          return NextResponse.json({ ok: false, error: { code: 'ILLEGAL_TRANSITION', from: expected, to } }, { status: 409 })
        }
        const swapped = await setOrderProofCas(id, expected, to, { id: session.email ?? null })
        if (!swapped) {
          const current = await getOrderById(id)
          if (!current) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
          return NextResponse.json({ ok: false, error: { code: 'STALE' }, data: { order: current } }, { status: 409 })
        }
      } else {
        await setOrderProof(id, to, { id: session.email ?? null })
      }
      await audit({
        actorType: 'admin', actorId: session.email ?? null,
        action: 'order.proof_change', targetType: 'order', targetId: id,
        diff: { proof: to, guarded: !!expected },
        ip: getClientIp(req), userAgent: getUserAgent(req),
      })
    }

    const order = await getOrderById(id)
    return NextResponse.json({ ok: true, data: { order } })
  })
}
