'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyInner() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    const token = params?.get('t')
    if (!token) { setStatus('error'); return }
    fetch('/api/account/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async r => {
        if (r.ok) { setStatus('ok'); router.push('/account') }
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [params, router])

  return (
    <div className="max-w-md mx-auto p-6 sm:p-10 text-center">
      {status === 'loading' && <p className="text-gray-400 text-sm">Verifying your sign-in link…</p>}
      {status === 'ok' && <p className="text-cream text-sm">Signed in. Redirecting…</p>}
      {status === 'error' && (
        <div>
          <h1 className="text-xl font-bold text-cream mb-2">Link invalid or expired</h1>
          <p className="text-sm text-gray-400 mb-6">Sign-in links expire after 15 minutes and can only be used once.</p>
          <a href="/account/login" className="text-sm text-[#6BB8B2] hover:underline">Request a new link →</a>
        </div>
      )}
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500 text-sm">Loading…</div>}>
      <VerifyInner />
    </Suspense>
  )
}
