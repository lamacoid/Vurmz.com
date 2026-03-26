export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'

// Secret URL to set owner cookie: vurmz.com/api/set-owner?key=vurmz-zach-2024
const OWNER_KEY = 'vurmz-zach-2024'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')

  if (key !== OWNER_KEY) {
    return NextResponse.json({ error: 'nope' }, { status: 403 })
  }

  const res = NextResponse.json({
    ok: true,
    message: 'Owner cookie set. Your visits will no longer be tracked in custom analytics.'
  })

  // Set cookie for 1 year, httpOnly, secure, same-site lax
  res.cookies.set('vurmz_owner', '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: '/',
  })

  return res
}
