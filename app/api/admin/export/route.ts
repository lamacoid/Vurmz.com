import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/client'

export const runtime = 'edge'

function csvEscape(v: unknown): string {
  const s = v == null ? '' : String(v)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const head = headers.join(',')
  const body = rows.map(r => headers.map(h => csvEscape(r[h])).join(',')).join('\n')
  return `${head}\n${body}\n`
}

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const type = url.searchParams.get('type') ?? 'orders'
    const db = getDb()

    let rows: Record<string, unknown>[] = []
    let filename = 'export.csv'

    if (type === 'orders') {
      const { results } = await db.prepare(
        `SELECT number, email, status, fulfillment_method, subtotal_cents, fulfillment_fee_cents, total_cents, created_at
         FROM orders ORDER BY created_at DESC LIMIT 5000`
      ).all<Record<string, unknown>>()
      rows = results
      filename = `vurmz-orders-${new Date().toISOString().slice(0,10)}.csv`
    } else if (type === 'invoices') {
      const { results } = await db.prepare(
        `SELECT number, customer_id, status, total_cents, amount_paid_cents, due_date, created_at, paid_at
         FROM invoices ORDER BY created_at DESC LIMIT 5000`
      ).all<Record<string, unknown>>()
      rows = results
      filename = `vurmz-invoices-${new Date().toISOString().slice(0,10)}.csv`
    } else if (type === 'customers') {
      const { results } = await db.prepare(
        `SELECT email, name, phone, company, lifetime_value_cents, order_count, created_at
         FROM customers WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 10000`
      ).all<Record<string, unknown>>()
      rows = results
      filename = `vurmz-customers-${new Date().toISOString().slice(0,10)}.csv`
    } else if (type === 'payments') {
      const { results } = await db.prepare(
        `SELECT square_payment_id, amount_cents, status, method_brand, method_last4, invoice_id, customer_id, created_at
         FROM payments ORDER BY created_at DESC LIMIT 10000`
      ).all<Record<string, unknown>>()
      rows = results
      filename = `vurmz-payments-${new Date().toISOString().slice(0,10)}.csv`
    } else {
      return NextResponse.json({ ok: false, error: { code: 'BAD_TYPE' } }, { status: 400 })
    }

    const csv = rowsToCsv(rows)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  })
}
