import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { listCustomers, upsertCustomerByEmail } from '@/lib/db/repos/customers'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const search = url.searchParams.get('q') ?? undefined
    const customers = await listCustomers({ search, limit: 500 })
    return NextResponse.json({ ok: true, data: { customers } })
  })
}

const createSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().max(200).optional(),
  phone: z.string().max(30).nullable().optional(),
  company: z.string().max(200).nullable().optional(),
})

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    }
    const customer = await upsertCustomerByEmail(body.data)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'customer.create', targetType: 'customer', targetId: customer.id,
      diff: { email: customer.email, name: customer.name },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { customer } })
  })
}
