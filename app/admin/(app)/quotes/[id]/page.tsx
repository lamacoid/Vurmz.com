'use client'
export const runtime = 'edge'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Item { id: string; description: string; qty: number; unitPriceCents: number; totalCents: number }
interface Quote { id: string; number: string; status: string; email: string; totalCents: number; notes: string; expiresAt: string | null; acceptedAt: string | null; convertedOrderId: string | null; createdAt: string }

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

const STATUS_LABEL: Record<string, string> = {
  new: 'New', drafting: 'Drafting', sent: 'Sent', accepted: 'Accepted',
  declined: 'Declined', expired: 'Expired', converted: 'Converted',
}
function nextStep(status: string): string {
  if (status === 'new' || status === 'drafting') return 'Finish the quote and send it to the customer.'
  if (status === 'sent') return 'Sent. Waiting on the customer to accept.'
  if (status === 'accepted') return 'Accepted. Convert it to an invoice to get paid.'
  if (status === 'expired') return 'Expired. Re-send it if it still applies.'
  if (status === 'declined') return 'Declined.'
  return 'Converted to an invoice.'
}

export default function QuoteDetail() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!params?.id) return
    const res = await fetch(`/api/admin/quotes/${params.id}`)
    const json = (await res.json()) as { data?: { quote: Quote; items: Item[] } }
    if (json.data) { setQuote(json.data.quote); setItems(json.data.items) }
    setLoading(false)
  }, [params?.id])

  useEffect(() => { load() }, [load])

  async function send() {
    if (!quote) return
    setWorking('send')
    await fetch(`/api/admin/quotes/${quote.id}/send`, { method: 'POST' })
    setWorking(null)
    load()
  }

  async function convert() {
    if (!quote) return
    if (!confirm('Convert this quote into a draft invoice?')) return
    setWorking('convert')
    const res = await fetch(`/api/admin/quotes/${quote.id}/convert`, { method: 'POST' })
    const json = (await res.json()) as { ok?: boolean; data?: { invoiceId: string } }
    setWorking(null)
    if (json.ok && json.data?.invoiceId) {
      router.push(`/admin/invoices/${json.data.invoiceId}`)
    }
  }

  async function setStatus(status: string) {
    if (!quote) return
    await fetch(`/api/admin/quotes/${quote.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
  }

  if (loading) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>
  if (!quote) return <div className="p-8 text-[var(--a-ink-soft)] text-sm">Quote not found.</div>

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <Link href="/admin/quotes" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)]">← Quotes</Link>
      <div className="flex items-start justify-between mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)] font-mono">{quote.number}</h1>
          <p className="text-sm text-[var(--a-ink-soft)] mt-1">{quote.email} · {new Date(quote.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          {quote.status === 'new' || quote.status === 'drafting' ? (
            <button onClick={send} disabled={working === 'send'} className="px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] text-white text-sm font-semibold rounded-md">
              {working === 'send' ? 'Sending…' : 'Send quote'}
            </button>
          ) : null}
          {quote.status !== 'converted' ? (
            <button onClick={convert} disabled={working === 'convert'} className="px-4 h-9 bg-[var(--a-accent)] hover:opacity-90 text-[var(--a-bg)] text-sm font-semibold rounded-md">
              {working === 'convert' ? 'Converting…' : '→ Invoice'}
            </button>
          ) : (
            quote.convertedOrderId && (
              <Link href={`/admin/invoices/${quote.convertedOrderId}`} className="px-4 h-9 inline-flex items-center bg-white/5 text-[var(--a-accent)] text-sm font-semibold rounded-md">View invoice</Link>
            )
          )}
          <select value={quote.status} onChange={e => setStatus(e.target.value)} className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2 text-xs text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]">
            {['new','drafting','sent','accepted','declined','expired','converted'].map(s => <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-5 bg-white/[0.04] border-l-2 border-[var(--a-accent)] rounded-lg px-4 py-3">
        <p className="text-sm text-[var(--a-ink)]"><span className="font-semibold">Next step:</span> {nextStep(quote.status)}</p>
      </div>

      <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5 mb-5">
        <div className="divide-y divide-[var(--a-line)]">
          {items.map(it => (
            <div key={it.id} className="py-2 flex justify-between">
              <div>
                <p className="text-sm text-[var(--a-ink)]">{it.description}</p>
                <p className="text-[11px] text-[var(--a-ink-faint)]">{it.qty} × {money(it.unitPriceCents)}</p>
              </div>
              <p className="text-sm font-semibold text-[var(--a-ink)]">{money(it.totalCents)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--a-line)] mt-3 pt-3 flex justify-between text-base font-bold text-[var(--a-ink)]">
          <span>Total</span><span>{money(quote.totalCents)}</span>
        </div>
      </div>

      {quote.notes && (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1">Notes</p>
          <p className="text-sm text-[var(--a-ink)] whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}
    </div>
  )
}
