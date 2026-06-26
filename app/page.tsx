import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, ArrowDownIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SHOP_CATEGORIES } from '@/lib/categories'
import { BASIC } from '@/lib/pricing'
import { shopTestimonials } from '@/lib/testimonials'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import CategoryCard from '@/components/CategoryCard'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import TrustedBy from '@/components/TrustedBy'
import ContactForm from '@/components/ContactForm'
import RotatingHeroBg from '@/components/RotatingHeroBg'
import ItemScroller from '@/components/ItemScroller'
import GlassImage from '@/components/shop/GlassImage'
import RotatingTagline from '@/components/RotatingTagline'
import VurmzLogo from '@/components/VurmzLogo'

// Single-page homepage: one brand, one scroll — shop first, then the anchored
// "For businesses" half, then contact. Replaced the old split chooser.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const CONSUMER_CATEGORIES = SHOP_CATEGORIES.filter(cat => {
  if (cat.pricingType === 'signature') return true
  if (cat.pricingKey && cat.pricingKey in BASIC) {
    const data = BASIC[cat.pricingKey]
    return !('materials' in data)
  }
  return true
})

const WORK = [
  { src: '/portfolio/culinary-cleaver-engraved.jpg', label: 'Knife Engraving' },
  { src: '/portfolio/water-bottle-full-wrap.jpg', label: 'Full-Wrap Bottle' },
  { src: '/portfolio/eye-storm-hexagonal-mirror.jpg', label: 'Custom Mirror Art' },
  { src: '/portfolio/denver-map-glass-coaster.jpg', label: 'Glass Coaster' },
  { src: '/portfolio/macbook-engraving.jpg', label: 'MacBook Engraving' },
  { src: '/portfolio/clga-faceplate-closeup.jpg', label: 'Amp Faceplate' },
  { src: '/portfolio/tumbler-cherry-creek-37.jpg', label: 'Branded Tumbler' },
  { src: '/portfolio/pocket-knife-engraved.jpg', label: 'Pocket Knife' },
]

const B2B_LANES = [
  { h: 'Metal service tags', p: 'Stickers fall off. A fiber-laser mark in stainless outlives the equipment. Packs of 10 from $30.', href: '/services/metal-tags' },
  { h: 'Knife crews', p: 'I pick up the whole line’s knives and return them engraved next day. $25 single, $8/knife for full kitchens.', href: '/services/knife-engraving' },
  { h: 'Branded packs', p: 'Pens, coasters, keychains, metal cards. Stocked, engraved with your logo, delivered on a schedule.', href: '/services' },
  { h: 'Custom & one-off', p: 'Awards, signage, faceplates, jobsite tools. If your work needs a permanent mark, that’s my lane.', href: '/services/portfolio' },
]

