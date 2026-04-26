'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface FileItem { id: string; filename: string; mimeType: string; sizeBytes: number; uploadedAt: string; url: string }

function formatSize(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

export default function AccountFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/account/files')
    const json = (await res.json()) as { data?: { files: FileItem[] } }
    setFiles(json.data?.files ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

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
          className="border-2 border-dashed border-white/10 rounded-xl p-14 text-center cursor-pointer hover:border-[#6BB8B2]/40 transition-colors"
        >
          <p className="text-sm text-gray-400">Drag files here or click to upload</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(f => (
            <div key={f.id} className="flex items-center gap-3 bg-[#243B39] border border-white/5 rounded-lg px-4 py-3">
              <a href={f.url} target="_blank" rel="noreferrer" className="flex-1 min-w-0">
                <p className="text-sm text-cream hover:text-[#6BB8B2] truncate">{f.filename}</p>
                <p className="text-[11px] text-gray-500">{formatSize(f.sizeBytes)} · {new Date(f.uploadedAt).toLocaleDateString()}</p>
              </a>
              <button onClick={() => remove(f.id)} className="text-xs text-gray-500 hover:text-red-400">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
