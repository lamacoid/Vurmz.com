import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReservePiece from '@/components/shop/ReservePiece'
import { SOURCED, sourcedBySlug, alsoInReserve, deliveredPrice } from '@/lib/sourcing'

export function generateStaticParams() {
  return SOURCED.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = sourcedBySlug(slug)
  if (!item) return { title: 'Not found' }
  const title = `${item.name}, engraved | The Reserve`
  const description = `${item.maker} ${item.material.toLowerCase()}, found, engraved with your words, and hand-delivered across the south Denver metro. $${deliveredPrice(item)} delivered. Proof photo before it runs.`
  return {
    title: { absolute: `${title} | VURMZ` },
    description,
    alternates: { canonical: `/shop/reserve/${slug}` },
    openGraph: { title, description, images: [{ url: `https://www.vurmz.com${item.backdrop}`, width: 1200, height: 800, alt: item.name }] },
  }
}

export default async function ReservePiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = sourcedBySlug(slug)
  if (!item) notFound()
  return <ReservePiece item={item} also={alsoInReserve(item)} />
}
