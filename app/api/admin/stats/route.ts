export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

export async function GET() {
  try {
    const db = getD1()

    // Get date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString()

    // Run all queries in parallel
    const [
      // Current counts
      pendingQuotes,
      activeOrders,
      completedThisMonth,
      totalCustomers,

      // Revenue
      revenueThisMonth,
      revenueLastMonth,
      revenueThisWeek,

      // Recent activity
      recentOrders,

      // Top products (most ordered)
      topProducts,

      // Orders by status
      ordersByStatus
    ] = await Promise.all([
      // Pending quotes
      db.prepare("SELECT COUNT(*) as count FROM quotes WHERE status IN ('new', 'pending', 'PENDING')").first(),

      // Active orders (not completed)
      db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('PENDING', 'IN_PROGRESS')").first(),

      // Completed this month
      db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'COMPLETED' AND completed_at >= ?")
        .bind(startOfMonth).first(),

      // Total customers
      db.prepare("SELECT COUNT(*) as count FROM customers").first(),

      // Revenue this month
      db.prepare("SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE payment_status = 'paid' AND created_at >= ?")
        .bind(startOfMonth).first(),

      // Revenue last month
      db.prepare("SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE payment_status = 'paid' AND created_at >= ? AND created_at <= ?")
        .bind(startOfLastMonth, endOfLastMonth).first(),

      // Revenue this week
      db.prepare("SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE payment_status = 'paid' AND created_at >= ?")
        .bind(startOfWeek).first(),

      // Recent orders (last 5)
      db.prepare(`
        SELECT o.id, o.order_number, o.status, o.price, o.created_at, c.name as customer_name
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.created_at DESC LIMIT 5
      `).all(),

      // Top products
      db.prepare(`
        SELECT material as product, COUNT(*) as count, SUM(price) as revenue
        FROM orders
        GROUP BY material
        ORDER BY count DESC
        LIMIT 5
      `).all(),

      // Orders by status
      db.prepare(`
        SELECT status, COUNT(*) as count
        FROM orders
        GROUP BY status
      `).all()
    ])

    // Calculate month-over-month growth
    const thisMonthRev = (revenueThisMonth as any)?.total || 0
    const lastMonthRev = (revenueLastMonth as any)?.total || 0
    const growth = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1) : 0

    return NextResponse.json({
      overview: {
        pendingQuotes: (pendingQuotes as any)?.count || 0,
        activeOrders: (activeOrders as any)?.count || 0,
        completedThisMonth: (completedThisMonth as any)?.count || 0,
        totalCustomers: (totalCustomers as any)?.count || 0
      },
      revenue: {
        thisMonth: thisMonthRev,
        lastMonth: lastMonthRev,
        thisWeek: (revenueThisWeek as any)?.total || 0,
        monthOverMonthGrowth: growth
      },
      recentOrders: (recentOrders.results || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number,
        status: o.status,
        price: o.price,
        customerName: o.customer_name,
        createdAt: o.created_at
      })),
      topProducts: (topProducts.results || []).map((p: any) => ({
        product: p.product,
        count: p.count,
        revenue: p.revenue
      })),
      ordersByStatus: (ordersByStatus.results || []).reduce((acc: any, s: any) => {
        acc[s.status] = s.count
        return acc
      }, {})
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
