'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Failed to send link')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(106,140,140,0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(140,174,196,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: liquidEase }}
        className="relative max-w-md w-full"
      >
        {/* Card glow */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-50"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(106,140,140,0.15) 0%, transparent 60%)',
            filter: 'blur(20px)',
          }}
        />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: '0 20px 60px rgba(106,140,140,0.15), 0 1px 0 rgba(255,255,255,0.8) inset',
            border: '1px solid rgba(255,255,255,0.5)',
          }}
        >
          {/* Top glass edge highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.8) 50%, transparent 90%)',
            }}
          />

          <div className="p-10">
            {/* Logo */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: liquidEase }}
            >
              <Image
                src="/images/vurmz-logo-full.svg"
                alt="VURMZ"
                width={180}
                height={50}
                className="mx-auto mb-6"
                priority
              />
              <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Admin</h1>
              <p className="text-gray-500 text-sm mt-1">Sign in to manage orders</p>
            </motion.div>

            {/* Email sent confirmation */}
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 rounded-xl text-center"
                style={{
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <EnvelopeIcon className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="font-semibold text-gray-900 mb-1">Check Your Email</h2>
                <p className="text-sm text-gray-600">
                  Login link sent to <strong>{email}</strong>
                </p>
                <button
                  onClick={() => { setSent(false); setEmail('') }}
                  className="mt-3 text-sm text-[#6a8c8c] hover:underline"
                >
                  Use different email
                </button>
              </motion.div>
            )}

            {/* Error */}
            {error && !sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl text-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#dc2626',
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            {!sent && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: liquidEase }}
            >
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <motion.div
                  animate={{
                    boxShadow: focused === 'email'
                      ? '0 0 0 3px rgba(106,140,140,0.15), 0 2px 8px rgba(106,140,140,0.1)'
                      : '0 2px 8px rgba(106,140,140,0.06)',
                  }}
                  transition={{ duration: 0.3, ease: liquidEase }}
                  className="rounded-xl overflow-hidden"
                >
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    required
                    className="w-full px-4 py-3.5 rounded-xl outline-none transition-colors"
                    style={{
                      background: 'rgba(106,140,140,0.04)',
                      border: '1px solid rgba(106,140,140,0.12)',
                    }}
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 rounded-xl text-white font-medium overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(106,140,140,0.95) 0%, rgba(90,122,122,1) 100%)',
                  boxShadow: '0 4px 20px rgba(106,140,140,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: '0 6px 30px rgba(106,140,140,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.3, ease: liquidEase }}
              >
                {/* Glass shine */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
                  }}
                />
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Login Link'}
                </span>
              </motion.button>

            </motion.form>
            )}

            {/* Footer */}
            <motion.div
              className="mt-8 pt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: liquidEase }}
              style={{
                borderTop: '1px solid rgba(106,140,140,0.1)',
              }}
            >
              <p className="text-xs text-gray-400">
                Need help? Contact <a href="mailto:hello@vurmz.com" className="text-[#6a8c8c] hover:underline">hello@vurmz.com</a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Reflection */}
        <div
          className="absolute -bottom-20 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(106,140,140,0.03) 0%, transparent 100%)',
            filter: 'blur(10px)',
            transform: 'scaleY(-0.3)',
          }}
        />
      </motion.div>

      {/* Corner accents */}
      <div
        className="absolute -top-32 -right-32 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(106,140,140,0.06) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(140,174,196,0.05) 0%, transparent 50%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}
