'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  UserCircleIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
}

interface Order {
  id: string
  orderNumber: string
  productType: string
  quantity: number
  price: number
  status: string
  createdAt: string
}

export default function PortalDashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check session
    fetch('/api/portal/auth/session')
      .then(res => res.json() as Promise<{ authenticated?: boolean; customer?: Customer }>)
      .then(data => {
        if (data.authenticated && data.customer) {
          setCustomer(data.customer)
          // Fetch orders
          fetchOrders(data.customer.id)
        } else {
          router.push('/portal/login')
        }
      })
      .catch(() => {
        router.push('/portal/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  const fetchOrders = async (customerId: string) => {
    try {
      const res = await fetch(`/api/portal/orders?customerId=${customerId}`)
      const data = await res.json() as { orders?: Order[] }
      if (data.orders) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/portal/auth/session', { method: 'DELETE' })
    router.push('/portal/login')
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; icon: typeof ClockIcon }> = {
      'new': { bg: 'bg-blue-100', text: 'text-blue-700', icon: ClockIcon },
      'quoted': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: ClockIcon },
      'pending_approval': { bg: 'bg-orange-100', text: 'text-orange-700', icon: ClockIcon },
      'in_progress': { bg: 'bg-purple-100', text: 'text-purple-700', icon: ClockIcon },
      'complete': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircleIcon },
      'delivered': { bg: 'bg-teal-100', text: 'text-teal-700', icon: TruckIcon },
    }
    const config = configs[status] || configs['new']
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3.5 w-3.5" />
        {status.replace(/_/g, ' ').replace(/-/g, ' ')}
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

  if (!customer) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-gray-900">VURMZ</Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 text-sm">Customer Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hi, {customer.name.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Sign out"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['in_progress', 'pending_approval'].includes(o.status)).length}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['complete', 'delivered'].includes(o.status)).length}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/portal/profile"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#6a8c8c] hover:shadow-sm transition-all group"
          >
            <UserCircleIcon className="h-8 w-8 text-gray-400 group-hover:text-[#6a8c8c] mb-3" />
            <h3 className="font-semibold text-gray-900">My Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Update your contact info and business details</p>
          </Link>

          <Link
            href="/portal/orders"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#6a8c8c] hover:shadow-sm transition-all group"
          >
            <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400 group-hover:text-[#6a8c8c] mb-3" />
            <h3 className="font-semibold text-gray-900">Order History</h3>
            <p className="text-sm text-gray-500 mt-1">View all your past and current orders</p>
          </Link>

          <Link
            href="/portal/files"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#6a8c8c] hover:shadow-sm transition-all group"
          >
            <FolderIcon className="h-8 w-8 text-gray-400 group-hover:text-[#6a8c8c] mb-3" />
            <h3 className="font-semibold text-gray-900">My Files</h3>
            <p className="text-sm text-gray-500 mt-1">Upload and manage logos, artwork</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/portal/orders" className="text-sm text-[#6a8c8c] hover:underline">
              View all
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet</p>
              <Link
                href="/order"
                className="inline-block mt-4 px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ background: '#6a8c8c' }}
              >
                Place Your First Order
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.productType}</p>
                    <p className="text-sm text-gray-500">
                      {order.orderNumber} &middot; Qty: {order.quantity} &middot; ${order.price?.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
