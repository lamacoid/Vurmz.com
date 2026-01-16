'use client'

export const runtime = 'edge'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
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
  adminNotes: string | null
  customerToken: string | null
  createdAt: string
  responseSentAt: string | null
  acceptedAt: string | null
  completedAt: string | null
  customer: {
    name: string
    email: string | null
    phone: string
    business: string | null
  }
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  new: {
    label: 'New Quote',
    bg: 'rgba(251, 191, 36, 0.1)',
    text: '#b45309',
    border: 'rgba(251, 191, 36, 0.2)'
  },
  'pending-approval': {
    label: 'Pending Approval',
    bg: 'rgba(249, 115, 22, 0.1)',
    text: '#c2410c',
    border: 'rgba(249, 115, 22, 0.2)'
  },
  quoted: {
    label: 'Quote Sent',
    bg: 'rgba(106, 140, 140, 0.1)',
    text: '#5a7a7a',
    border: 'rgba(106, 140, 140, 0.2)'
  },
  accepted: {
    label: 'Accepted',
    bg: 'rgba(34, 197, 94, 0.1)',
    text: '#15803d',
    border: 'rgba(34, 197, 94, 0.2)'
  },
  declined: {
    label: 'Declined',
    bg: 'rgba(239, 68, 68, 0.1)',
    text: '#dc2626',
    border: 'rgba(239, 68, 68, 0.2)'
  },
  in_progress: {
    label: 'In Progress',
    bg: 'rgba(147, 51, 234, 0.1)',
    text: '#7c3aed',
    border: 'rgba(147, 51, 234, 0.2)'
  },
  complete: {
    label: 'Complete',
    bg: 'rgba(107, 114, 128, 0.1)',
    text: '#4b5563',
    border: 'rgba(107, 114, 128, 0.2)'
  }
}

const liquidEase = [0.23, 1, 0.32, 1] as const

const glassCard = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  boxShadow: '0 4px 20px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
  border: '1px solid rgba(106,140,140,0.08)',
}

