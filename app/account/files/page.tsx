'use client'
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface FileItem { id: string; filename: string; mimeType: string; sizeBytes: number; uploadedAt: string; url: string }

function formatSize(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

function isImage(m: string) { return m.startsWith('image/') }
function isPdf(m: string) { return m === 'application/pdf' }

export default function AccountFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<FileItem | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/account/files')
    const json = (await res.json()) as { data?: { files: FileItem[] } }
    setFiles(json.data?.files ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!preview) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreview(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview])

  async function upload(list: FileList | null) {
    if (!list?.length) return
    setUploading(true)
    for (const file of Array.from(list)) {
      const form = new FormData()
      form.append('file', file)
      await fetch('/api/account/files', { method: 'POST', body: form })
    }
    setUploading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Remove this file?')) return
    await fetch(`/api/account/files/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link href="/account" className="text-xs text-gray-500 hover:text-cream mb-4 inline-block">← Back</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cream">Files</h1>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={inputRef} type="file" multiple hidden onChange={e => upload(e.target.files)} />
      </div>

      <p className="text-xs text-gray-500 mb-5">
        Store the designs, logos, and references Zach needs for your orders. Up to 50 MB per file.
      </p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : files.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); upload(e.dataTransfer.files) }}
          className="border-2 border-dashed border-white/10 rounded-xl p-14 text-center cursor-pointer hover:border-[#6FB6AC]/40 transition-colors"
        >
          <p className="text-sm text-gray-400">Drag files here or click to upload</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(f => {
            const previewable = isImage(f.mimeType) || isPdf(f.mimeType)
            return (
              <div key={f.id} className="flex items-center gap-3 bg-[#1A4F48] border border-white/5 rounded-lg px-3 py-2.5">
                <button
                  onClick={() => previewable ? setPreview(f) : window.open(f.url, '_blank')}
                  className="flex-shrink-0 w-14 h-14 bg-[#143E38] rounded-md overflow-hidden flex items-center justify-center group relative"
                  aria-label={previewable ? 'Preview' : 'Open'}
                >
                  {isImage(f.mimeType) ? (
                    <img src={f.url} alt={f.filename} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                  ) : isPdf(f.mimeType) ? (
                    <span className="text-[10px] font-mono font-bold text-[#6FB6AC] tracking-wider">PDF</span>
                  ) : (
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  )}
                </button>
                <button onClick={() => previewable ? setPreview(f) : window.open(f.url, '_blank')} className="flex-1 min-w-0 text-left">
                  <p className="text-sm text-cream hover:text-[#6FB6AC] truncate">{f.filename}</p>
                  <p className="text-[11px] text-gray-500">{formatSize(f.sizeBytes)} · {new Date(f.uploadedAt).toLocaleDateString()}</p>
                </button>
                <a href={f.url} target="_blank" rel="noreferrer" download={f.filename} className="text-xs text-gray-500 hover:text-cream px-2">Open</a>
                <button onClick={() => remove(f.id)} className="text-xs text-gray-500 hover:text-red-400 px-2">Remove</button>
              </div>
            )
          })}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center"
            aria-label="Close preview"
          >
            ×
          </button>
          <div className="absolute top-4 left-4 right-16 text-cream text-sm truncate">{preview.filename}</div>
          <div className="max-w-full max-h-full" onClick={e => e.stopPropagation()}>
            {isImage(preview.mimeType) ? (
              <img src={preview.url} alt={preview.filename} className="max-w-[90vw] max-h-[85vh] object-contain rounded" />
            ) : isPdf(preview.mimeType) ? (
              <iframe src={preview.url} className="w-[90vw] h-[85vh] bg-white rounded" title={preview.filename} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
