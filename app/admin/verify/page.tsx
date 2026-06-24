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
    fetch('/api/admin/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => {
        if (!r.ok) { setStatus('error'); return }
        setStatus('ok')
        setTimeout(() => router.push('/admin'), 800)
      })
      .catch(() => setStatus('error'))
  }, [params, router])

  return (
    <div className="min-h-screen bg-[var(--a-bg)] text-[var(--a-ink)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && <p className="text-[var(--a-ink-soft)] text-sm">Verifying admin link…</p>}
        {status === 'ok' && (
          <>
            <div className="w-14 h-14 rounded-full bg-[#7FCFD4]/15 border border-[#7FCFD4]/30 flex items-center justify-center mb-5 mx-auto">
              <span className="text-[var(--a-accent)] text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--a-ink)]">Signed in</h1>
            <p className="text-xs text-[var(--a-ink-faint)] mt-3">Redirecting to admin…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-xl font-bold text-[var(--a-ink)] mb-2">Link invalid or expired</h1>
            <p className="text-sm text-[var(--a-ink-soft)] mb-6">Admin sign-in links expire after 15 minutes and can only be used once.</p>
            <a href="/admin/login" className="text-sm text-[var(--a-accent)] hover:underline">Request a new link →</a>
          </>
        )}
      </div>
    </div>
  )
}

export default function AdminVerifyPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[var(--a-ink-faint)] text-sm">Loading…</div>}>
      <VerifyInner />
    </Suspense>
  )
}