export default function QuoteDetailPage() {
  const params = useParams()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [price, setPrice] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [quoteLink, setQuoteLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/quotes/${params.id}`)
      .then(res => res.json())
      .then((data: unknown) => {
        const result = data as Quote | { error: string }
        if ('error' in result) {
          setError('Quote not found')
        } else {
          setQuote(result)
          setPrice(result.price?.toString() || '')
          setAdminNotes(result.adminNotes || '')
          if (result.customerToken) {
            setQuoteLink(`https://www.vurmz.com/view-quote/${result.customerToken}`)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load quote')
        setLoading(false)
      })
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: price ? parseFloat(price) : null,
          adminNotes
        })
      })

      if (res.ok) {
        const updated = await res.json() as Quote
        setQuote(updated)
        setSuccess('Saved!')
        setTimeout(() => setSuccess(''), 2000)
      } else {
        setError('Failed to save')
      }
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleSendQuote = async () => {
    if (!price) {
      setError('Please set a price before sending')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/quotes/${params.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(price), adminNotes })
      })

      if (res.ok) {
        const data = await res.json() as Quote & { quoteLink?: string }
        setQuote(data)
        if (data.quoteLink) {
          setQuoteLink(data.quoteLink)
        }
        setSuccess('Quote sent! Share the link with the customer.')
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Failed to send quote')
      }
    } catch {
      setError('Failed to send quote')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quoteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = quoteLink
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        const updated = await res.json() as Quote
        setQuote(updated)
        setSuccess('Status updated!')
        setTimeout(() => setSuccess(''), 2000)
      } else {
        setError('Failed to update status')
      }
    } catch {
      setError('Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const handleAcceptOrder = async () => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/quotes/${params.id}/accept`, {
        method: 'POST'
      })

      if (res.ok) {
        const data = await res.json() as Quote & { paymentUrl?: string; message?: string }
        setQuote(data)
        setSuccess(data.message || 'Order started! Customer has been notified with invoice.')
        if (data.paymentUrl) {
          window.open(data.paymentUrl, '_blank')
        }
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Failed to start order')
      }
    } catch {
      setError('Failed to start order')
    } finally {
      setSaving(false)
    }
  }

  const handleMarkComplete = async () => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/quotes/${params.id}/complete`, {
        method: 'POST'
      })

      if (res.ok) {
        const data = await res.json() as Quote & { message?: string }
        setQuote(data)
        setSuccess(data.message || 'Order complete! Customer notified.')
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Failed to complete order')
      }
    } catch {
      setError('Failed to complete order')
    } finally {
      setSaving(false)
    }
  }

  const handleSendInvoice = async () => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/quotes/${params.id}/invoice`, {
        method: 'POST'
      })

      if (res.ok) {
        const data = await res.json() as { invoiceUrl?: string }
        setSuccess('Invoice sent via Square!')
        if (data.invoiceUrl) {
          window.open(data.invoiceUrl, '_blank')
        }
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Failed to send invoice')
      }
    } catch {
      setError('Failed to send invoice')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Quote Details">
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(106,140,140,0.2)', borderTopColor: '#6a8c8c' }}
          />
        </div>
      </AdminShell>
    )
  }

  if (!quote) {
    return (
      <AdminShell title="Quote Details">
        <div className="py-20 text-center text-gray-500">{error || 'Quote not found'}</div>
      </AdminShell>
    )
  }

  const status = statusConfig[quote.status] || statusConfig.new

  return (
    <AdminShell title={`Quote #${quote.id}`}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: liquidEase }}
          className="flex items-center justify-between"
        >
          <Link
            href="/admin/quotes"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Quotes</span>
          </Link>
          <span
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{
              background: status.bg,
              color: status.text,
              border: `1px solid ${status.border}`,
            }}
          >
            {status.label}
          </span>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#dc2626',
            }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              color: '#15803d',
            }}
          >
            {success}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: liquidEase }}
              className="rounded-2xl p-6"
              style={glassCard}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Customer</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name</span>
                  <p className="font-medium text-gray-800 mt-0.5">{quote.customer.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Business</span>
                  <p className="font-medium text-gray-800 mt-0.5">{quote.customer.business || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone</span>
                  <p className="font-medium text-gray-800 mt-0.5">{quote.customer.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="font-medium mt-0.5">
                    {quote.customer.email ? (
                      <a href={`mailto:${quote.customer.email}`} className="text-[#6a8c8c] hover:underline">
                        {quote.customer.email}
                      </a>
                    ) : '—'}
                  </p>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="mt-5 pt-5 flex flex-wrap gap-2" style={{ borderTop: '1px solid rgba(106,140,140,0.1)' }}>
                <a
                  href={`https://voice.google.com/u/0/messages?phoneNumber=+1${quote.customer.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    color: '#15803d',
                  }}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  Text
                </a>
                <a
                  href={`https://voice.google.com/u/0/calls?a=nc,+1${quote.customer.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    color: '#2563eb',
                  }}
                >
                  <PhoneIcon className="h-4 w-4" />
                  Call
                </a>
                {quote.customer.email && (
                  <a
                    href={`mailto:${quote.customer.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(107, 114, 128, 0.1)',
                      border: '1px solid rgba(107, 114, 128, 0.2)',
                      color: '#4b5563',
                    }}
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    Email
                  </a>
                )}
              </div>
            </motion.div>

            {/* Request Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: liquidEase }}
              className="rounded-2xl p-6"
              style={glassCard}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Request Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                <div>
                  <span className="text-gray-500">Product</span>
                  <p className="font-medium text-gray-800 mt-0.5">{quote.productType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Quantity</span>
                  <p className="font-medium text-gray-800 mt-0.5">{quote.quantity}</p>
                </div>
                <div>
                  <span className="text-gray-500">Turnaround</span>
                  <p className="font-medium text-gray-800 mt-0.5">{quote.turnaround}</p>
                </div>
                <div>
                  <span className="text-gray-500">Delivery</span>
                  <p className="font-medium text-gray-800 mt-0.5">{quote.deliveryMethod}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Description</span>
                <div
                  className="mt-2 p-4 rounded-xl text-sm whitespace-pre-wrap"
                  style={{
                    background: 'rgba(106,140,140,0.04)',
                    border: '1px solid rgba(106,140,140,0.08)',
                  }}
                >
                  {quote.description}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: liquidEase }}
              className="rounded-2xl p-6"
              style={glassCard}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Your Quote</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                      style={{
                        background: 'rgba(106,140,140,0.04)',
                        border: '1px solid rgba(106,140,140,0.12)',
                      }}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Notes for Customer</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl outline-none resize-none text-sm transition-all focus:ring-2 focus:ring-[#6a8c8c]/20"
                    style={{
                      background: 'rgba(106,140,140,0.04)',
                      border: '1px solid rgba(106,140,140,0.12)',
                    }}
                    placeholder="Estimated timeline, details, etc."
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
                  style={{
                    background: 'rgba(106,140,140,0.08)',
                    border: '1px solid rgba(106,140,140,0.15)',
                    color: '#5a7a7a',
                  }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>

            {/* Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: liquidEase }}
              className="rounded-2xl p-6"
              style={glassCard}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                {quote.status === 'new' && (
                  <>
                    <button
                      onClick={handleSendQuote}
                      disabled={saving || !price}
                      className="w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%)',
                        boxShadow: '0 4px 12px rgba(106,140,140,0.25)',
                      }}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                      Send Quote to Customer
                    </button>
                    <button
                      onClick={() => handleStatusChange('declined')}
                      disabled={saving}
                      className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#dc2626',
                      }}
                    >
                      <XMarkIcon className="h-5 w-5" />
                      Decline Request
                    </button>
                  </>
                )}

                {quote.status === 'pending-approval' && (
                  <>
                    <div
                      className="p-4 rounded-xl mb-3"
                      style={{
                        background: 'rgba(249, 115, 22, 0.08)',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                      }}
                    >
                      <p className="font-medium text-orange-700">Ready to Start!</p>
                      <p className="text-xs text-orange-600 mt-1">
                        Customer ordered for ${quote.price?.toFixed(2)}. Start the order to add it to your queue.
                      </p>
                    </div>
                    <button
                      onClick={handleAcceptOrder}
                      disabled={saving}
                      className="w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        boxShadow: '0 4px 12px rgba(34,197,94,0.25)',
                      }}
                    >
                      <CheckIcon className="h-5 w-5" />
                      Start Order
                    </button>
                    <button
                      onClick={() => handleStatusChange('declined')}
                      disabled={saving}
                      className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#dc2626',
                      }}
                    >
                      <XMarkIcon className="h-5 w-5" />
                      Decline Order
                    </button>
                  </>
                )}

                {quote.status === 'quoted' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 text-center">
                      Waiting for customer to accept...
                    </p>
                    {quoteLink && (
                      <div
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(106,140,140,0.04)',
                          border: '1px solid rgba(106,140,140,0.1)',
                        }}
                      >
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          Share this link with customer:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={quoteLink}
                            readOnly
                            className="flex-1 text-xs px-3 py-2 rounded-lg bg-white/50 border border-gray-200"
                          />
                          <button
                            onClick={copyToClipboard}
                            className="p-2 rounded-lg transition-all hover:scale-105"
                            style={{
                              background: 'linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%)',
                            }}
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <ClipboardDocumentCheckIcon className="h-4 w-4 text-white" />
                            ) : (
                              <ClipboardIcon className="h-4 w-4 text-white" />
                            )}
                          </button>
                        </div>
                        {copied && (
                          <p className="text-xs text-green-600 mt-2">Copied!</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {quote.status === 'accepted' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={saving}
                    className="w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    style={{
                      background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                      boxShadow: '0 4px 12px rgba(147,51,234,0.25)',
                    }}
                  >
                    <CheckIcon className="h-5 w-5" />
                    Start Work
                  </button>
                )}

                {quote.status === 'in_progress' && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={saving}
                    className="w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    style={{
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      boxShadow: '0 4px 12px rgba(34,197,94,0.25)',
                    }}
                  >
                    <CheckIcon className="h-5 w-5" />
                    Mark Complete & Notify
                  </button>
                )}

                {quote.status === 'complete' && (
                  <button
                    onClick={handleSendInvoice}
                    disabled={saving}
                    className="w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    style={{
                      background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                      boxShadow: '0 4px 12px rgba(55,65,81,0.25)',
                    }}
                  >
                    <DocumentTextIcon className="h-5 w-5" />
                    Send Invoice via Square
                  </button>
                )}
              </div>
            </motion.div>

            {/* Timeline Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: liquidEase }}
              className="rounded-2xl p-6"
              style={glassCard}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Timeline</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span className="text-gray-800">{format(new Date(quote.createdAt), 'MMM d, yyyy')}</span>
                </div>
                {quote.responseSentAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quote Sent</span>
                    <span className="text-gray-800">{format(new Date(quote.responseSentAt), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {quote.acceptedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Accepted</span>
                    <span className="text-gray-800">{format(new Date(quote.acceptedAt), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {quote.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completed</span>
                    <span className="text-gray-800">{format(new Date(quote.completedAt), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
