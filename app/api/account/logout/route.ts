import { NextRequest, NextResponse } from 'next/server'
import { destroyCustomerSession } from '@/lib/auth/customer'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const cookie = await destroyCustomerSession(req)
  const res = NextResponse.json({ ok: true })
  res.headers.append('Set-Cookie', cookie)
  return res
}
