import { NextRequest, NextResponse } from 'next/server'
import { getCustomerSession } from '@/lib/auth/customer'
import { getDesignForOwner } from '@/lib/designer/designs-repo'

export const runtime = 'edge'

/** One saved design, for its owner: the account that made it, or the guest token that made it. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const session = await getCustomerSession(req)
  const token = req.nextUrl.searchParams.get('token')
  const design = await getDesignForOwner(id, { customerId: session?.customer.id ?? null, guestToken: token })
  if (!design) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
  return NextResponse.json({ ok: true, data: { design } })
}
