export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { destroyAdminSession } from '@/lib/auth/admin'

export async function POST(req: NextRequest) {
  const cookie = await destroyAdminSession(req)
  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', cookie)
  return res
}
