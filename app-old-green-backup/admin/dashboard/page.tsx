'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import {
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
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

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  SENT: 'bg-vurmz-powder/50 text-vurmz-teal-dark',
  APPROVED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-vurmz-teal/20 text-vurmz-teal-dark',
  COMPLETED: 'bg-green-100 text-green-800'
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json() as Promise<DashboardData>)
      .then(data => {
        setData(data)
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
        <div className="text-gray-500">Loading dashboard...</div>
      ) : !data ? (
        <div className="text-red-500">Failed to load dashboard data</div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3">
                  <DocumentTextIcon className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Quotes</p>
                  <p className="text-2xl font-bold text-vurmz-dark">{data.stats.pendingQuotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-vurmz-teal/20 p-3">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-vurmz-teal" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-vurmz-dark">{data.stats.activeOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-vurmz-powder/50 p-3">
                  <UserGroupIcon className="h-6 w-6 text-vurmz-teal-dark" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-vurmz-dark">{data.stats.totalCustomers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-vurmz-dark">
                    ${data.stats.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          {data.stats.lowStockMaterials > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 flex items-center gap-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800">Low Stock Alert</p>
                <p className="text-sm text-amber-600">
                  {data.stats.lowStockMaterials} material(s) are running low
                </p>
              </div>
              <Link
                href="/admin/materials"
                className="ml-auto text-amber-700 font-medium hover:underline"
              >
                View Materials
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Quotes */}
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-vurmz-dark">Recent Quotes</h2>
                <Link
                  href="/admin/quotes"
                  className="text-sm text-gray-600 hover:text-vurmz-teal flex items-center gap-1"
                >
                  View All <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {data.recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="block px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-vurmz-dark">
                          {quote.customer.company || quote.customer.name}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {quote.projectDescription}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 ${statusColors[quote.status]}`}>
                        {quote.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                    </p>
                  </Link>
                ))}
                {data.recentQuotes.length === 0 && (
                  <p className="px-6 py-4 text-gray-500 text-sm">No quotes yet</p>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-vurmz-dark">Recent Orders</h2>
                <Link
                  href="/admin/orders"
                  className="text-sm text-gray-600 hover:text-vurmz-teal flex items-center gap-1"
                >
                  View All <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {data.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-vurmz-dark">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.customer.company || order.customer.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 ${statusColors[order.status]}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <p className="text-sm font-medium text-vurmz-dark mt-1">
                          ${order.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {data.recentOrders.length === 0 && (
                  <p className="px-6 py-4 text-gray-500 text-sm">No orders yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
