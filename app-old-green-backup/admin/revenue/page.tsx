'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/AdminShell'

interface ChartDataPoint {
  date: string
  amount: number
}

interface Transaction {
  id: string
  date: string
  amount: number
  note: string
  receiptUrl: string | null
  sourceType: string
}

interface RevenueData {
  period: string
  totalRevenue: number
  totalTransactions: number
  avgTransaction: number
  chartData: ChartDataPoint[]
  recentTransactions: Transaction[]
  dateRange: {
    start: string
    end: string
  }
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/api/square/revenue?period=${period}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch revenue data')
        return res.json() as Promise<RevenueData>
      })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading revenue:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [period])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  // Simple bar chart using CSS
  const maxAmount = data?.chartData.length
    ? Math.max(...data.chartData.map(d => d.amount))
    : 0

  return (
    <AdminShell title="Revenue Dashboard">
      {/* Period Selector */}
      <div className="mb-6 flex gap-2">
        {['day', 'week', 'month', 'year'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              period === p
                ? 'bg-black text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p === 'day' ? 'Today' : `This ${p}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500">Loading revenue data...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4">
          {error}
          <p className="text-sm mt-2">Make sure SQUARE_ACCESS_TOKEN is configured in your environment.</p>
        </div>
      ) : data ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-500 uppercase tracking-wide">Total Revenue</div>
              <div className="text-3xl font-bold mt-1">{formatCurrency(data.totalRevenue)}</div>
              <div className="text-sm text-gray-400 mt-1">
                {formatDate(data.dateRange.start)} - {formatDate(data.dateRange.end)}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-500 uppercase tracking-wide">Transactions</div>
              <div className="text-3xl font-bold mt-1">{data.totalTransactions}</div>
              <div className="text-sm text-gray-400 mt-1">Completed payments</div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-500 uppercase tracking-wide">Avg Transaction</div>
              <div className="text-3xl font-bold mt-1">{formatCurrency(data.avgTransaction)}</div>
              <div className="text-sm text-gray-400 mt-1">Per sale</div>
            </div>
          </div>

          {/* Chart */}
          {data.chartData.length > 0 && (
            <div className="bg-white border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Daily Revenue</h2>
              <div className="flex items-end gap-1 h-48">
                {data.chartData.map((point, i) => (
                  <div
                    key={point.date}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div className="relative w-full flex justify-center">
                      <div
                        className="bg-vurmz-teal hover:bg-vurmz-teal-dark transition-colors w-full max-w-8"
                        style={{
                          height: `${maxAmount > 0 ? (point.amount / maxAmount) * 160 : 0}px`,
                          minHeight: point.amount > 0 ? '4px' : '0'
                        }}
                        title={`${point.date}: ${formatCurrency(point.amount)}`}
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                        {formatCurrency(point.amount)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            {data.recentTransactions.length === 0 ? (
              <p className="text-gray-500">No transactions in this period</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.recentTransactions.map(tx => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{formatCurrency(tx.amount)}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(tx.date)} at {formatTime(tx.date)}
                        {tx.note && <span className="ml-2">- {tx.note}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 uppercase">{tx.sourceType}</span>
                      {tx.receiptUrl && (
                        <a
                          href={tx.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-vurmz-teal hover:underline"
                        >
                          Receipt
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </AdminShell>
  )
}
