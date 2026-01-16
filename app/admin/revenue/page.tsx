'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminShell from '@/components/AdminShell'

// Glass styling
const glassCard = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
  border: '1px solid rgba(106,140,140,0.08)',
}

const liquidEase = [0.23, 1, 0.32, 1] as const

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

// Teal spinner component
function TealSpinner() {
  return (
    <motion.div
      className="flex items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-10 h-10 rounded-full border-3 border-[#6A8C8C]/20 border-t-[#6A8C8C]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

// Stat card component
function StatCard({
  title,
  value,
  subtitle,
  delay = 0,
}: {
  title: string
  value: string
  subtitle: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: liquidEase }}
      className="rounded-2xl p-6"
      style={glassCard}
    >
      <div className="text-xs text-[#6A8C8C] uppercase tracking-wider font-medium mb-2">
        {title}
      </div>
      <div className="text-4xl font-light text-[#1a1a1a] tracking-tight">
        {value}
      </div>
      <div className="text-sm text-[#6A8C8C]/70 mt-2">
        {subtitle}
      </div>
    </motion.div>
  )
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

  const maxAmount = data?.chartData.length
    ? Math.max(...data.chartData.map(d => d.amount))
    : 0

  const periodOptions = [
    { key: 'day', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ]

  return (
    <AdminShell title="Revenue Dashboard">
      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: liquidEase }}
        className="mb-8 flex gap-2 flex-wrap"
      >
        {periodOptions.map((p, i) => (
          <motion.button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: liquidEase }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
              period === p.key
                ? 'bg-[#6A8C8C] text-white shadow-lg shadow-[#6A8C8C]/20'
                : 'text-[#6A8C8C] hover:bg-[#6A8C8C]/10'
            }`}
            style={period !== p.key ? glassCard : undefined}
          >
            {p.label}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <TealSpinner key="loading" />
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: liquidEase }}
            className="rounded-2xl p-6 bg-red-50/80 border border-red-200/50"
          >
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-red-700 font-medium">{error}</h3>
                <p className="text-sm text-red-600/70 mt-1">
                  Make sure SQUARE_ACCESS_TOKEN is configured in your environment.
                </p>
              </div>
            </div>
          </motion.div>
        ) : data ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(data.totalRevenue)}
                subtitle={`${formatDate(data.dateRange.start)} - ${formatDate(data.dateRange.end)}`}
                delay={0}
              />
              <StatCard
                title="Transactions"
                value={data.totalTransactions.toString()}
                subtitle="Completed payments"
                delay={0.1}
              />
              <StatCard
                title="Average Transaction"
                value={formatCurrency(data.avgTransaction)}
                subtitle="Per sale"
                delay={0.2}
              />
            </div>

            {/* Chart */}
            {data.chartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: liquidEase }}
                className="rounded-2xl p-6 mb-8"
                style={glassCard}
              >
                <h2 className="text-lg font-medium text-[#1a1a1a] mb-6">Daily Revenue</h2>
                <div className="flex items-end gap-1 h-52">
                  {data.chartData.map((point, i) => (
                    <motion.div
                      key={point.date}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4 + i * 0.03,
                        ease: liquidEase
                      }}
                      className="flex-1 flex flex-col items-center group origin-bottom"
                    >
                      <div className="relative w-full flex justify-center">
                        <motion.div
                          className="bg-gradient-to-t from-[#6A8C8C] to-[#8AACAC] rounded-t-lg w-full max-w-8 cursor-pointer"
                          style={{
                            height: `${maxAmount > 0 ? (point.amount / maxAmount) * 180 : 0}px`,
                            minHeight: point.amount > 0 ? '4px' : '0'
                          }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
                        >
                          {formatCurrency(point.amount)}
                        </motion.div>
                      </div>
                      <div className="text-xs text-[#6A8C8C]/60 mt-3 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Transactions Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: liquidEase }}
              className="rounded-2xl p-6"
              style={glassCard}
            >
              <h2 className="text-lg font-medium text-[#1a1a1a] mb-6">Recent Transactions</h2>
              {data.recentTransactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-[#6A8C8C]/60"
                >
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  No transactions in this period
                </motion.div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#6A8C8C]/10">
                        <th className="text-left text-xs font-medium text-[#6A8C8C] uppercase tracking-wider py-3 px-4">
                          Amount
                        </th>
                        <th className="text-left text-xs font-medium text-[#6A8C8C] uppercase tracking-wider py-3 px-4">
                          Date
                        </th>
                        <th className="text-left text-xs font-medium text-[#6A8C8C] uppercase tracking-wider py-3 px-4 hidden sm:table-cell">
                          Note
                        </th>
                        <th className="text-left text-xs font-medium text-[#6A8C8C] uppercase tracking-wider py-3 px-4">
                          Source
                        </th>
                        <th className="text-right text-xs font-medium text-[#6A8C8C] uppercase tracking-wider py-3 px-4">
                          Receipt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentTransactions.map((tx, i) => (
                        <motion.tr
                          key={tx.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.5 + i * 0.05,
                            ease: liquidEase
                          }}
                          className="border-b border-[#6A8C8C]/5 hover:bg-[#6A8C8C]/5 transition-colors duration-200"
                        >
                          <td className="py-4 px-4">
                            <span className="font-medium text-[#1a1a1a]">
                              {formatCurrency(tx.amount)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-[#1a1a1a]">
                              {formatDate(tx.date)}
                            </div>
                            <div className="text-xs text-[#6A8C8C]/60">
                              {formatTime(tx.date)}
                            </div>
                          </td>
                          <td className="py-4 px-4 hidden sm:table-cell">
                            <span className="text-sm text-[#6A8C8C]/80 truncate max-w-[200px] block">
                              {tx.note || '-'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#6A8C8C]/10 text-[#6A8C8C]">
                              {tx.sourceType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {tx.receiptUrl ? (
                              <motion.a
                                href={tx.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-1.5 text-sm text-[#6A8C8C] hover:text-[#5A7C7C] transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View
                              </motion.a>
                            ) : (
                              <span className="text-[#6A8C8C]/40 text-sm">-</span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Charts Placeholder - Future Enhancement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: liquidEase }}
              className="mt-8 rounded-2xl p-8 text-center"
              style={{
                ...glassCard,
                background: 'linear-gradient(180deg, rgba(106,140,140,0.05) 0%, rgba(106,140,140,0.02) 100%)',
              }}
            >
              <svg className="w-10 h-10 mx-auto mb-3 text-[#6A8C8C]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-[#6A8C8C]/60 text-sm">
                Advanced analytics charts coming soon
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </AdminShell>
  )
}
