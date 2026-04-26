import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateCart } from '@/lib/checkout/validate'
import { computeFulfillmentOptions } from '@/lib/checkout/fulfillment'

export const runtime = 'edge'

const schema = z.object({
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().min(1) })).min(1),
  address: z.object({
    name: z.string().optional(),
    line1: z.string().optional(),
    line2: z.string().nullable().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().nullable().optional(),
  }).partial().optional(),
})

export async function POST(req: NextRequest) {
  const body = schema.safeParse(await req.json().catch(() => null))
  if (!body.success) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
  }
  const cart = await validateCart(body.data.items)
  if (cart.items.length === 0) {
    return NextResponse.json({ ok: false, error: { code: 'EMPTY_CART' } }, { status: 400 })
  }
  const options = computeFulfillmentOptions({
    subtotalCents: cart.subtotalCents,
    totalWeightGrams: cart.totalWeightGrams,
    address: body.data.address ?? null,
  })
  return NextResponse.json({
    ok: true,
    data: {
      subtotalCents: cart.subtotalCents,
      totalWeightGrams: cart.totalWeightGrams,
      items: cart.items,
      fulfillmentOptions: options,
    },
  })
}
