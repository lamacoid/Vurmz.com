// Unified session management for Edge runtime
// Works with both admin and portal auth

export const ADMIN_SESSION_COOKIE = 'vurmz_admin_session'
export const PORTAL_SESSION_COOKIE = 'vurmz_portal_session'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

export interface PortalCustomer {
  id: string
  email: string
  name: string
  phone: string
  company: string | null
}

export interface SessionData {
  user?: AdminUser
  customer?: PortalCustomer
  isAuthenticated: boolean
}

// Client-side hook will call /api/auth/session to get this data
// Server-side can parse cookies directly
