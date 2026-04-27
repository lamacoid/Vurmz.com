export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth/admin'

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req)
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, email: session.email })
}
