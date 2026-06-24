'use client'
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/admin/icons'

interface MediaItem {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
  altText: string
  url: string
  uploadedAt: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function load() {
    const res = await fetch('/api/admin/media?limit=200')
    const json = (await res.json()) as { ok: boolean; data?: { items: MediaItem[] } }
    setItems(json.data?.items ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      await fetch('/api/admin/media/upload', { method: 'POST', body: form })
    }
    setUploading(false)
    load()
  }

  async function updateAlt(id: string, altText: string) {
    await fetch(`/api/admin/media/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ altText }),
    })
  }

  async function remove(id: string) {
    if (!confirm('Delete this media file? This can be undone in the next 30 days.')) return
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    setSelected(null)
    load()
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Media library</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">Every image and asset used on the site.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              setSyncing(true)
              await fetch('/api/admin/media/sync-site', { method: 'POST' })
              await load()
              setSyncing(false)
            }}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-3 h-9 bg-white/5 hover:bg-white/10 disabled:opacity-60 text-[var(--a-ink)] text-sm rounded-md border border-[var(--a-line)]"
            title="Register /public photos already shipped with the site"
          >
            {syncing ? 'Syncing…' : 'Sync site photos'}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors"
          >
            <Icon name="plus" className="w-4 h-4" />
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          hidden
          onChange={e => handleUpload(e.target.files)}
        />
      </div>

      {loading ? (
        <div className="text-[var(--a-ink-faint)] text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
          className="border-2 border-dashed border-[var(--a-line)] rounded-xl p-16 text-center cursor-pointer hover:border-[#7FCFD4]/40 transition-colors"
        >
          <Icon name="image" className="w-10 h-10 text-[var(--a-ink-faint)] mx-auto mb-3" />
          <p className="text-[var(--a-ink-soft)] text-sm">Drag files here or click to upload</p>
          <p className="text-[var(--a-ink-faint)] text-xs mt-1">Images, PDFs — up to 50 MB each</p>
        </div>
      ) : (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        >
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="group relative aspect-square bg-[var(--a-panel)] border border-[var(--a-line)] hover:border-[#7FCFD4]/40 rounded-lg overflow-hidden transition-colors"
            >
              {item.mimeType.startsWith('image/') ? (
                <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--a-ink-faint)]">
                  <Icon name="doc" className="w-8 h-8" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[10px] text-[var(--a-ink)] truncate">
                {item.filename}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[var(--a-line)]">
              <p className="text-sm font-semibold text-[var(--a-ink)] truncate pr-4">{selected.filename}</p>
              <button onClick={() => setSelected(null)} className="p-1 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]">
                <Icon name="x" className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 grid md:grid-cols-2 gap-5">
              <div className="bg-[var(--a-panel)] rounded-lg overflow-hidden">
                {selected.mimeType.startsWith('image/') ? (
                  <img src={selected.url} alt={selected.altText} className="w-full h-auto" />
                ) : (
                  <a href={selected.url} target="_blank" rel="noreferrer" className="flex items-center justify-center p-10 text-[var(--a-accent)]">
                    Open file
                  </a>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] block mb-1">Alt text</label>
                  <input
                    defaultValue={selected.altText}
                    onBlur={e => updateAlt(selected.id, e.target.value)}
                    placeholder="Describe this image…"
                    className="w-full bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
                  />
                </div>
                <dl className="text-xs space-y-1 text-[var(--a-ink-soft)]">
                  <div className="flex justify-between"><dt>Type</dt><dd>{selected.mimeType}</dd></div>
                  <div className="flex justify-between"><dt>Size</dt><dd>{formatSize(selected.sizeBytes)}</dd></div>
                  <div className="flex justify-between"><dt>Uploaded</dt><dd>{new Date(selected.uploadedAt).toLocaleDateString()}</dd></div>
                </dl>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.origin + selected.url); }}
                    className="flex-1 px-3 h-9 bg-[var(--a-panel)] hover:bg-[#2a4441] text-[var(--a-ink)] text-xs font-medium rounded-md border border-[var(--a-line)]"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => remove(selected.id)}
                    className="px-3 h-9 bg-red-900/40 hover:bg-red-900/60 text-red-200 text-xs font-medium rounded-md border border-red-900/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
