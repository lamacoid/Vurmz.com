'use client'

export const runtime = 'edge'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

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
  createdAt: string
  responseSentAt: string | null
  acceptedAt: string | null
  customerName: string
}

export default function ViewQuotePage() {
  const params = useParams()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [responding, setResponding] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseStatus, setResponseStatus] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    fetch(`/api/view-quote/${params.token}`)
      .then(res => res.json())
      .then((data: unknown) => {
        const result = data as Quote | { error: string }
        if ('error' in result) {
          setError('Quote not found or has expired.')
        } else {
          setQuote(result)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load quote')
        setLoading(false)
      })
  }, [params.token])

  const handleResponse = async (action: 'accept' | 'decline') => {
    setResponding(true)
    setResponseMessage('')

    try {
      const res = await fetch(`/api/view-quote/${params.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await res.json() as { success?: boolean; message?: string; error?: string; status?: string }

      if (res.ok && data.success) {
        setResponseStatus('success')
        setResponseMessage(data.message || 'Response recorded!')
        setQuote(prev => prev ? { ...prev, status: data.status || action + 'ed' } : null)
      } else {
        setResponseStatus('error')
        setResponseMessage(data.error || 'Failed to submit response')
      }
    } catch {
      setResponseStatus('error')
      setResponseMessage('Failed to submit response')
    } finally {
      setResponding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading quote...</div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 p-8 max-w-md w-full text-center">
          <XCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Quote Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This quote link is invalid or has expired.'}</p>
          <Link href="/" className="text-vurmz-teal hover:underline">
            Visit VURMZ.com
          </Link>
        </div>
      </div>
    )
  }

  const statusMessages: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
    accepted: {
      title: 'Quote Accepted!',
      description: 'Thank you for accepting this quote. We will begin work on your order shortly.',
      icon: <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
    },
    declined: {
      title: 'Quote Declined',
      description: 'Thank you for letting us know. Feel free to request a new quote anytime.',
      icon: <XCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
    },
    in_progress: {
      title: 'Work In Progress',
      description: 'Your order is currently being worked on. We will notify you when complete.',
      icon: <CheckCircleIcon className="h-16 w-16 text-purple-500 mx-auto mb-4" />
    },
    complete: {
      title: 'Order Complete',
      description: 'Your order has been completed! Check your email for delivery/pickup details.',
      icon: <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
    }
  }

  const statusInfo = statusMessages[quote.status]

  // If quote is not in 'quoted' status, show the appropriate message
  if (quote.status !== 'quoted' && statusInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-vurmz-dark text-white py-4">
          <div className="max-w-2xl mx-auto px-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="VURMZ" width={40} height={40} />
              <span className="font-bold text-xl tracking-wider">VURMZ</span>
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 py-12">
          <div className="bg-white border border-gray-200 p-8 text-center">
            {statusInfo.icon}
            <h1 className="text-2xl font-bold mb-2">{statusInfo.title}</h1>
            <p className="text-gray-600 mb-6">{statusInfo.description}</p>

            <div className="bg-gray-50 p-4 text-left text-sm space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Quote #:</span>
                <span className="font-medium">{quote.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product:</span>
                <span className="font-medium">{quote.productType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="font-bold text-lg">${quote.price?.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/" className="text-vurmz-teal hover:underline">
              Visit VURMZ.com
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-vurmz-dark text-white py-4">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="VURMZ" width={40} height={40} />
            <span className="font-bold text-xl tracking-wider">VURMZ</span>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-white border border-gray-200">
          {/* Quote Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-1">Your Quote from VURMZ</h1>
            <p className="text-gray-600">
              Hi {quote.customerName.split(' ')[0]}, here&apos;s your custom quote for laser engraving.
            </p>
          </div>

          {/* Quote Details */}
          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Product Type</span>
                <span className="font-medium">{quote.productType}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Quantity</span>
                <span className="font-medium">{quote.quantity}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Turnaround</span>
                <span className="font-medium">{quote.turnaround}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Delivery</span>
                <span className="font-medium">{quote.deliveryMethod}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-gray-500 text-sm block mb-1">Your Request</span>
              <div className="bg-gray-50 p-3 text-sm whitespace-pre-wrap">
                {quote.description}
              </div>
            </div>

            {/* Admin Notes */}
            {quote.adminNotes && (
              <div>
                <span className="text-gray-500 text-sm block mb-1">Notes from VURMZ</span>
                <div className="bg-vurmz-teal/10 border border-vurmz-teal/20 p-3 text-sm whitespace-pre-wrap">
                  {quote.adminNotes}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="bg-vurmz-dark text-white p-6 -mx-6">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total Price</span>
                <span className="text-3xl font-bold">${quote.price?.toFixed(2)}</span>
              </div>
            </div>

            {/* Response Message */}
            {responseMessage && (
              <div className={`p-4 ${responseStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {responseMessage}
              </div>
            )}

            {/* Action Buttons */}
            {quote.status === 'quoted' && !responseMessage && (
              <div className="space-y-3">
                <button
                  onClick={() => handleResponse('accept')}
                  disabled={responding}
                  className="w-full bg-vurmz-teal text-white py-4 font-bold text-lg hover:bg-vurmz-teal-dark disabled:bg-gray-300 flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="h-6 w-6" />
                  Accept Quote
                </button>
                <button
                  onClick={() => handleResponse('decline')}
                  disabled={responding}
                  className="w-full border border-gray-300 text-gray-600 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Decline
                </button>
                <p className="text-xs text-gray-500 text-center">
                  By accepting, you agree to proceed with this order at the quoted price.
                  An invoice will be sent separately for payment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Questions? Contact us at <a href="mailto:zach@vurmz.com" className="text-vurmz-teal hover:underline">zach@vurmz.com</a></p>
        </div>
      </div>
    </div>
  )
}
