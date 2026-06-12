'use client'

import { useState } from 'react'

export default function UnsubscribeForm({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: { message?: string } }
      if (!res.ok || !data.ok) {
        setStatus('error')
        setMessage(data.error?.message ?? 'Could not unsubscribe. Try again or text Zach directly.')
        return
      }
      setStatus('success')
      setMessage("You're off the list. Thanks for trying VURMZ.")
    } catch {
      setStatus('error')
      setMessage('Network error. Try again in a minute.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-vurmz-teal/10 border border-vurmz-teal/30 rounded-md p-6 text-center">
        <p className="text-cream">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-vurmz-dark border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
        />
      </div>
      {status === 'error' && <p className="text-red-400 text-sm">{message}</p>}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full px-6 py-3 bg-vurmz-cta text-white font-semibold rounded-md hover:bg-vurmz-cta-hover transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? 'Working…' : 'Unsubscribe'}
      </button>
    </form>
  )
}
