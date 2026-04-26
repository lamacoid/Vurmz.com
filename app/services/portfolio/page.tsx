import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { getSmsLink } from '@/lib/site-info'
import Breadcrumbs from '@/components/Breadcrumbs'
import { portfolioItems } from '@/lib/portfolio'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Client work, personal projects, and experiments in laser engraving. Metal, wood, glass, and more from Centennial, CO.',
}

export default function PortfolioPage() {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Portfolio' }]} theme="services" />
      </div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-cream py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Portfolio
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              Some of those possibilities.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-10 sm:py-12 bg-vurmz-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {portfolioItems.map((item, idx) => (
              <div
                key={idx}
                className="relative break-inside-avoid rounded-sm overflow-hidden group cursor-default"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm text-cream font-medium">{item.label}</p>
                  {'context' in item && item.context && (
                    <p className="text-xs text-cream/60 mt-0.5">{item.context}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-10 sm:py-12 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-cream mb-4">
            Like what you see?
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            Check out <Link href="/services/pricing" className="text-vurmz-teal hover:text-cream transition-colors">transparent pricing</Link> or just text me a photo of what you want engraved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/services/pricing"
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
