'use client'

// App-wide error boundary. Catches render/data errors below the root layout and
// shows a friendly, on-brand page with a way to retry or get home, instead of
// the framework default. Reported to Sentry via the existing reportError path.
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Best-effort client log; server-side reportError already captures the throw.
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--ink)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.3em] uppercase mb-4">Something broke</p>
        <h1 className="text-2xl font-bold mb-3">That page hit a snag</h1>
        <p className="text-[var(--ink-soft)] mb-8">
          Sorry about that. Try again, or head back home. If it keeps happening, text me and I&apos;ll sort it out.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-lg hover:bg-vurmz-cta-hover transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-[var(--hairline)] text-[var(--ink)] font-semibold text-sm rounded-lg hover:bg-[var(--ink)]/5 transition-colors"
          >
            Back to VURMZ
          </Link>
        </div>
      </div>
    </div>
  )
}
