export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 48; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// POST - Verify magic link token and create session
export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json() as { token?: string; email?: string }

    if (!token || !email) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const db = getD1()

    // Find customer by email
    const customer = await db.prepare(
      'SELECT id, name, email, phone, company, address, city, state, zip, notes FROM customers WHERE email = ?'
    ).bind(email.toLowerCase()).first() as {
      id: string
      name: string
      email: string
      phone: string
      company: string | null
      address: string | null
      city: string | null
      state: string | null
      zip: string | null
      notes: string | null
    } | null

    if (!customer || !customer.notes) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 401 })
    }

    // Parse stored token data
    let tokenData: { loginToken?: string; tokenExpires?: string }
    try {
      tokenData = JSON.parse(customer.notes)
    } catch {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 401 })
    }

    // Verify token
    if (tokenData.loginToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 401 })
    }

    // Check expiration
    if (tokenData.tokenExpires && new Date(tokenData.tokenExpires) < new Date()) {
      return NextResponse.json({ error: 'Link has expired. Please request a new one.' }, { status: 401 })
    }

    // Clear the login token
    await db.prepare(
      'UPDATE customers SET notes = NULL WHERE id = ?'
    ).bind(customer.id).run()

    // Generate session token
    const sessionToken = generateSessionToken()
    const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

    // Store session (using notes field for simplicity - in production use a sessions table)
    await db.prepare(
      'UPDATE customers SET notes = ? WHERE id = ?'
    ).bind(JSON.stringify({
      sessionToken,
      sessionExpires
    }), customer.id).run()

    // Return customer data and session token
    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip
      }
    })

    // Set session cookie
    response.cookies.set('portal_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    })

    response.cookies.set('portal_customer_id', customer.id, {
      httpOnly: false, // Allow JS access for client-side checks
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ error: 'Failed to verify link' }, { status: 500 })
  }
}
