export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const valid = await validateSession(req)
  if (!valid) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true })
}
