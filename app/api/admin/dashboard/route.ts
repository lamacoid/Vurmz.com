import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/client'
import { listOrderItemFlags } from '@/lib/db/repos/orders'

export const runtime = 'edge'

/**
 * One round trip for the Today view: actionable orders (with proof state and
 * personalization flags), status counts, and money (7d collected + pipeline).
 */
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const db = getDb()
    const [actionRows, countRows, collected, pipeline, flags] = await Promise.all([
      db.prepare(
        `SELECT id, number, email, status, total_cents, fulfillment_method, notes, metadata, created_at
         FROM orders WHERE status IN ('new','confirmed','in_progress')
         ORDER BY created_at DESC LIMIT 10`
      ).all<{ id: string; number: string; email: string; status: string; total_cents: number; fulfillment_method: string; notes: string; metadata: string; created_at: string }>(),
      db.prepare(`SELECT status, COUNT(*) n FROM orders GROUP BY status`).all<{ status: string; n: number }>(),
      db.prepare(
        `SELECT COALESCE(SUM(amount_cents),0) c FROM payments WHERE status='succeeded' AND created_at >= datetime('now','-7 day')`
      ).first<{ c: number }>(),
      db.prepare(
        `SELECT COALESCE(SUM(total_cents),0) c FROM orders WHERE status IN ('new','confirmed','in_progress','ready')`
      ).first<{ c: number }>(),
      listOrderItemFlags(),
    ])

    const counts = Object.fromEntries(countRows.results.map(r => [r.status, r.n]))
    const orders = actionRows.results.map(r => {
      let meta: { attachments?: unknown[]; proof?: { status?: string } } = {}
      try { meta = JSON.parse(r.metadata || '{}') } catch {}
      const f = flags[r.id] ?? { hasText: false, hasElement: false }
      const personalized = f.hasText || f.hasElement
      return {
        id: r.id,
        number: r.number,
        email: r.email,
        status: r.status,
        totalCents: r.total_cents,
        fulfillmentMethod: r.fulfillment_method,
        createdAt: r.created_at,
        hasText: f.hasText,
        hasElement: f.hasElement,
        attachmentCount: Array.isArray(meta.attachments) ? meta.attachments.length : 0,
        // Personalized orders default to "proof needed" until marked otherwise.
        proofStatus: meta.proof?.status ?? (personalized ? 'needed' : null),
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        orders,
        counts,
        proofsOwed: orders.filter(o => o.proofStatus === 'needed').length,
        revenue7dCents: collected?.c ?? 0,
        pipelineCents: pipeline?.c ?? 0,
      },
    })
  })
}
