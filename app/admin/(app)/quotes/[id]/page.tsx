'use client'
export const runtime = 'edge'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Item { id: string; description: string; qty: number; unitPriceCents: number; totalCents: number }
interface Quote { id: string; number: string; status: string; email: string; totalCents: number; notes: string; expiresAt: string | null; acceptedAt: string | null; convertedOrderId: string | null; createdAt: string }

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

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

  if (loading) return <div className="p-8 text-gray-500 text-sm">Loading…</div>
  if (!quote) return <div className="p-8 text-gray-400 text-sm">Quote not found.</div>

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <Link href="/admin/quotes" className="text-xs text-gray-500 hover:text-cream">← Quotes</Link>
      <div className="flex items-start justify-between mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream font-mono">{quote.number}</h1>
          <p className="text-sm text-gray-400 mt-1">{quote.email} · {new Date(quote.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          {quote.status === 'new' || quote.status === 'drafting' ? (
            <button onClick={send} disabled={working === 'send'} className="px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] text-white text-sm font-semibold rounded-md">
              {working === 'send' ? 'Sending…' : 'Send quote'}
            </button>
          ) : null}
          {quote.status !== 'converted' ? (
            <button onClick={convert} disabled={working === 'convert'} className="px-4 h-9 bg-[#7FCFD4] hover:bg-[#5aa49e] text-[#143E38] text-sm font-semibold rounded-md">
              {working === 'convert' ? 'Converting…' : '→ Invoice'}
            </button>
          ) : (
            quote.convertedOrderId && (
              <Link href={`/admin/invoices/${quote.convertedOrderId}`} className="px-4 h-9 inline-flex items-center bg-[#7FCFD4]/20 text-[#7FCFD4] text-sm font-semibold rounded-md">View invoice</Link>
            )
          )}
          <select value={quote.status} onChange={e => setStatus(e.target.value)} className="bg-[#16525C] border border-white/10 rounded-md px-3 py-2 text-xs text-cream outline-none focus:border-[#7FCFD4]">
            {['new','drafting','sent','accepted','declined','expired','converted'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-[#16525C] border border-white/5 rounded-xl p-5 mb-5">
        <div className="divide-y divide-white/5">
          {items.map(it => (
            <div key={it.id} className="py-2 flex justify-between">
              <div>
                <p className="text-sm text-cream">{it.description}</p>
                <p className="text-[11px] text-gray-500">{it.qty} × {money(it.unitPriceCents)}</p>
              </div>
              <p className="text-sm font-semibold text-cream">{money(it.totalCents)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 mt-3 pt-3 flex justify-between text-base font-bold text-cream">
          <span>Total</span><span>{money(quote.totalCents)}</span>
        </div>
      </div>

      {quote.notes && (
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Notes</p>
          <p className="text-sm text-cream whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}
    </div>
  )
}
