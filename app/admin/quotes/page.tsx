'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface Quote {
  id: number
  productType: string
  quantity: string
  description: string
  status: string
  turnaround: string
  deliveryMethod: string
  price: number | null
  createdAt: string
  customer: {
    name: string
    email: string | null
    phone: string
    business: string | null
  }
}

const statusStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
  new: {
    bg: 'rgba(251, 191, 36, 0.1)',
    text: '#b45309',
    border: 'rgba(251, 191, 36, 0.2)',
    label: 'New Quote'
  },
  'pending-approval': {
    bg: 'rgba(249, 115, 22, 0.1)',
    text: '#c2410c',
    border: 'rgba(249, 115, 22, 0.2)',
    label: 'Pending'
  },
  quoted: {
    bg: 'rgba(106, 140, 140, 0.1)',
    text: '#5a7a7a',
    border: 'rgba(106, 140, 140, 0.2)',
    label: 'Quoted'
  },
  accepted: {
    bg: 'rgba(34, 197, 94, 0.1)',
    text: '#15803d',
    border: 'rgba(34, 197, 94, 0.2)',
    label: 'Accepted'
  },
  approved: {
    bg: 'rgba(34, 197, 94, 0.1)',
    text: '#15803d',
    border: 'rgba(34, 197, 94, 0.2)',
    label: 'Approved'
  },
  declined: {
    bg: 'rgba(239, 68, 68, 0.1)',
    text: '#dc2626',
    border: 'rgba(239, 68, 68, 0.2)',
    label: 'Declined'
  },
  in_progress: {
    bg: 'rgba(147, 51, 234, 0.1)',
    text: '#7c3aed',
    border: 'rgba(147, 51, 234, 0.2)',
    label: 'In Progress'
  },
  complete: {
    bg: 'rgba(107, 114, 128, 0.1)',
    text: '#4b5563',
    border: 'rgba(107, 114, 128, 0.2)',
    label: 'Complete'
  },
  completed: {
    bg: 'rgba(107, 114, 128, 0.1)',
    text: '#4b5563',
    border: 'rgba(107, 114, 128, 0.2)',
    label: 'Completed'
  }
}

const turnaroundLabels: Record<string, string> = {
  'same-day': 'Same Day',
  'next-day': 'Next Day',
  'standard': 'Standard',
  'flexible': 'Flexible'
}

const filterOptions = [
  { value: '', label: 'All Quotes' },
  { value: 'new', label: 'New' },
  { value: 'pending-approval', label: 'Pending Approval' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' }
]

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')

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

  const filteredQuotes = quotes.filter(quote => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      quote.customer.name.toLowerCase().includes(searchLower) ||
      quote.customer.business?.toLowerCase().includes(searchLower) ||
      quote.productType.toLowerCase().includes(searchLower) ||
      quote.description.toLowerCase().includes(searchLower)
    )
  })

  return (
    <AdminShell title="Quotes">
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
              placeholder="Search quotes..."
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

        {/* Quotes List */}
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
          ) : filteredQuotes.length === 0 ? (
            <div className="py-20 text-center">
              <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No quotes found</p>
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
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredQuotes.map((quote, index) => {
                      const status = statusStyles[quote.status] || statusStyles.new
                      return (
                        <motion.tr
                          key={quote.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.02, ease: liquidEase }}
                          className="group"
                          style={{ borderBottom: '1px solid rgba(106,140,140,0.05)' }}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-800">
                                {quote.customer.business || quote.customer.name}
                              </p>
                              <p className="text-sm text-gray-500">{quote.customer.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{quote.productType}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{quote.quantity}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">
                              {turnaroundLabels[quote.turnaround] || quote.turnaround}
                            </span>
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
                              {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {quote.price ? (
                              <span className="text-sm font-medium text-gray-800">
                                ${quote.price.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/admin/quotes/${quote.id}`}
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
        {!loading && filteredQuotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: liquidEase }}
            className="flex items-center justify-between px-2 text-sm text-gray-500"
          >
            <span>
              Showing {filteredQuotes.length} of {quotes.length} quotes
            </span>
            <span>
              Total value: ${filteredQuotes.reduce((sum, q) => sum + (q.price || 0), 0).toLocaleString()}
            </span>
          </motion.div>
        )}
      </div>
    </AdminShell>
  )
}
