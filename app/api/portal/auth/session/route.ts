export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

// GET - Validate session and get customer data
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('portal_session')?.value
    const customerId = request.cookies.get('portal_customer_id')?.value

    if (!sessionToken || !customerId) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const db = getD1()

    const customer = await db.prepare(
      'SELECT id, name, email, phone, company, address, city, state, zip, notes FROM customers WHERE id = ?'
    ).bind(customerId).first() as {
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
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify session token
    let sessionData: { sessionToken?: string; sessionExpires?: string }
    try {
      sessionData = JSON.parse(customer.notes)
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    if (sessionData.sessionToken !== sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Check expiration
    if (sessionData.sessionExpires && new Date(sessionData.sessionExpires) < new Date()) {
      return NextResponse.json({ authenticated: false, error: 'Session expired' }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
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
  } catch (error) {
    console.error('Error validating session:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}

// DELETE - Logout
export async function DELETE(request: NextRequest) {
  try {
    const customerId = request.cookies.get('portal_customer_id')?.value

    if (customerId) {
      const db = getD1()
      await db.prepare('UPDATE customers SET notes = NULL WHERE id = ?').bind(customerId).run()
    }

    const response = NextResponse.json({ success: true })

    response.cookies.delete('portal_session')
    response.cookies.delete('portal_customer_id')

    return response
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
