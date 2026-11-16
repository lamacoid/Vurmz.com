import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb, newId } from '@/lib/db/client'
import { EXPENSE_CATEGORIES, keys, listExceptions, listLedger, monthlySummary, post, type LedgerKind } from '@/lib/money/ledger'
import { getSetting } from '@/lib/db/repos/settings'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

/**
 * GET /api/admin/ledger
 *   ?view=summary  months, totals, owed, exceptions, books status (the Money room)
 *   ?view=lines    recent lines, filter by kind / from / to
 */
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const view = url.searchParams.get('view') ?? 'summary'
    if (view === 'lines') {
      const kind = url.searchParams.get('kind') as LedgerKind | null
      const lines = await listLedger({
        kind: kind ?? undefined,
        from: url.searchParams.get('from') ?? undefined,
        to: url.searchParams.get('to') ?? undefined,
        limit: Number(url.searchParams.get('limit') ?? 100),
        offset: Number(url.searchParams.get('offset') ?? 0),
      })
      return NextResponse.json({ ok: true, data: { lines } })
    }

    const db = getDb()
    const [months, exceptions, totals, owed, books, square] = await Promise.all([
      monthlySummary(12),
      listExceptions(25),
      db.prepare(
        `SELECT
           COALESCE(SUM(CASE WHEN kind IN ('sale','refund') AND occurred_at >= date('now','start of month') THEN amount_cents END),0) AS income_month,
           COALESCE(SUM(CASE WHEN kind IN ('sale','refund') AND occurred_at >= date('now','start of year') THEN amount_cents END),0) AS income_year,
           COALESCE(SUM(CASE WHEN kind IN ('expense','fee') AND occurred_at >= date('now','start of year') THEN amount_cents END),0) AS spent_year,
           COALESCE(SUM(CASE WHEN kind IN ('sale','refund') AND occurred_at >= datetime('now','-7 day') THEN amount_cents END),0) AS income_week
         FROM ledger`
      ).first<{ income_month: number; income_year: number; spent_year: number; income_week: number }>(),
      // Owed: open invoices plus delivered-but-unsettled orders, net of what has landed.
      db.prepare(
        `SELECT
           (SELECT COALESCE(SUM(i.total_cents - i.amount_paid_cents),0) FROM invoices i WHERE i.status IN ('sent','viewed','overdue','partially_paid')) AS invoices_cents,
           (SELECT COUNT(*) FROM invoices i WHERE i.status IN ('sent','viewed','overdue','partially_paid')) AS invoices_n,
           (SELECT COALESCE(SUM(o.total_cents - COALESCE((SELECT SUM(l.amount_cents) FROM ledger l WHERE l.order_id = o.id AND l.kind = 'sale'),0)),0)
              FROM orders o WHERE o.status = 'delivered'
              AND COALESCE((SELECT SUM(l.amount_cents) FROM ledger l WHERE l.order_id = o.id AND l.kind = 'sale'),0) < o.total_cents
              AND NOT EXISTS (SELECT 1 FROM invoices i WHERE i.order_id = o.id AND i.status IN ('sent','viewed','overdue','partially_paid'))) AS delivered_cents,
           (SELECT COUNT(*) FROM orders o WHERE o.status = 'delivered'
              AND COALESCE((SELECT SUM(l.amount_cents) FROM ledger l WHERE l.order_id = o.id AND l.kind = 'sale'),0) < o.total_cents
              AND NOT EXISTS (SELECT 1 FROM invoices i WHERE i.order_id = o.id AND i.status IN ('sent','viewed','overdue','partially_paid'))) AS delivered_n`
      ).first<{ invoices_cents: number; invoices_n: number; delivered_cents: number; delivered_n: number }>(),
      getSetting<{ at: string; year: number; key: string; lines: number }>('books_last'),
      getSetting<{ at: string; report: { ok: boolean; payments: { posted: number; unmatched: number }; error?: string } }>('square_sync_last'),
    ])
    return NextResponse.json({
      ok: true,
      data: {
        months,
        exceptions,
        totals: totals ?? { income_month: 0, income_year: 0, spent_year: 0, income_week: 0 },
        owed: owed ?? { invoices_cents: 0, invoices_n: 0, delivered_cents: 0, delivered_n: 0 },
        books,
        square,
        categories: EXPENSE_CATEGORIES,
      },
    })
  })
}

const postSchema = z.object({
  kind: z.enum(['expense', 'adjustment']),
  amountCents: z.number().int().min(-10_000_000).max(10_000_000).refine(n => n !== 0, 'amount cannot be zero'),
  occurredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}/).optional(),
  category: z.string().max(40).optional(),
  note: z.string().max(1000).optional(),
  receiptKey: z.string().max(320).optional(),
  orderId: z.string().max(60).optional(),
  /** Client-generated id so a double submit posts once. */
  clientId: z.string().max(60).optional(),
})

/** POST /api/admin/ledger: an expense (or a noted adjustment). */
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async session => {
    const body = postSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    const d = body.data
    if (d.kind === 'expense' && d.amountCents < 0) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Expenses are entered as a positive amount.' } }, { status: 422 })
    }
    if (d.kind === 'adjustment' && !d.note?.trim()) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'An adjustment needs a note saying why.' } }, { status: 422 })
    }
    const id = d.clientId?.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40) || newId()
    const occurredAt = d.occurredAt ? new Date(d.occurredAt).toISOString() : undefined
    if (d.occurredAt && Number.isNaN(new Date(d.occurredAt).getTime())) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Bad date.' } }, { status: 422 })
    }
    const { entry, inserted } = await post({
      postingKey: d.kind === 'expense' ? keys.expense(id) : keys.adjustment(id),
      kind: d.kind,
      amountCents: d.amountCents,
      occurredAt,
      category: d.category?.trim() || (d.kind === 'expense' ? 'other' : 'adjustment'),
      note: d.note?.trim() ?? '',
      receiptKey: d.receiptKey ?? null,
      orderId: d.orderId ?? null,
      method: 'other',
      source: 'manual',
      createdBy: session.email ?? 'admin',
    })
    if (inserted) {
      await audit({
        actorType: 'admin', actorId: session.email ?? null,
        action: `ledger.${d.kind}`, targetType: 'ledger', targetId: entry.id,
        diff: { amountCents: entry.amountCents, category: entry.category },
        ip: getClientIp(req), userAgent: getUserAgent(req),
      })
    }
    return NextResponse.json({ ok: true, data: { entry, inserted } }, { status: inserted ? 201 : 200 })
  })
}
