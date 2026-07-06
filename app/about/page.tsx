import Image from 'next/image'
import type { Metadata } from 'next'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { aboutContent, aboutMeta } from '@/lib/about'
import Breadcrumbs from '@/components/Breadcrumbs'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'About',
  description: aboutMeta.description,
  alternates: { canonical: '/about' },
}

// The About page, plated on the same cream menu card as the shop.
// Zach's story in his own words, the photo framed, the pillars as three
// words. No value cards, no manufactured warmth, no block of color.
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--ink-soft)]">
      <SiteHeader variant="services" />

      <section className="pt-24 sm:pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'About' }]} theme="landing" />

          {/* The card: everything lives on it, like the menu. */}
          <div className="mt-6 bg-[var(--surface)] border border-[var(--hairline)] rounded-sm shadow-sm px-5 sm:px-10 py-8 sm:py-10">
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-3">About</p>
            <h1
              className="text-3xl sm:text-4xl text-[var(--ink)] tracking-tight leading-tight max-w-2xl"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', textWrap: 'balance' }}
            >
              {aboutContent.headline}
            </h1>

            <div className="mt-6 border-t-2 border-[var(--ink)]/25" aria-hidden />
            <div className="mt-[3px] border-t border-[var(--ink)]/25" aria-hidden />

            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-12 mt-10 items-start">
              {/* The photo, framed like a plate. */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--page)]">
                <Image src={aboutContent.image} alt={`${siteInfo.founder.name}, owner of VURMZ`} fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono text-white/85 tracking-[0.2em] uppercase drop-shadow">
                  {siteInfo.founder.name} &middot; Owner
                </span>
              </div>

              <div className="space-y-5">
                {aboutContent.storyParagraphs.map((p, i) => (
                  <p key={i} className="text-[var(--ink-soft)] text-base leading-relaxed">{p}</p>
                ))}
              </div>
            </div>

            {/* The pillars: three words, no explaining. */}
            <div className="mt-12 flex items-center gap-4">
              <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
              <p
                className="text-xl sm:text-2xl font-semibold text-[var(--ink)] tracking-tight whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                {aboutContent.pillars}
              </p>
              <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
            </div>

            {/* How it works: the one genuinely useful section, kept. */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
                <h2 className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">How it works</h2>
                <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                {aboutContent.process.map(s => (
                  <div key={s.step}>
                    <p className="font-semibold text-[var(--ink)] text-sm">
                      <span className="text-[var(--eyebrow)] font-mono mr-1.5">{s.step}.</span>
                      {s.title}
                    </p>
                    <p className="text-[var(--ink-soft)] text-sm leading-snug mt-1">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-10 pt-5 border-t border-[var(--hairline)] text-xs text-[var(--ink-soft)] text-center">
              <a href={getSmsLink()} className="text-[var(--eyebrow)] font-semibold hover:underline">
                Text {siteInfo.phone}
              </a>{' '}
              and it goes straight to me.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
