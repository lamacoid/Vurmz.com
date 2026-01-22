'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { EyeIcon } from '@heroicons/react/24/outline'

interface Quote {
  id: number
  productType: string
  quantity: string
  description: string
  status: string
  turnaround: string
  deliveryMethod: string
  createdAt: string
  customer: {
    name: string
    email: string | null
    phone: string
    business: string | null
  }
}

const statusColors: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800',
  'pending-approval': 'bg-orange-100 text-orange-800',
  quoted: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  approved: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  in_progress: 'bg-purple-100 text-purple-800',
  complete: 'bg-gray-100 text-gray-800',
  completed: 'bg-gray-100 text-gray-800'
}

const statusLabels: Record<string, string> = {
  new: 'New Quote',
  'pending-approval': 'Pending',
  quoted: 'Quoted',
  accepted: 'Accepted',
  approved: 'Approved',
  declined: 'Declined',
  in_progress: 'In Progress',
  complete: 'Complete',
  completed: 'Completed'
}

const turnaroundLabels: Record<string, string> = {
  'same-day': 'Same Day',
  'next-day': 'Next Day',
  'standard': 'Standard',
  'flexible': 'Flexible'
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const url = filter ? `/api/quotes?status=${filter}` : '/api/quotes'
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuotes(data)
        } else {
          setQuotes([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading quotes:', err)
        setLoading(false)
      })
  }, [filter])

  return (
    <AdminShell title="Quotes">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 text-sm font-medium ${!filter ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 text-sm font-medium ${filter === 'new' ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
          >
            New Quotes
          </button>
          <button
            onClick={() => setFilter('pending-approval')}
            className={`px-4 py-2 text-sm font-medium ${filter === 'pending-approval' ? 'bg-orange-600 text-white' : 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100'}`}
          >
            Orders Pending
          </button>
          <button
            onClick={() => setFilter('quoted')}
            className={`px-4 py-2 text-sm font-medium ${filter === 'quoted' ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
          >
            Quoted
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 text-sm font-medium ${filter === 'accepted' ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
          >
            Accepted
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 text-sm font-medium ${filter === 'in_progress' ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
          >
            In Progress
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading quotes...</div>
          ) : quotes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No quotes found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Qty</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Turnaround</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{quote.customer.business || quote.customer.name}</p>
                          <p className="text-sm text-gray-500">{quote.customer.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{quote.productType}</td>
                      <td className="px-6 py-4 text-sm">{quote.quantity}</td>
                      <td className="px-6 py-4 text-sm">{turnaroundLabels[quote.turnaround] || quote.turnaround}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[quote.status] || 'bg-gray-100 text-gray-800'}`}>
                          {statusLabels[quote.status] || quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(quote.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/quotes/${quote.id}`}
                          className="text-gray-600 hover:text-black"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
