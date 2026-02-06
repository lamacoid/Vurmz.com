export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth-helpers'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear session cookie
  response.cookies.delete(SESSION_COOKIE)

  // Clear any legacy cookies that may still exist
  response.cookies.delete('vurmz_admin_session')
  response.cookies.delete('vurmz_portal_session')
  response.cookies.delete('portal_session')
  response.cookies.delete('portal_customer_id')

  return response
}
