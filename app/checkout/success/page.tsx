'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function Inner() {
  const params = useSearchParams()
  const number = params?.get('n') ?? ''
  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D96C5C]/10 text-[#D96C5C] mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-[#16525C] mb-2">Order placed</h1>
      {number && <p className="text-sm text-[#6B6259] mb-2">Order <span className="font-mono text-[#16525C]">{number}</span></p>}
      <p className="text-[#6B6259] mb-8 max-w-md mx-auto">
        You&rsquo;ll get a confirmation email in a minute. I&rsquo;ll reach out personally with next steps.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/shop" className="px-5 h-11 inline-flex items-center bg-white/60 border border-[#16525C]/12 text-[#16525C] text-sm font-semibold rounded-sm">
          Keep shopping
        </Link>
        <Link href="/account" className="px-5 h-11 inline-flex items-center bg-[#D96C5C] hover:bg-[#C25A4B] text-white text-sm font-semibold rounded-sm">
          View account
        </Link>
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense fallback={<div className="p-12 text-center text-sm">Loading…</div>}><Inner /></Suspense>
}
