import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SIGNATURE, SOURCING, CATALOG } from '@/lib/pricing'
import { portfolioItems } from '@/lib/portfolio'
import { SHELF, DOORS } from '@/lib/shop-doors'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ContactForm from '@/components/ContactForm'
import HowItWorks from '@/components/HowItWorks'
import TrustedBy from '@/components/TrustedBy'
import ItemScroller from '@/components/ItemScroller'
import GlassImage from '@/components/shop/GlassImage'
import RotatingTagline from '@/components/RotatingTagline'
import CanYouEngraveThis from '@/components/CanYouEngraveThis'
import RotatingHeroBg from '@/components/RotatingHeroBg'
import VurmzLogo from '@/components/VurmzLogo'
import { ETCH } from '@/lib/shop-art'
import EtchArt from '@/components/shop/EtchArt'
import { DoorEtching } from '@/components/shop/DoorEtchings'

/**
 * The homepage: the older one-scroll page, with the new way in at the
 * top (2026-10-01). The rotating line, three paths, then the thing you
 * already own (or the thing I go and get for you), then the work, the
 * shop by category, how it works, the business half, me, contact.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const card = 'rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)]'
const eyebrow = 'text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]'
// A glassy teal break on the paper: the reserve's room, used as a band.
const roomBand = 'room relative overflow-hidden'
const bloom = { backgroundImage: 'radial-gradient(ellipse 70% 60% at 15% 0%, rgba(127,207,212,0.16) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(13,47,53,0.85) 0%, transparent 60%)' }

const PATHS = [
  { h: 'I already have something', p: 'A knife, a laptop, a flask. Send a photo, get a number today.', href: '/engrave', cta: 'Engrave my stuff' },
  { h: 'Shop things to engrave', p: 'Coasters, boards, knives, tumblers, tags. Priced, in stock, your words on them.', href: '/shop', cta: 'See the shop' },
  { h: 'I am ordering for a business', p: 'Pens, cards, labels, coasters, knife crews. Posted prices by the run.', href: '/services', cta: 'Business pricing' },
]

const WORK_SLUGS = ['wolverines-knife', 'culinary-cleaver', 'medieval-water-bottle', 'denver-map-mirror', 'macbook-personalization', 'clga-amp-faceplate', 'branded-tumbler', 'pocket-knife']
const WORK = WORK_SLUGS.map(s => portfolioItems.find(p => p.slug === s)).filter((p): p is (typeof portfolioItems)[number] => !!p)

const SHOP = [SHELF, ...DOORS.filter(d => d.key !== 'business')]

const B2B_LANES = [
  { h: 'Equipment labels', p: `Anodized aluminum, 3M backed, a mark that outlives the equipment. $${CATALOG.serviceTags.aluminumBase * CATALOG.serviceTags.pack} per ${CATALOG.serviceTags.pack}.`, href: '/services/metal-tags' },
  { h: 'Knife crews', p: `I pick up the whole line's knives and return them engraved next day. $${CATALOG.knife.crew.perKnife} a knife at ${CATALOG.knife.crew.minQty} or more, $${CATALOG.knife.fullKitchen.perKnife} for a full kitchen.`, href: '/services/knife-engraving' },
  { h: 'Metal cards', p: 'Sixteen layouts, fourteen colors. Design it on the page and the laser file writes itself.', href: '/shop/p/anodized-aluminum-wallet-card' },
  { h: 'Plates, panels, one-offs', p: 'Faceplates, valve tags, signage, jobsite tools. Send a photo and a count, you get a number today.', href: '/services#lanes' },
  { h: 'Standing accounts', p: `Logo on file, free delivery every ${siteInfo.deliveryRunDay}, NET-30, 15% off standing orders.`, href: '/services#account' },
]

export default function Page() {
  return (
    <div className="bg-[var(--page)] text-[var(--ink-soft)]" data-theme="shop">
      <style dangerouslySetInnerHTML={{ __html: 'html{scroll-behavior:smooth}' }} />
      <SiteHeader variant="shop" />

      {/* 1. Hero: the wordmark over the work, the rotating line, then three ways in. */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-10 sm:pb-14 overflow-hidden">
        <RotatingHeroBg />
        <div className="relative z-10 max-w-[1280px] mx-auto">
        <h1 className="sr-only">Laser engraving in {siteInfo.address}. Put your name, logo, or story on something.</h1>
        <div className="text-center">
          <div className="hero-logo-light mx-auto mb-6 justify-center">
            <VurmzLogo className="h-14 sm:h-[72px]" color="var(--ink)" />
          </div>
          <RotatingTagline
            accentColor="#C67A6F"
            className="text-[var(--hero-ink)] text-3xl sm:text-4xl lg:text-5xl mb-5 max-w-xl mx-auto"
          />
          <p className="mx-auto max-w-[52ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
            Industrial engraving equipment in Centennial. Posted prices, a number the same day, hand-delivered.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {PATHS.map(x => (
            <Link key={x.href} href={x.href} className={`group ${card} hover:border-[var(--feature)]/40 p-5 sm:p-6 flex flex-col transition-colors duration-[var(--t-hover)] puffy-light`}>
              <span className="text-[length:var(--step-panel)] leading-tight text-[var(--ink)]" style={display}>{x.h}</span>
              <span className="mt-2 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">{x.p}</span>
              <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#B0675D] group-hover:gap-3 transition-all">
                {x.cta}
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* 2. Bring your own thing. Have it, or let me go get it. The first teal break. */}
      <section id="engrave" className={`${roomBand} scroll-mt-28`} style={bloom}>
        <EtchArt tone="cream" src={ETCH.knife} className="absolute -right-10 -bottom-6 w-[420px] aspect-[4/3] opacity-[0.10] pointer-events-none" sizes="420px" />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-12 items-start">
          <div>
            <p className={`${eyebrow} mb-3`}>Bring your own thing</p>
            <h2 className="text-[length:var(--step-section)] leading-[1.05] text-[var(--ink)]" style={display}>
              Knife. Tool. Laptop. Flask. Weird piece of metal from your garage.
            </h2>
            <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)] max-w-[44ch]">
              Send me a photo and I will tell you if I can mark it and what it costs. One piece is ${SIGNATURE.startingAt} for most jobs.
            </p>
            <div className="mt-6 rounded-[var(--r-panel)] border border-[var(--glass-edge)] bg-[var(--glass)] p-5">
              <p className="text-[length:var(--step-body)] font-semibold text-[var(--ink)]">Do not have it yet? I will go get it.</p>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
                Tell me what you want and I order it, mark it, and bring it. One delivery instead of three: no waiting on a box, no handing it off, no second trip. The piece is at cost, what it costs to buy. ${SOURCING.reserveFee} covers everything else: finding it, marking it, bringing it.
              </p>
              <Link href="/shop/reserve" className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--eyebrow)] hover:gap-3 transition-all">
                What I find for people
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <CanYouEngraveThis compact />
        </div>
      </section>

      {/* 3. Recent work, photos over the scrolling "ideas" backdrop. */}
      <section className="relative py-14 sm:py-[72px] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none select-none flex flex-col justify-center"
          aria-hidden
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)',
          }}
        >
          <ItemScroller opacityScale={0.22} />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-6">
            <p className={eyebrow}>Recent work</p>
            <Link href="/services/portfolio" className="text-[13px] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">All the work</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WORK.map(item => (
              <Link key={item.slug} href={`/services/portfolio/${item.slug}`} className="group relative aspect-square rounded-sm overflow-hidden puffy-light block">
                <GlassImage src={item.src} alt={item.label} depth="card" sizes="(max-width: 640px) 50vw, 25vw" className="absolute inset-0" />
                <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-white text-xs font-medium drop-shadow">{item.material}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shop by category. */}
      <section className="border-t border-[var(--hairline)] py-14 sm:py-[72px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-[length:var(--step-section)] text-[var(--ink)]" style={display}>Shop by category</h2>
            <Link href="/shop" className="text-[13px] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">Everything</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {SHOP.map(d => (
              <Link key={d.key} href={`/shop/${d.key}`} className={`group ${card} hover:border-[var(--feature)]/40 overflow-hidden transition-colors duration-[var(--t-hover)] puffy-light`}>
                <span className="relative flex items-center justify-center aspect-[4/3] sm:aspect-[16/9] bg-[var(--glass-soft)]">
                  {d.art ? (
                    <EtchArt src={d.art} className="w-[56%] max-w-[220px] aspect-[4/3] transition-transform duration-500 ease-out group-hover:-translate-y-1" />
                  ) : (
                    <DoorEtching kind={d.etch} className="w-[54%] max-w-[200px] text-[var(--feature)] transition-colors" />
                  )}
                </span>
                <span className="block border-t border-[var(--hairline)] p-3 sm:p-4">
                  <span className="block text-[length:var(--step-body)] leading-tight text-[var(--ink)]" style={display}>{d.name}</span>
                  <span className="hidden sm:block mt-1 text-[13px] leading-snug text-[var(--ink-soft)]">{d.line}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How it works, the one shared version. */}
      <HowItWorks />

      {/* 6. Services, the anchored business half. The second teal break. */}
      <section id="services" className={`${roomBand} scroll-mt-16`} style={bloom}>
        <EtchArt tone="cream" src={ETCH.pen} className="absolute -right-8 top-6 w-[380px] aspect-[4/3] opacity-[0.10] pointer-events-none" sizes="380px" />
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <p className={`${eyebrow} mb-3`}>For your work</p>
          <h2 className="text-[length:var(--step-section)] text-[var(--ink)] tracking-tight leading-tight mb-4" style={display}>
            Things I make<br />
            <span className="text-[var(--ink-soft)]">for the businesses around here.</span>
          </h2>
          <p className="text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
            Posted prices. Delivered across the south metro.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {B2B_LANES.map(lane => (
              <Link key={lane.h} href={lane.href} className="group rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] p-6 hover:border-[var(--glass-edge)] hover:bg-[var(--glass)] transition-colors">
                <h3 className="font-semibold text-[var(--ink)] mb-2 flex items-center justify-between">
                  {lane.h}
                  <ArrowRightIcon className="w-4 h-4 text-[var(--eyebrow)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{lane.p}</p>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/services" className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--coral)] text-white font-semibold text-sm rounded-[var(--r-control)] hover:bg-[var(--coral-hover)] transition-colors puffy-btn">
              Everything for business
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={getSmsLink('Hi, I have a business engraving question')} className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--ink)]/35 text-[var(--ink)] font-semibold text-sm rounded-[var(--r-control)] hover:border-[var(--ink)] transition-colors">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text {siteInfo.phone}
            </a>
          </div>

          <div className="mt-12 border-t border-[var(--hairline)] pt-8">
            <TrustedBy theme="services" />
          </div>
        </div>
      </section>

      {/* 7. About. */}
      <section>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm puffy-light">
              <Image src="/images/zach.jpeg" alt={`${siteInfo.founder.name}, owner of VURMZ`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-mono text-white/80 tracking-wider uppercase drop-shadow">{siteInfo.founder.name} &middot; Owner</span>
              </div>
            </div>
            <div>
              <p className={`${eyebrow} mb-4`}>Who I am</p>
              <h2 className="text-[length:var(--step-section)] text-[var(--ink)] tracking-tight leading-tight mb-4" style={display}>
                I&apos;m {siteInfo.founder.name}.<br /><span className="text-[var(--ink)]/50">VURMZ is in {siteInfo.city}.</span>
              </h2>
              <p className="text-[var(--ink-soft)] text-base leading-relaxed mb-4">
                Text me what you want marked. You get a number the same day, and the finished piece comes to your door.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[#B0675D] font-semibold text-sm hover:gap-3 transition-all">
                About VURMZ
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact. */}
      <section id="contact" className="bg-[var(--surface)]/60 border-t border-[var(--hairline)] scroll-mt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <p className={`${eyebrow} mb-3 text-center`}>Contact</p>
          <h2 className="text-[length:var(--step-section)] text-[var(--ink)] tracking-tight mb-2 text-center" style={display}>
            Questions? Send it.
          </h2>
          <p className="text-[var(--ink-soft)] text-sm text-center mb-8">
            Or skip the form and text me at{' '}
            <a href={getSmsLink()} className="text-[var(--eyebrow)] font-semibold hover:underline">{siteInfo.phone}</a>
            . That is usually faster.
          </p>
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
