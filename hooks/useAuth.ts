'use client'

import { useState, useEffect, useCallback } from 'react'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAdminAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json() as { user: AdminUser | null; isAuthenticated: boolean }

      setState({
        user: data.user || null,
        isAuthenticated: data.isAuthenticated || false,
        isLoading: false
      })
    } catch (error) {
      console.error('Auth check failed:', error)
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  return {
    ...state,
    logout,
    refresh: checkSession
  }
}
