'use client'
import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { trackConversion } from '@/lib/track'

function Inner() {
  const params = useSearchParams()
  const number = params?.get('n') ?? ''

  // Funnel: purchase, valued from the total stashed at order creation.
  // Clearing the stash keeps a refresh from double-counting.
  useEffect(() => {
    try {
      const stash = sessionStorage.getItem('vurmz_order_total')
      if (stash !== null) {
        sessionStorage.removeItem('vurmz_order_total')
        trackConversion('purchase', parseInt(stash, 10) || undefined)
      }
    } catch {}
  }, [])
  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C67A6F]/10 text-[#C67A6F] mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Order placed</h1>
      {number && <p className="text-sm text-[#6B6259] mb-2">Order <span className="font-mono text-[var(--ink)]">{number}</span></p>}
      <p className="text-[#6B6259] mb-8 max-w-md mx-auto">
        You&rsquo;ll get a confirmation email in a minute. I&rsquo;ll reach out personally with next steps.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/shop" className="px-5 h-11 inline-flex items-center bg-white/60 border border-[#16525C]/12 text-[var(--ink)] text-sm font-semibold rounded-sm">
          Keep shopping
        </Link>
        <Link href="/account" className="px-5 h-11 inline-flex items-center bg-[#C67A6F] hover:bg-[#B0675D] text-white text-sm font-semibold rounded-sm">
          View account
        </Link>
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense fallback={<div className="p-12 text-center text-sm">Loading…</div>}><Inner /></Suspense>
}
