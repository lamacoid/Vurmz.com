'use client'
/**
 * Inventory (renovated 2026-07-16): the form Zach asked for. One row per
 * product + color/finish, counted. The shop reads this: a product's finish
 * chips are exactly the finish rows with stock, so the site can never offer
 * a color that is not really on the shelf. Rows without a finish track
 * whole-product stock, same as before.
 */
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

interface InventoryItem {
  id: string
  productId: string | null
  finish: string | null
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
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState('')

  // The add form
  const [addProductId, setAddProductId] = useState('')
  const [addFinish, setAddFinish] = useState('')
  const [addQty, setAddQty] = useState('')

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

  async function adjust(productId: string, qtyChange: number, finish: string | null, reason?: string) {
    await fetch('/api/admin/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, qtyChange, finish: finish ?? undefined, reason }),
    })
    load()
  }

  async function addStock() {
    const qty = parseInt(addQty, 10)
    if (!addProductId) { setNote('Pick a product first.'); return }
    if (!Number.isFinite(qty) || qty < 0) { setNote('Enter how many you have.'); return }
    setSaving(true)
    setNote('')
    await adjust(addProductId, qty, addFinish.trim() || null, 'stock entry')
    setAddFinish('')
    setAddQty('')
    setSaving(false)
    setNote('Saved.')
    setTimeout(() => setNote(''), 2000)
  }

  async function setThreshold(id: string, lowThreshold: number) {
    await fetch('/api/admin/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, lowThreshold }),
    })
    load()
  }

  async function removeRow(item: InventoryItem) {
    if (!confirm(`Remove ${item.productName}${item.finish ? ` (${item.finish})` : ''} from inventory?`)) return
    await fetch('/api/admin/inventory', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    })
    load()
  }

  const lowCount = items.filter(i => i.isLow).length

  // Group rows under their product so pens with four colors read as one block.
  const groups = new Map<string, InventoryItem[]>()
  for (const it of items) {
    const key = it.productName
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(it)
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Inventory</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">What you actually have, by color. The shop only offers colors listed here.</p>
        </div>
        {lowCount > 0 && (
          <span className="text-xs bg-red-900/30 text-red-300 px-3 py-1.5 rounded-full font-semibold">
            {lowCount} low
          </span>
        )}
      </div>

      {/* Add stock: the form. Three questions, one button. */}
      <div className="mb-6 bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3 font-semibold">Add stock</p>
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1.5fr_1fr_auto] gap-2">
          <select
            value={addProductId}
            onChange={e => setAddProductId(e.target.value)}
            className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2.5 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
          >
            <option value="">What is it?</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input
            type="text"
            value={addFinish}
            maxLength={60}
            onChange={e => setAddFinish(e.target.value)}
            placeholder="Color / finish (optional)"
            className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2.5 text-sm text-[var(--a-ink)] placeholder:text-[var(--a-ink-faint)] outline-none focus:border-[var(--a-accent)]"
          />
          <input
            type="number"
            min={0}
            value={addQty}
            onChange={e => setAddQty(e.target.value)}
            placeholder="How many"
            className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2.5 text-sm text-[var(--a-ink)] placeholder:text-[var(--a-ink-faint)] outline-none focus:border-[var(--a-accent)]"
          />
          <button
            onClick={addStock}
            disabled={saving}
            className="px-4 py-2.5 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
          >
            {saving ? 'Saving…' : 'Add'}
          </button>
        </div>
        <p className="text-[11px] text-[var(--a-ink-faint)] mt-2">
          Adding to a product and color you already track adds to its count. Leave color blank to count the product as a whole.
        </p>
        {note && <p className="text-xs text-[var(--a-accent)] mt-1">{note}</p>}
      </div>

      {loading ? (
        <div className="text-[var(--a-ink-faint)] text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-10 text-center text-[var(--a-ink-soft)] text-sm">
          Nothing counted yet. Add your first item above.
          {products.length === 0 && <> No products exist either; <Link href="/admin/products/new" className="text-[var(--a-accent)] hover:underline">add a product →</Link></>}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(groups.entries()).map(([productName, rows]) => (
            <div key={productName} className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl overflow-hidden">
              <p className="px-4 pt-3 pb-1 text-sm font-semibold text-[var(--a-ink)]">{productName}</p>
              <div className="divide-y divide-[var(--a-line)]">
                {rows.map(item => (
                  <div key={item.id} className="flex items-center gap-2 sm:gap-3 px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--a-ink-soft)] truncate">{item.finish ?? 'All colors / unspecified'}</p>
                      {item.isLow && <p className="text-[10px] text-red-300 uppercase font-semibold tracking-wider">Low</p>}
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${item.isLow ? 'text-red-300' : 'text-[var(--a-ink)]'}`}>{item.qtyOnHand}</p>
                      <p className="text-[10px] text-[var(--a-ink-faint)]">on hand</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => item.productId && adjust(item.productId, -1, item.finish, 'decrement')}
                        disabled={item.qtyOnHand <= 0}
                        className="w-8 h-8 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded text-[var(--a-ink)]"
                        aria-label="One fewer"
                      >−</button>
                      <button
                        onClick={() => item.productId && adjust(item.productId, 1, item.finish, 'increment')}
                        className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded text-[var(--a-ink)]"
                        aria-label="One more"
                      >+</button>
                      <button
                        onClick={() => {
                          const n = prompt('Add how many? (negative to remove)')
                          if (n && Number.isFinite(parseInt(n, 10)) && item.productId) adjust(item.productId, parseInt(n, 10), item.finish, 'bulk adjust')
                        }}
                        className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded text-[var(--a-ink-soft)] text-xs"
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
                      className="w-14 bg-[var(--a-bg)] border border-[var(--a-line)] rounded px-2 py-1 text-xs text-[var(--a-ink)] text-center outline-none focus:border-[var(--a-accent)]"
                      title="Warn me when it drops to this"
                    />
                    <button
                      onClick={() => removeRow(item)}
                      className="w-7 h-7 rounded text-[var(--a-ink-faint)] hover:text-red-300 text-sm"
                      title="Remove this row"
                      aria-label="Remove this row"
                    >×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
