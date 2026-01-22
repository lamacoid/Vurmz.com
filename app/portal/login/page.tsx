'use client'

import { useState } from 'react'
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function PortalLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/portal/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json() as { error?: string }

      if (res.ok) {
        setSent(true)
      } else {
        setError(data.error || 'Failed to send login link')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <EnvelopeIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            We sent a login link to <strong>{email}</strong>. Click the link in the email to sign in.
          </p>
          <p className="text-sm text-gray-500">
            Link expires in 15 minutes. Check your spam folder if you don&apos;t see it.
          </p>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            className="mt-6 text-[#6a8c8c] hover:underline text-sm"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">VURMZ</Link>
          <p className="text-gray-600 mt-2">Customer Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600 text-sm mb-6">
            Enter your email to receive a secure login link.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#6a8c8c]/20 focus:border-[#6a8c8c] outline-none"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%)' }}
            >
              {loading ? 'Sending...' : 'Send Login Link'}
              {!loading && <ArrowRightIcon className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New customer? <Link href="/order" className="text-[#6a8c8c] hover:underline">Place an order</Link> to create an account.
          </p>
        </div>
      </div>
    </div>
  )
}
