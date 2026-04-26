import { NextRequest, NextResponse } from 'next/server'
import { requireCustomer } from '@/lib/auth/customer'
import { getInvoiceById, listInvoiceItems, setInvoiceStatus } from '@/lib/db/repos/invoices'

export const runtime = 'edge'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCustomer(req)
    const { id } = await ctx.params
    const invoice = await getInvoiceById(id)
    if (!invoice || invoice.customerId !== session.customer.id) {
      return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    }
    // Mark viewed on first view
    if (invoice.status === 'sent') {
      await setInvoiceStatus(id, 'viewed')
    }
    const items = await listInvoiceItems(id)
    return NextResponse.json({ ok: true, data: { invoice, items } })
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  }
}
