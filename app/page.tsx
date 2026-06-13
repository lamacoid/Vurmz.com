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
import SiteHero from '@/components/SiteHero'
import CategoryCard from '@/components/CategoryCard'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import TrustedBy from '@/components/TrustedBy'
import ContactForm from '@/components/ContactForm'
import GlassImage from '@/components/shop/GlassImage'

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
    <div className="bg-[#1f4f57] text-gray-300" data-theme="shop">
      {/* Smooth anchor scrolling, this page only */}
      <style dangerouslySetInnerHTML={{ __html: 'html{scroll-behavior:smooth}' }} />

      <SiteHeader variant="shop" />
      <main id="main-content">
        {/* ═══════════ HERO — one brand, two doors ═══════════ */}
        <SiteHero eyebrow="Centennial, CO" accent="coral" baseColor="#1f4f57">
          <h1 className="sr-only">VURMZ — Laser Engraving in {siteInfo.address}</h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-7 max-w-lg mx-auto">
            Gifts, knives, tumblers, decor — engraved and hand-delivered across the south Denver metro. One person, start to finish.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E95C4E] text-white font-semibold text-base rounded-sm hover:bg-[#D24A3D] transition-colors shadow-lg shadow-black/20"
            >
              Shop engraved goods
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#6BB8B2]/40 text-[#6BB8B2] font-semibold text-base rounded-sm hover:bg-[#6BB8B2]/10 transition-colors"
            >
              <ArrowDownIcon className="w-4 h-4" />
              For businesses
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-4">Prices on the site. No quote forms that go nowhere.</p>
        </SiteHero>

        {/* ═══════════ RECENT WORK ═══════════ */}
        <section className="pb-10 sm:pb-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-mono text-[#6BB8B2] tracking-[0.2em] uppercase mb-6">Recent work</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WORK.map((item) => (
                <div key={item.label} className="group relative aspect-square rounded-sm overflow-hidden">
                  <GlassImage src={item.src} alt={item.label} depth="card" sizes="(max-width: 640px) 50vw, 25vw" className="absolute inset-0" />
                  <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium drop-shadow">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SHOP CATEGORIES ═══════════ */}
        <section className="pb-10 sm:pb-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#F0E6D3] text-center mb-8">Shop by category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CONSUMER_CATEGORIES.map((cat) => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section className="pb-12 sm:pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#F0E6D3] text-center mb-8">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { n: 1, h: 'Pick or text', p: 'Order from the shop, or use Bring Your Own — $35 to engrave something you already have.' },
                { n: 2, h: 'Approve the proof', p: 'I send a proof photo before anything runs. Nothing engraves until you sign off.' },
                { n: 3, h: 'Hand-delivered', p: 'I bring it to your door across the south Denver metro. Free over $100.' },
              ].map((step) => (
                <div key={step.n}>
                  <div className="w-10 h-10 rounded-full bg-[#6BB8B2]/15 border border-[#6BB8B2]/20 flex items-center justify-center mb-3 mx-auto">
                    <span className="text-[#6BB8B2] font-bold">{step.n}</span>
                  </div>
                  <h3 className="font-semibold text-[#F0E6D3] mb-1">{step.h}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SERVICES — the anchored business half ═══════════ */}
        <section id="services" className="relative bg-vurmz-dark border-t border-white/[0.08] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <p className="text-xs font-mono text-vurmz-teal tracking-[0.25em] uppercase mb-3">For your work</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream tracking-tight leading-tight mb-4">
              Laser engraving services<br />
              <span className="text-gray-500">for businesses in the Denver metro.</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
              Next-day turnaround. Hand-to-hand delivery. Posted pricing — the competitors make you fill out a quote form to learn a number. I don&apos;t.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {B2B_LANES.map((lane) => (
                <Link
                  key={lane.h}
                  href={lane.href}
                  className="group bg-white/[0.03] border border-white/[0.08] rounded-sm p-6 hover:border-vurmz-teal/40 transition-colors"
                >
                  <h3 className="font-semibold text-cream mb-2 flex items-center justify-between">
                    {lane.h}
                    <ArrowRightIcon className="w-4 h-4 text-vurmz-teal opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{lane.p}</p>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
              >
                Everything for business
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getSmsLink('Hi, I have a business engraving question')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-vurmz-cream text-vurmz-dark font-semibold text-sm rounded-sm hover:bg-vurmz-cream-hover transition-all"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Text {siteInfo.phone}
              </a>
            </div>

            <div className="mt-12 border-t border-white/[0.06] pt-8">
              <TrustedBy theme="services" />
            </div>
          </div>
        </section>

        {/* ═══════════ ABOUT ═══════════ */}
        <section className="bg-vurmz-dark border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image src="/images/zach.jpeg" alt={`${siteInfo.founder.name}, owner of VURMZ`} fill className="object-cover" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-mono text-cream/60 tracking-wider uppercase">{siteInfo.founder.name} &middot; Owner</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-4">Who I Am</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight leading-tight mb-4">
                  No department.<br /><span className="text-gray-500">Just me.</span>
                </h2>
                <p className="text-gray-400 text-base leading-relaxed mb-4">
                  I&apos;m {siteInfo.founder.name}, and I run VURMZ out of {siteInfo.city}. You text me, I quote you, I engrave it, and I hand it to you. No middlemen at any step.
                </p>
                <Link href="/about" className="inline-flex items-center gap-2 text-vurmz-teal font-semibold text-sm hover:gap-3 transition-all">
                  About VURMZ
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section className="bg-vurmz-dark border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <TestimonialCarousel testimonials={shopTestimonials} theme="services" />
          </div>
        </section>

        {/* ═══════════ CONTACT ═══════════ */}
        <section id="contact" className="bg-vurmz-dark border-t border-white/[0.06] scroll-mt-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <p className="text-xs font-mono text-vurmz-teal tracking-[0.2em] uppercase mb-3 text-center">Contact</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream tracking-tight mb-2 text-center">
              Questions? Send it.
            </h2>
            <p className="text-gray-400 text-sm text-center mb-8">
              Or skip the form and text me at{' '}
              <a href={getSmsLink()} className="text-vurmz-teal font-semibold hover:underline">{siteInfo.phone}</a>
              {' '}— that&apos;s usually faster.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
