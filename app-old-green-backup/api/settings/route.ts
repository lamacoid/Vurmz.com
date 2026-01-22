export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, now } from '@/lib/d1'

// GET - Get settings
export async function GET() {
  try {
    const db = getD1()
    let settings = await db.prepare('SELECT * FROM settings WHERE id = ?').bind('default').first()

    if (!settings) {
      await db.prepare("INSERT INTO settings (id, business_name) VALUES ('default', 'VURMZ LLC')").run()
      settings = await db.prepare('SELECT * FROM settings WHERE id = ?').bind('default').first()
    }

    // Map to camelCase for frontend
    return NextResponse.json({
      id: (settings as any).id,
      businessName: (settings as any).business_name,
      phone: (settings as any).phone,
      email: (settings as any).email,
      address: (settings as any).address,
      city: (settings as any).city,
      state: (settings as any).state,
      zip: (settings as any).zip,
      serviceRadius: (settings as any).service_radius,
      minOrderFreeDelivery: (settings as any).min_order_free_delivery,
      deliveryFee: (settings as any).delivery_fee,
      salesTaxRate: (settings as any).sales_tax_rate,
      businessHours: (settings as any).business_hours,
      primaryColor: (settings as any).primary_color,
      logoUrl: (settings as any).logo_url
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

interface SettingsInput {
  id: string
  businessName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  serviceRadius: number
  minOrderFreeDelivery: number
  deliveryFee: number
  salesTaxRate: number
  businessHours: string
}

// PATCH - Update settings
export async function PATCH(request: NextRequest) {
  try {
    const db = getD1()
    const data = await request.json() as SettingsInput
    const timestamp = now()

    await db.prepare(`
      UPDATE settings SET
        business_name = ?,
        phone = ?,
        email = ?,
        address = ?,
        city = ?,
        state = ?,
        zip = ?,
        service_radius = ?,
        min_order_free_delivery = ?,
        delivery_fee = ?,
        sales_tax_rate = ?,
        business_hours = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      data.businessName,
      data.phone,
      data.email,
      data.address,
      data.city,
      data.state,
      data.zip,
      data.serviceRadius,
      data.minOrderFreeDelivery,
      data.deliveryFee,
      data.salesTaxRate,
      data.businessHours,
      timestamp,
      data.id
    ).run()

    const settings = await db.prepare('SELECT * FROM settings WHERE id = ?').bind(data.id).first()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
