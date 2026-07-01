import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRightIcon, ChatBubbleLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getSmsLink, siteInfo } from '@/lib/site-info'
import { portfolioBySlug, portfolioItems } from '@/lib/portfolio'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamicParams = false

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = portfolioBySlug[slug]
  if (!item) return { title: 'Not found' }
  return {
    title: item.label,
    description: `${item.context}, laser engraved by VURMZ in ${siteInfo.city}, ${siteInfo.stateAbbr}. Material: ${item.material}. ${item.leadTimeDays}-day turnaround.`,
    openGraph: {
      title: `${item.label} · VURMZ`,
      description: item.context,
      images: [{ url: `https://www.vurmz.com${item.src}`, width: 1200, height: 800, alt: item.label }],
    },
    alternates: { canonical: `https://www.vurmz.com/services/portfolio/${item.slug}` },
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  const item = portfolioBySlug[slug]
  if (!item) notFound()

  // Find 3 related items (matching tag), excluding self
  const related = portfolioItems
    .filter((p) => p.slug !== item.slug && p.tags.some((t) => item.tags.includes(t)))
    .slice(0, 3)

  // Schema.org CreativeWork structured data
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.label,
    description: item.context,
    image: `https://www.vurmz.com${item.src}`,
    creator: {
      '@type': 'Person',
      name: siteInfo.founder.name,
    },
    keywords: item.tags.join(', '),
    material: item.material,
    locationCreated: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteInfo.city,
        addressRegion: siteInfo.stateAbbr,
        addressCountry: 'US',
      },
    },
  }

  return (
    <div className="bg-[var(--page)] text-[var(--ink)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'VURMZ', href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Portfolio', href: '/services/portfolio' },
            { label: item.label },
          ]}
          theme="services"
        />
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-black/40">
            <Image
              src={item.src}
              alt={item.label}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <Link
              href="/services/portfolio"
              className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to portfolio
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-3">
              {item.label}
            </h1>
            <p className="text-base sm:text-lg text-[var(--ink-soft)] leading-relaxed mb-6">{item.context}</p>

            <dl className="grid grid-cols-2 gap-4 text-sm border-y border-[var(--hairline)] py-4 mb-6">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Material</dt>
                <dd className="text-[var(--ink)]">{item.material}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">For</dt>
                <dd className="text-[var(--ink)]">{item.customerType}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Turnaround</dt>
                <dd className="text-[var(--ink)]">{item.leadTimeDays} day{item.leadTimeDays === 1 ? '' : 's'}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-1">Tags</dt>
                <dd className="text-[var(--ink)]">{item.tags.join(' · ')}</dd>
              </div>
            </dl>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getSmsLink(`Hi! I saw "${item.label}" on your portfolio and want something similar.`)}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Want something like this?
              </a>
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cream text-vurmz-dark font-semibold text-sm rounded-sm hover:bg-vurmz-cream-hover transition-all"
              >
                See pricing
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-[var(--hairline)]">
        <h2 className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.25em] uppercase mb-4">The story</h2>
        <p className="text-base sm:text-lg text-[var(--ink)] leading-relaxed whitespace-pre-line">{item.story}</p>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[var(--hairline)]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-6">More like this</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/services/portfolio/${r.slug}`}
                className="group block rounded-sm overflow-hidden bg-[var(--surface)] border border-[var(--hairline)] hover:border-vurmz-teal/30 transition-colors"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={r.src}
                    alt={r.label}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[var(--ink)] leading-tight">{r.label}</p>
                  <p className="text-xs text-[var(--ink-soft)] mt-1 line-clamp-2">{r.context}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/services/portfolio"
              className="inline-flex items-center gap-2 text-sm text-[var(--eyebrow)] hover:text-[var(--ink)] transition-colors"
            >
              See full portfolio
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
