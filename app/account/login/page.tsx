'use client'
import { useState } from 'react'

export default function AccountLogin() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/account/auth/magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = (await res.json()) as { ok?: boolean; error?: { message?: string } }
      if (!res.ok || !json.ok) {
        setStatus('error')
        setError(json.error?.message ?? 'Something went wrong. Try again.')
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
      setError('Network error. Try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 sm:p-10">
      <h1 className="text-2xl font-bold text-[var(--ink)] mb-2">Sign in to your account</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8">We&rsquo;ll email you a one-time link, no password.</p>

      {status === 'sent' ? (
        <div className="bg-[var(--page)] border border-[#7FCFD4]/20 rounded-xl p-6">
          <p className="text-[var(--ink)] font-semibold mb-2">Check your email</p>
          <p className="text-sm text-[var(--ink-soft)]">
            We sent a sign-in link to <span className="text-[var(--ink)]">{email}</span>. The link expires in 15 minutes.
          </p>
          <p className="text-xs text-[var(--ink-soft)] mt-4">Didn&rsquo;t get it? Check spam, or <button onClick={() => setStatus('idle')} className="text-[#7FCFD4] hover:underline">try again</button>.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] block mb-1">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[var(--page)] border border-white/5 rounded-md px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[#7FCFD4]"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full h-10 bg-[#C67A6F] hover:bg-[#B0675D] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors"
          >
            {status === 'sending' ? 'Sending link…' : 'Send sign-in link'}
          </button>
        </form>
      )}

      <p className="mt-10 text-xs text-[var(--ink-soft)] text-center">
        New here? Just enter your email, we&rsquo;ll create your account when you first sign in.
      </p>
    </div>
  )
}