export default function Page() {
  return (
    <div className="bg-[var(--page)] text-[var(--ink-soft)]" data-theme="shop">
      {/* Smooth anchor scrolling + let the color bands butt against their
          divider lines (override the global 2.5rem section gap on this page). */}
      <style dangerouslySetInnerHTML={{ __html: 'html{scroll-behavior:smooth}#home-sections>section+section{margin-top:0}' }} />

      <SiteHeader variant="shop" />
      <div id="home-sections">
        {/* ═══════════ HERO — animated teal VURMZ logo over rotating work photos ═══════════ */}
        <section className="relative px-4 pt-32 sm:pt-36 pb-12 sm:pb-14 text-center overflow-hidden">
          <RotatingHeroBg />
          <div className="relative z-10">
          <h1 className="sr-only">VURMZ Laser Engraving in {siteInfo.address}</h1>
          {/* Light mode: solid deep-teal wordmark on the airy paper hero. */}
          <div className="hero-logo-light mx-auto mb-6 justify-center">
            <VurmzLogo className="h-14 sm:h-[72px]" color="var(--ink)" />
          </div>
          {/* Dark mode: the signature animated teal gradient through the logo shape. */}
          <div className="hero-logo-anim relative h-14 sm:h-[72px] mx-auto mb-6 w-[280px]">
            <div className="relative" style={{ WebkitMaskImage: 'url(/images/vurmz-logo-text.png)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url(/images/vurmz-logo-text.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}>
              <div className="h-14 sm:h-[72px] w-full relative overflow-hidden">
                <div className="absolute w-24 h-24 rounded-full bg-[#2FA6C0] blur-[30px] opacity-80" style={{ animation: 'blob1 7s ease-in-out infinite', top: '-20%', left: '0%' }} />
                <div className="absolute w-20 h-20 rounded-full bg-[#9BDDE8] blur-[25px] opacity-80" style={{ animation: 'blob2 9s ease-in-out infinite', top: '-10%', left: '30%' }} />
                <div className="absolute w-28 h-28 rounded-full bg-[#4FBCD2] blur-[35px] opacity-70" style={{ animation: 'blob3 6s ease-in-out infinite', top: '-30%', left: '55%' }} />
                <div className="absolute w-20 h-20 rounded-full bg-[#AEE2EE] blur-[28px] opacity-80" style={{ animation: 'blob4 8s ease-in-out infinite', top: '0%', left: '75%' }} />
                <div className="absolute w-16 h-16 rounded-full bg-[#3892A6] blur-[22px] opacity-90" style={{ animation: 'blob5 10s ease-in-out infinite', top: '-15%', left: '15%' }} />
                <div className="absolute w-24 h-24 rounded-full bg-[#62C8D8] blur-[30px] opacity-70" style={{ animation: 'blob6 7.5s ease-in-out infinite', top: '-25%', left: '45%' }} />
                <div className="absolute w-16 h-16 rounded-full bg-[#1F8294] blur-[26px] opacity-80" style={{ animation: 'blob1 8.5s ease-in-out infinite reverse', top: '-5%', left: '60%' }} />
                <div className="absolute w-24 h-24 rounded-full bg-[#BCEAF2] blur-[32px] opacity-60" style={{ animation: 'blob3 9.5s ease-in-out infinite reverse', top: '-15%', left: '10%' }} />
                <div className="absolute w-16 h-16 rounded-full bg-[#7FCFD4] blur-[24px] opacity-90" style={{ animation: 'blob5 6.5s ease-in-out infinite reverse', top: '-25%', left: '40%' }} />
                <div className="absolute w-20 h-20 rounded-full bg-[#34879A] blur-[28px] opacity-75" style={{ animation: 'blob2 11s ease-in-out infinite reverse', top: '0%', left: '80%' }} />
              </div>
            </div>
            <style>{`
              @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,10px) scale(1.2)} 66%{transform:translate(-20px,-5px) scale(.9)} }
              @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,8px) scale(1.1)} 66%{transform:translate(25px,-10px) scale(.85)} }
              @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-12px) scale(.9)} 66%{transform:translate(-35px,6px) scale(1.15)} }
              @keyframes blob4 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,-8px) scale(1.1)} 66%{transform:translate(15px,12px) scale(.95)} }
              @keyframes blob5 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(35px,-6px) scale(1.15)} 66%{transform:translate(-15px,8px) scale(.9)} }
              @keyframes blob6 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-20px,10px) scale(.85)} 66%{transform:translate(30px,-8px) scale(1.2)} }
            `}</style>
          </div>

          <RotatingTagline
            accentColor="#C67A6F"
            className="text-[var(--hero-ink)] text-3xl sm:text-4xl lg:text-5xl mb-8 max-w-xl mx-auto"
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C67A6F] text-white font-semibold text-base rounded-sm hover:bg-[#B0675D] transition-colors puffy-btn"
            >
              Shop engraved goods
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <a
              href="#services"
              className="btn-hero-ghost inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base rounded-sm"
            >
              <ArrowDownIcon className="w-4 h-4" />
              For businesses
            </a>
          </div>
          </div>
        </section>

        {/* ═══════════ RECENT WORK — photos over the scrolling "ideas" backdrop ═══════════ */}
        <section className="relative band-teal-deep py-12 sm:py-14 overflow-hidden">
          {/* The "endless ideas" marquee, a faint background texture behind the
              photos. Edges fade via a mask so it dissolves cleanly on any band
              color (paper in light, teal in dark) with no dark smudges. */}
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
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-6">Recent work</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WORK.map((item) => (
                <div key={item.label} className="group relative aspect-square rounded-sm overflow-hidden puffy">
                  <GlassImage src={item.src} alt={item.label} depth="card" sizes="(max-width: 640px) 50vw, 25vw" className="absolute inset-0" />
                  <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium drop-shadow">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SHOP CATEGORIES (base teal band) ═══════════ */}
        <section className="band-teal border-t border-[var(--hairline)] py-12 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--ink)] text-center mb-8">Shop by category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CONSUMER_CATEGORIES.map((cat) => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS (dusty coral band) ═══════════ */}
        <section className="bg-[#B0675D] border-t border-[var(--hairline)] py-14 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-8">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { n: 1, h: 'Pick or text', p: 'Buy a ready product from the shop, or text me to engrave something you bring, from $35.' },
                { n: 2, h: 'Approve your proof', p: 'Before anything is cut, I send a photo. Nothing runs until you say go.' },
                { n: 3, h: 'Delivered to you', p: 'Hand-delivered free across the south Denver metro ($100+), or shipped if you’re farther out.' },
              ].map((step) => (
                <div key={step.n}>
                  <div className="w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center mb-3 mx-auto puffy">
                    <span className="text-white font-bold">{step.n}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{step.h}</h3>
                  <p className="text-white/85 text-sm leading-relaxed">{step.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SERVICES — the anchored business half ═══════════ */}
        <section id="services" className="relative band-teal-deep border-t border-[var(--hairline)] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.25em] uppercase mb-3">For your work</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-4">
              Laser engraving services<br />
              <span className="text-[var(--ink-soft)]">for businesses in the Denver metro.</span>
            </h2>
            <p className="text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
              Posted prices. Most jobs in 24 to 72 hours. Hand-delivered across the metro.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {B2B_LANES.map((lane) => (
                <Link
                  key={lane.h}
                  href={lane.href}
                  className="group bg-[var(--surface)] border border-[var(--hairline)] rounded-sm p-6 hover:border-vurmz-teal/40 transition-colors puffy"
                >
                  <h3 className="font-semibold text-[var(--ink)] mb-2 flex items-center justify-between">
                    {lane.h}
                    <ArrowRightIcon className="w-4 h-4 text-[var(--eyebrow)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{lane.p}</p>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all puffy-btn"
              >
                Everything for business
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getSmsLink('Hi, I have a business engraving question')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cream text-vurmz-dark font-semibold text-sm rounded-sm hover:bg-vurmz-cream-hover transition-all puffy-btn"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text {siteInfo.phone}
              </a>
            </div>

            <div className="mt-12 border-t border-[var(--hairline)] pt-8">
              <TrustedBy theme="services" />
            </div>
          </div>
        </section>

        {/* ═══════════ ABOUT (oatmeal band, dark text) ═══════════ */}
        <section className="bg-[var(--surface)] border-t border-black/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm puffy-light">
                <Image src="/images/zach.jpeg" alt={`${siteInfo.founder.name}, owner of VURMZ`} fill className="object-cover" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-mono text-white/80 tracking-wider uppercase drop-shadow">{siteInfo.founder.name} &middot; Owner</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--ink)] tracking-[0.2em] uppercase mb-4">Who I Am</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight leading-tight mb-4">
                  No department.<br /><span className="text-[var(--ink)]/50">Just me.</span>
                </h2>
                <p className="text-[#4f5d5b] text-base leading-relaxed mb-4">
                  I&apos;m {siteInfo.founder.name}, and I run VURMZ out of {siteInfo.city}. You text me, I quote you, I engrave it, and I hand it to you. No middlemen at any step.
                </p>
                <Link href="/about" className="inline-flex items-center gap-2 text-[#B0675D] font-semibold text-sm hover:gap-3 transition-all">
                  About VURMZ
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS (base teal band) ═══════════ */}
        <section className="band-teal border-t border-[var(--hairline)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <TestimonialCarousel testimonials={shopTestimonials} theme="services" />
          </div>
        </section>

        {/* ═══════════ CONTACT (darker teal band) ═══════════ */}
        <section id="contact" className="band-teal-deep border-t border-[var(--hairline)] scroll-mt-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <p className="text-xs font-mono text-[var(--eyebrow)] tracking-[0.2em] uppercase mb-3 text-center">Contact</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight mb-2 text-center">
              Questions? Send it.
            </h2>
            <p className="text-[var(--ink-soft)] text-sm text-center mb-8">
              Or skip the form and text me at{' '}
              <a href={getSmsLink()} className="text-[var(--eyebrow)] font-semibold hover:underline">{siteInfo.phone}</a>
              , that&apos;s usually faster.
            </p>
            <ContactForm />
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  )
}
