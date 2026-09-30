import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, DELIVERY, CATALOG } from '@/lib/pricing'
import { portfolioItems } from '@/lib/portfolio'
import { aboutContent } from '@/lib/about'
import { SHELF, DOORS } from '@/lib/shop-doors'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ContactForm from '@/components/ContactForm'
import HowItWorks from '@/components/HowItWorks'
import CanYouEngraveThis from '@/components/CanYouEngraveThis'
import EtchArt from '@/components/shop/EtchArt'
import { DoorEtching } from '@/components/shop/DoorEtchings'

/**
 * The homepage, rebuilt 2026-09-30 around the ways to use VURMZ instead of
 * everything it sells. Three paths up top, proof, then the one that
 * matters most: the thing you already own, photographed and priced.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const glass = 'rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] backdrop-blur-md'
const eyebrow = 'text-[11px] font-mono tracking-[0.3em] uppercase text-[#7FCFD4]'

const PATHS = [
  {
    h: 'I already have something',
    p: 'A knife, a laptop, a flask. Send a photo, get a number today.',
    href: '/engrave',
    cta: 'Engrave my stuff',
  },
  {
    h: 'Shop things to engrave',
    p: 'Coasters, boards, knives, tumblers, tags. Priced, in stock, your words on them.',
    href: '/shop',
    cta: 'See the shop',
  },
  {
    h: 'I am ordering for a business',
    p: 'Pens, cards, labels, coasters, knife crews. Posted prices by the run.',
    href: '/services',
    cta: 'Business pricing',
  },
]

// Eight pieces, the strongest proof, straight from the portfolio.
const WORK_SLUGS = ['culinary-cleaver', 'macbook-personalization', 'denver-map-mirror', 'medieval-water-bottle', 'pocket-knife', 'clga-amp-faceplate', 'branded-tumbler', 'eye-storm-mirror']
const WORK = WORK_SLUGS.map(s => portfolioItems.find(p => p.slug === s)).filter((p): p is (typeof portfolioItems)[number] => !!p)

const SHOP = [SHELF, ...DOORS.filter(d => d.key !== 'business')]

const BUSINESS_ROWS = [
  ['Setup fees', 'None. A logo file is a logo file.'],
  ['Turnaround', 'Most runs in 24 to 72 hours.'],
  ['Delivery', `Hand-delivered across the ${DELIVERY.area}. Every ${siteInfo.deliveryRunDay} for standing accounts.`],
  ['Small orders', `Yes. Ten pens is a run. ${CATALOG.knife.fullKitchen.perKnife ? `Knife crews from $${CATALOG.knife.fullKitchen.perKnife} a blade.` : ''}`.trim()],
  ['Your logo', 'Stays on file. A reorder is a text with a count.'],
  ['Prices', 'Posted on the site. Priced by the run, and the tier holds between reorders.'],
  ['Terms', 'NET-30 on standing accounts.'],
]

const WHY = [
  { h: 'Local', p: `Centennial. I drive the south Denver metro myself, free over $${DELIVERY.freeThreshold}.` },
  { h: 'One person', p: 'You text me. I answer, I quote it, I engrave it, I hand it to you.' },
  { h: 'Fast', p: 'A number the same day. Most pieces back in 24 to 72 hours.' },
  { h: 'Unusual items welcome', p: 'Metal, wood, glass, leather, slate, plastic. If it is solid, it takes a mark.' },
]

export default function Page() {
  return (
    <div className="text-[var(--ink-soft)]" data-theme="shop">
      <style dangerouslySetInnerHTML={{ __html: 'html{scroll-behavior:smooth}' }} />
      <SiteHeader variant="shop" />

      {/* 1. Hero: the line, and three ways in. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-12 sm:pb-16">
        <p className={`${eyebrow} mb-4`}>Laser engraving · {siteInfo.address}</p>
        <h1 className="text-[length:var(--step-display)] sm:text-[clamp(3rem,7vw,5.5rem)] leading-[1.02] text-white/95 max-w-[14ch]" style={display}>
          Put your name on something.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
          One person in Centennial with industrial engraving equipment. Posted prices, a number the same day, hand-delivered.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {PATHS.map(x => (
            <Link key={x.href} href={x.href} className={`group ${glass} hover:bg-white/[0.07] hover:border-[#7FCFD4]/50 p-5 sm:p-6 flex flex-col transition-colors duration-[var(--t-hover)]`}>
              <span className="text-[length:var(--step-panel)] leading-tight text-white/95" style={display}>{x.h}</span>
              <span className="mt-2 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">{x.p}</span>
              <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#7FCFD4] group-hover:text-white transition-colors">
                {x.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Work strip: proof, fast. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="flex items-baseline justify-between mb-4">
          <p className={eyebrow}>Recent work</p>
          <Link href="/services/portfolio" className="text-[13px] text-[var(--ink-soft)] hover:text-white transition-colors">All the work</Link>
        </div>
        <ul className="grid grid-cols-4 lg:grid-cols-8 gap-2 list-none p-0 m-0">
          {WORK.map(w => (
            <li key={w.slug}>
              <Link href={`/services/portfolio/${w.slug}`} className="group block">
                <span className="relative block aspect-square rounded-[var(--r-tile)] overflow-hidden border border-white/10">
                  <Image src={w.src} alt={w.label} fill sizes="(max-width: 1024px) 25vw, 12vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                </span>
                <span className="block mt-1.5 text-[11px] leading-snug text-[var(--ink-soft)] group-hover:text-white transition-colors line-clamp-1">{w.material}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Already own it? The primary thing. */}
      <section id="engrave" className="border-y border-white/10 bg-[#0D2F35]/40 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-12 items-start">
          <div>
            <p className={`${eyebrow} mb-3`}>Already own it?</p>
            <h2 className="text-[length:var(--step-section)] leading-[1.05] text-white/95" style={display}>
              Knife. Tool. Laptop. Flask. Weird piece of metal from your garage.
            </h2>
            <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)] max-w-[44ch]">
              Send me a photo and I will tell you if I can mark it and what it costs. One piece is ${SIGNATURE.startingAt} for most jobs.
            </p>
            <p className="mt-4 text-[14px] text-[var(--ink-soft)]">
              <Link href="/engrave" className="text-[#7FCFD4] hover:text-white transition-colors">What people bring, and what the price covers.</Link>
            </p>
          </div>
          <CanYouEngraveThis compact />
        </div>
      </section>

      {/* 4. Shop: six categories, not the taxonomy. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[length:var(--step-section)] leading-tight text-white/95" style={display}>The shop</h2>
          <Link href="/shop" className="text-[13px] text-[var(--ink-soft)] hover:text-white transition-colors">Everything</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SHOP.map(d => (
            <Link key={d.key} href={`/shop/${d.key}`} className={`group ${glass} hover:bg-white/[0.07] hover:border-[#7FCFD4]/50 overflow-hidden transition-colors duration-[var(--t-hover)]`}>
              <span className="relative flex items-center justify-center aspect-[4/3] sm:aspect-[16/9]">
                {d.art ? (
                  <EtchArt src={d.art} className="w-[56%] max-w-[220px] aspect-[4/3] transition-transform duration-500 ease-out group-hover:-translate-y-1" />
                ) : (
                  <DoorEtching kind={d.etch} className="w-[54%] max-w-[200px] text-[#DED6C3]/85 group-hover:text-[#7FCFD4] transition-colors" />
                )}
              </span>
              <span className="block border-t border-white/10 p-3 sm:p-4">
                <span className="block text-[length:var(--step-body)] leading-tight text-white/95" style={display}>{d.name}</span>
                <span className="hidden sm:block mt-1 text-[13px] leading-snug text-[var(--ink-soft)]">{d.line}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Business: the procurement table. */}
      <section id="business" className="border-y border-white/10 bg-[#0D2F35]/40 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-12 items-start">
          <div>
            <p className={`${eyebrow} mb-3`}>For a business</p>
            <h2 className="text-[length:var(--step-section)] leading-[1.05] text-white/95" style={display}>
              Pens, cards, labels, coasters, knife crews.
            </h2>
            <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)] max-w-[40ch]">
              Priced by the run. Send a count and a logo, you get a number today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services" className="inline-flex items-center h-11 px-6 rounded-[var(--r-control)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-[14.5px] font-semibold transition-colors">
                Business pricing
              </Link>
              <a href={getSmsLink('Hi Zach, I have a business order. ')} className="inline-flex items-center h-11 px-6 rounded-[var(--r-control)] border border-white/20 hover:border-[#7FCFD4]/60 text-[var(--ink)] text-[14.5px] font-semibold transition-colors">
                Text a count
              </a>
            </div>
          </div>
          <dl className={`${glass} divide-y divide-white/10`}>
            {BUSINESS_ROWS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[160px_minmax(0,1fr)] gap-4 px-4 sm:px-5 py-3.5">
                <dt className="text-[12px] font-mono uppercase tracking-[0.14em] text-[#7FCFD4] pt-0.5">{k}</dt>
                <dd className="text-[14.5px] leading-relaxed text-[var(--ink)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6. How it works: the one shared version. */}
      <HowItWorks />

      {/* 7. Why VURMZ. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {WHY.map(w => (
            <div key={w.h} className={`${glass} p-5`}>
              <p className="text-[length:var(--step-body)] text-white/95" style={display}>{w.h}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">{w.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Zach, short. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className={`${glass} grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-8 items-center p-5 sm:p-6`}>
          <div className="relative aspect-square max-w-[220px] rounded-[var(--r-tile)] overflow-hidden border border-white/10">
            <Image src={aboutContent.image} alt={`${siteInfo.founder.name}, who runs VURMZ`} fill sizes="220px" className="object-cover" />
          </div>
          <div>
            <p className={`${eyebrow} mb-2`}>Who you are texting</p>
            <p className="text-[length:var(--step-panel)] leading-tight text-white/95" style={display}>
              I&rsquo;m {siteInfo.founder.name}. I run VURMZ out of {siteInfo.city}, and I handle every job myself.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              You text me, I quote it, I engrave it, I hand it to you. No department, no middle step.{' '}
              <Link href="/about" className="text-[#7FCFD4] hover:text-white transition-colors">More about VURMZ.</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 9. Contact. */}
      <section id="contact" className="border-t border-white/10 bg-[#0D2F35]/40 scroll-mt-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <p className={`${eyebrow} mb-3 text-center`}>Contact</p>
          <h2 className="text-[length:var(--step-section)] text-white/95 text-center" style={display}>Questions? Send it.</h2>
          <p className="mt-2 mb-8 text-[14px] text-[var(--ink-soft)] text-center">
            Or skip the form and text me at{' '}
            <a href={getSmsLink()} className="text-[#7FCFD4] hover:text-white transition-colors">{siteInfo.phone}</a>. That is usually faster.
          </p>
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
