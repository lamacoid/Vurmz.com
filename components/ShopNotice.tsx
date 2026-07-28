'use client'

import { useState, FormEvent } from 'react'

// Closed notice with a newsletter signup. Floats bottom-right; lifts above the
// LaserCursor toggle (fixed bottom-4 left-4) on mobile, where they collide.
// Posts to the same /api/newsletter route as the footer and homepage forms, so
// everyone lands in one Resend audience for the reopen email.
export default function ShopNotice() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data: { error?: string } = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
        return
      }

      setStatus('success')
      setEmail('')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <aside
      aria-label="Temporarily closed"
      className="fixed bottom-16 right-3 sm:bottom-4 sm:right-4 z-30 w-[calc(100vw-1.5rem)] max-w-[300px] rounded-xl border border-[var(--hairline)] bg-[var(--surface)] p-4 shadow-lg shadow-black/10"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C67A6F]" aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--eyebrow)]">
          Temporarily closed
        </p>
      </div>

      {status === 'success' ? (
        <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
          You are on the list. You will be first in the queue when the shop has a
          new home.
        </p>
      ) : (
        <>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
            I am not taking new orders while the shop finds a new home. Still glad
            to talk through projects or answer questions.
          </p>

          <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            <label htmlFor="reopen-email" className="sr-only">
              Email address
            </label>
            <input
              id="reopen-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full rounded-md border border-[var(--hairline)] bg-[var(--page)] px-3 py-2 text-[12.5px] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/60 focus:border-[#C67A6F] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-md bg-[#C67A6F] px-3 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#B0675D] disabled:opacity-60"
            >
              {status === 'loading' ? 'Adding you...' : 'Email me when you reopen'}
            </button>

            {status === 'error' && (
              <p className="text-[11.5px] leading-snug text-[#B0675D]">{errorMsg}</p>
            )}

            <p className="text-[10.5px] leading-snug text-[var(--ink-soft)]/70">
              First in the queue when the doors open. Unsubscribe anytime.
            </p>
          </form>

          <a
            href="sms:7192573834"
            className="mt-3 inline-block text-[12px] font-medium text-[var(--ink)] underline underline-offset-4 decoration-[var(--hairline)] transition-colors hover:decoration-[#C67A6F]"
          >
            Text (719) 257-3834
          </a>
        </>
      )}
    </aside>
  )
}
