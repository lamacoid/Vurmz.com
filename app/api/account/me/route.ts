import { NextRequest, NextResponse } from 'next/server'
import { getCustomerSession } from '@/lib/auth/customer'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const session = await getCustomerSession(req)
  if (!session) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
  const { customer } = session
  return NextResponse.json({
    ok: true,
    data: {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
      },
    },
  })
}
