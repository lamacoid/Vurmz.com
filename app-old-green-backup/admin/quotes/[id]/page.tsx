'use client'

export const runtime = 'edge'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { ArrowLeftIcon, CheckIcon, XMarkIcon, PaperAirplaneIcon, DocumentTextIcon, ClipboardIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

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

const statusConfig: Record<string, { label: string; color: string; next?: string }> = {
  new: { label: 'New Quote', color: 'bg-yellow-100 text-yellow-800', next: 'quoted' },
  'pending-approval': { label: 'Pending Approval', color: 'bg-orange-100 text-orange-800' },
  quoted: { label: 'Quote Sent', color: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800', next: 'in_progress' },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-800' },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800', next: 'complete' },
  complete: { label: 'Complete', color: 'bg-gray-100 text-gray-800' }
}

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
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
          // Set quote link if token exists
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
      // Fallback for older browsers
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
        setSuccess(data.message || 'Order accepted! Customer has been notified and payment link sent.')
        if (data.paymentUrl) {
          window.open(data.paymentUrl, '_blank')
        }
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Failed to accept order')
      }
    } catch {
      setError('Failed to accept order')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Quote Details">
        <div className="p-8 text-center text-gray-500">Loading...</div>
      </AdminShell>
    )
  }

  if (!quote) {
    return (
      <AdminShell title="Quote Details">
        <div className="p-8 text-center text-gray-500">{error || 'Quote not found'}</div>
      </AdminShell>
    )
  }

  const status = statusConfig[quote.status] || { label: quote.status, color: 'bg-gray-100' }

  return (
    <AdminShell title={`Quote #${quote.id}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/quotes" className="flex items-center gap-2 text-gray-600 hover:text-black">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Quotes
          </Link>
          <span className={`px-3 py-1 rounded text-sm font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4">{success}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Customer</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium">{quote.customer.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Business:</span>
                  <p className="font-medium">{quote.customer.business || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <p className="font-medium">{quote.customer.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">
                    {quote.customer.email ? (
                      <a href={`mailto:${quote.customer.email}`} className="text-vurmz-teal hover:underline">
                        {quote.customer.email}
                      </a>
                    ) : '-'}
                  </p>
                </div>
              </div>
              {/* Quick Contact Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                <a
                  href={`https://voice.google.com/u/0/messages?phoneNumber=+1${quote.customer.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-green-700"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>
                  Text via Google Voice
                </a>
                <a
                  href={`https://voice.google.com/u/0/calls?a=nc,+1${quote.customer.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-700"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  Call via Google Voice
                </a>
                {quote.customer.email && (
                  <a
                    href={`mailto:${quote.customer.email}`}
                    className="inline-flex items-center gap-1.5 bg-gray-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-gray-700"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    Email
                  </a>
                )}
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Request Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Product:</span>
                  <p className="font-medium">{quote.productType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Quantity:</span>
                  <p className="font-medium">{quote.quantity}</p>
                </div>
                <div>
                  <span className="text-gray-500">Turnaround:</span>
                  <p className="font-medium">{quote.turnaround}</p>
                </div>
                <div>
                  <span className="text-gray-500">Delivery:</span>
                  <p className="font-medium">{quote.deliveryMethod}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Description:</span>
                <p className="mt-1 whitespace-pre-wrap bg-gray-50 p-3 text-sm">{quote.description}</p>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Your Quote</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-gray-300 pl-8 pr-4 py-2 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes for Customer
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 px-3 py-2 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none resize-none text-sm"
                    placeholder="Estimated timeline, details, etc."
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Actions</h3>
              <div className="space-y-3">
                {quote.status === 'new' && (
                  <>
                    <button
                      onClick={handleSendQuote}
                      disabled={saving || !price}
                      className="w-full bg-vurmz-teal text-white px-4 py-3 font-medium hover:bg-vurmz-teal-dark disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                      Send Quote to Customer
                    </button>
                    <button
                      onClick={() => handleStatusChange('declined')}
                      disabled={saving}
                      className="w-full border border-red-300 text-red-600 px-4 py-2 font-medium hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      Decline Request
                    </button>
                  </>
                )}

                {quote.status === 'pending-approval' && (
                  <>
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded mb-3">
                      <p className="text-sm font-medium text-orange-800">Order Placed!</p>
                      <p className="text-xs text-orange-700 mt-1">
                        Customer placed an order for ${quote.price?.toFixed(2)}. Accept to charge their card and start work.
                      </p>
                    </div>
                    <button
                      onClick={handleAcceptOrder}
                      disabled={saving}
                      className="w-full bg-green-600 text-white px-4 py-3 font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="h-5 w-5" />
                      Accept Order & Charge ${quote.price?.toFixed(2)}
                    </button>
                    <button
                      onClick={() => handleStatusChange('declined')}
                      disabled={saving}
                      className="w-full border border-red-300 text-red-600 px-4 py-2 font-medium hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      Decline Order
                    </button>
                  </>
                )}

                {quote.status === 'quoted' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">
                      Waiting for customer to accept...
                    </p>
                    {quoteLink && (
                      <div className="bg-gray-50 p-3 rounded">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Share this link with customer:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={quoteLink}
                            readOnly
                            className="flex-1 text-xs bg-white border border-gray-300 px-2 py-1.5 rounded"
                          />
                          <button
                            onClick={copyToClipboard}
                            className="p-1.5 bg-vurmz-teal text-white rounded hover:bg-vurmz-teal-dark"
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <ClipboardDocumentCheckIcon className="h-4 w-4" />
                            ) : (
                              <ClipboardIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {copied && (
                          <p className="text-xs text-green-600 mt-1">Copied!</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {quote.status === 'accepted' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={saving}
                    className="w-full bg-purple-600 text-white px-4 py-3 font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    Start Work
                  </button>
                )}

                {quote.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange('complete')}
                    disabled={saving}
                    className="w-full bg-green-600 text-white px-4 py-3 font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    Mark Complete
                  </button>
                )}

                {quote.status === 'complete' && (
                  <button
                    onClick={handleSendInvoice}
                    disabled={saving}
                    className="w-full bg-vurmz-dark text-white px-4 py-3 font-medium hover:bg-black disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <DocumentTextIcon className="h-5 w-5" />
                    Send Invoice via Square
                  </button>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-4">Timeline</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted:</span>
                  <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                </div>
                {quote.responseSentAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quote Sent:</span>
                    <span>{new Date(quote.responseSentAt).toLocaleDateString()}</span>
                  </div>
                )}
                {quote.acceptedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Accepted:</span>
                    <span>{new Date(quote.acceptedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {quote.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completed:</span>
                    <span>{new Date(quote.completedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
