'use client'
import { useCallback, useEffect, useState } from 'react'

interface BusinessInfo {
  name?: string
  legal_name?: string
  tagline?: string
  description?: string
  phone?: string
  phone_clean?: string
  email?: string
  address?: string
  full_address?: string
  city?: string
  state?: string
  state_abbr?: string
  url?: string
}

interface Settings {
  business_info?: BusinessInfo
  hours?: Record<string, string>
  service_areas?: string[]
  social_links?: { instagram?: string; facebook?: string; linkedin?: string }
  [key: string]: unknown
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/settings')
    const json = (await res.json()) as { data?: { settings: Settings } }
    setSettings(json.data?.settings ?? {})
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function save(key: string, value: unknown) {
    setSaving(key)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    setSaving(null)
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading || !settings) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>

  const biz = settings.business_info ?? {}
  const social = settings.social_links ?? {}
  const areas = settings.service_areas ?? []

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--a-ink)] mb-6">Site settings</h1>

      <Section title="Business info" saving={saving === 'business_info'}>
        <Field label="Business name" value={biz.name ?? ''} onSave={v => save('business_info', { ...biz, name: v })} />
        <Field label="Tagline" value={biz.tagline ?? ''} onSave={v => save('business_info', { ...biz, tagline: v })} />
        <Field label="Description" value={biz.description ?? ''} onSave={v => save('business_info', { ...biz, description: v })} multiline />
        <Field label="Phone" value={biz.phone ?? ''} onSave={v => save('business_info', { ...biz, phone: v, phone_clean: v.replace(/\D/g, '') })} />
        <Field label="Email" value={biz.email ?? ''} onSave={v => save('business_info', { ...biz, email: v })} />
        <Field label="Address (display)" value={biz.address ?? ''} onSave={v => save('business_info', { ...biz, address: v })} />
        <Field label="Full address (SEO)" value={biz.full_address ?? ''} onSave={v => save('business_info', { ...biz, full_address: v })} />
        <Field label="City" value={biz.city ?? ''} onSave={v => save('business_info', { ...biz, city: v })} />
        <Field label="URL" value={biz.url ?? ''} onSave={v => save('business_info', { ...biz, url: v })} />
      </Section>

      <Section title="Social" saving={saving === 'social_links'}>
        <Field label="Instagram" value={social.instagram ?? ''} onSave={v => save('social_links', { ...social, instagram: v })} placeholder="https://instagram.com/vurmz" />
        <Field label="Facebook" value={social.facebook ?? ''} onSave={v => save('social_links', { ...social, facebook: v })} />
        <Field label="LinkedIn" value={social.linkedin ?? ''} onSave={v => save('social_links', { ...social, linkedin: v })} />
      </Section>

      <Section title="Service areas" saving={saving === 'service_areas'}>
        <AreaList value={areas} onChange={v => save('service_areas', v)} />
      </Section>
    </div>
  )
}

function Section({ title, children, saving }: { title: string; children: React.ReactNode; saving: boolean }) {
  return (
    <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] font-semibold">{title}</p>
        {saving && <span className="text-[10px] text-[var(--a-ink-faint)]">Saving…</span>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, value, onSave, multiline, placeholder }: { label: string; value: string; onSave: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={() => local !== value && onSave(local)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
        />
      ) : (
        <input
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={() => local !== value && onSave(local)}
          placeholder={placeholder}
          className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
        />
      )}
    </div>
  )
}

function AreaList({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [newArea, setNewArea] = useState('')
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map(a => (
          <span key={a} className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-full pl-3 pr-1 py-1 text-xs text-[var(--a-ink)] flex items-center gap-2">
            {a}
            <button onClick={() => onChange(value.filter(v => v !== a))} className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-[var(--a-ink-soft)]">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newArea}
          onChange={e => setNewArea(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newArea.trim()) { onChange([...value, newArea.trim()]); setNewArea('') } }}
          placeholder="Add a city…"
          className="flex-1 bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
        />
        <button
          onClick={() => { if (newArea.trim()) { onChange([...value, newArea.trim()]); setNewArea('') } }}
          className="px-3 h-9 bg-white/5 hover:bg-white/10 rounded-md text-xs text-[var(--a-ink)]"
        >
          Add
        </button>
      </div>
    </div>
  )
}
