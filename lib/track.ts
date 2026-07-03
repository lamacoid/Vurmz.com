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

/**
 * Conversion funnel events (add_to_cart -> begin_checkout -> purchase).
 * These land in the MAIN database's `events` table (migration 0016) via
 * the same /api/track beacon, so the funnel can be joined against orders.
 * Distinct from trackEvent above, which rides the pageview pipeline.
 */
export function trackConversion(event: 'add_to_cart' | 'begin_checkout' | 'purchase', valueCents?: number) {
  if (typeof window === 'undefined') return
  if (document.cookie.includes('vurmz_owner=1')) return
  try {
    const payload = JSON.stringify({ event, valueCents, path: window.location.pathname })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track/', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/track/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {})
    }
  } catch {
    // Silent fail — tracking should never break the UI
  }
}
