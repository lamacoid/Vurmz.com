import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'About VURMZ | Local Laser Engraving | Centennial Colorado',
  description: `Meet ${siteInfo.founder.name}, owner of ${siteInfo.legalName}. Colorado native, ${siteInfo.city} local, chef, and laser engraver serving the Denver metro area.`,
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16 sm:py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse 60% 50% at 30% 40%, rgba(60,185,178,0.12) 0%, transparent 60%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-[13px] text-gray-400 border border-white/[0.08] bg-white/[0.03]">
              {siteInfo.city}, {siteInfo.state}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              About
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl">
              I&apos;m Zach. Chef, dad, Colorado native. Based in Centennial.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-24 bg-[#0d1b1a] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">The Short Version</h2>
              <div className="space-y-4 text-gray-400 text-[15px] leading-relaxed">
                <p>
                  I fell into laser engraving while working on another business idea. Needed some custom pieces made and realized there was no good local option for small quantities. Either pay a fortune, wait weeks for shipping, or order way more than you need. That&apos;s broken.
                </p>
                <p>
                  So I bought a laser. Then another. And another. Five lasers later, I&apos;ve built a hyperlocal shop right here in Centennial that serves my neighbors the way they deserve: same-day turnaround, hand-delivered, no minimums, and direct access to the owner.
                </p>
                <p>
                  The strategy is density over distance. I&apos;m not trying to be the cheapest nationwide. I&apos;m trying to be the default shop for every office park, law firm, restaurant, and contractor within a 10-minute drive. The dentist recommends me to the accountant next door. They tell the restaurant downstairs. I become the standard—not because I&apos;m the cheapest, but because I&apos;m right here, fast, and the quality is clean.
                </p>
                <p>
                  The bigger dream is a full makerspace where small businesses can access all kinds of equipment they wouldn&apos;t normally have—lasers, large format printing, CNC, the works. That&apos;s still the goal. But you have to start somewhere.
                </p>
                <p>
                  I&apos;m also a chef. Been cooking in Denver for over 15 years. Between that and this, I stay pretty busy. But I like it that way.
                </p>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.06]">
              <Image
                src="/images/zach.jpeg"
                alt="Zach and his son in the Colorado mountains"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-vurmz-dark py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(60,185,178,0.15) 0%, transparent 60%)',
        }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to Order?
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl mb-8">
            Build your order online or text me directly. Same-day response.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 bg-vurmz-teal text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-vurmz-teal-dark transition-all shadow-lg shadow-vurmz-teal/20"
            >
              Start Your Order
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a
              href={getSmsLink()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border border-white/[0.12] text-gray-300 hover:text-white hover:border-white/[0.25] transition-all"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Text {siteInfo.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
