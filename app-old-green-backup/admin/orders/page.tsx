'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { format } from 'date-fns'
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline'

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

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800'
}

const deliveryLabels: Record<string, string> = {
  PICKUP: 'Pickup',
  LOCAL_DELIVERY: 'Delivery',
  SHIPPING: 'Shipping'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

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

  return (
    <AdminShell title="Orders">
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 text-sm font-medium ${!filter ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'PENDING' ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('IN_PROGRESS')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'IN_PROGRESS' ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'COMPLETED' ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            >
              Completed
            </button>
          </div>
          <Link
            href="/admin/orders/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-800"
          >
            <PlusIcon className="h-5 w-5" />
            New Order
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order #</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Project</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Due Date</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Delivery</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.customer.company || order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm line-clamp-1 max-w-xs">{order.projectDescription}</p>
                      <p className="text-xs text-gray-500">{order.material} x {order.quantity}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">${order.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${statusColors[order.status]}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.dueDate ? format(new Date(order.dueDate), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {deliveryLabels[order.deliveryMethod]}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-gray-600 hover:text-black"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
