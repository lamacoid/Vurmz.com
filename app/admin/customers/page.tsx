'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  city: string | null
  state: string | null
  _count: {
    quotes: number
    orders: number
  }
}

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const url = search ? `/api/customers?search=${encodeURIComponent(search)}` : '/api/customers'
    fetch(url)
      .then(res => res.json() as Promise<Customer[]>)
      .then(data => {
        setCustomers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading customers:', err)
        setLoading(false)
      })
  }, [search])

  return (
    <AdminShell title="Customers">
      <div className="space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: liquidEase }}
          className="flex gap-4"
        >
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, company, email..."
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
        </motion.div>

        {/* Customers List */}
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
          ) : customers.length === 0 ? (
            <div className="py-20 text-center">
              <UserGroupIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No customers found</p>
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
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Quotes</th>
                    <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {customers.map((customer, index) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.02, ease: liquidEase }}
                        className="group"
                        style={{ borderBottom: '1px solid rgba(106,140,140,0.05)' }}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{customer.name}</p>
                            {customer.company && (
                              <p className="text-sm text-gray-500">{customer.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <PhoneIcon className="h-4 w-4 text-gray-400" />
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {customer.city ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPinIcon className="h-4 w-4 text-gray-400" />
                              {customer.city}, {customer.state}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg text-xs font-medium"
                            style={{
                              background: customer._count.quotes > 0 ? 'rgba(106,140,140,0.1)' : 'rgba(107,114,128,0.1)',
                              color: customer._count.quotes > 0 ? '#5a7a7a' : '#9ca3af',
                            }}
                          >
                            {customer._count.quotes}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg text-xs font-medium"
                            style={{
                              background: customer._count.orders > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)',
                              color: customer._count.orders > 0 ? '#15803d' : '#9ca3af',
                            }}
                          >
                            {customer._count.orders}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/customers/${customer.id}`}
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
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Stats Footer */}
        {!loading && customers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: liquidEase }}
            className="flex items-center justify-between px-2 text-sm text-gray-500"
          >
            <span>{customers.length} customers</span>
            <span>
              {customers.reduce((sum, c) => sum + c._count.orders, 0)} total orders
            </span>
          </motion.div>
        )}
      </div>
    </AdminShell>
  )
}
