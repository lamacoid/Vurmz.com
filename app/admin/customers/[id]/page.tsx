'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface CustomerDetail {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  notes: string | null
  createdAt: string
  stats: {
    totalSpent: number
    orderCount: number
    quoteCount: number
  }
  orders: Array<{
    id: string
    orderNumber: string
    description: string
    price: number
    status: string
    createdAt: string
  }>
  quotes: Array<{
    id: string
    productType: string
    quantity: number
    price: number | null
    status: string
    createdAt: string
  }>
}

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'rgba(251, 191, 36, 0.1)', text: '#b45309', border: 'rgba(251, 191, 36, 0.2)' },
  IN_PROGRESS: { bg: 'rgba(147, 51, 234, 0.1)', text: '#7c3aed', border: 'rgba(147, 51, 234, 0.2)' },
  COMPLETED: { bg: 'rgba(34, 197, 94, 0.1)', text: '#15803d', border: 'rgba(34, 197, 94, 0.2)' },
  new: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' },
  pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#b45309', border: 'rgba(251, 191, 36, 0.2)' },
  sent: { bg: 'rgba(106, 140, 140, 0.1)', text: '#5a7a7a', border: 'rgba(106, 140, 140, 0.2)' },
  accepted: { bg: 'rgba(34, 197, 94, 0.1)', text: '#15803d', border: 'rgba(34, 197, 94, 0.2)' },
  declined: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.2)' }
}

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`/api/customers/${id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json() as CustomerDetail
      setCustomer(data)
      setEditForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        notes: data.notes || ''
      })
    } catch (err) {
      console.error('Error loading customer:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        await fetchCustomer()
        setEditing(false)
      } else {
        alert('Failed to save changes')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Customer Details">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(106,140,140,0.2)', borderTopColor: '#6a8c8c' }}
          />
        </div>
      </AdminShell>
    )
  }

  if (!customer) {
    return (
      <AdminShell title="Customer Details">
        <div className="text-center py-20">
          <p className="text-gray-500">Customer not found</p>
          <Link href="/admin/customers" className="text-[#6a8c8c] hover:underline mt-2 inline-block">
            Back to Customers
          </Link>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title={customer.name}>
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
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(106,140,140,0.1)' }}
              >
                <UserIcon className="h-7 w-7 text-[#6a8c8c]" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">{customer.name}</h1>
                {customer.company && (
                  <p className="text-gray-500">{customer.company}</p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            style={{
              background: 'rgba(106, 140, 140, 0.08)',
              color: '#5a7a7a',
              border: '1px solid rgba(106, 140, 140, 0.15)',
            }}
          >
            <PencilIcon className="h-4 w-4" />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: liquidEase }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Spent', value: `$${customer.stats.totalSpent.toLocaleString()}`, icon: CurrencyDollarIcon, color: '#22c55e' },
            { label: 'Orders', value: customer.stats.orderCount, icon: ClipboardDocumentListIcon, color: '#6a8c8c' },
            { label: 'Quotes', value: customer.stats.quoteCount, icon: DocumentTextIcon, color: '#f59e0b' }
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 flex items-center gap-4"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(106,140,140,0.08)',
              }}
            >
              <div
                className="p-2.5 rounded-lg"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info / Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: liquidEase }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(106,140,140,0.08)',
            }}
          >
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
              <h2 className="font-semibold text-gray-800">Contact Information</h2>
            </div>
            <div className="p-6">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={editForm.state}
                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                      <input
                        type="text"
                        value={editForm.zip}
                        onChange={(e) => setEditForm({ ...editForm, zip: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#6a8c8c] transition-colors resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-2.5 rounded-xl font-medium text-white transition-all disabled:opacity-50"
                    style={{ background: '#6a8c8c' }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <a href={`mailto:${customer.email}`} className="text-gray-700 hover:text-[#6a8c8c] transition-colors">
                      {customer.email}
                    </a>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <a href={`tel:${customer.phone}`} className="text-gray-700 hover:text-[#6a8c8c] transition-colors">
                        {customer.phone}
                      </a>
                    </div>
                  )}
                  {customer.company && (
                    <div className="flex items-center gap-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{customer.company}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-700">
                        {customer.address}<br />
                        {customer.city}, {customer.state} {customer.zip}
                      </span>
                    </div>
                  )}
                  {customer.notes && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Notes</p>
                      <p className="text-gray-700 text-sm">{customer.notes}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 pt-2">
                    Customer since {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Orders & Quotes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: liquidEase }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Orders */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                border: '1px solid rgba(106,140,140,0.08)',
              }}
            >
              <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
                <h2 className="font-semibold text-gray-800">Orders</h2>
              </div>
              {customer.orders.length > 0 ? (
                <div className="divide-y divide-gray-100/50">
                  {customer.orders.map((order) => {
                    const status = statusStyles[order.status] || statusStyles.PENDING
                    return (
                      <Link
                        key={order.id}
                        href={`/admin/orders/${order.id}`}
                        className="block px-6 py-4 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-mono text-sm font-medium text-gray-800">{order.orderNumber}</p>
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{order.description}</p>
                          </div>
                          <div className="text-right">
                            <span
                              className="text-xs px-2 py-1 rounded-lg font-medium"
                              style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                            <p className="text-sm font-medium text-gray-800 mt-1">${order.price?.toFixed(2) || '0.00'}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {format(new Date(order.createdAt), 'MMM d, yyyy')}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="px-6 py-8 text-gray-400 text-sm text-center">No orders yet</p>
              )}
            </div>

            {/* Quotes */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                border: '1px solid rgba(106,140,140,0.08)',
              }}
            >
              <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(106,140,140,0.08)' }}>
                <h2 className="font-semibold text-gray-800">Quotes</h2>
              </div>
              {customer.quotes.length > 0 ? (
                <div className="divide-y divide-gray-100/50">
                  {customer.quotes.map((quote) => {
                    const status = statusStyles[quote.status] || statusStyles.pending
                    return (
                      <Link
                        key={quote.id}
                        href={`/admin/quotes/${quote.id}`}
                        className="block px-6 py-4 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{quote.productType}</p>
                            <p className="text-sm text-gray-500 mt-0.5">Qty: {quote.quantity}</p>
                          </div>
                          <div className="text-right">
                            <span
                              className="text-xs px-2 py-1 rounded-lg font-medium"
                              style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}
                            >
                              {quote.status}
                            </span>
                            {quote.price && (
                              <p className="text-sm font-medium text-gray-800 mt-1">${quote.price.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <p className="px-6 py-8 text-gray-400 text-sm text-center">No quotes yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminShell>
  )
}
