import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, decodeSession } from '@/lib/auth-helpers'

/**
 * Next.js middleware for route protection.
 *
 * Protected routes require a valid admin session cookie.
 * Public routes are allowed through without auth.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // --- Public exceptions (no auth required) ---

  // Quote submissions from the public order form
  if (method === 'POST' && pathname === '/api/quotes') {
    return NextResponse.next()
  }

  // Contact form submissions
  if (method === 'POST' && pathname === '/api/messages') {
    return NextResponse.next()
  }

  // Square webhook callbacks
  if (pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next()
  }

  // Auth routes (login, verify, session check, logout)
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/admin/auth/')) {
    return NextResponse.next()
  }

  // Portal auth routes
  if (pathname.startsWith('/api/portal/auth/')) {
    return NextResponse.next()
  }

  // Public product/portfolio data
  if (pathname.startsWith('/api/public/')) {
    return NextResponse.next()
  }

  // View quote by token (customer-facing)
  if (pathname.startsWith('/api/view-quote/')) {
    return NextResponse.next()
  }

  // --- Protected routes: require admin session ---

  const sessionCookie = request.cookies.get(SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const session = decodeSession(sessionCookie.value)

  if (!session) {
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }

  // Admin routes require admin user type
  if (pathname.startsWith('/api/admin/') && session.userType !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protect all API routes (exceptions handled above)
    '/api/admin/:path*',
    '/api/customers/:path*',
    '/api/orders/:path*',
    '/api/quotes/:path*',
    '/api/messages/:path*',
    '/api/materials/:path*',
    '/api/files/:path*',
    '/api/webhooks/:path*',
  ]
}
