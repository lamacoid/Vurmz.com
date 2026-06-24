'use client'
import { useCallback, useEffect, useState } from 'react'
import { Icon } from '@/components/admin/icons'

type Placement = 'header' | 'footer' | 'footer-legal' | 'mobile'

interface NavItem {
  id: string; placement: Placement; position: number; label: string; href: string
  parentId: string | null; opensNewTab: boolean; children: NavItem[]
}

const PLACEMENT_LABELS: Record<Placement, string> = {
  header: 'Header (main site)',
  footer: 'Footer',
  'footer-legal': 'Footer legal (privacy, terms)',
  mobile: 'Mobile drawer',
}

export default function NavigationEditorPage() {
  const [nav, setNav] = useState<Record<Placement, NavItem[]>>({ header: [], footer: [], 'footer-legal': [], mobile: [] })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/navigation')
    const json = (await res.json()) as { data?: Record<Placement, NavItem[]> }
    if (json.data) setNav(json.data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function addItem(placement: Placement) {
    const label = prompt('Label:')
    if (!label) return
    const href = prompt('Link (e.g. /shop or https://…):')
    if (!href) return
    const existing = nav[placement]
    const position = existing.length ? existing[existing.length - 1].position + 10 : 10
    await fetch('/api/admin/navigation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placement, label, href, position }),
    })
    load()
  }

  async function editItem(item: NavItem) {
    const label = prompt('Label:', item.label)
    if (!label) return
    const href = prompt('Link:', item.href)
    if (!href) return
    await fetch(`/api/admin/navigation/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, href }),
    })
    load()
  }

  async function removeItem(id: string) {
    if (!confirm('Remove this link?')) return
    await fetch(`/api/admin/navigation/${id}`, { method: 'DELETE' })
    load()
  }

  async function move(placement: Placement, id: string, dir: -1 | 1) {
    const list = nav[placement]
    const idx = list.findIndex(i => i.id === id)
    if (idx < 0) return
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= list.length) return
    const a = list[idx], b = list[newIdx]
    await fetch('/api/admin/navigation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: a.id, position: b.position }, { id: b.id, position: a.position }] }),
    })
    load()
  }

  if (loading) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--a-ink)] mb-1">Navigation</h1>
      <p className="text-sm text-[var(--a-ink-faint)] mb-6">Links shown in the site header, footer, and mobile menu.</p>

      <div className="space-y-5">
        {(Object.keys(PLACEMENT_LABELS) as Placement[]).map(p => (
          <div key={p} className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[var(--a-ink)]">{PLACEMENT_LABELS[p]}</p>
              <button
                onClick={() => addItem(p)}
                className="text-xs text-[var(--a-accent)] hover:underline inline-flex items-center gap-1"
              >
                <Icon name="plus" className="w-3 h-3" /> Add link
              </button>
            </div>
            {nav[p].length === 0 ? (
              <p className="text-xs text-[var(--a-ink-faint)]">No links yet.</p>
            ) : (
              <div className="space-y-1">
                {nav[p].map(item => (
                  <div key={item.id} className="flex items-center gap-2 bg-[var(--a-bg)] border border-[var(--a-line)] rounded px-3 py-2">
                    <div className="flex flex-col">
                      <button onClick={() => move(p, item.id, -1)} className="text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] text-[10px]">▲</button>
                      <button onClick={() => move(p, item.id, 1)} className="text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] text-[10px]">▼</button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--a-ink)] truncate">{item.label}</p>
                      <p className="text-[10px] text-[var(--a-ink-faint)] truncate font-mono">{item.href}</p>
                    </div>
                    <button onClick={() => editItem(item)} className="text-xs text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] px-2">Edit</button>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-red-300 hover:text-red-200 px-2">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
