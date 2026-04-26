/**
 * Lightweight event tracking via the existing /api/track beacon.
 * Fires a navigator.sendBeacon with event data.
 * No-ops if the owner cookie is set or if called on the server.
 */
export function trackEvent(action: string, label?: string) {
  if (typeof window === 'undefined') return
  if (document.cookie.includes('vurmz_owner=1')) return

  try {
    // Encode events as special paths so they flow through existing pageview tracking
    // They'll appear in analytics as "event:sms_click" etc.
    const payload = JSON.stringify({
      path: `event:${action}${label ? `:${label}` : ''}`,
      referrer: window.location.pathname,
    })
    navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }))
  } catch {
    // Silent fail — tracking should never break the UI
  }
}
