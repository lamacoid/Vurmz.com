export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
const SQUARE_API_URL = 'https://connect.squareup.com'

interface SquarePayment {
  id: string
  created_at: string
  updated_at: string
  amount_money: {
    amount: number
    currency: string
  }
  status: string
  source_type: string
  note?: string
  order_id?: string
  receipt_url?: string
}

interface SquarePaymentsResponse {
  payments?: SquarePayment[]
  cursor?: string
  errors?: Array<{ detail: string }>
}

export async function GET(request: NextRequest) {
  if (!SQUARE_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Square not configured' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // day, week, month, year

    // Calculate date range
    const now = new Date()
    let beginTime: Date

    switch (period) {
      case 'day':
        beginTime = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        const dayOfWeek = now.getDay()
        beginTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
        break
      case 'year':
        beginTime = new Date(now.getFullYear(), 0, 1)
        break
      case 'month':
      default:
        beginTime = new Date(now.getFullYear(), now.getMonth(), 1)
        break
    }

    // Fetch payments from Square
    const payments: SquarePayment[] = []
    let cursor: string | undefined

    do {
      const url = new URL(`${SQUARE_API_URL}/v2/payments`)
      url.searchParams.set('begin_time', beginTime.toISOString())
      url.searchParams.set('end_time', now.toISOString())
      url.searchParams.set('sort_order', 'DESC')
      if (cursor) {
        url.searchParams.set('cursor', cursor)
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Square-Version': '2024-01-18',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        }
      })

      const data = await response.json() as SquarePaymentsResponse

      if (data.errors) {
        console.error('Square API error:', data.errors)
        return NextResponse.json({ error: data.errors[0]?.detail || 'Square API error' }, { status: 500 })
      }

      if (data.payments) {
        payments.push(...data.payments)
      }

      cursor = data.cursor
    } while (cursor)

    // Filter only completed payments
    const completedPayments = payments.filter(p => p.status === 'COMPLETED')

    // Calculate totals
    const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount_money?.amount || 0), 0) / 100
    const totalTransactions = completedPayments.length

    // Group by day for chart data
    const dailyRevenue: Record<string, number> = {}
    completedPayments.forEach(payment => {
      const date = payment.created_at.split('T')[0]
      dailyRevenue[date] = (dailyRevenue[date] || 0) + (payment.amount_money?.amount || 0) / 100
    })

    // Convert to sorted array
    const chartData = Object.entries(dailyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount }))

    // Recent transactions (last 10)
    const recentTransactions = completedPayments.slice(0, 10).map(p => ({
      id: p.id,
      date: p.created_at,
      amount: (p.amount_money?.amount || 0) / 100,
      note: p.note || '',
      receiptUrl: p.receipt_url || null,
      sourceType: p.source_type
    }))

    // Calculate average transaction
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    return NextResponse.json({
      period,
      totalRevenue,
      totalTransactions,
      avgTransaction,
      chartData,
      recentTransactions,
      dateRange: {
        start: beginTime.toISOString(),
        end: now.toISOString()
      }
    })
  } catch (error) {
    console.error('Revenue API error:', error)
    return NextResponse.json({ error: 'Failed to fetch revenue data', details: String(error) }, { status: 500 })
  }
}
