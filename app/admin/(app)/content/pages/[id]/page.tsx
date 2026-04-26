'use client'
export const runtime = 'edge'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PageEditor from '@/components/admin/PageEditor'
import type { Block } from '@/lib/blocks/types'

interface PageData {
  id: string; slug: string; title: string; metaDescription: string | null
  publishedBlocks: Block[]; draftBlocks: Block[]
  version: number; isPublished: boolean; noindex: boolean; updatedAt: string
}

export default function EditPage() {
  const params = useParams<{ id: string }>()
  const [data, setData] = useState<PageData | null>(null)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/admin/pages/${params.id}`).then(r => r.json()).then(j => {
      const parsed = j as { data?: { page: PageData } }
      setData(parsed.data?.page ?? null)
    })
  }, [params?.id])

  if (!data) return <div className="p-8 text-gray-500 text-sm">Loading…</div>
  return <PageEditor initial={data} />
}
