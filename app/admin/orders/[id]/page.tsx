'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface OrderDetail {
  id: string
  orderNumber: string
  projectDescription: string
  material: string
  quantity: number
  price: number
  status: string
  paymentStatus: string
  deliveryMethod: string
  dueDate: string | null
  notes: string | null
  createdAt: string
  completedAt: string | null
  customer: {
    id: string
    name: string
    email: string
    phone: string | null
    company: string | null
    address: string | null
    city: string | null
    state: string | null
    zip: string | null
  } | null
  activity: Array<{
    id: string
    action: string
    details: string | null
    createdAt: string
  }>
}

const statusStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
  PENDING: { bg: 'rgba(251, 191, 36, 0.1)', text: '#b45309', border: 'rgba(251, 191, 36, 0.2)', label: 'Pending' },
  IN_PROGRESS: { bg: 'rgba(147, 51, 234, 0.1)', text: '#7c3aed', border: 'rgba(147, 51, 234, 0.2)', label: 'In Progress' },
  COMPLETED: { bg: 'rgba(34, 197, 94, 0.1)', text: '#15803d', border: 'rgba(34, 197, 94, 0.2)', label: 'Completed' }
}

const paymentStyles: Record<string, { bg: string; text: string; label: string }> = {
  paid: { bg: 'rgba(34, 197, 94, 0.1)', text: '#15803d', label: 'Paid' },
  unpaid: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', label: 'Unpaid' },
  pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#b45309', label: 'Pending' }
}

const deliveryLabels: Record<string, string> = {
  PICKUP: 'Pickup',
  LOCAL_DELIVERY: 'Local Delivery',
  SHIPPING: 'Shipping'
}

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json() as OrderDetail
      setOrder(data)
    } catch (err) {
      console.error('Error loading order:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const handleAction = async (action: string) => {
    setActionLoading(action)
    try {
      const res = await fetch(`/api/orders/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (res.ok) {
        await fetchOrder() // Refresh order data
      } else {
        alert(data.error || 'Action failed')
      }
    } catch (err) {
      console.error('Action error:', err)
      alert('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Order Details">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(106,140,140,0.2)', borderTopColor: '#6a8c8c' }}
          />
        </div>
      </AdminShell>
    )
  }

  if (!order) {
    return (
      <AdminShell title="Order Details">
        <div className="text-center py-20">
          <p className="text-gray-500">Order not found</p>
          <Link href="/admin/orders" className="text-[#6a8c8c] hover:underline mt-2 inline-block">
            Back to Orders
          </Link>
        </div>
      </AdminShell>
    )
  }

  const status = statusStyles[order.status] || statusStyles.PENDING
  const payment = paymentStyles[order.paymentStatus] || paymentStyles.unpaid

  return (
    <AdminShell title={`Order ${order.orderNumber}`}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: liquidEase }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl transition-all hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 font-mono">{order.orderNumber}</h1>
              <p className="text-sm text-gray-500">
                Created {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}
            >
              {status.label}
            </span>
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ background: payment.bg, color: payment.text }}
            >
              {payment.label}
            </span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: liquidEase }}
          className="flex flex-wrap gap-3"
        >
          {order.status !== 'COMPLETED' && (
            <>
              {order.status === 'PENDING' && (
                <button
                  onClick={() => handleAction('mark-in-progress')}
                  disabled={actionLoading !== null}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
                  style={{
                    background: 'rgba(147, 51, 234, 0.1)',
                    color: '#7c3aed',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                  }}
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  {actionLoading === 'mark-in-progress' ? 'Updating...' : 'Start Work'}
                </button>
              )}
              <button
                onClick={() => handleAction('mark-complete')}
                disabled={actionLoading !== null}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#15803d',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <CheckCircleIcon className="h-5 w-5" />
                {actionLoading === 'mark-complete' ? 'Updating...' : 'Mark Complete'}
              </button>
            </>
          )}
          {order.paymentStatus !== 'paid' && (
            <button
              onClick={() => handleAction('mark-paid')}
              disabled={actionLoading !== null}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
              style={{
                background: 'rgba(34, 197, 94, 0.08)',
                color: '#15803d',
                border: '1px solid rgba(34, 197, 94, 0.15)',
              }}
            >
              <CurrencyDollarIcon className="h-5 w-5" />
              {actionLoading === 'mark-paid' ? 'Updating...' : 'Mark Paid'}
            </button>
          )}
          {order.paymentStatus === 'paid' && order.customer?.email && (
            <button
              onClick={() => handleAction('resend-receipt')}
              disabled={actionLoading !== null}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50"
              style={{
                background: 'rgba(106, 140, 140, 0.08)',
                color: '#5a7a7a',
                border: '1px solid rgba(106, 140, 140, 0.15)',
              }}
            >
              <EnvelopeIcon className="h-5 w-5" />
              {actionLoading === 'resend-receipt' ? 'Sending...' : 'Resend Receipt'}
            </button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: liquidEase }}
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(106,140,140,0.08)',
            }}
          >
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
              <h2 className="font-semibold text-gray-800">Order Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Project Description</h3>
                <p className="text-gray-800">{order.projectDescription}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Material</p>
                  <p className="font-medium text-gray-800">{order.material}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium text-gray-800">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-gray-800 text-lg">${order.price?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery</p>
                  <p className="font-medium text-gray-800">{deliveryLabels[order.deliveryMethod] || order.deliveryMethod}</p>
                </div>
              </div>
              {order.dueDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span>Due: {format(new Date(order.dueDate), 'MMM d, yyyy')}</span>
                </div>
              )}
              {order.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: liquidEase }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(106,140,140,0.08)',
            }}
          >
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
              <h2 className="font-semibold text-gray-800">Customer</h2>
            </div>
            {order.customer ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(106,140,140,0.1)' }}
                  >
                    <UserIcon className="h-6 w-6 text-[#6a8c8c]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{order.customer.name}</p>
                    {order.customer.company && (
                      <p className="text-sm text-gray-500">{order.customer.company}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6a8c8c] transition-colors"
                  >
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    {order.customer.email}
                  </a>
                  {order.customer.phone && (
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6a8c8c] transition-colors"
                    >
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      {order.customer.phone}
                    </a>
                  )}
                  {order.customer.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>
                        {order.customer.address}<br />
                        {order.customer.city}, {order.customer.state} {order.customer.zip}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  href={`/admin/customers/${order.customer.id}`}
                  className="inline-flex items-center gap-1 text-sm text-[#6a8c8c] hover:underline mt-2"
                >
                  View Customer Profile
                </Link>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No customer linked
              </div>
            )}
          </motion.div>
        </div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: liquidEase }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: '1px solid rgba(106,140,140,0.08)',
          }}
        >
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
            <h2 className="font-semibold text-gray-800">Activity</h2>
          </div>
          <div className="p-6">
            {order.activity && order.activity.length > 0 ? (
              <div className="space-y-4">
                {order.activity.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative">
                      <div
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ background: '#6a8c8c' }}
                      />
                      {index < order.activity.length - 1 && (
                        <div
                          className="absolute top-4 left-[3px] w-0.5 h-full"
                          style={{ background: 'rgba(106,140,140,0.2)' }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm text-gray-800">{item.action}</p>
                      {item.details && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No activity recorded</p>
            )}
          </div>
        </motion.div>
      </div>
    </AdminShell>
  )
}
