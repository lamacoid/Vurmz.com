'use client'
export const runtime = 'edge'
/**
 * The Designs room: every design anyone made in the designer, ordered or
 * not, newest first. The unordered ones are people who got as far as
 * putting their name on a card and stopped: one tap to text them.
 */
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import CardThumb, { designLabel } from '@/components/designer/CardThumb'
import type { CardDesign } from '@/lib/designer/card'

interface Row {
  id: string
  productName: string | null
  productSlug: string | null
  design: CardDesign
  orderId: string | null
  orderNumber: string | null
  email: string | null
  customerId: string | null
  customerName: string | null
  customerPhone: string | null
  customerEmail: string | null
  updatedAt: string
}

function smsHref(phone: string, body: string) {
  return `sms:${phone.replace(/[^\d+]/g, '')}?body=${encodeURIComponent(body)}`
}

export default function DesignsRoom() {
  const [rows, setRows] = useState<Row[]>([])
  const [filter, setFilter] = useState<'all' | 'no' | 'yes'>('all')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const j = (await fetch(`/api/admin/designs?ordered=${filter}`).then(r => r.json())) as { data?: { designs: Row[] } }
    setRows(j.data?.designs ?? [])
    setLoading(false)
  }, [filter])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-[var(--a-ink)]">Designs</h1>
          <p className="text-sm text-[var(--a-ink-soft)]">Everything anyone made in the designer. Unordered ones are worth a text.</p>
        </div>
        <div className="flex gap-1">
          {([['all', 'All'], ['no', 'Not ordered'], ['yes', 'Ordered']] as const).map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`text-xs px-3 py-1.5 rounded-full border ${filter === k ? 'border-[var(--a-accent)] bg-[var(--a-accent)]/15 text-[var(--a-accent)]' : 'border-[var(--a-line)] text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]'}`}>{label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--a-ink-soft)]">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-[var(--a-ink-soft)]">Nothing here yet. Designs land the moment someone types on a card.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map(r => {
            const who = r.customerName || r.customerEmail || r.email || 'Guest'
            const name = r.design.values?.name?.trim()
            return (
              <div key={r.id} className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
                <CardThumb design={r.design} id={`adm-${r.id}`} />
                <div className="mt-3 text-sm">
                  <p className="text-[var(--a-ink)] font-medium truncate">{name ? `${name} · ` : ''}{who}</p>
                  <p className="text-[var(--a-ink-soft)]">{r.productName ?? 'Card'} · {designLabel(r.design)}</p>
                  <p className="text-xs text-[var(--a-ink-faint)] mt-0.5">{new Date(r.updatedAt).toLocaleString()}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.orderId ? (
                    <Link href={`/admin/orders/${r.orderId}`} className="text-xs px-3 py-1.5 rounded-md border border-[var(--a-accent)] text-[var(--a-accent)] hover:bg-[var(--a-accent)]/10">Order {r.orderNumber ?? ''}</Link>
                  ) : (
                    <span className="text-xs px-3 py-1.5 rounded-md border border-amber-400/60 text-amber-300">Not ordered</span>
                  )}
                  {r.customerPhone && (
                    <a href={smsHref(r.customerPhone, `Hi${r.customerName ? ` ${r.customerName.split(' ')[0]}` : ''}, Zach at VURMZ. I saw the card you designed. Want me to run it?`)} className="text-xs px-3 py-1.5 rounded-md border border-[var(--a-line)] text-[var(--a-ink)] hover:border-[var(--a-accent)]">Text them</a>
                  )}
                  {!r.customerPhone && (r.customerEmail || r.email) && (
                    <a href={`mailto:${r.customerEmail || r.email}?subject=${encodeURIComponent('The card you designed')}`} className="text-xs px-3 py-1.5 rounded-md border border-[var(--a-line)] text-[var(--a-ink)] hover:border-[var(--a-accent)]">Email them</a>
                  )}
                  {r.customerId && <Link href={`/admin/customers/${r.customerId}`} className="text-xs px-3 py-1.5 rounded-md text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]">Customer</Link>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
