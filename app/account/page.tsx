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

  if (loading || !me) return <div className="p-10 text-center text-[var(--ink-soft)] text-sm">Loading…</div>

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">My Account</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8">Invoices, messages, files, orders, and profile, all in one place.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card href="/account/invoices" title="Invoices" sub="Pay open invoices, view receipts" />
        <Card href="/account/orders" title="Orders" sub="Track your orders and service jobs" />
        <Card href="/account/messages" title="Messages" sub="Your conversation with Zach" />
        <Card href="/account/files" title="Files" sub="Designs, artwork, and references" />
        <Card href="/account/profile" title="Profile" sub="Contact info, saved payment methods" />
      </div>

      <button
        onClick={async () => {
          await fetch('/api/account/logout', { method: 'POST' })
          router.push('/account/login')
        }}
        className="mt-10 text-xs text-[var(--ink-soft)] hover:text-[var(--ink-soft)]"
      >
        Sign out
      </button>
    </div>
  )
}

function Card({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <Link href={href} className="bg-[var(--page)] border border-white/5 hover:border-[#7FCFD4]/30 rounded-xl p-5 transition-colors">
      <p className="text-base font-semibold text-[var(--ink)] mb-2">{title}</p>
      <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{sub}</p>
    </Link>
  )
}
