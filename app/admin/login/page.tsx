'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicEmail, setMagicEmail] = useState('')
  const [magicStatus, setMagicStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Wrong password')
        setPassword('')
      }
    } catch {
      setError('Connection failed')
    } finally {
      setLoading(false)
    }
  }

  async function sendMagic(e: React.FormEvent) {
    e.preventDefault()
    setMagicStatus('sending')
    try {
      const res = await fetch('/api/admin/auth/magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: magicEmail }),
      })
      setMagicStatus(res.ok ? 'sent' : 'error')
    } catch {
      setMagicStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#1d474e] flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <h1 className="text-lg font-bold text-cream tracking-wider">VURMZ</h1>
          <p className="text-xs text-gray-500 mt-1">Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-3 bg-[#1A4F48] border border-[#2d4a47] rounded-lg text-cream text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#2FE6C4]/50 transition-colors"
          />

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-lg hover:bg-vurmz-cta-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-wider text-gray-600">
          <span className="flex-1 h-px bg-white/10" />
          or
          <span className="flex-1 h-px bg-white/10" />
        </div>

        {magicStatus === 'sent' ? (
          <div className="bg-[#1A4F48] border border-[#2FE6C4]/20 rounded-lg p-4 text-center">
            <p className="text-cream text-sm font-semibold mb-1">Check your email</p>
            <p className="text-xs text-gray-400">If that address is the admin, a sign-in link is on its way.</p>
            <button
              onClick={() => { setMagicStatus('idle'); setMagicEmail('') }}
              className="text-[10px] text-gray-500 hover:text-cream mt-3"
            >
              try again
            </button>
          </div>
        ) : (
          <form onSubmit={sendMagic} className="space-y-3">
            <input
              type="email"
              value={magicEmail}
              onChange={e => setMagicEmail(e.target.value)}
              placeholder="Email me a sign-in link"
              required
              className="w-full px-4 py-2.5 bg-[#1A4F48] border border-[#2d4a47] rounded-lg text-cream text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#2FE6C4]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={magicStatus === 'sending' || !magicEmail}
              className="w-full py-2.5 bg-[#1A4F48] hover:bg-[#2d4a47] border border-white/10 text-cream font-medium text-xs rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {magicStatus === 'sending' ? 'Sending…' : 'Email sign-in link'}
            </button>
            {magicStatus === 'error' && (
              <p className="text-xs text-red-400 text-center">Couldn&rsquo;t send. Try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
