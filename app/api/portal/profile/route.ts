export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

// PUT - Update customer profile
export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('portal_session')?.value
    const customerId = request.cookies.get('portal_customer_id')?.value

    if (!sessionToken || !customerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getD1()

    // Verify session
    const customer = await db.prepare(
      'SELECT id, notes FROM customers WHERE id = ?'
    ).bind(customerId).first() as { id: string; notes: string | null } | null

    if (!customer?.notes) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let sessionData: { sessionToken?: string }
    try {
      sessionData = JSON.parse(customer.notes)
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (sessionData.sessionToken !== sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get update data
    const { name, phone, company, website, bio, address, city, state, zip } = await request.json() as {
      name?: string
      phone?: string
      company?: string
      website?: string
      bio?: string
      address?: string
      city?: string
      state?: string
      zip?: string
    }

    // Update customer - need to preserve session in notes, add website/bio as JSON
    const extendedData = JSON.stringify({
      ...sessionData,
      website: website || null,
      bio: bio || null
    })

    await db.prepare(`
      UPDATE customers SET
        name = ?,
        phone = ?,
        company = ?,
        address = ?,
        city = ?,
        state = ?,
        zip = ?,
        notes = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      name,
      phone,
      company || null,
      address || null,
      city || null,
      state || 'CO',
      zip || null,
      extendedData,
      customerId
    ).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
