import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { aboutContent, aboutMeta } from '@/lib/about'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'About',
  description: aboutMeta.description,
  alternates: { canonical: '/about' },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

// Short, on purpose (2026-09-30). Direct. Local. Fast. Unusual
// items welcome. His name. That is the whole page.
const FACTS = [
  { h: 'Direct', p: 'Text me what you want. You get a number the same day.' },
  { h: 'Local', p: `${siteInfo.city}, most of my life. I drive the south Denver metro myself.` },
  { h: 'Fast', p: 'A number the same day. Most pieces back in 24 to 72 hours.' },
  { h: 'Unusual items welcome', p: 'Metal, wood, glass, leather, slate, plastic. If it is solid, it takes a mark.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen text-[var(--ink-soft)]" data-theme="shop">
      <SiteHeader variant="shop" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 md:gap-12 items-start">
          <div className="relative aspect-[4/5] max-w-[420px] rounded-[var(--r-panel)] overflow-hidden border border-[var(--hairline)]">
            <Image src={aboutContent.image} alt={`${siteInfo.founder.name}, who runs VURMZ`} fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" priority />
          </div>

          <div>
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--feature)] mb-3">About</p>
            <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>
              I&rsquo;m {siteInfo.founder.name}. VURMZ is me and a couple of lasers in {siteInfo.city}.
            </h1>
            <p className="mt-5 max-w-[52ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
              I started making custom cards for another project, taught myself the machine, and it did not stop. VURMZ was a nickname in high school. Now it is the name on the invoices.
            </p>

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {FACTS.map(f => (
                <div key={f.h} className="rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] p-5">
                  <dt className="text-[length:var(--step-body)] text-[var(--ink)]" style={display}>{f.h}</dt>
                  <dd className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">{f.p}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-[15px] text-[var(--ink-soft)]">
              Have something to engrave?{' '}
              <Link href="/engrave" className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">Send a photo</Link>
              {' '}or text me at{' '}
              <a href={getSmsLink()} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">{siteInfo.phone}</a>. It goes straight to me.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
