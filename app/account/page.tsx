'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MeData { id: string; name: string; email: string }
type Me = MeData | null

export default function AccountDashboard() {
  const [me, setMe] = useState<Me>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/account/me')
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        const parsed = j as { ok?: boolean; data?: { customer: MeData } } | null
        if (parsed?.ok && parsed.data?.customer) setMe(parsed.data.customer)
        else router.push('/account/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <div className="p-10 text-center text-gray-500 text-sm">Loading…</div>
  if (!me) return null

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-cream mb-2">Hi {me.name || me.email.split('@')[0]}.</h1>
      <p className="text-sm text-gray-400 mb-8">Your VURMZ account — invoices, messages, files, and orders.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card href="/account/invoices" title="Invoices" sub="Pay open invoices, view receipts" soon />
        <Card href="/account/orders" title="Orders" sub="Track your orders and service jobs" soon />
        <Card href="/account/messages" title="Messages" sub="Your conversation with Zach" soon />
        <Card href="/account/files" title="Files" sub="Designs, artwork, and references" soon />
        <Card href="/account/profile" title="Profile" sub="Contact info, saved payment methods" soon />
      </div>

      <button
        onClick={async () => {
          await fetch('/api/account/logout', { method: 'POST' })
          router.push('/account/login')
        }}
        className="mt-10 text-xs text-gray-500 hover:text-gray-300"
      >
        Sign out
      </button>
    </div>
  )
}

function Card({ href, title, sub, soon }: { href: string; title: string; sub: string; soon?: boolean }) {
  return (
    <Link href={href} className="bg-[#243B39] border border-white/5 hover:border-[#6BB8B2]/30 rounded-xl p-5 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <p className="text-base font-semibold text-cream">{title}</p>
        {soon && <span className="text-[9px] font-mono uppercase text-gray-500">soon</span>}
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">{sub}</p>
    </Link>
  )
}
