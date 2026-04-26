import { NextRequest, NextResponse } from 'next/server'
import { requireCustomer } from '@/lib/auth/customer'
import { listInvoices } from '@/lib/db/repos/invoices'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const session = await requireCustomer(req)
    const invoices = await listInvoices({ customerId: session.customer.id, limit: 100 })
    // Hide drafts from the customer
    return NextResponse.json({ ok: true, data: { invoices: invoices.filter(i => i.status !== 'draft') } })
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status })
  }
}
