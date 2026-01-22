'use client'

export const runtime = 'edge'

import { useEffect, useState, useMemo } from 'react'
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
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  SwatchIcon,
  QrCodeIcon,
  PhotoIcon,
  RectangleStackIcon,
  TagIcon,
  CubeIcon,
  SparklesIcon,
  BoltIcon
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

// Parse structured product data from description
interface ParsedProductData {
  baseDescription: string
  deliveryAddress?: string
  cardDetails?: {
    nameOnCard?: string
    title?: string
    business?: string
    phone?: string
    email?: string
    website?: string
    cardColor?: string
    layout?: string
    addons: string[]
    backSide?: string
    backSideText?: string
    qrLink?: string
    pricePerCard?: string
    markingStyle?: string
  }
  penDetails?: {
    textStyle?: string
    line1?: string
    line2?: string
    font?: string
    penColor?: string
    addons: string[]
    pricePerPen?: string
  }
  labelDetails?: {
    type?: string
    size?: string
    material?: string
    textLines: string[]
    icon?: string
    hasQrCode?: boolean
    hasLogo?: boolean
    priceEach?: string
  }
  uploadedFiles: string[]
  hasSvgDesign: boolean
  svgSize?: string
}

function parseDescription(description: string): ParsedProductData {
  const result: ParsedProductData = {
    baseDescription: '',
    uploadedFiles: [],
    hasSvgDesign: false
  }

  const lines = description.split('\n')
  let section = 'base'
  const currentCardDetails: ParsedProductData['cardDetails'] = { addons: [] }
  const currentPenDetails: ParsedProductData['penDetails'] = { addons: [] }
  const currentLabelDetails: ParsedProductData['labelDetails'] = { textLines: [] }
  const baseLines: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('Delivery Address:')) {
      result.deliveryAddress = trimmed.replace('Delivery Address:', '').trim()
      continue
    }

    if (trimmed.includes('--- Metal Business Card Details ---')) {
      section = 'card'
      continue
    }
    if (trimmed.includes('--- Branded Pen Details ---')) {
      section = 'pen'
      continue
    }
    if (trimmed.includes('--- Tag Design ---') || trimmed.includes('--- Sign Design ---')) {
      section = 'label'
      currentLabelDetails.type = trimmed.includes('Tag') ? 'Tag' : 'Sign'
      continue
    }
    if (trimmed.includes('--- Uploaded Files ---')) {
      section = 'files'
      continue
    }
    if (trimmed.includes('[Lightburn-ready SVG design file included')) {
      result.hasSvgDesign = true
      const sizeMatch = trimmed.match(/(\d+\.?\d*KB)/)
      if (sizeMatch) result.svgSize = sizeMatch[1]
      continue
    }

    if (section === 'card' && trimmed) {
      if (trimmed.startsWith('Name on Card:')) currentCardDetails.nameOnCard = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Title:')) currentCardDetails.title = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Business:')) currentCardDetails.business = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Phone:')) currentCardDetails.phone = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Email:')) currentCardDetails.email = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Website:')) currentCardDetails.website = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Card Color:')) currentCardDetails.cardColor = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Layout:')) currentCardDetails.layout = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Marking Style:')) currentCardDetails.markingStyle = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Add-ons:')) {
        const addons = trimmed.split(':')[1]?.trim()
        if (addons && addons !== 'None') currentCardDetails.addons = addons.split(',').map(a => a.trim())
      }
      else if (trimmed.startsWith('Back Side:')) {
        const backInfo = trimmed.split(':').slice(1).join(':').trim()
        const dashIndex = backInfo.indexOf(' - "')
        if (dashIndex > -1) {
          currentCardDetails.backSide = backInfo.substring(0, dashIndex)
          currentCardDetails.backSideText = backInfo.substring(dashIndex + 4).replace('"', '')
        } else {
          currentCardDetails.backSide = backInfo
        }
      }
      else if (trimmed.startsWith('QR Link:')) currentCardDetails.qrLink = trimmed.split(':').slice(1).join(':').trim()
      else if (trimmed.startsWith('Price per Card:')) currentCardDetails.pricePerCard = trimmed.split(':')[1]?.trim()
    }

    if (section === 'pen' && trimmed) {
      if (trimmed.startsWith('Text Style:')) currentPenDetails.textStyle = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Line 1:')) currentPenDetails.line1 = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Line 2:')) currentPenDetails.line2 = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Font:')) currentPenDetails.font = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Pen Color:')) currentPenDetails.penColor = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Add-ons:')) {
        const addons = trimmed.split(':')[1]?.trim()
        if (addons && addons !== 'None') currentPenDetails.addons = addons.split(',').map(a => a.trim())
      }
      else if (trimmed.startsWith('Price per Pen:')) currentPenDetails.pricePerPen = trimmed.split(':')[1]?.trim()
    }

    if (section === 'label' && trimmed) {
      if (trimmed.startsWith('Size:')) currentLabelDetails.size = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Material:')) currentLabelDetails.material = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('Line ')) {
        const text = trimmed.split(':').slice(1).join(':').trim()
        if (text) currentLabelDetails.textLines.push(text)
      }
      else if (trimmed.startsWith('Icon:')) currentLabelDetails.icon = trimmed.split(':')[1]?.trim()
      else if (trimmed.startsWith('QR Code:')) currentLabelDetails.hasQrCode = trimmed.includes('Yes')
      else if (trimmed.startsWith('Logo:')) currentLabelDetails.hasLogo = trimmed.includes('Yes')
      else if (trimmed.startsWith('Price Each:')) currentLabelDetails.priceEach = trimmed.split(':')[1]?.trim()
    }

    if (section === 'files' && trimmed && !trimmed.startsWith('NOTE:')) {
      if (trimmed.match(/\.\w+\s*\(/)) {
        result.uploadedFiles.push(trimmed)
      }
    }

    if (section === 'base' && trimmed) {
      baseLines.push(trimmed)
    }
  }

  result.baseDescription = baseLines.join('\n')
  if (currentCardDetails.nameOnCard || currentCardDetails.cardColor) result.cardDetails = currentCardDetails
  if (currentPenDetails.line1 || currentPenDetails.penColor) result.penDetails = currentPenDetails
  if (currentLabelDetails.textLines.length > 0 || currentLabelDetails.size) result.labelDetails = currentLabelDetails

  return result
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

  // Parse product details from description
  const parsedData = useMemo(() => {
    if (!quote?.description) return null
    return parseDescription(quote.description)
  }, [quote?.description])

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

  // Quick approve: for quotes that already have a calculated price, skip the quote-send step
  const handleQuickApprove = async () => {
    if (!quote?.price) {
      setError('No price calculated for this order')
      return
    }

    if (!quote.customer.email) {
      setError('Customer email is required to send invoice')
      return
    }

    setSaving(true)
    setError('')

    try {
      // First, set status to pending-approval
      const statusRes = await fetch(`/api/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending-approval' })
      })

      if (!statusRes.ok) {
        throw new Error('Failed to update status')
      }

      // Then call the accept endpoint to create invoice and start order
      const res = await fetch(`/api/quotes/${params.id}/accept`, {
        method: 'POST'
      })

      if (res.ok) {
        const data = await res.json() as Quote & { orderNumber?: string; invoiceUrl?: string; message?: string }
        setQuote(data)
        setSuccess(data.message || 'Order approved! Invoice sent to customer.')
        if (data.invoiceUrl) {
          window.open(data.invoiceUrl, '_blank')
        }
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Failed to approve order')
      }
    } catch {
      setError('Failed to approve order')
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

            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: liquidEase }}
              className="rounded-2xl p-6"
              style={glassCard}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Order Summary</h3>
                <div className="flex items-center gap-2">
                  <CubeIcon className="h-5 w-5 text-[#6a8c8c]" />
                  <span className="font-bold text-lg text-gray-800">{quote.quantity}x</span>
                </div>
              </div>

              {/* Product Type Badge */}
              <div className="mb-4">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(106,140,140,0.15) 0%, rgba(106,140,140,0.08) 100%)',
                    border: '1px solid rgba(106,140,140,0.2)',
                    color: '#5a7a7a',
                  }}
                >
                  {quote.productType.toLowerCase().includes('card') && <CreditCardIcon className="h-4 w-4" />}
                  {quote.productType.toLowerCase().includes('pen') && <SparklesIcon className="h-4 w-4" />}
                  {(quote.productType.toLowerCase().includes('tag') || quote.productType.toLowerCase().includes('sign')) && <TagIcon className="h-4 w-4" />}
                  {quote.productType}
                </span>
              </div>

              {/* Turnaround & Delivery */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(106,140,140,0.04)', border: '1px solid rgba(106,140,140,0.08)' }}>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Turnaround</span>
                  <p className="font-medium text-gray-800 mt-0.5 capitalize">{quote.turnaround}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(106,140,140,0.04)', border: '1px solid rgba(106,140,140,0.08)' }}>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Delivery</span>
                  <p className="font-medium text-gray-800 mt-0.5 capitalize">{quote.deliveryMethod}</p>
                </div>
              </div>

              {/* Delivery Address if present */}
              {parsedData?.deliveryAddress && (
                <div className="mb-5 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <span className="text-xs text-blue-600 uppercase tracking-wide font-medium">Delivery Address</span>
                  <p className="text-sm text-gray-700 mt-1">{parsedData.deliveryAddress}</p>
                </div>
              )}

              {/* Base Description */}
              {parsedData?.baseDescription && (
                <div className="mb-5">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Notes</span>
                  <p className="text-sm text-gray-700 mt-1">{parsedData.baseDescription}</p>
                </div>
              )}
            </motion.div>

            {/* Metal Business Card Details */}
            {parsedData?.cardDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: liquidEase }}
                className="rounded-2xl p-6"
                style={glassCard}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CreditCardIcon className="h-5 w-5 text-[#6a8c8c]" />
                  <h3 className="font-semibold text-gray-800">Metal Business Card</h3>
                </div>

                {/* Card Info Grid */}
                <div className="space-y-3">
                  {parsedData.cardDetails.nameOnCard && (
                    <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(106,140,140,0.08) 0%, rgba(106,140,140,0.03) 100%)', border: '1px solid rgba(106,140,140,0.12)' }}>
                      <span className="text-lg font-bold text-gray-800">{parsedData.cardDetails.nameOnCard}</span>
                      {parsedData.cardDetails.title && <p className="text-sm text-gray-600">{parsedData.cardDetails.title}</p>}
                      {parsedData.cardDetails.business && <p className="text-sm text-[#6a8c8c] font-medium">{parsedData.cardDetails.business}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {parsedData.cardDetails.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        {parsedData.cardDetails.phone}
                      </div>
                    )}
                    {parsedData.cardDetails.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                        {parsedData.cardDetails.email}
                      </div>
                    )}
                    {parsedData.cardDetails.website && (
                      <div className="col-span-2 flex items-center gap-2 text-gray-600">
                        <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                        {parsedData.cardDetails.website}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                    {parsedData.cardDetails.cardColor && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Card Color</span>
                        <div className="flex items-center gap-2 mt-1">
                          <SwatchIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{parsedData.cardDetails.cardColor}</span>
                        </div>
                      </div>
                    )}
                    {parsedData.cardDetails.layout && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Layout</span>
                        <div className="flex items-center gap-2 mt-1">
                          <RectangleStackIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{parsedData.cardDetails.layout}</span>
                        </div>
                      </div>
                    )}
                    {parsedData.cardDetails.markingStyle && (
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Marking Style</span>
                        <div className="flex items-center gap-2 mt-1">
                          <BoltIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{parsedData.cardDetails.markingStyle}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Addons */}
                  {parsedData.cardDetails.addons.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Add-ons</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {parsedData.cardDetails.addons.map((addon, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {addon.includes('QR') && <QrCodeIcon className="h-3 w-3 inline mr-1" />}
                            {addon.includes('Logo') && <PhotoIcon className="h-3 w-3 inline mr-1" />}
                            {addon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* QR Link */}
                  {parsedData.cardDetails.qrLink && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">QR Code Links To</span>
                      <a href={parsedData.cardDetails.qrLink} target="_blank" rel="noopener noreferrer" className="block mt-1 text-sm text-[#6a8c8c] hover:underline truncate">
                        {parsedData.cardDetails.qrLink}
                      </a>
                    </div>
                  )}

                  {/* Back Side */}
                  {parsedData.cardDetails.backSide && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Back Side Design</span>
                      <p className="text-sm font-medium text-gray-700 mt-1">{parsedData.cardDetails.backSide}</p>
                      {parsedData.cardDetails.backSideText && (
                        <p className="text-sm text-gray-600 mt-0.5 italic">&ldquo;{parsedData.cardDetails.backSideText}&rdquo;</p>
                      )}
                    </div>
                  )}

                  {/* Price per card */}
                  {parsedData.cardDetails.pricePerCard && (
                    <div className="pt-3 border-t border-gray-100 text-right">
                      <span className="text-sm text-gray-500">Unit Price:</span>
                      <span className="ml-2 font-bold text-[#6a8c8c]">{parsedData.cardDetails.pricePerCard}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Branded Pen Details */}
            {parsedData?.penDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: liquidEase }}
                className="rounded-2xl p-6"
                style={glassCard}
              >
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="h-5 w-5 text-[#6a8c8c]" />
                  <h3 className="font-semibold text-gray-800">Branded Pen</h3>
                </div>

                <div className="space-y-3">
                  {/* Text Preview */}
                  <div className="p-4 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(106,140,140,0.08) 0%, rgba(106,140,140,0.03) 100%)', border: '1px solid rgba(106,140,140,0.12)' }}>
                    <p className="font-bold text-gray-800">{parsedData.penDetails.line1}</p>
                    {parsedData.penDetails.line2 && (
                      <p className="text-sm text-gray-600 mt-1">{parsedData.penDetails.line2}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {parsedData.penDetails.penColor && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Pen Color</span>
                        <div className="flex items-center gap-2 mt-1">
                          <SwatchIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 capitalize">{parsedData.penDetails.penColor}</span>
                        </div>
                      </div>
                    )}
                    {parsedData.penDetails.font && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Font</span>
                        <p className="text-sm font-medium text-gray-700 mt-1 capitalize">{parsedData.penDetails.font}</p>
                      </div>
                    )}
                  </div>

                  {parsedData.penDetails.addons.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Add-ons</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {parsedData.penDetails.addons.map((addon, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {addon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsedData.penDetails.pricePerPen && (
                    <div className="pt-3 border-t border-gray-100 text-right">
                      <span className="text-sm text-gray-500">Unit Price:</span>
                      <span className="ml-2 font-bold text-[#6a8c8c]">{parsedData.penDetails.pricePerPen}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Tag/Sign Details */}
            {parsedData?.labelDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: liquidEase }}
                className="rounded-2xl p-6"
                style={glassCard}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TagIcon className="h-5 w-5 text-[#6a8c8c]" />
                  <h3 className="font-semibold text-gray-800">{parsedData.labelDetails.type || 'Label'} Design</h3>
                </div>

                <div className="space-y-3">
                  {/* Text Preview */}
                  {parsedData.labelDetails.textLines.length > 0 && (
                    <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(106,140,140,0.08) 0%, rgba(106,140,140,0.03) 100%)', border: '1px solid rgba(106,140,140,0.12)' }}>
                      {parsedData.labelDetails.textLines.map((line, i) => (
                        <p key={i} className={i === 0 ? "font-bold text-gray-800" : "text-sm text-gray-600 mt-1"}>{line}</p>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {parsedData.labelDetails.size && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Size</span>
                        <p className="text-sm font-medium text-gray-700 mt-1">{parsedData.labelDetails.size}</p>
                      </div>
                    )}
                    {parsedData.labelDetails.material && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Material</span>
                        <p className="text-sm font-medium text-gray-700 mt-1">{parsedData.labelDetails.material}</p>
                      </div>
                    )}
                    {parsedData.labelDetails.icon && (
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Icon</span>
                        <p className="text-sm font-medium text-gray-700 mt-1">{parsedData.labelDetails.icon}</p>
                      </div>
                    )}
                  </div>

                  {/* Extras */}
                  {(parsedData.labelDetails.hasQrCode || parsedData.labelDetails.hasLogo) && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Extras</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {parsedData.labelDetails.hasQrCode && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <QrCodeIcon className="h-3 w-3 inline mr-1" />QR Code
                          </span>
                        )}
                        {parsedData.labelDetails.hasLogo && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <PhotoIcon className="h-3 w-3 inline mr-1" />Logo
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {parsedData.labelDetails.priceEach && (
                    <div className="pt-3 border-t border-gray-100 text-right">
                      <span className="text-sm text-gray-500">Unit Price:</span>
                      <span className="ml-2 font-bold text-[#6a8c8c]">{parsedData.labelDetails.priceEach}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SVG Design Indicator */}
            {parsedData?.hasSvgDesign && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: liquidEase }}
                className="rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">Lightburn-Ready SVG Included</p>
                    <p className="text-sm text-emerald-600">{parsedData.svgSize || 'Design file'} ready for production</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Uploaded Files */}
            {parsedData && parsedData.uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: liquidEase }}
                className="rounded-2xl p-6"
                style={glassCard}
              >
                <div className="flex items-center gap-2 mb-4">
                  <PhotoIcon className="h-5 w-5 text-[#6a8c8c]" />
                  <h3 className="font-semibold text-gray-800">Uploaded Files</h3>
                </div>
                <div className="space-y-2">
                  {parsedData.uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(106,140,140,0.04)', border: '1px solid rgba(106,140,140,0.08)' }}>
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{file}</span>
                    </div>
                  ))}
                  <p className="text-xs text-amber-600 mt-2">Note: Contact customer to retrieve files (R2 storage pending setup)</p>
                </div>
              </motion.div>
            )}

            {/* Raw Description Fallback */}
            {(!parsedData?.cardDetails && !parsedData?.penDetails && !parsedData?.labelDetails) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: liquidEase }}
                className="rounded-2xl p-6"
                style={glassCard}
              >
                <h3 className="font-semibold text-gray-800 mb-4">Request Details</h3>
                <div
                  className="p-4 rounded-xl text-sm whitespace-pre-wrap"
                  style={{
                    background: 'rgba(106,140,140,0.04)',
                    border: '1px solid rgba(106,140,140,0.08)',
                  }}
                >
                  {quote.description}
                </div>
              </motion.div>
            )}
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
                    {/* Quick Approve - shown when price is pre-calculated and customer has email */}
                    {quote.price && quote.customer.email && (
                      <>
                        <div
                          className="p-4 rounded-xl mb-2"
                          style={{
                            background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)',
                            border: '1px solid rgba(34,197,94,0.2)',
                          }}
                        >
                          <p className="font-medium text-emerald-700">Pre-Calculated Order</p>
                          <p className="text-xs text-emerald-600 mt-1">
                            Customer designed for ${quote.price.toFixed(2)}. Quick approve to send invoice immediately.
                          </p>
                        </div>
                        <button
                          onClick={handleQuickApprove}
                          disabled={saving}
                          className="w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                          style={{
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            boxShadow: '0 4px 12px rgba(34,197,94,0.25)',
                          }}
                        >
                          <BoltIcon className="h-5 w-5" />
                          Quick Approve & Send Invoice
                        </button>
                        <div className="relative flex items-center py-2">
                          <div className="flex-grow border-t border-gray-200"></div>
                          <span className="flex-shrink mx-3 text-xs text-gray-400">or send quote for review</span>
                          <div className="flex-grow border-t border-gray-200"></div>
                        </div>
                      </>
                    )}

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
