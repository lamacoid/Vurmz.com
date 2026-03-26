export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const cookie = await deleteSession(req)
  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', cookie)
  return res
}
