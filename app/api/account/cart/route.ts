import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCustomerSession } from '@/lib/auth/customer'
import { getCustomerCart, saveCustomerCart, clearCustomerCart, type ServerCartItem } from '@/lib/db/repos/carts'

export const runtime = 'edge'

const itemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable().optional(),
  variantName: z.string().max(100).nullable().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  priceCents: z.number().int().nonnegative(),
  packSize: z.number().int().min(1),
  qty: z.number().int().min(1).max(999),
  heroUrl: z.string().nullable(),
  oneOff: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

const putSchema = z.object({
  items: z.array(itemSchema),
  notes: z.string().max(2000).optional(),
})

export async function GET(req: NextRequest) {
  const session = await getCustomerSession(req)
  if (!session) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  const cart = await getCustomerCart(session.customer.id)
  return NextResponse.json({
    ok: true,
    data: { cart: cart ?? { id: null, items: [], notes: '', updatedAt: null } },
  })
}

export async function PUT(req: NextRequest) {
  const session = await getCustomerSession(req)
  if (!session) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  const body = putSchema.safeParse(await req.json().catch(() => null))
  if (!body.success) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
  }
  const cart = await saveCustomerCart(
    session.customer.id,
    body.data.items as ServerCartItem[],
    body.data.notes ?? ''
  )
  return NextResponse.json({ ok: true, data: { cart } })
}

export async function DELETE(req: NextRequest) {
  const session = await getCustomerSession(req)
  if (!session) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  await clearCustomerCart(session.customer.id)
  return NextResponse.json({ ok: true })
}
