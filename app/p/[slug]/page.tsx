export const runtime = 'edge'

import { getD1 } from '@/lib/d1'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface Page {
  id: string
  slug: string
  title: string
  content: string | null
  enabled: number
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const db = getD1()

  const page = await db.prepare(
    'SELECT title FROM pages WHERE slug = ? AND enabled = 1'
  ).bind(slug).first() as Page | null

  if (!page) {
    return { title: 'Page Not Found' }
  }

  return {
    title: page.title,
  }
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params
  const db = getD1()

  const page = await db.prepare(
    'SELECT * FROM pages WHERE slug = ? AND enabled = 1'
  ).bind(slug).first() as Page | null

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">{page.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {page.content ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="text-gray-500 text-center">This page has no content yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
