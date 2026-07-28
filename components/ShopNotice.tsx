'use client'

import { useState, FormEvent } from 'react'
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid'
import { getSmsLink } from '@/lib/site-info'

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
      className="fixed bottom-14 right-3 sm:bottom-4 sm:right-4 z-30 w-[calc(100vw-1.5rem)] max-w-[300px] max-h-[calc(100vh-9.5rem)] overflow-y-auto rounded-xl border border-[var(--hairline)] bg-[var(--surface)] p-4 shadow-lg shadow-black/10"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C67A6F]" aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--eyebrow)]">
          Temporarily closed
        </p>
      </div>

      {status === 'success' ? (
        <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
          You are on the list. You will be first in the queue when we open in the
          new space.
        </p>
      ) : (
        <>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
            Orders are paused while we transition to a new space. Still glad to
            talk through projects or answer questions.
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
        </>
      )}

      {/* The two buttons say text-or-email without saying it. */}
      <div className="mt-3 border-t border-[var(--hairline)] pt-3">
        {/* The number is not printed. The bubble opens Messages with a starter
            line already typed, so they only have to finish the sentence. */}
        <a
          href={getSmsLink('Hi Zach, I have a project in mind: ')}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#0B93F6] px-3 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#0A84FF]"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
          Message me directly
        </a>
        {/* The pill is the envelope: paper tones in both modes, the flap seam
            and a whisper-darker flap panel. Fixed hex on purpose; an envelope
            stays paper-colored in dark mode. A glass version was tried and
            rejected 2026-07-28 (buttons stay flat). Only the top flap; bottom
            seams too would draw an X that reads as a disabled button. */}
        <a
          href="mailto:zach@vurmz.com?subject=Project%20question&body=Hi%20Zach%2C%20I%20have%20a%20project%20in%20mind%3A%20"
          className="relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-full border border-[#16525C]/25 bg-[#DED6C3] px-3 py-2 text-[12.5px] font-semibold text-[#16525C] transition-colors hover:bg-[#D5CBB4]"
        >
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 272 36"
            preserveAspectRatio="none"
          >
            <path d="M-2 -2 L-2 2 L136 30 L274 2 L274 -2 Z" fill="#16525C" fillOpacity="0.06" />
            <path d="M-2 2 L136 30 L274 2" fill="none" stroke="#16525C" strokeOpacity="0.18" strokeWidth="1" />
          </svg>
          <span className="relative">Email me</span>
        </a>
      </div>
    </aside>
  )
}
