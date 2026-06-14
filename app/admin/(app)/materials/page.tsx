'use client'
import { useCallback, useEffect, useState } from 'react'
import { Icon } from '@/components/admin/icons'

interface Material {
  id: string; name: string; sku: string | null; category: string
  qtyOnHand: number; unit: string; costCents: number; supplier: string | null; notes: string
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/materials')
    const json = (await res.json()) as { data?: { materials: Material[] } }
    setMaterials(json.data?.materials ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create() {
    const name = prompt('Material name:')
    if (!name) return
    await fetch('/api/admin/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    load()
  }

  async function patch(id: string, patch: Partial<Material>) {
    await fetch(`/api/admin/materials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this material?')) return
    await fetch(`/api/admin/materials/${id}`, { method: 'DELETE' })
    load()
  }

  // Group by category
  const byCategory: Record<string, Material[]> = {}
  for (const m of materials) {
    const cat = m.category || 'Uncategorized'
    byCategory[cat] = byCategory[cat] || []
    byCategory[cat].push(m)
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream">Materials</h1>
          <p className="text-sm text-gray-500 mt-1">Laser substrate stock, suppliers, and costs.</p>
        </div>
        <button
          onClick={create}
          className="inline-flex items-center gap-2 px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] text-white text-sm font-semibold rounded-md"
        >
          <Icon name="plus" className="w-4 h-4" />
          New material
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : materials.length === 0 ? (
        <div className="bg-[#1A4F48] border border-white/5 rounded-xl p-10 text-center">
          <Icon name="layers" className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-cream text-sm font-semibold mb-1">No materials yet</p>
          <p className="text-gray-500 text-xs">Track stock of substrates you engrave on.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(byCategory).map(([cat, list]) => (
            <div key={cat} className="bg-[#1A4F48] border border-white/5 rounded-xl overflow-hidden">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold px-4 py-2 border-b border-white/5">{cat}</p>
              <div className="divide-y divide-white/5">
                {list.map(m => (
                  <Row key={m.id} material={m} onPatch={patch.bind(null, m.id)} onRemove={() => remove(m.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ material, onPatch, onRemove }: { material: Material; onPatch: (p: Partial<Material>) => void; onRemove: () => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <input
            defaultValue={material.name}
            onBlur={e => e.target.value !== material.name && onPatch({ name: e.target.value })}
            className="bg-transparent text-sm text-cream outline-none w-full font-medium"
          />
          {material.sku && <p className="text-[10px] text-gray-500 font-mono">{material.sku}</p>}
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            defaultValue={material.qtyOnHand}
            onBlur={e => {
              const v = parseInt(e.target.value, 10)
              if (Number.isFinite(v) && v !== material.qtyOnHand) onPatch({ qtyOnHand: v })
            }}
            className="w-16 bg-[#143E38] border border-white/5 rounded px-2 py-1 text-xs text-cream text-center outline-none focus:border-[#2FE6C4]"
          />
          <span className="text-[10px] text-gray-500">{material.unit}</span>
        </div>
        <p className="text-sm text-cream min-w-[60px] text-right">{money(material.costCents)}</p>
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-[#2FE6C4] hover:underline">{expanded ? 'Hide' : 'Details'}</button>
        <button onClick={onRemove} className="text-xs text-red-300 hover:text-red-200">×</button>
      </div>
      {expanded && (
        <div className="px-4 pb-3 space-y-2 bg-[#143E38]/50">
          <div className="grid grid-cols-3 gap-2">
            <TinyField label="SKU" value={material.sku ?? ''} onSave={v => onPatch({ sku: v || null })} />
            <TinyField label="Category" value={material.category} onSave={v => onPatch({ category: v })} />
            <TinyField label="Unit" value={material.unit} onSave={v => onPatch({ unit: v })} />
            <TinyField label="Supplier" value={material.supplier ?? ''} onSave={v => onPatch({ supplier: v || null })} />
            <TinyField label="Cost (cents)" value={String(material.costCents)} onSave={v => onPatch({ costCents: parseInt(v, 10) || 0 })} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Notes</label>
            <textarea
              defaultValue={material.notes}
              onBlur={e => e.target.value !== material.notes && onPatch({ notes: e.target.value })}
              rows={2}
              className="w-full bg-[#143E38] border border-white/5 rounded px-2 py-1.5 text-xs text-cream outline-none focus:border-[#2FE6C4]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function TinyField({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">{label}</span>
      <input
        defaultValue={value}
        onBlur={e => e.target.value !== value && onSave(e.target.value)}
        className="w-full bg-[#1A4F48] border border-white/5 rounded px-2 py-1 text-xs text-cream outline-none focus:border-[#2FE6C4]"
      />
    </label>
  )
}
