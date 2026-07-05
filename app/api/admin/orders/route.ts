import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { listOrders, listOrderItemFlags, createOrder, type OrderStatus, type OrderLineItemInput } from '@/lib/db/repos/orders'
import { upsertCustomerByEmail } from '@/lib/db/repos/customers'
import { validateCart } from '@/lib/checkout/validate'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { newId } from '@/lib/db/client'

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

// ----- The order wizard (RAIL-SYSTEM-PLAN Phase A) --------------------
// Any-source order entry: phone, walk-in, Bark, text. Catalog lines are
// priced through the SAME validateCart path as public checkout (sale
// prices, pack math, business tiers), so admin orders can never disagree
// with web pricing. Overrides are allowed but stored beside the computed
// price and audit-logged. dryRun prices without creating, so the page's
// preview and the real order share one code path.

const createSchema = z.object({
  dryRun: z.boolean().optional(),
  customer: z.union([
    z.object({ id: z.string().min(1) }),
    z.object({
      name: z.string().min(1).max(120),
      email: z.string().email().max(200).optional(),
      phone: z.string().max(40).optional(),
      company: z.string().max(120).optional(),
    }),
  ]),
  lines: z.array(z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('catalog'),
      productId: z.string().min(1),
      variantId: z.string().optional(),
      qty: z.number().int().min(1).max(999),
      overrideCents: z.number().int().min(0).max(5_000_000).optional(),
      engraving: z.object({ text: z.string().max(200), fontValue: z.string().max(60).optional() }).optional(),
    }),
    z.object({
      kind: z.literal('custom'),
      name: z.string().min(1).max(200),
      qty: z.number().int().min(1).max(999),
      unitPriceCents: z.number().int().min(0).max(5_000_000),
      engraving: z.object({ text: z.string().max(200), fontValue: z.string().max(60).optional() }).optional(),
    }),
  ])).min(1).max(30),
  fulfillmentMethod: z.enum(['pickup', 'hand_deliver', 'ship']),
  isBusinessOrder: z.boolean().optional(),
  payment: z.enum(['cash_now', 'invoice_later', 'collect_later']),
  notes: z.string().max(2000).optional(),
})

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async session => {
    const raw = await req.json().catch(() => null)
    const parsed = createSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', issues: parsed.error.issues.slice(0, 5) } }, { status: 422 })
    }
    const body = parsed.data

    // Price catalog lines through checkout's own validator (I1: one truth).
    const catalogLines = body.lines.filter(l => l.kind === 'catalog')
    const cart = await validateCart(
      catalogLines.map(l => ({ productId: l.productId, qty: l.qty, variantId: l.variantId })),
      { isBusinessOrder: body.isBusinessOrder },
    )
    if (cart.unavailable.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAVAILABLE', message: 'Some products are unavailable', unavailable: cart.unavailable },
      }, { status: 422 })
    }

    const items: OrderLineItemInput[] = []
    let ci = 0
    for (const l of body.lines) {
      if (l.kind === 'catalog') {
        const v = cart.items[ci++]
        const unit = l.overrideCents ?? v.unitPriceCents
        items.push({
          productId: v.productId,
          variantId: v.variantId,
          nameSnapshot: v.name,
          qty: v.qty,
          unitPriceCents: unit,
          metadata: {
            ...(l.engraving?.text?.trim() ? { engraving: { text: l.engraving.text.trim(), fontValue: l.engraving.fontValue } } : {}),
            // I6: an override never erases what the price should have been.
            ...(l.overrideCents !== undefined && l.overrideCents !== v.unitPriceCents
              ? { priceOverride: { computedCents: v.unitPriceCents, overrideCents: l.overrideCents, by: session.email ?? 'admin' } }
              : {}),
          },
        })
      } else {
        items.push({
          productId: null,
          nameSnapshot: l.name,
          qty: l.qty,
          unitPriceCents: l.unitPriceCents,
          metadata: l.engraving?.text?.trim() ? { engraving: { text: l.engraving.text.trim(), fontValue: l.engraving.fontValue } } : {},
        })
      }
    }
    const subtotalCents = items.reduce((s, i) => s + i.unitPriceCents * i.qty, 0)

    if (body.dryRun) {
      return NextResponse.json({
        ok: true,
        data: {
          preview: true,
          items: items.map(i => ({ name: i.nameSnapshot, qty: i.qty, unitPriceCents: i.unitPriceCents, overridden: !!(i.metadata as Record<string, unknown> | undefined)?.priceOverride })),
          subtotalCents,
        },
      })
    }

    // Customer: existing id, or upsert by email; walk-ins without an email
    // still get a real customer record (I1) with a synthesized address,
    // flagged so it is obvious and fixable later.
    let customerId: string
    let email: string
    let walkIn = false
    if ('id' in body.customer) {
      customerId = body.customer.id
      const { getCustomerById } = await import('@/lib/db/repos/customers')
      const c = await getCustomerById(customerId)
      if (!c) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Customer not found' } }, { status: 404 })
      email = c.email
    } else {
      if (!body.customer.email) walkIn = true
      const realEmail = body.customer.email ?? `walkin-${newId('c').slice(-8)}@no-email.vurmz.com`
      const c = await upsertCustomerByEmail({
        email: realEmail,
        name: body.customer.name,
        phone: body.customer.phone ?? null,
        company: body.customer.company ?? null,
      })
      customerId = c.id
      email = c.email
    }

    // Cash already collected means the order enters confirmed (there is no
    // 'paid' status; paid orders advance to confirmed). Everything else
    // enters 'new' and the rail's collect gate holds it after delivery.
    const settled = body.payment === 'cash_now'
    const order = await createOrder({
      customerId,
      email,
      subtotalCents,
      totalCents: subtotalCents,
      status: settled ? 'confirmed' : 'new',
      channel: 'admin',
      fulfillmentMethod: body.fulfillmentMethod,
      notes: body.notes ?? '',
      items,
      metadata: {
        source: 'admin-wizard',
        payment: {
          expectation: body.payment,
          settled,
          ...(settled ? { settledBy: session.email ?? 'admin', settledAt: new Date().toISOString(), method: 'cash' } : {}),
        },
        ...(walkIn ? { walkIn: true } : {}),
        ...(body.isBusinessOrder ? { businessOrder: true } : {}),
      },
    })

    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'order.created_admin', targetType: 'order', targetId: order.id,
      diff: { subtotalCents, lines: items.length, payment: body.payment, walkIn },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { order } })
  })
}
