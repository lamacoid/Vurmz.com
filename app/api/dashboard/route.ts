export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

export async function GET() {
  try {
    const db = getD1()

    // Get counts
    const [pendingQuotes, activeOrders, totalCustomers, lowStockMaterials] = await Promise.all([
      db.prepare("SELECT COUNT(*) as count FROM quotes WHERE status = 'PENDING'").first(),
      db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('PENDING', 'IN_PROGRESS')").first(),
      db.prepare("SELECT COUNT(*) as count FROM customers").first(),
      db.prepare("SELECT COUNT(*) as count FROM materials WHERE quantity_in_stock <= low_stock_threshold").first()
    ])

    // Get recent quotes with customer info
    const recentQuotesResult = await db.prepare(`
      SELECT q.*, c.name as customer_name, c.business_name as customer_company
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      ORDER BY q.created_at DESC LIMIT 5
    `).all()

    // Get recent orders with customer info
    const recentOrdersResult = await db.prepare(`
      SELECT o.*, c.name as customer_name, c.business_name as customer_company
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC LIMIT 5
    `).all()

    // Calculate monthly revenue
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyRevenueResult = await db.prepare(`
      SELECT SUM(price) as total FROM orders
      WHERE status = 'COMPLETED' AND completed_at >= ?
    `).bind(startOfMonth.toISOString()).first()

    const recentQuotes = (recentQuotesResult.results || []).map((row: any) => ({
      id: row.id,
      projectDescription: row.project_description,
      status: row.status,
      createdAt: row.created_at,
      customer: { name: row.customer_name || 'Unknown', company: row.customer_company || null }
    }))

    const recentOrders = (recentOrdersResult.results || []).map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      projectDescription: row.project_description,
      status: row.status,
      price: row.price || 0,
      createdAt: row.created_at,
      customer: { name: row.customer_name || 'Unknown', company: row.customer_company || null }
    }))

    return NextResponse.json({
      stats: {
        pendingQuotes: (pendingQuotes as any)?.count || 0,
        activeOrders: (activeOrders as any)?.count || 0,
        totalCustomers: (totalCustomers as any)?.count || 0,
        lowStockMaterials: (lowStockMaterials as any)?.count || 0,
        monthlyRevenue: (monthlyRevenueResult as any)?.total || 0
      },
      recentQuotes,
      recentOrders
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
