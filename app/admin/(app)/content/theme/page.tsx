'use client'
import { useCallback, useEffect, useState } from 'react'

interface Theme {
  colors: Record<string, string>
  fonts: { heading: string; body: string; mono: string }
  spacing: { container_max: string; radius_sm: string; radius_md: string; radius_lg: string }
  updatedAt: string
}

const COLOR_LABELS: Record<string, string> = {
  bg: 'Background',
  bg_alt: 'Background (alt)',
  teal_primary: 'Teal primary',
  teal_muted: 'Teal muted',
  coral_cta: 'Coral CTA',
  coral_accent: 'Coral accent',
  cream: 'Cream',
  cream_muted: 'Cream muted',
  text_heading: 'Text heading',
  text_body: 'Text body',
  text_muted: 'Text muted',
  border: 'Border',
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

      <div className="bg-[#243B39] border border-white/5 rounded-xl p-5 mb-4">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Colors</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(theme.colors).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={val.startsWith('#') ? val : '#000000'}
                onChange={e => updateColor(key, e.target.value)}
                onBlur={commitColors}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border border-white/10"
              />
              <div className="flex-1">
                <p className="text-[11px] text-gray-500">{COLOR_LABELS[key] ?? key}</p>
                <input
                  value={val}
                  onChange={e => updateColor(key, e.target.value)}
                  onBlur={commitColors}
                  className="w-full bg-[#1a2f2e] border border-white/5 rounded px-2 py-1 text-xs text-cream outline-none focus:border-[#6BB8B2] font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#243B39] border border-white/5 rounded-xl p-5 mb-4">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Fonts</p>
        <div className="space-y-2">
          {(['heading','body','mono'] as const).map(k => (
            <div key={k}>
              <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1">{k}</label>
              <input
                value={theme.fonts[k]}
                onChange={e => setTheme({ ...theme, fonts: { ...theme.fonts, [k]: e.target.value } })}
                onBlur={() => save({ fonts: theme.fonts })}
                className="w-full bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-xs text-cream outline-none focus:border-[#6BB8B2] font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#243B39] border border-white/5 rounded-xl p-5">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Spacing</p>
        <div className="grid grid-cols-2 gap-3">
          {(['container_max','radius_sm','radius_md','radius_lg'] as const).map(k => (
            <div key={k}>
              <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1">{k.replace('_', ' ')}</label>
              <input
                value={theme.spacing[k]}
                onChange={e => setTheme({ ...theme, spacing: { ...theme.spacing, [k]: e.target.value } })}
                onBlur={() => save({ spacing: theme.spacing })}
                className="w-full bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-xs text-cream outline-none focus:border-[#6BB8B2] font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
