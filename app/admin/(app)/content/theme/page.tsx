'use client'
import { useCallback, useEffect, useState } from 'react'

interface Theme {
  colors: Record<string, string>
  fonts: { heading: string; body: string; mono: string }
  spacing: { container_max: string; radius_sm: string; radius_md: string; radius_lg: string }
  updatedAt: string
}

// Slimmer set, grouped. Keys not listed here remain in the DB but aren't editable
// (they auto-derive from these — bg_alt = bg slightly lighter, cream_muted = cream at 70%, etc).
type Slot = {
  key: string
  label: string
  hint: string
  preview: 'page' | 'button' | 'outline' | 'cta' | 'cream-text' | 'heading' | 'muted-text' | 'border'
}

const CORE_SLOTS: Slot[] = [
  { key: 'bg',           label: 'Page background',  hint: 'Dark teal — sets the overall mood for services side', preview: 'page' },
  { key: 'teal_primary', label: 'Primary teal',     hint: 'Brand color — buttons, links, accents',                preview: 'button' },
  { key: 'teal_muted',   label: 'Muted teal',       hint: 'Outlines, secondary actions',                          preview: 'outline' },
  { key: 'cream',        label: 'Cream',            hint: 'Headlines and cards on dark',                          preview: 'cream-text' },
  { key: 'text_heading', label: 'Text heading',     hint: 'Section titles',                                       preview: 'heading' },
  { key: 'text_muted',   label: 'Text muted',       hint: 'Helper copy, captions, timestamps',                    preview: 'muted-text' },
  { key: 'border',       label: 'Border',           hint: 'Card and divider lines',                               preview: 'border' },
]

const SHOP_SLOTS: Slot[] = [
  { key: 'coral_cta', label: 'Coral CTA', hint: 'Shop-side action — overrides primary teal on /shop pages', preview: 'cta' },
]

function Preview({ kind, color }: { kind: Slot['preview']; color: string }) {
  switch (kind) {
    case 'page':
      return <div className="w-full h-9 rounded-md" style={{ background: color }} />
    case 'button':
      return (
        <div className="px-3 py-1.5 rounded-md text-[11px] font-semibold inline-block text-white" style={{ background: color }}>
          Sample button
        </div>
      )
    case 'outline':
      return (
        <div className="px-3 py-1.5 rounded-md text-[11px] font-medium inline-block bg-transparent border" style={{ borderColor: color, color }}>
          Outline
        </div>
      )
    case 'cta':
      return (
        <div className="px-3 py-1.5 rounded-md text-[11px] font-bold inline-block text-white" style={{ background: color }}>
          Browse products →
        </div>
      )
    case 'cream-text':
      return (
        <div className="px-3 py-1.5 rounded-md text-[11px] font-medium inline-block bg-[#1c474e]" style={{ color }}>
          Headline sample
        </div>
      )
    case 'heading':
      return (
        <div className="text-base font-bold" style={{ color }}>Section title</div>
      )
    case 'muted-text':
      return (
        <div className="text-[11px]" style={{ color }}>Helper text · 2m ago</div>
      )
    case 'border':
      return (
        <div className="px-3 py-1.5 rounded-md text-[11px] inline-block bg-transparent border-2 text-cream" style={{ borderColor: color }}>
          Card edge
        </div>
      )
  }
}

export default function ThemeEditorPage() {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/theme')
    const json = (await res.json()) as { data?: { theme: Theme } }
    setTheme(json.data?.theme ?? null)
  }, [])

  useEffect(() => { load() }, [load])

  async function save(patch: Partial<Theme>) {
    setSaving(true)
    const res = await fetch('/api/admin/theme', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const json = (await res.json()) as { data?: { theme: Theme } }
    if (json.data?.theme) setTheme(json.data.theme)
    setSaving(false)
    setSavedAt(Date.now())
  }

  if (!theme) return <div className="p-8 text-gray-500 text-sm">Loading…</div>

  function updateColor(key: string, value: string) {
    if (!theme) return
    setTheme({ ...theme, colors: { ...theme.colors, [key]: value } })
  }
  function commitColors() {
    if (!theme) return
    save({ colors: theme.colors })
  }

  function renderSlot(s: Slot) {
    const val = theme!.colors[s.key] ?? '#000000'
    return (
      <div key={s.key} className="flex items-start gap-3 p-3 rounded-lg bg-[#1c474e] border border-white/5">
        <input
          type="color"
          value={val.startsWith('#') ? val : '#000000'}
          onChange={e => updateColor(s.key, e.target.value)}
          onBlur={commitColors}
          className="w-12 h-12 flex-shrink-0 rounded cursor-pointer bg-transparent border border-white/10"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-cream font-medium">{s.label}</p>
          <p className="text-[11px] text-gray-500 mb-2">{s.hint}</p>
          <input
            value={val}
            onChange={e => updateColor(s.key, e.target.value)}
            onBlur={commitColors}
            className="w-full bg-[#235158] border border-white/5 rounded px-2 py-1 text-xs text-cream outline-none focus:border-[#6BB8B2] font-mono"
          />
        </div>
        <div className="flex-shrink-0 w-44 flex items-center justify-end">
          <Preview kind={s.preview} color={val} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream">Theme</h1>
          <p className="text-sm text-gray-500 mt-1">Colors, fonts, and spacing for block-rendered pages.</p>
        </div>
        <div className="text-[11px] text-gray-500">
          {saving ? 'Saving…' : savedAt ? 'Saved ✓' : `Last updated ${new Date(theme.updatedAt).toLocaleString()}`}
        </div>
      </div>

      <div className="bg-[#235158] border border-white/5 rounded-xl p-5 mb-4">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Core palette</p>
          <p className="text-[10px] text-gray-500">Continuity across the site</p>
        </div>
        <div className="space-y-2">
          {CORE_SLOTS.map(renderSlot)}
        </div>
      </div>

      <div className="bg-[#235158] border border-white/5 rounded-xl p-5 mb-4">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Shop palette</p>
          <p className="text-[10px] text-gray-500">Override on /shop pages</p>
        </div>
        <div className="space-y-2">
          {SHOP_SLOTS.map(renderSlot)}
        </div>
      </div>

      <div className="bg-[#235158] border border-white/5 rounded-xl p-5 mb-4">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Fonts</p>
        <div className="space-y-2">
          {(['heading','body','mono'] as const).map(k => (
            <div key={k}>
              <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1">{k}</label>
              <input
                value={theme.fonts[k]}
                onChange={e => setTheme({ ...theme, fonts: { ...theme.fonts, [k]: e.target.value } })}
                onBlur={() => save({ fonts: theme.fonts })}
                className="w-full bg-[#1c474e] border border-white/5 rounded-md px-3 py-2 text-xs text-cream outline-none focus:border-[#6BB8B2] font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#235158] border border-white/5 rounded-xl p-5">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Spacing</p>
        <div className="grid grid-cols-2 gap-3">
          {(['container_max','radius_sm','radius_md','radius_lg'] as const).map(k => (
            <div key={k}>
              <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1">{k.replace('_', ' ')}</label>
              <input
                value={theme.spacing[k]}
                onChange={e => setTheme({ ...theme, spacing: { ...theme.spacing, [k]: e.target.value } })}
                onBlur={() => save({ spacing: theme.spacing })}
                className="w-full bg-[#1c474e] border border-white/5 rounded-md px-3 py-2 text-xs text-cream outline-none focus:border-[#6BB8B2] font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
