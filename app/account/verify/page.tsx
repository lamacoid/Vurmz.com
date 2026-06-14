'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function VerifyInner() {
  const params = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [firstName, setFirstName] = useState<string>('')

  useEffect(() => {
    const token = params?.get('t')
    if (!token) { setStatus('error'); return }
    fetch('/api/account/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async r => {
        if (!r.ok) { setStatus('error'); return }
        const json = (await r.json()) as { firstName: string }
        setFirstName(json.firstName)
        setStatus('ok')
        setTimeout(() => router.push('/account'), 1400)
      })
      .catch(() => setStatus('error'))
  }, [params, router])

  return (
    <div className="max-w-md mx-auto p-6 sm:p-10 text-center">
      {status === 'loading' && <p className="text-gray-400 text-sm">Verifying your sign-in link…</p>}
      {status === 'ok' && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#2FE6C4]/15 border border-[#2FE6C4]/30 flex items-center justify-center mb-5">
            <span className="text-[#2FE6C4] text-2xl font-semibold">
              {firstName ? firstName.charAt(0).toUpperCase() : '✓'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-cream">
            {firstName ? `Hi, ${firstName}` : 'Signed in'}
          </h1>
          <p className="text-xs text-gray-500 mt-3 tracking-wide">
            {firstName ? 'Welcome back' : 'Welcome to VURMZ'}
          </p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h1 className="text-xl font-bold text-cream mb-2">Link invalid or expired</h1>
          <p className="text-sm text-gray-400 mb-6">Sign-in links expire after 15 minutes and can only be used once.</p>
          <a href="/account/login" className="text-sm text-[#2FE6C4] hover:underline">Request a new link →</a>
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
