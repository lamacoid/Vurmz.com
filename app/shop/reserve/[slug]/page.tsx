import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReservePiece from '@/components/shop/ReservePiece'
import { RESERVE_CATEGORIES, reserveCategory, makersFor, rangeFor } from '@/lib/sourcing'

export function generateStaticParams() {
  return RESERVE_CATEGORIES.map(c => ({ slug: c.key }))
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = reserveCategory(slug)
  if (!cat) return { title: 'Not found' }
  const range = rangeFor(cat.key)
  const title = `${cat.label}, found and engraved | The Reserve`
  const description = `${cat.line} Found, engraved with your words, and hand-delivered across the south Denver metro.${range ? ` ${usd(range.low)} to ${usd(range.high)} delivered.` : ''}`
  return {
    title: { absolute: `${title} | VURMZ` },
    description,
    alternates: { canonical: `/shop/reserve/${slug}` },
    openGraph: { title, description, images: [{ url: `https://www.vurmz.com${cat.backdrop}`, width: 1200, height: 800, alt: cat.label }] },
  }
}

export default async function ReserveCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = reserveCategory(slug)
  // Old per-maker links redirect in next.config.ts (the worker shadows a
  // Server Component redirect in production).
  if (!cat) notFound()
  const makers = makersFor(cat.key)
  if (makers.length === 0) notFound()
  const also = RESERVE_CATEGORIES.filter(c => c.key !== cat.key && c.featured).slice(0, 3)
  return <ReservePiece cat={cat} makers={makers} also={also} />
}
