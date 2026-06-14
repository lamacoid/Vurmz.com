'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Order { id: string; number: string; status: string; totalCents: number; fulfillmentMethod: string; createdAt: string }

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

const statusColors: Record<string, string> = {
  new:         'bg-[#7FCFD4]/20 text-[#7FCFD4]',
  confirmed:   'bg-[#7FCFD4]/20 text-[#7FCFD4]',
  in_progress: 'bg-yellow-900/30 text-yellow-300',
  ready:       'bg-yellow-900/30 text-yellow-300',
  delivered:   'bg-green-900/30 text-green-300',
  cancelled:   'bg-white/5 text-gray-500',
  refunded:    'bg-white/5 text-gray-500',
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/account/orders').then(r => r.json()).then(j => {
      const parsed = j as { data?: { orders: Order[] } }
      setOrders(parsed.data?.orders ?? [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link href="/account" className="text-xs text-gray-500 hover:text-cream mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold text-cream mb-6">Orders</h1>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-10 text-center text-gray-400 text-sm">
          No orders yet. <Link href="/shop" className="text-[#7FCFD4] hover:underline">Shop now →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map(o => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="block bg-[#16525C] border border-white/5 hover:border-[#7FCFD4]/30 rounded-xl p-4 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-mono text-cream">{o.number}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${statusColors[o.status] ?? ''}`}>
                  {o.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString()} · {o.fulfillmentMethod.replace('_', ' ')}
                </p>
                <p className="text-cream font-semibold">{money(o.totalCents)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
