'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/admin/icons'

interface PageRow {
  id: string; slug: string; title: string; isPublished: boolean; version: number; updatedAt: string; publishedAt: string | null
}

export default function PagesListPage() {
  const router = useRouter()
  const [pages, setPages] = useState<PageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/pages')
    const json = (await res.json()) as { data?: { pages: PageRow[] } }
    setPages(json.data?.pages ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create() {
    const slug = prompt('Slug (e.g. "about" or "services/foo"):')
    if (!slug) return
    const title = prompt('Title:') ?? slug
    setCreating(true)
    const res = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, title }),
    })
    const json = (await res.json()) as { ok?: boolean; data?: { page: { id: string } }; error?: { message?: string } }
    if (!res.ok || !json.ok) { alert(json.error?.message ?? 'Failed'); setCreating(false); return }
    router.push(`/admin/content/pages/${json.data!.page.id}`)
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream">Pages</h1>
          <p className="text-sm text-gray-500 mt-1">Content pages — visual editor with live preview.</p>
        </div>
        <button
          onClick={create}
          disabled={creating}
          className="inline-flex items-center gap-2 px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
        >
          <Icon name="plus" className="w-4 h-4" />
          New page
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : pages.length === 0 ? (
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-10 text-center">
          <Icon name="doc" className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-cream text-sm font-semibold mb-1">No pages yet</p>
          <p className="text-gray-500 text-xs mb-5">Create your first page — pick blocks, drag to reorder, publish.</p>
          <button onClick={create} className="inline-flex items-center gap-2 px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] text-white text-xs font-semibold rounded-md">
            <Icon name="plus" className="w-4 h-4" />
            New page
          </button>
        </div>
      ) : (
        <div className="bg-[#16525C] border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
          {pages.map(p => (
            <Link
              key={p.id}
              href={`/admin/content/pages/${p.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-cream truncate">{p.title}</p>
                <p className="text-[11px] text-gray-500 truncate font-mono">/p/{p.slug}</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <span className="font-mono">v{p.version}</span>
                <span className={`px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                  p.isPublished ? 'bg-[#7FCFD4]/15 text-[#7FCFD4]' : 'bg-white/5 text-gray-500'
                }`}>
                  {p.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
