import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateCart } from '@/lib/checkout/validate'
import { computeFulfillmentOptions, isValidHandDeliveryWindow } from '@/lib/checkout/fulfillment'
import { createOrder, type FulfillmentMethod, type ShippingAddress } from '@/lib/db/repos/orders'
import { markProductSold } from '@/lib/db/repos/products'
import { upsertCustomerByEmail } from '@/lib/db/repos/customers'
import { getCustomerSession } from '@/lib/auth/customer'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'
import { createPayment, isSquareEnabled } from '@/lib/payments/square'
import { getDb, getEnv, newId, nowIso } from '@/lib/db/client'

export const runtime = 'edge'

const addressSchema = z.object({
  name: z.string().min(1).max(120),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).nullable().optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(30),
  postalCode: z.string().min(3).max(20),
  country: z.string().min(2).max(3).optional(),
  phone: z.string().max(30).nullable().optional(),
})

const schema = z.object({
  email: z.string().email().max(200),
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().min(1) })).min(1),
  fulfillmentMethod: z.enum(['ship','hand_deliver','pickup','uber_direct','invoice_later']),
  address: addressSchema.optional().nullable(),
  notes: z.string().max(2000).optional(),
  handDelivery: z.object({
    window: z.string().max(40).optional(),
    note: z.string().max(500).optional(),
  }).optional(),
  payment: z.object({
    method: z.enum(['square','invoice_later']),
    sourceId: z.string().optional(),
    idempotencyKey: z.string().uuid().optional(),
  }),
})

