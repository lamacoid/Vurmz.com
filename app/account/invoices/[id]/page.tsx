'use client'
export const runtime = 'edge'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import SquarePayment from '@/components/shop/SquarePayment'

interface InvoiceItem { id: string; description: string; qty: number; unitPriceCents: number; totalCents: number }
interface Invoice {
  id: string; number: string; status: string; subtotalCents: number; taxCents: number;
  totalCents: number; amountPaidCents: number; dueDate: string | null; notes: string; createdAt: string
}
interface SquareConfig { applicationId: string; locationId: string; environment: 'sandbox' | 'production' }

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [squareConfig, setSquareConfig] = useState<SquareConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!params?.id) return
    const [invJ, cfgJ] = await Promise.all([
      fetch(`/api/account/invoices/${params.id}`).then(r => r.json()),
      fetch('/api/checkout/config').then(r => r.json()),
    ])
    const invP = invJ as { data?: { invoice: Invoice; items: InvoiceItem[] } }
    const cfgP = cfgJ as { data?: { square: SquareConfig | null } }
    if (invP.data) { setInvoice(invP.data.invoice); setItems(invP.data.items) }
    setSquareConfig(cfgP.data?.square ?? null)
    setLoading(false)
  }, [params?.id])

  useEffect(() => { load() }, [load])

  function idempotencyKey() {
    const r = crypto.getRandomValues(new Uint8Array(16))
    r[6] = (r[6] & 0x0f) | 0x40
    r[8] = (r[8] & 0x3f) | 0x80
    const h = Array.from(r).map(b => b.toString(16).padStart(2, '0')).join('')
    return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`
  }

  async function pay(sourceId: string) {
    if (!invoice) return
    const res = await fetch(`/api/account/invoices/${invoice.id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId, idempotencyKey: idempotencyKey() }),
    })
    const json = (await res.json()) as { ok?: boolean; data?: { receiptUrl: string | null }; error?: { code?: string; message?: string } }
    if (!res.ok || !json.ok) {
      setError(json.error?.message ?? json.error?.code ?? 'Payment failed')
      return
    }
    router.refresh()
    load()
  }

  if (loading) return <div className="p-10 text-center text-gray-500 text-sm">Loading…</div>
  if (!invoice) return <div className="p-10 text-center text-gray-500 text-sm">Invoice not found.</div>

  const owed = invoice.totalCents - invoice.amountPaidCents
  const isPayable = owed > 0 && !['paid', 'void', 'refunded'].includes(invoice.status)

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link href="/account/invoices" className="text-xs text-gray-500 hover:text-cream mb-4 inline-block">← All invoices</Link>

      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-2xl font-bold text-cream font-mono">{invoice.number}</h1>
        <span className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold ${invoice.status === 'paid' ? 'bg-green-900/30 text-green-300' : 'bg-[#2FE6C4]/20 text-[#2FE6C4]'}`}>
          {invoice.status.replace('_', ' ')}
        </span>
      </div>

      <div className="bg-[#1A4F48] border border-white/5 rounded-xl p-5 mb-5">
        <div className="divide-y divide-white/5">
          {items.map(it => (
            <div key={it.id} className="py-2.5 flex justify-between">
              <div>
                <p className="text-sm text-cream">{it.description}</p>
                <p className="text-[11px] text-gray-500">{it.qty} × {money(it.unitPriceCents)}</p>
              </div>
              <p className="text-sm font-semibold text-cream">{money(it.totalCents)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 mt-4 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-cream">{money(invoice.subtotalCents)}</span></div>
          {invoice.taxCents > 0 && <div className="flex justify-between"><span className="text-gray-400">Tax</span><span className="text-cream">{money(invoice.taxCents)}</span></div>}
          <div className="flex justify-between font-bold text-base pt-1 text-cream"><span>Total</span><span>{money(invoice.totalCents)}</span></div>
          {invoice.amountPaidCents > 0 && invoice.amountPaidCents < invoice.totalCents && (
            <div className="flex justify-between text-[#2FE6C4]"><span>Paid</span><span>−{money(invoice.amountPaidCents)}</span></div>
          )}
          {owed > 0 && (
            <div className="flex justify-between font-bold text-base pt-1 text-[#C46B4D]"><span>Amount due</span><span>{money(owed)}</span></div>
          )}
        </div>
      </div>

      {invoice.notes && (
        <div className="bg-[#1A4F48] border border-white/5 rounded-xl p-4 mb-5">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Notes</p>
          <p className="text-sm text-cream whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {isPayable && (
        <div className="bg-[#1A4F48] border border-white/5 rounded-xl p-5">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-3">Pay now</p>
          {squareConfig ? (
            <SquarePayment
              config={squareConfig}
              amountCents={owed}
              onToken={pay}
              onError={setError}
            />
          ) : (
            <p className="text-sm text-gray-400">Online payment not configured yet. Zach will send you a Square payment link.</p>
          )}
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
      )}
    </div>
  )
}
