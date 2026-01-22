export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

// GET - Export orders as CSV
export async function GET(request: NextRequest) {
  try {
    const db = getD1()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const from = searchParams.get('from') // Date range start
    const to = searchParams.get('to') // Date range end

    let query = `
      SELECT
        o.order_number,
        o.project_description,
        o.material,
        o.quantity,
        o.price,
        o.status,
        o.payment_status,
        o.delivery_method,
        o.due_date,
        o.created_at,
        o.completed_at,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.company as customer_company
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      query += ' AND o.status = ?'
      params.push(status)
    }

    if (from) {
      query += ' AND o.created_at >= ?'
      params.push(from)
    }

    if (to) {
      query += ' AND o.created_at <= ?'
      params.push(to)
    }

    query += ' ORDER BY o.created_at DESC'

    const result = await db.prepare(query).bind(...params).all()
    const orders = result.results || []

    // Build CSV
    const headers = [
      'Order Number',
      'Customer',
      'Company',
      'Email',
      'Phone',
      'Description',
      'Material',
      'Quantity',
      'Price',
      'Status',
      'Payment Status',
      'Delivery Method',
      'Due Date',
      'Created',
      'Completed'
    ]

    const rows = orders.map((o: any) => [
      o.order_number || '',
      o.customer_name || '',
      o.customer_company || '',
      o.customer_email || '',
      o.customer_phone || '',
      `"${(o.project_description || '').replace(/"/g, '""')}"`,
      o.material || '',
      o.quantity || '',
      o.price ? `$${o.price.toFixed(2)}` : '',
      o.status || '',
      o.payment_status || '',
      o.delivery_method || '',
      o.due_date || '',
      o.created_at ? new Date(o.created_at).toLocaleDateString() : '',
      o.completed_at ? new Date(o.completed_at).toLocaleDateString() : ''
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const filename = `vurmz-orders-${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error exporting orders:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
