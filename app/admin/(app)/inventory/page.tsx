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
          <h1 className="text-2xl font-bold text-cream">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Pack-level stock. Adjust on receive or restock.</p>
        </div>
        {lowCount > 0 && (
          <span className="text-xs bg-red-900/30 text-red-300 px-3 py-1.5 rounded-full font-semibold">
            {lowCount} low
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : items.length === 0 && untracked.length === 0 ? (
        <div className="bg-[#243B39] border border-white/5 rounded-xl p-10 text-center text-gray-400 text-sm">
          No products yet. <Link href="/admin/products/new" className="text-[#6BB8B2] hover:underline">Add a product →</Link>
        </div>
      ) : (
        <>
          <div className="bg-[#243B39] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cream truncate">{item.productName}</p>
                  {item.isLow && <p className="text-[10px] text-red-300 uppercase font-semibold tracking-wider">Below threshold</p>}
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${item.isLow ? 'text-red-300' : 'text-cream'}`}>{item.qtyOnHand}</p>
                  <p className="text-[10px] text-gray-500">on hand</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => item.productId && adjust(item.productId, -1, 'decrement')}
                    disabled={item.qtyOnHand <= 0}
                    className="w-7 h-7 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded text-cream"
                  >−</button>
                  <button
                    onClick={() => item.productId && adjust(item.productId, 1, 'increment')}
                    className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded text-cream"
                  >+</button>
                  <button
                    onClick={() => {
                      const n = prompt('Add how many?')
                      if (n && Number.isFinite(parseInt(n, 10)) && item.productId) adjust(item.productId, parseInt(n, 10), 'bulk adjust')
                    }}
                    className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded text-gray-400 text-xs"
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
                  className="w-16 bg-[#1a2f2e] border border-white/5 rounded px-2 py-1 text-xs text-cream text-center outline-none focus:border-[#6BB8B2]"
                  title="Low-stock threshold"
                />
              </div>
            ))}
          </div>

          {untracked.length > 0 && (
            <div className="mt-6 bg-[#243B39] border border-white/5 rounded-xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">Not tracked yet</p>
              <p className="text-xs text-gray-500 mb-3">Click a product to start tracking its stock.</p>
              <div className="flex flex-wrap gap-2">
                {untracked.map(p => (
                  <button
                    key={p.id}
                    onClick={() => adjust(p.id, 0, 'initialize')}
                    className="text-xs bg-[#1a2f2e] hover:bg-[#1a2f2e]/80 border border-white/5 hover:border-[#6BB8B2]/40 rounded-full px-3 py-1 text-cream"
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
