import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { aboutContent } from '@/lib/about'
import Breadcrumbs from '@/components/Breadcrumbs'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'About',
  description: `Meet ${siteInfo.founder.name}, the person behind VURMZ. One-person laser engraving studio in ${siteInfo.city}, Colorado. Personal service, next-day turnaround, hand-delivered.`,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--ink-soft)]">
      <SiteHeader variant="services" />

      {/* Breadcrumbs + Hero */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'About' }]} theme="landing" />
          <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.25em] uppercase mb-4">Who We Are</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--ink)] tracking-tight leading-tight">About VURMZ</h1>
        </div>
      </section>

      {/* Story */}
      <section className="pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image src={aboutContent.image} alt={`${siteInfo.founder.name}, owner of VURMZ`} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(18,63,71,0.7) 0%, transparent 100%)' }} />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-mono text-white/80 tracking-wider uppercase drop-shadow">{siteInfo.founder.name} &middot; Owner</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-6">
                {aboutContent.headline.split('.')[0]}.<br />
                <span className="text-[var(--ink-soft)]">{aboutContent.subhead}</span>
              </h2>
              {aboutContent.storyParagraphs.map((p, i) => (
                <p key={i} className="text-[var(--ink-soft)] text-base leading-relaxed mb-4">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-4">What We Stand For</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mb-10">Built on three things.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {aboutContent.values.map((v) => (
              <div key={v.title} className="bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6">
                <h3 className="text-lg font-bold text-[var(--ink)] mb-2">{v.title}</h3>
                <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-4">The Process</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mb-10">How it works.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutContent.process.map((s) => (
              <div key={s.step} className="relative">
                <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--hairline)] flex items-center justify-center mb-4">
                  <span className="text-[var(--ink)] font-bold">{s.step}</span>
                </div>
                <h3 className="font-semibold text-[var(--ink)] mb-1">{s.title}</h3>
                <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 border-t border-[var(--hairline)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mb-4">Ready to get started?</h2>
          <p className="text-[var(--ink-soft)] text-base mb-8">Browse engraved products or get a custom quote for your business.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C67A6F] text-white font-semibold text-sm rounded-sm hover:bg-[#B0675D] transition-all">
              Browse the Shop
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link href="/services/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--ink)]/40 text-[var(--ink)] font-semibold text-sm rounded-sm hover:bg-[var(--ink)]/5 transition-all">
              Get a Quote
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <a href={getSmsLink()} className="inline-block mt-4 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors text-sm">
            Or just text me &middot; {siteInfo.phone}
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
