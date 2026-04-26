import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getDb } from '@/lib/db/client'

export const runtime = 'edge'

interface MonthRow { month: string; revenue_cents: number; order_count: number }
interface OutstandingRow { total_cents: number; count: number }
interface TopProductRow { name_snapshot: string; revenue_cents: number; qty: number }

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const months = Math.min(24, Number(url.searchParams.get('months') ?? 12))
    const db = getDb()

    // Revenue by month (from paid invoices + completed orders' payments)
    const monthlyRes = await db.prepare(
      `SELECT substr(created_at, 1, 7) as month,
              SUM(amount_cents) as revenue_cents,
              COUNT(*) as order_count
       FROM payments
       WHERE status = 'succeeded'
       GROUP BY month
       ORDER BY month DESC
       LIMIT ?`
    ).bind(months).all<MonthRow>()

    // Outstanding invoices (sent/viewed/overdue)
    const outstanding = await db.prepare(
      `SELECT COALESCE(SUM(total_cents - amount_paid_cents), 0) as total_cents, COUNT(*) as count
       FROM invoices
       WHERE status IN ('sent','viewed','overdue','partially_paid')`
    ).first<OutstandingRow>()

    // Top products from order_items
    const topProducts = await db.prepare(
      `SELECT oi.name_snapshot,
              SUM(oi.qty * oi.unit_price_cents) as revenue_cents,
              SUM(oi.qty) as qty
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE o.status IN ('delivered','ready','in_progress','confirmed')
       GROUP BY oi.name_snapshot
       ORDER BY revenue_cents DESC
       LIMIT 10`
    ).all<TopProductRow>()

    // Totals
    const totals = await db.prepare(
      `SELECT
         (SELECT COALESCE(SUM(amount_cents), 0) FROM payments WHERE status = 'succeeded') as revenue_ever,
         (SELECT COALESCE(SUM(amount_cents), 0) FROM payments WHERE status = 'succeeded' AND created_at >= date('now', 'start of month')) as revenue_month,
         (SELECT COUNT(*) FROM orders WHERE status NOT IN ('cancelled','refunded')) as orders_total,
         (SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL) as customers_total`
    ).first<{ revenue_ever: number; revenue_month: number; orders_total: number; customers_total: number }>()

    return NextResponse.json({
      ok: true,
      data: {
        monthly: monthlyRes.results.reverse(),
        outstanding: {
          totalCents: outstanding?.total_cents ?? 0,
          count: outstanding?.count ?? 0,
        },
        topProducts: topProducts.results,
        totals: totals ?? { revenue_ever: 0, revenue_month: 0, orders_total: 0, customers_total: 0 },
      },
    })
  })
}
