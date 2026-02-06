'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface DashboardData {
  stats: {
    pendingQuotes: number
    activeOrders: number
    totalCustomers: number
    lowStockMaterials: number
    monthlyRevenue: number
  }
  recentQuotes: Array<{
    id: string
    projectDescription: string
    status: string
    createdAt: string
    customer: { name: string; company: string | null }
  }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    projectDescription: string
    status: string
    price: number
    createdAt: string
    customer: { name: string; company: string | null }
  }>
}

interface AnalyticsData {
  overview: {
    pendingQuotes: number
    activeOrders: number
    completedThisMonth: number
    totalCustomers: number
  }
  revenue: {
    thisMonth: number
    lastMonth: number
    thisWeek: number
    monthOverMonthGrowth: number | string
  }
  recentOrders: Array<{
    id: string
    orderNumber: string
    status: string
    price: number
    customerName: string
    createdAt: string
  }>
  topProducts: Array<{
    product: string
    count: number
    revenue: number
  }>
  ordersByStatus: Record<string, number>
}

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'rgba(251, 191, 36, 0.1)', text: '#b45309', border: 'rgba(251, 191, 36, 0.2)' },
  SENT: { bg: 'rgba(106, 140, 140, 0.1)', text: '#5a7a7a', border: 'rgba(106, 140, 140, 0.2)' },
  APPROVED: { bg: 'rgba(34, 197, 94, 0.1)', text: '#15803d', border: 'rgba(34, 197, 94, 0.2)' },
  DECLINED: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.2)' },
  IN_PROGRESS: { bg: 'rgba(106, 140, 140, 0.15)', text: '#5a7a7a', border: 'rgba(106, 140, 140, 0.25)' },
  COMPLETED: { bg: 'rgba(34, 197, 94, 0.1)', text: '#15803d', border: 'rgba(34, 197, 94, 0.2)' }
}

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then(res => res.json() as Promise<DashboardData>).catch(() => null),
      fetch('/api/admin/stats').then(res => res.json() as Promise<AnalyticsData>).catch(() => null)
    ])
      .then(([dashData, analyticsData]) => {
        if (dashData) {
          setData(dashData)
        }
        if (analyticsData) {
          setAnalytics(analyticsData)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading dashboard:', err)
        setLoading(false)
      })
  }, [])

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(106,140,140,0.2)', borderTopColor: '#6a8c8c' }}
          />
        </div>
      ) : !data ? (
        <div className="text-red-500">Failed to load dashboard data</div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Pending Quotes', value: data.stats.pendingQuotes, icon: DocumentTextIcon, color: '#f59e0b' },
              { label: 'Active Orders', value: data.stats.activeOrders, icon: ClipboardDocumentListIcon, color: '#6a8c8c' },
              { label: 'Total Customers', value: data.stats.totalCustomers, icon: UserGroupIcon, color: '#8caec4' },
              { label: 'Monthly Revenue', value: `$${(data.stats.monthlyRevenue || 0).toLocaleString()}`, icon: CurrencyDollarIcon, color: '#22c55e' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: liquidEase }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                  border: '1px solid rgba(106,140,140,0.08)',
                }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        background: `${stat.color}15`,
                        border: `1px solid ${stat.color}25`,
                      }}
                    >
                      <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Site Manager Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: liquidEase }}
          >
            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-5 rounded-2xl transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(106,140,140,0.1) 0%, rgba(140,174,196,0.08) 100%)',
                border: '1px solid rgba(106,140,140,0.15)',
                boxShadow: '0 2px 12px rgba(106,140,140,0.06)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ background: 'rgba(106,140,140,0.15)' }}
                >
                  <WrenchScrewdriverIcon className="h-6 w-6 text-[#5a7a7a]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Site Manager</h3>
                  <p className="text-sm text-gray-500">Edit your website content, colors, products, and more</p>
                </div>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400" />
            </Link>
          </motion.div>

          {/* Revenue & Analytics */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Revenue Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: liquidEase }}
                className="md:col-span-2 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                  border: '1px solid rgba(106,140,140,0.08)',
                }}
              >
                <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
                  <h2 className="font-semibold text-gray-800">Revenue</h2>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">This Week</p>
                    <p className="text-2xl font-semibold text-gray-800">${(analytics.revenue?.thisWeek || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-2xl font-semibold text-gray-800">${(analytics.revenue?.thisMonth || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">vs Last Month</p>
                    <div className="flex items-center gap-2">
                      {Number(analytics.revenue?.monthOverMonthGrowth || 0) >= 0 ? (
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                      )}
                      <p className={`text-2xl font-semibold ${Number(analytics.revenue?.monthOverMonthGrowth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analytics.revenue?.monthOverMonthGrowth || 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Top Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45, ease: liquidEase }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                  border: '1px solid rgba(106,140,140,0.08)',
                }}
              >
                <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
                  <h2 className="font-semibold text-gray-800">Top Materials</h2>
                </div>
                <div className="p-4 space-y-2">
                  {(analytics.topProducts || []).slice(0, 4).map((product, i) => (
                    <div key={i} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-sm text-gray-700">{product.product || 'Unspecified'}</span>
                      <span className="text-xs font-medium text-gray-500">{product.count} orders</span>
                    </div>
                  ))}
                  {(!analytics.topProducts || analytics.topProducts.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Completed This Month */}
          {analytics && analytics.overview?.completedThisMonth > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38, ease: liquidEase }}
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              <div
                className="p-2.5 rounded-xl"
                style={{ background: 'rgba(34, 197, 94, 0.15)' }}
              >
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800">Orders Completed This Month</p>
                <p className="text-sm text-green-600">
                  {analytics.overview.completedThisMonth} order(s) delivered
                </p>
              </div>
            </motion.div>
          )}

          {/* Low Stock Alert */}
          {data.stats.lowStockMaterials > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: liquidEase }}
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{
                background: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
              }}
            >
              <div
                className="p-2.5 rounded-xl"
                style={{ background: 'rgba(251, 191, 36, 0.15)' }}
              >
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-amber-800">Low Stock Alert</p>
                <p className="text-sm text-amber-600">
                  {data.stats.lowStockMaterials} material(s) are running low
                </p>
              </div>
              <Link
                href="/admin/materials"
                className="px-4 py-2 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-100/50 transition-colors"
              >
                View Materials
              </Link>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Quotes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: liquidEase }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                border: '1px solid rgba(106,140,140,0.08)',
              }}
            >
              <div
                className="px-6 py-4 flex justify-between items-center"
                style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}
              >
                <h2 className="font-semibold text-gray-800">Recent Quotes</h2>
                <Link
                  href="/admin/quotes"
                  className="text-sm text-gray-500 hover:text-[#6a8c8c] flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100/50">
                {data.recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="block px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {quote.customer.company || quote.customer.name}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                          {quote.projectDescription}
                        </p>
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-lg font-medium"
                        style={{
                          background: statusStyles[quote.status]?.bg || 'rgba(106,140,140,0.1)',
                          color: statusStyles[quote.status]?.text || '#5a7a7a',
                          border: `1px solid ${statusStyles[quote.status]?.border || 'rgba(106,140,140,0.2)'}`,
                        }}
                      >
                        {quote.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {quote.createdAt ? format(new Date(quote.createdAt), 'MMM d, yyyy') : 'No date'}
                    </p>
                  </Link>
                ))}
                {data.recentQuotes.length === 0 && (
                  <p className="px-6 py-8 text-gray-400 text-sm text-center">No quotes yet</p>
                )}
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: liquidEase }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                border: '1px solid rgba(106,140,140,0.08)',
              }}
            >
              <div
                className="px-6 py-4 flex justify-between items-center"
                style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}
              >
                <h2 className="font-semibold text-gray-800">Recent Orders</h2>
                <Link
                  href="/admin/orders"
                  className="text-sm text-gray-500 hover:text-[#6a8c8c] flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100/50">
                {data.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {order.customer.company || order.customer.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-xs px-2.5 py-1 rounded-lg font-medium"
                          style={{
                            background: statusStyles[order.status]?.bg || 'rgba(106,140,140,0.1)',
                            color: statusStyles[order.status]?.text || '#5a7a7a',
                            border: `1px solid ${statusStyles[order.status]?.border || 'rgba(106,140,140,0.2)'}`,
                          }}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                        <p className="text-sm font-medium text-gray-800 mt-2">
                          ${(order.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {data.recentOrders.length === 0 && (
                  <p className="px-6 py-8 text-gray-400 text-sm text-center">No orders yet</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