async function sendOrderEmails(env: CloudflareEnv, args: {
  email: string
  customerName: string | null
  orderNumber: string
  orderId: string
  subtotalCents: number
  fulfillmentFeeCents: number
  totalCents: number
  items: Array<{ name: string; qty: number; unitPriceCents: number }>
  fulfillmentLabel: string
}) {
  if (!env.RESEND_API_KEY) return
  const dollars = (c: number) => `$${(c / 100).toFixed(2)}`
  const lines = args.items.map(i => `<li>${i.qty} × ${i.name} — ${dollars(i.unitPriceCents * i.qty)}</li>`).join('')
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#111">
      <h2 style="margin:0 0 12px;font-size:20px">Thanks for your order — ${args.orderNumber}</h2>
      <p style="color:#555;line-height:1.5">${args.customerName ? `Hey ${args.customerName}, ` : ''}I got your order and I&rsquo;m on it. Here&rsquo;s the summary:</p>
      <ul style="padding-left:18px;color:#333;line-height:1.6">${lines}</ul>
      <table style="width:100%;margin:16px 0;border-top:1px solid #eee;border-bottom:1px solid #eee;padding:8px 0">
        <tr><td style="padding:4px 0;color:#666">Subtotal</td><td style="text-align:right">${dollars(args.subtotalCents)}</td></tr>
        <tr><td style="padding:4px 0;color:#666">${args.fulfillmentLabel}</td><td style="text-align:right">${dollars(args.fulfillmentFeeCents)}</td></tr>
        <tr><td style="padding:4px 0;font-weight:700">Total</td><td style="text-align:right;font-weight:700">${dollars(args.totalCents)}</td></tr>
      </table>
      <p style="color:#555">I&rsquo;ll reach out with next steps shortly. Reply to this email anytime.</p>
      <p style="margin-top:24px;color:#999;font-size:12px">VURMZ · Centennial, CO · zach@vurmz.com</p>
    </div>
  `
  // Customer confirmation
  fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'VURMZ <orders@vurmz.com>',
      to: args.email,
      subject: `Order ${args.orderNumber} — VURMZ`,
      html,
    }),
  }).catch(() => {})

  // Owner notification
  fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'VURMZ Orders <orders@vurmz.com>',
      to: 'zach@vurmz.com',
      subject: `New order ${args.orderNumber} — ${dollars(args.totalCents)}`,
      html: `<p>New order from <strong>${args.email}</strong>. ${args.fulfillmentLabel}.</p><ul style="padding-left:18px">${lines}</ul><p><a href="https://vurmz.com/admin/orders/${args.orderId}">Open in admin →</a></p>`,
    }),
  }).catch(() => {})
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: parsed.error.issues } }, { status: 422 })
  }
  const body = parsed.data

  // 1. Validate cart server-side (authoritative pricing)
  const cart = await validateCart(body.items)
  if (cart.items.length === 0) {
    return NextResponse.json({ ok: false, error: { code: 'EMPTY_CART' } }, { status: 400 })
  }
  const soldItem = cart.unavailable.find(u => u.reason === 'sold')
  if (soldItem) {
    return NextResponse.json({
      ok: false,
      error: { code: 'ITEM_SOLD', message: 'One of the items in your cart was just sold. Please remove it and try again.', details: cart.unavailable },
    }, { status: 409 })
  }

  // 2. Compute fulfillment options and match the chosen method
  const options = computeFulfillmentOptions({
    subtotalCents: cart.subtotalCents,
    totalWeightGrams: cart.totalWeightGrams,
    address: body.address ?? null,
  })
  const chosen = options.find(o => o.method === body.fulfillmentMethod)
  if (!chosen || chosen.disabled) {
    return NextResponse.json({ ok: false, error: { code: 'FULFILLMENT_UNAVAILABLE' } }, { status: 400 })
  }
  const fulfillmentFeeCents = chosen.priceCents
  const totalCents = cart.subtotalCents + fulfillmentFeeCents

  // Hand delivery: validate the chosen window (if any). Reject unknown values
  // rather than silently dropping them.
  let handDeliveryMeta: { window?: string; windowLabel?: string; note?: string } | null = null
  if (body.fulfillmentMethod === 'hand_deliver') {
    const win = body.handDelivery?.window?.trim() || null
    if (win && !isValidHandDeliveryWindow(win)) {
      return NextResponse.json({ ok: false, error: { code: 'BAD_DELIVERY_WINDOW' } }, { status: 400 })
    }
    handDeliveryMeta = {
      window: win ?? undefined,
      windowLabel: chosen.windows?.find(w => w.key === win)?.label,
      note: body.handDelivery?.note?.trim() || undefined,
    }
  }

  // 3. Upsert customer (so admin sees them immediately)
  const session = await getCustomerSession(req)
  const customer = session?.customer ?? await upsertCustomerByEmail({
    email: body.email,
    name: body.address?.name,
    phone: body.address?.phone ?? null,
  })

  // 4. Create order
  const order = await createOrder({
    customerId: customer.id,
    email: body.email,
    subtotalCents: cart.subtotalCents,
    fulfillmentFeeCents,
    totalCents,
    fulfillmentMethod: body.fulfillmentMethod as FulfillmentMethod,
    fulfillmentAddress: (body.address ?? null) as ShippingAddress | null,
    fulfillmentEta: null,
    notes: body.notes ?? '',
    items: cart.items.map(i => ({
      productId: i.productId,
      nameSnapshot: i.name,
      qty: i.qty,
      unitPriceCents: i.unitPriceCents,
    })),
    channel: 'shop',
    metadata: {
      source: 'checkout',
      ...(handDeliveryMeta ? { handDelivery: handDeliveryMeta } : {}),
    },
  })

  // 5. Payment — Square if requested and enabled, else defer to invoice
  let paymentStatus: 'paid' | 'pending' = 'pending'
  if (body.payment.method === 'square') {
    if (!isSquareEnabled()) {
      return NextResponse.json({ ok: false, error: { code: 'PAYMENT_UNAVAILABLE', message: 'Online payment not yet configured.' } }, { status: 400 })
    }
    if (!body.payment.sourceId || !body.payment.idempotencyKey) {
      return NextResponse.json({ ok: false, error: { code: 'PAYMENT_BAD_REQUEST' } }, { status: 400 })
    }
    const result = await createPayment({
      sourceId: body.payment.sourceId,
      amountCents: totalCents,
      idempotencyKey: body.payment.idempotencyKey,
      referenceId: order.id,
      note: `Order ${order.number}`,
      buyerEmail: body.email,
    })
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: { code: 'PAYMENT_DECLINED', message: result.error } }, { status: 402 })
    }
    const db = getDb()
    await db.prepare(
      `INSERT INTO payments (id, invoice_id, customer_id, amount_cents, status, square_payment_id, square_receipt_url, method_brand, method_last4, metadata, created_at, updated_at)
       VALUES (?, NULL, ?, ?, 'succeeded', ?, ?, ?, ?, '{}', ?, ?)`
    ).bind(
      newId('pay'),
      customer.id,
      totalCents,
      result.paymentId,
      result.receiptUrl,
      result.brand,
      result.last4,
      nowIso(),
      nowIso()
    ).run()
    paymentStatus = 'paid'
  }

  // 6. Mark any one-off items in the order as sold (atomic per-row, race-safe).
  for (const it of cart.items) {
    if (it.oneOff) {
      await markProductSold(it.productId)
    }
  }

  // 7. Send emails (non-blocking)
  const fulfillmentLabel = handDeliveryMeta?.windowLabel
    ? `${chosen.label} — ${handDeliveryMeta.windowLabel}`
    : chosen.label
  await sendOrderEmails(getEnv(), {
    email: body.email,
    customerName: body.address?.name ?? customer.name ?? null,
    orderNumber: order.number,
    orderId: order.id,
    subtotalCents: cart.subtotalCents,
    fulfillmentFeeCents,
    totalCents,
    items: cart.items.map(i => ({ name: `${i.name} (${i.packSize}-pack)`, qty: i.qty, unitPriceCents: i.unitPriceCents })),
    fulfillmentLabel,
  })

  await audit({
    actorType: 'customer',
    actorId: customer.id,
    action: 'order.create',
    targetType: 'order',
    targetId: order.id,
    diff: { totalCents, fulfillmentMethod: body.fulfillmentMethod, paymentStatus },
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
  })

  return NextResponse.json({
    ok: true,
    data: {
      order: { id: order.id, number: order.number, totalCents, paymentStatus },
    },
  })
}
