import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { getSmsLink } from '@/lib/site-info'
import Breadcrumbs from '@/components/Breadcrumbs'
import SiteHero from '@/components/SiteHero'
import { portfolioItems } from '@/lib/portfolio'

export const metadata: Metadata = {
  title: { absolute: 'Laser Engraving Portfolio | VURMZ, Centennial, CO' },
  description: 'Client work, personal projects, and experiments in laser engraving. Metal, wood, glass, and more from Centennial, CO.',
  alternates: { canonical: '/services/portfolio' },
  openGraph: {
    title: 'Laser Engraving Portfolio | VURMZ',
    description: 'Client work, personal projects, and experiments in laser engraving. Metal, wood, glass, and more from Centennial, CO.',
    url: 'https://www.vurmz.com/services/portfolio',
    images: ['/portfolio/denver-map-mirror-closeup.jpg'],
  },
}

export default function PortfolioPage() {
  return (
    <div className="bg-[var(--page)]">
      {/* Hero (shared) */}
      <SiteHero
        eyebrow="Portfolio"
        heading="Laser Engraving Portfolio: Metal, Wood, Glass & More"
        accent="teal"
        baseColor="#16525C"
      >
        <p className="text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Some of those possibilities: client work, personal projects, and experiments in metal, wood, and glass.
        </p>
      </SiteHero>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Portfolio' }]} theme="services" />
      </div>

      {/* Portfolio Grid */}
      <section className="py-10 sm:py-12 bg-[var(--page)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {portfolioItems.map((item) => (
              <Link
                key={item.slug}
                href={`/services/portfolio/${item.slug}`}
                className="break-inside-avoid group block"
              >
                <div className="relative rounded-sm overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                  {/* Subtle coral wash (~20%) + slim bottom gradient for label legibility */}
                  <div className="absolute inset-0 bg-[#C67A6F]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm text-[var(--ink)] font-medium">{item.label}</p>
                    {item.context && (
                      <p className="text-xs text-[var(--ink)]/60 mt-0.5">{item.context}</p>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-[11px] font-mono text-[var(--ink-soft)] tracking-[0.12em] uppercase">
                  {item.material} &middot; {item.process}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-10 sm:py-12 border-t border-[var(--hairline)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-4">
            Like what you see?
          </h2>
          <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-6">
            Check out <Link href="/services" className="text-[var(--eyebrow)] hover:text-[var(--ink)] transition-colors">transparent pricing</Link> or just text me a photo of what you want engraved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cream text-vurmz-dark font-semibold text-sm rounded-sm hover:bg-vurmz-cream-hover transition-all"
            >
              View Pricing
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getSmsLink("I saw your portfolio and I'm interested")}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text me
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
