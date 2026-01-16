'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: string
  orderNumber: string
  projectDescription: string
  material: string
  quantity: number
  price: number
  status: string
  dueDate: string | null
  deliveryMethod: string
  createdAt: string
  customer: {
    name: string
    email: string
    company: string | null
  }
}

const statusStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
  PENDING: {
    bg: 'rgba(251, 191, 36, 0.1)',
    text: '#b45309',
    border: 'rgba(251, 191, 36, 0.2)',
    label: 'Pending'
  },
  IN_PROGRESS: {
    bg: 'rgba(147, 51, 234, 0.1)',
    text: '#7c3aed',
    border: 'rgba(147, 51, 234, 0.2)',
    label: 'In Progress'
  },
  COMPLETED: {
    bg: 'rgba(34, 197, 94, 0.1)',
    text: '#15803d',
    border: 'rgba(34, 197, 94, 0.2)',
    label: 'Completed'
  }
}

const deliveryLabels: Record<string, string> = {
  PICKUP: 'Pickup',
  LOCAL_DELIVERY: 'Delivery',
  SHIPPING: 'Shipping'
}

const filterOptions = [
  { value: '', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' }
]

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const url = filter ? `/api/orders?status=${filter}` : '/api/orders'
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data)
        } else {
          console.error('API returned non-array:', data)
          setOrders([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading orders:', err)
        setOrders([])
        setLoading(false)
      })
  }, [filter])

  const filteredOrders = orders.filter(order => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.customer.company?.toLowerCase().includes(searchLower) ||
      order.projectDescription.toLowerCase().includes(searchLower)
    )
  })

  return (
    <AdminShell title="Orders">
      <div className="space-y-6">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: liquidEase }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(106,140,140,0.15)',
                boxShadow: '0 2px 8px rgba(106,140,140,0.06)',
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-12 pr-10 py-3 rounded-xl outline-none appearance-none cursor-pointer transition-all min-w-[180px]"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(106,140,140,0.15)',
                boxShadow: '0 2px 8px rgba(106,140,140,0.06)',
              }}
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: liquidEase }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: '1px solid rgba(106,140,140,0.08)',
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'rgba(106,140,140,0.2)', borderTopColor: '#6a8c8c' }}
              />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center">
              <ClipboardDocumentListIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No orders found</p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-2 text-sm text-[#6a8c8c] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order, index) => {
                      const status = statusStyles[order.status] || statusStyles.PENDING
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.02, ease: liquidEase }}
                          className="group"
                          style={{ borderBottom: '1px solid rgba(106,140,140,0.05)' }}
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-medium text-gray-800">
                              {order.orderNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-800">
                                {order.customer.company || order.customer.name}
                              </p>
                              <p className="text-sm text-gray-500">{order.customer.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 line-clamp-1 max-w-xs">
                              {order.projectDescription}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {order.material} x {order.quantity}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                              style={{
                                background: status.bg,
                                color: status.text,
                                border: `1px solid ${status.border}`,
                              }}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">
                              {order.dueDate ? format(new Date(order.dueDate), 'MMM d') : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">
                              {deliveryLabels[order.deliveryMethod] || order.deliveryMethod}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-medium text-gray-800">
                              ${order.price.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                              style={{
                                background: 'rgba(106,140,140,0.08)',
                                border: '1px solid rgba(106,140,140,0.1)',
                              }}
                            >
                              <EyeIcon className="h-4 w-4 text-[#6a8c8c]" />
                            </Link>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Stats Footer */}
        {!loading && filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: liquidEase }}
            className="flex items-center justify-between px-2 text-sm text-gray-500"
          >
            <span>
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
            <span>
              Total value: ${filteredOrders.reduce((sum, o) => sum + o.price, 0).toLocaleString()}
            </span>
          </motion.div>
        )}
      </div>
    </AdminShell>
  )
}
