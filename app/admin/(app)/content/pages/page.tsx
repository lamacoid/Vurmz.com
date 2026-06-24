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
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Pages</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">Content pages — visual editor with live preview.</p>
        </div>
        <button
          onClick={create}
          disabled={creating}
          className="inline-flex items-center gap-2 px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
        >
          <Icon name="plus" className="w-4 h-4" />
          New page
        </button>
      </div>

      {loading ? (
        <p className="text-[var(--a-ink-faint)] text-sm">Loading…</p>
      ) : pages.length === 0 ? (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-10 text-center">
          <Icon name="doc" className="w-8 h-8 text-[var(--a-ink-faint)] mx-auto mb-3" />
          <p className="text-[var(--a-ink)] text-sm font-semibold mb-1">No pages yet</p>
          <p className="text-[var(--a-ink-faint)] text-xs mb-5">Create your first page — pick blocks, drag to reorder, publish.</p>
          <button onClick={create} className="inline-flex items-center gap-2 px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] text-white text-xs font-semibold rounded-md">
            <Icon name="plus" className="w-4 h-4" />
            New page
          </button>
        </div>
      ) : (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl overflow-hidden divide-y divide-[var(--a-line)]">
          {pages.map(p => (
            <Link
              key={p.id}
              href={`/admin/content/pages/${p.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--a-ink)] truncate">{p.title}</p>
                <p className="text-[11px] text-[var(--a-ink-faint)] truncate font-mono">/p/{p.slug}</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[var(--a-ink-faint)]">
                <span className="font-mono">v{p.version}</span>
                <span className={`px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                  p.isPublished ? 'bg-[#7FCFD4]/15 text-[var(--a-accent)]' : 'bg-white/5 text-[var(--a-ink-faint)]'
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
