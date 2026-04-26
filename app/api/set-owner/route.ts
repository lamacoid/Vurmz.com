export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const { env } = getRequestContext()
  const expectedKey = (env as any).OWNER_KEY || 'vurmz-zach-2024'

  if (key !== expectedKey) {
    return NextResponse.json({ error: 'nope' }, { status: 403 })
  }

  const res = NextResponse.json({
    ok: true,
    message: 'Owner cookie set. Your visits will no longer be tracked in custom analytics.'
  })

  res.cookies.set('vurmz_owner', '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
  })

  return res
}
