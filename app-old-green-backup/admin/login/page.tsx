'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json() as { error?: string; user?: { id: string; email: string; name: string } }

      if (data.error) {
        setError('Invalid email or password')
      } else {
        router.push('/admin/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vurmz-light flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/images/vurmz-logo.svg"
              alt="VURMZ LLC"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-vurmz-dark">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Sign in to manage VURMZ</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-vurmz-dark mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
                placeholder="zach@vurmz.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-vurmz-dark mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vurmz-teal text-white px-6 py-3 font-semibold hover:bg-vurmz-teal-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Demo credentials:</p>
            <p className="font-mono mt-1">zach@vurmz.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
