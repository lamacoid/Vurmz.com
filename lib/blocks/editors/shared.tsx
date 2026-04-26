'use client'
import { useEffect, useState } from 'react'

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1 font-semibold">{children}</label>
}

export function TextField({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean
}) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2] font-mono"
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
        />
      )}
    </div>
  )
}

export function SelectField<T extends string>({ label, value, onChange, options }: {
  label: string; value: T; onChange: (v: T) => void; options: Array<{ value: T; label: string }>
}) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="w-full bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function CheckField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 mb-3 cursor-pointer">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <span className="text-sm text-cream">{label}</span>
    </label>
  )
}

interface MediaItem { id: string; url: string; filename: string; altText: string }

export function ImagePickerField({ label, value, onChange }: {
  label: string;
  value: { mediaId?: string; url?: string; alt?: string } | undefined;
  onChange: (v: { mediaId: string; url: string; alt: string } | undefined) => void;
}) {
  const [open, setOpen] = useState(false)
  const [media, setMedia] = useState<MediaItem[]>([])

  useEffect(() => {
    if (!open || media.length > 0) return
    fetch('/api/admin/media?limit=500').then(r => r.json()).then(j => {
      const parsed = j as { data?: { items: MediaItem[] } }
      setMedia(parsed.data?.items ?? [])
    })
  }, [open, media.length])

  return (
    <div className="mb-3">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-[#1a2f2e] border border-white/5 rounded overflow-hidden flex-shrink-0">
          {value?.url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value.url} alt={value.alt ?? ''} className="w-full h-full object-cover" />
          ) : <div />}
        </div>
        <div className="flex-1 flex gap-2">
          <button onClick={() => setOpen(true)} className="px-3 h-8 bg-white/5 hover:bg-white/10 rounded-md text-xs text-cream">
            {value?.url ? 'Change' : 'Choose image'}
          </button>
          {value?.url && (
            <button onClick={() => onChange(undefined)} className="px-3 h-8 bg-white/5 hover:bg-white/10 rounded-md text-xs text-red-300">
              Remove
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-[#1a2f2e] border border-white/10 rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-white/5">
              <p className="text-sm font-semibold text-cream">Choose image</p>
              <button onClick={() => setOpen(false)} className="text-gray-400">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {media.length === 0 ? <p className="col-span-4 text-xs text-gray-500 text-center py-6">No media yet — upload in the media library first.</p> : media.map(m => (
                <button
                  key={m.id}
                  onClick={() => { onChange({ mediaId: m.id, url: m.url, alt: m.altText }); setOpen(false) }}
                  className="aspect-square bg-[#243B39] border border-white/5 rounded overflow-hidden hover:border-[#6BB8B2]/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function LinkListField({ label, value, onChange }: {
  label: string;
  value: Array<{ href: string; label: string; newTab?: boolean; variant?: 'primary' | 'secondary' | 'ghost' }>;
  onChange: (v: Array<{ href: string; label: string; newTab?: boolean; variant?: 'primary' | 'secondary' | 'ghost' }>) => void;
}) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      <div className="space-y-2">
        {value.map((link, i) => (
          <div key={i} className="bg-[#1a2f2e] border border-white/5 rounded p-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                value={link.label}
                onChange={e => onChange(value.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                placeholder="Label"
                className="bg-[#243B39] border border-white/5 rounded px-2 py-1.5 text-xs text-cream outline-none focus:border-[#6BB8B2]"
              />
              <input
                value={link.href}
                onChange={e => onChange(value.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l))}
                placeholder="/link or https://…"
                className="bg-[#243B39] border border-white/5 rounded px-2 py-1.5 text-xs text-cream outline-none focus:border-[#6BB8B2]"
              />
            </div>
            <div className="flex items-center justify-between">
              <select
                value={link.variant ?? 'primary'}
                onChange={e => onChange(value.map((l, idx) => idx === i ? { ...l, variant: e.target.value as 'primary' | 'secondary' | 'ghost' } : l))}
                className="bg-[#243B39] border border-white/5 rounded px-2 py-1 text-xs text-cream outline-none"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="ghost">Ghost</option>
              </select>
              <label className="flex items-center gap-1.5 text-xs text-gray-400">
                <input type="checkbox" checked={!!link.newTab} onChange={e => onChange(value.map((l, idx) => idx === i ? { ...l, newTab: e.target.checked } : l))} />
                Open in new tab
              </label>
              <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="text-xs text-red-300 hover:text-red-200">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...value, { href: '/', label: 'Button', variant: 'primary' }])}
        className="mt-2 text-xs text-[#6BB8B2] hover:underline"
      >
        + Add link
      </button>
    </div>
  )
}
