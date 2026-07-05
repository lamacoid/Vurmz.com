import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/client'
import { listOrderItemFlags } from '@/lib/db/repos/orders'
import type { RailTicket } from '@/lib/admin/next-action'

export const runtime = 'edge'

/**
 * One round trip for the Today view: the ticket rail (every order not yet
 * delivered, as a RailTicket with customer, items, and engraving), status
 * counts, and money (7d collected + pipeline).
 */
/**
 * Settlement is DERIVED, never copied (RAIL-SYSTEM-PLAN Phase B, I1):
 * cash mark on the order, a succeeded payment referencing it, or its
 * linked invoice paid. Used both to compute each ticket's settled flag
 * and to keep delivered-but-unpaid orders ON the rail (I5).
 */
const SETTLED_SQL = `(
  COALESCE(json_extract(o.metadata,'$.payment.settled'), 0) = 1
  OR EXISTS(SELECT 1 FROM invoices i WHERE i.order_id = o.id AND i.status = 'paid')
  OR EXISTS(SELECT 1 FROM payments p WHERE p.status = 'succeeded' AND json_extract(p.metadata,'$.orderId') = o.id)
)`
const ON_RAIL_SQL = `(o.status IN ('new','confirmed','in_progress','ready') OR (o.status = 'delivered' AND NOT ${SETTLED_SQL}))`

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const db = getDb()
    const [actionRows, countRows, collected, pipeline, flags, itemRows, dueTodayRow, newSinceRow] = await Promise.all([
      // The rail: open work plus delivered-but-unpaid, customer joined in.
      db.prepare(
        `SELECT o.id, o.number, o.email, o.status, o.total_cents, o.fulfillment_method,
                o.fulfillment_eta, o.metadata, o.created_at,
                c.name AS customer_name, c.phone AS customer_phone,
                CASE WHEN ${SETTLED_SQL} THEN 1 ELSE 0 END AS settled
         FROM orders o LEFT JOIN customers c ON c.id = o.customer_id
         WHERE ${ON_RAIL_SQL}
         ORDER BY o.created_at ASC LIMIT 50`
      ).all<{ id: string; number: string; email: string; status: string; total_cents: number; fulfillment_method: string; fulfillment_eta: string | null; metadata: string; created_at: string; customer_name: string | null; customer_phone: string | null; settled: number }>(),
      db.prepare(`SELECT status, COUNT(*) n FROM orders GROUP BY status`).all<{ status: string; n: number }>(),
      db.prepare(
        `SELECT COALESCE(SUM(amount_cents),0) c FROM payments WHERE status='succeeded' AND created_at >= datetime('now','-7 day')`
      ).first<{ c: number }>(),
      // Owed to you = everything on the rail that has not settled yet.
      db.prepare(
        `SELECT COALESCE(SUM(o.total_cents),0) c FROM orders o WHERE ${ON_RAIL_SQL} AND NOT ${SETTLED_SQL}`
      ).first<{ c: number }>(),
      listOrderItemFlags(),
      // Item lines for the WHAT on each ticket.
      db.prepare(
        `SELECT oi.order_id, oi.name_snapshot, oi.qty, oi.metadata
         FROM order_items oi JOIN orders o ON o.id = oi.order_id
         WHERE ${ON_RAIL_SQL}
         ORDER BY oi.position`
      ).all<{ order_id: string; name_snapshot: string; qty: number; metadata: string }>(),
      db.prepare(
        `SELECT COUNT(*) c FROM orders WHERE status IN ('new','confirmed','in_progress','ready') AND date(fulfillment_eta) = date('now')`
      ).first<{ c: number }>(),
      db.prepare(
        `SELECT COUNT(*) c FROM orders WHERE created_at >= datetime('now','-1 day')`
      ).first<{ c: number }>(),
    ])

    // Fold items into per-order summary + the first engraving payload.
    const itemsByOrder = new Map<string, { summary: string[]; engraving: RailTicket['engraving'] }>()
    for (const it of itemRows.results) {
      const entry = itemsByOrder.get(it.order_id) ?? { summary: [], engraving: null }
      entry.summary.push(it.qty > 1 ? `${it.qty}× ${it.name_snapshot}` : it.name_snapshot)
      if (!entry.engraving) {
        try {
          const m = JSON.parse(it.metadata || '{}') as { engraving?: { text?: string; fontValue?: string; fontLabel?: string; placement?: string; element?: { label?: string; thumb?: string } } }
          if (m.engraving) {
            entry.engraving = {
              text: m.engraving.text,
              fontValue: m.engraving.fontValue,
              fontLabel: m.engraving.fontLabel,
              placement: m.engraving.placement,
              elementLabel: m.engraving.element?.label,
              elementThumb: m.engraving.element?.thumb,
            }
          }
        } catch {}
      }
      itemsByOrder.set(it.order_id, entry)
    }

    const counts = Object.fromEntries(countRows.results.map(r => [r.status, r.n]))
    const tickets: RailTicket[] = actionRows.results.map(r => {
      let meta: { attachments?: unknown[]; proof?: { status?: string } } = {}
      try { meta = JSON.parse(r.metadata || '{}') } catch {}
      const f = flags[r.id] ?? { hasText: false, hasElement: false }
      const personalized = f.hasText || f.hasElement
      const items = itemsByOrder.get(r.id) ?? { summary: [], engraving: null }
      return {
        kind: 'order' as const,
        id: r.id,
        number: r.number,
        status: r.status as RailTicket['status'],
        // Personalized orders default to "proof needed" until marked otherwise.
        proofStatus: (meta.proof?.status as RailTicket['proofStatus']) ?? (personalized ? 'needed' : null),
        personalized,
        customerName: r.customer_name || r.email.split('@')[0],
        email: r.email,
        phone: r.customer_phone,
        totalCents: r.total_cents,
        itemsSummary: items.summary.join(' · '),
        engraving: items.engraving,
        fulfillmentMethod: r.fulfillment_method,
        eta: r.fulfillment_eta,
        createdAt: r.created_at,
        settled: r.settled === 1,
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        tickets,
        counts,
        proofsOwed: tickets.filter(t => t.proofStatus === 'needed').length,
        dueToday: dueTodayRow?.c ?? 0,
        newSinceYesterday: newSinceRow?.c ?? 0,
        revenue7dCents: collected?.c ?? 0,
        pipelineCents: pipeline?.c ?? 0,
      },
    })
  })
}
