export const runtime = 'edge'

import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear all possible session cookies
  response.cookies.delete('vurmz_admin_session')
  response.cookies.delete('vurmz_session') // legacy
  response.cookies.delete('vurmz_portal_session')
  response.cookies.delete('portal_session')
  response.cookies.delete('portal_customer_id')

  return response
}
