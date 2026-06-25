'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/admin/icons'

interface InventoryItem {
  id: string
  productId: string | null
  productName: string
  qtyOnHand: number
  lowThreshold: number
  isLow: boolean
  updatedAt: string
}

interface Product { id: string; name: string; isPublished: boolean }

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [invR, prodR] = await Promise.all([
      fetch('/api/admin/inventory').then(r => r.json()),
      fetch('/api/admin/products').then(r => r.json()),
    ])
    const invP = invR as { data?: { items: InventoryItem[] } }
    const prodP = prodR as { data?: { products: Product[] } }
    setItems(invP.data?.items ?? [])
    setProducts(prodP.data?.products ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function adjust(productId: string, qtyChange: number, reason?: string) {
    await fetch('/api/admin/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qtyChange, reason }),
    })
    load()
  }

  async function setThreshold(id: string, lowThreshold: number) {
    await fetch('/api/admin/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, lowThreshold }),
    })
    load()
  }

  const lowCount = items.filter(i => i.isLow).length

  // Products without inventory row yet
  const trackedIds = new Set(items.map(i => i.productId))
  const untracked = products.filter(p => !trackedIds.has(p.id))

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Inventory</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">Pack-level stock. Adjust on receive or restock.</p>
        </div>
        {lowCount > 0 && (
          <span className="text-xs bg-red-900/30 text-red-300 px-3 py-1.5 rounded-full font-semibold">
            {lowCount} low
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-[var(--a-ink-faint)] text-sm">Loading…</div>
      ) : items.length === 0 && untracked.length === 0 ? (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-10 text-center text-[var(--a-ink-soft)] text-sm">
          No products yet. <Link href="/admin/products/new" className="text-[var(--a-accent)] hover:underline">Add a product →</Link>
        </div>
      ) : (
        <>
          <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl overflow-hidden divide-y divide-[var(--a-line)]">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--a-ink)] truncate">{item.productName}</p>
                  {item.isLow && <p className="text-[10px] text-red-300 uppercase font-semibold tracking-wider">Below threshold</p>}
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${item.isLow ? 'text-red-300' : 'text-[var(--a-ink)]'}`}>{item.qtyOnHand}</p>
                  <p className="text-[10px] text-[var(--a-ink-faint)]">on hand</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => item.productId && adjust(item.productId, -1, 'decrement')}
                    disabled={item.qtyOnHand <= 0}
                    className="w-7 h-7 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded text-[var(--a-ink)]"
                  >−</button>
                  <button
                    onClick={() => item.productId && adjust(item.productId, 1, 'increment')}
                    className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded text-[var(--a-ink)]"
                  >+</button>
                  <button
                    onClick={() => {
                      const n = prompt('Add how many?')
                      if (n && Number.isFinite(parseInt(n, 10)) && item.productId) adjust(item.productId, parseInt(n, 10), 'bulk adjust')
                    }}
                    className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded text-[var(--a-ink-soft)] text-xs"
                    title="Adjust by amount"
                  >#</button>
                </div>
                <input
                  type="number"
                  min={0}
                  defaultValue={item.lowThreshold}
                  onBlur={e => {
                    const v = parseInt(e.target.value, 10)
                    if (Number.isFinite(v) && v !== item.lowThreshold) setThreshold(item.id, v)
                  }}
                  className="w-16 bg-[var(--a-bg)] border border-[var(--a-line)] rounded px-2 py-1 text-xs text-[var(--a-ink)] text-center outline-none focus:border-[var(--a-accent)]"
                  title="Low-stock threshold"
                />
              </div>
            ))}
          </div>

          {untracked.length > 0 && (
            <div className="mt-6 bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-2 font-semibold">Not tracked yet</p>
              <p className="text-xs text-[var(--a-ink-faint)] mb-3">Click a product to start tracking its stock.</p>
              <div className="flex flex-wrap gap-2">
                {untracked.map(p => (
                  <button
                    key={p.id}
                    onClick={() => adjust(p.id, 0, 'initialize')}
                    className="text-xs bg-[var(--a-bg)] hover:bg-[#143E38]/80 border border-[var(--a-line)] hover:border-[var(--a-accent)]/40 rounded-full px-3 py-1 text-[var(--a-ink)]"
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
