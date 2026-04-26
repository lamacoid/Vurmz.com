import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/db/repos/pages'
import { renderBlocks } from '@/lib/blocks/renderer'
import { resolveThemeCss } from '@/lib/theme/resolver'
import type { Block } from '@/lib/blocks/types'

export const runtime = 'edge'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return { title: 'Not found' }
  return {
    title: page.title,
    description: page.metaDescription ?? undefined,
    robots: page.noindex ? { index: false, follow: false } : undefined,
  }
}

export default async function BlockRenderedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const page = await getPageBySlug(slug)
  if (!page) return notFound()
  if (!page.isPublished && sp.preview !== '1') return notFound()

  const blocks = sp.preview === '1' ? page.draftBlocks : page.publishedBlocks
  const themeCss = await resolveThemeCss()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      <main className="min-h-screen bg-[color:var(--t-bg,#1a2f2e)] text-[color:var(--t-cream,#F0E6D3)]">
        {renderBlocks(blocks as Block[])}
      </main>
    </>
  )
}
