'use client'
/* eslint-disable @next/next/no-img-element */
/**
 * FileAttach — "Add your file" for the product order form. One file per item.
 *
 * Guests upload through /api/checkout/upload (the private checkout/ prefix;
 * nothing is saved to an account). Logged-in customers upload through
 * /api/account/files, so the file lands in "My files" AND rides the order,
 * and they get a "Choose from your files" picker for anything already saved.
 * Login is detected client-side via /api/account/me, same as checkout.
 *
 * The value handed up is what rides the cart item: { key, filename }.
 */
import { useEffect, useRef, useState } from 'react'

export interface AttachedFile {
  key: string
  filename: string
}

interface SavedFile {
  id: string
  key?: string
  filename: string
  mimeType: string
  sizeBytes: number
  url: string
}

const GUEST_MAX = 10 * 1024 * 1024
const ACCOUNT_MAX = 50 * 1024 * 1024
// Guests may send SVG (checkout upload allows it); account files are images + PDF.
const GUEST_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf,.svg,.pdf'
const ACCOUNT_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp,application/pdf,.pdf'

function isImageName(name: string) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(name)
}

export default function FileAttach({
  value,
  onChange,
}: {
  value: AttachedFile | null
  onChange: (f: AttachedFile | null) => void
}) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saved, setSaved] = useState<SavedFile[] | null>(null)
  // Local preview for the chip; blob URL for fresh uploads, account URL for picks.
  const [thumbUrl, setThumbUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/account/me')
      .then(r => { if (!cancelled && r.ok) setLoggedIn(true) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // Blob URLs are released when the chip changes or the picker unmounts.
  useEffect(() => {
    return () => { if (thumbUrl?.startsWith('blob:')) URL.revokeObjectURL(thumbUrl) }
  }, [thumbUrl])

  function setThumb(url: string | null) {
    setThumbUrl(prev => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return url
    })
  }

  async function upload(file: File) {
    setError(null)
    const max = loggedIn ? ACCOUNT_MAX : GUEST_MAX
    if (file.size > max) {
      setError(`Max file size is ${Math.round(max / 1024 / 1024)} MB.`)
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const endpoint = loggedIn ? '/api/account/files' : '/api/checkout/upload'
      const res = await fetch(endpoint, { method: 'POST', body: fd })
      const json = (await res.json()) as {
        ok?: boolean
        data?: { key?: string; filename?: string }
        error?: { message?: string }
      }
      if (!res.ok || !json.ok || !json.data?.key) {
        setError(json.error?.message ?? 'Upload failed. Try again or text me the file.')
        return
      }
      onChange({ key: json.data.key, filename: json.data.filename ?? file.name })
      setThumb(file.type.startsWith('image/') ? URL.createObjectURL(file) : null)
      setPickerOpen(false)
    } catch {
      setError('Upload failed. Try again or text me the file.')
    } finally {
      setUploading(false)
    }
  }

  async function openPicker() {
    setPickerOpen(o => !o)
    if (saved !== null) return
    try {
      const res = await fetch('/api/account/files')
      const json = (await res.json()) as { data?: { files: SavedFile[] } }
      setSaved(json.data?.files ?? [])
    } catch {
      setSaved([])
    }
  }

  function pickSaved(f: SavedFile) {
    if (!f.key) return
    onChange({ key: f.key, filename: f.filename })
    setThumb(f.mimeType.startsWith('image/') ? f.url : null)
    setPickerOpen(false)
  }

  return (
    <div>
      <span className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] block mb-1.5">Your file</span>

      {value ? (
        <div className="flex items-center gap-3 bg-[var(--page)] border border-[var(--hairline)] rounded-sm px-3 py-2">
          <span className="flex-shrink-0 w-10 h-10 rounded-sm overflow-hidden bg-[var(--ink)]/[0.06] grid place-items-center">
            {thumbUrl && isImageName(value.filename) ? (
              <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[9px] font-mono font-semibold text-[var(--ink-soft)]">
                {value.filename.match(/\.([a-z0-9]+)$/i)?.[1]?.toUpperCase() ?? 'FILE'}
              </span>
            )}
          </span>
          <span className="flex-1 min-w-0 text-sm text-[var(--ink)] truncate">{value.filename}</span>
          <button
            type="button"
            onClick={() => { onChange(null); setThumb(null) }}
            className="text-xs text-[#C67A6F] font-semibold hover:underline flex-shrink-0"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <label className={`inline-flex items-center gap-2 px-3 py-2 bg-[var(--page)] border border-[var(--hairline)] rounded-sm text-sm text-[var(--ink)] cursor-pointer hover:border-[#C67A6F] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <input
              ref={inputRef}
              type="file"
              accept={loggedIn ? ACCOUNT_ACCEPT : GUEST_ACCEPT}
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) upload(f)
                e.target.value = ''
              }}
            />
            {uploading ? 'Uploading…' : '+ Add your file'}
          </label>
          {loggedIn && (
            <button
              type="button"
              onClick={openPicker}
              aria-expanded={pickerOpen}
              className="px-3 py-2 border border-[var(--hairline)] rounded-sm text-sm text-[var(--ink-soft)] hover:border-[#C67A6F] hover:text-[var(--ink)] transition-colors"
            >
              Choose from your files
            </button>
          )}
        </div>
      )}

      {pickerOpen && !value && (
        <div className="mt-2 max-h-48 overflow-y-auto rounded-sm border border-[var(--hairline)] bg-[var(--page)]">
          {saved === null ? (
            <p className="px-3 py-2.5 text-xs text-[var(--ink-soft)]">Loading…</p>
          ) : saved.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-[var(--ink-soft)]">No saved files yet. Upload one and it saves to your account.</p>
          ) : (
            saved.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => pickSaved(f)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--ink)]/[0.04] transition-colors"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-sm overflow-hidden bg-[var(--ink)]/[0.06] grid place-items-center">
                  {f.mimeType.startsWith('image/') ? (
                    <img src={f.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-[8px] font-mono font-semibold text-[var(--ink-soft)]">PDF</span>
                  )}
                </span>
                <span className="min-w-0 flex-1 text-sm text-[var(--ink)] truncate">{f.filename}</span>
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-1 text-[11px] text-red-700">{error}</p>}
      <p className="mt-1 text-[11px] text-[var(--ink-soft)]">
        Logo, design, or photo. SVG or PDF engraves best.
        {loggedIn ? ' Uploads save to your files.' : ''}
      </p>
    </div>
  )
}
