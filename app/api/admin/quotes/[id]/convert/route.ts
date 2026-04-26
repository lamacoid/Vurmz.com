import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getQuoteById, listQuoteItems, markQuoteConverted } from '@/lib/db/repos/quotes'
import { upsertCustomerByEmail } from '@/lib/db/repos/customers'
import { createInvoice } from '@/lib/db/repos/invoices'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

/**
 * Convert a quote into a draft invoice for the same customer.
 * Caller can then send the invoice from /admin/invoices/[id].
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const quote = await getQuoteById(id)
    if (!quote) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    if (quote.status === 'converted') return NextResponse.json({ ok: false, error: { code: 'ALREADY_CONVERTED' } }, { status: 400 })
    const items = await listQuoteItems(id)
    const customer = await upsertCustomerByEmail({ email: quote.email })

    const invoice = await createInvoice({
      customerId: customer.id,
      items: items.map(it => ({ description: it.description, qty: it.qty, unitPriceCents: it.unitPriceCents })),
      notes: quote.notes ? `From quote ${quote.number}:\n${quote.notes}` : `Converted from quote ${quote.number}`,
    })

    // Mark the quote as converted — we store the invoice id in converted_order_id
    // (same column covers both order and invoice references for now)
    await markQuoteConverted(id, invoice.id)

    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'quote.convert', targetType: 'quote', targetId: id,
      diff: { invoiceId: invoice.id, invoiceNumber: invoice.number },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })

    return NextResponse.json({ ok: true, data: { invoiceId: invoice.id, invoiceNumber: invoice.number } })
  })
}
