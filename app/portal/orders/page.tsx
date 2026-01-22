'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: string
  orderNumber: string
  productType: string
  quantity: number
  description: string
  price: number | null
  status: string
  turnaround: string
  deliveryMethod: string
  createdAt: string
  responseSentAt: string | null
  acceptedAt: string | null
  completedAt: string | null
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetch('/api/portal/auth/session')
      .then(res => res.json() as Promise<{ authenticated?: boolean }>)
      .then(data => {
        if (data.authenticated) {
          fetchOrders()
        } else {
          router.push('/portal/login')
        }
      })
      .catch(() => router.push('/portal/login'))
  }, [router])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/portal/orders')
      const data = await res.json() as { orders?: Order[] }
      if (data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string; icon: typeof ClockIcon }> = {
      'new': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Quote Requested', icon: ClockIcon },
      'quoted': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Quote Sent', icon: ClockIcon },
      'pending-approval': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Awaiting Start', icon: ClockIcon },
      'in_progress': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Production', icon: ClockIcon },
      'complete': { bg: 'bg-green-100', text: 'text-green-700', label: 'Complete', icon: CheckCircleIcon },
      'delivered': { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Delivered', icon: TruckIcon },
      'declined': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelled', icon: ClockIcon },
    }
    const config = configs[status] || configs['new']
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-4 w-4" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6a8c8c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/portal" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <ClipboardDocumentListIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">Place your first order to get started.</p>
            <Link
              href="/order"
              className="inline-block px-6 py-3 rounded-xl text-white font-medium"
              style={{ background: 'linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%)' }}
            >
              Start an Order
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{order.productType}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {order.quantity} &middot; {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {order.price && (
                      <span className="font-semibold text-gray-900">${order.price.toFixed(2)}</span>
                    )}
                    {getStatusBadge(order.status)}
                    <ChevronRightIcon className={`h-5 w-5 text-gray-400 transition-transform ${selectedOrder?.id === order.id ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {selectedOrder?.id === order.id && (
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Turnaround</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{order.turnaround}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{order.deliveryMethod}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Submitted</p>
                        <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      {order.completedAt && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(order.completedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {order.description && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Details</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200">
                          {order.description.substring(0, 500)}
                          {order.description.length > 500 && '...'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
