'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      setStatus('error')
      setError('Invalid login link')
      return
    }

    // Verify the token
    fetch('/api/portal/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email })
    })
      .then(res => res.json() as Promise<{ success?: boolean; error?: string }>)
      .then(data => {
        if (data.success) {
          setStatus('success')
          // Redirect to portal dashboard after brief delay
          setTimeout(() => {
            router.push('/portal')
          }, 1500)
        } else {
          setStatus('error')
          setError(data.error || 'Invalid or expired link')
        }
      })
      .catch(() => {
        setStatus('error')
        setError('Something went wrong. Please try again.')
      })
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-12 h-12 border-2 border-[#6a8c8c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your login...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">You&apos;re In!</h1>
          <p className="text-gray-600">Redirecting to your portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircleIcon className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Link Invalid</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href="/portal/login"
          className="inline-block px-6 py-3 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #6a8c8c 0%, #5a7a7a 100%)' }}
        >
          Request New Link
        </Link>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-12 h-12 border-2 border-[#6a8c8c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
