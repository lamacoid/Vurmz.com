import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'About VURMZ | Local Laser Engraving | Centennial Colorado',
  description: `Meet ${siteInfo.founder.name}, owner of ${siteInfo.legalName}. Colorado native, ${siteInfo.city} local, chef, and laser engraver serving the Denver metro area.`,
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-vurmz-powder mb-4">
              <MapPinIcon className="h-5 w-5" />
              <span>Centennial, Colorado</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About
            </h1>
            <p className="text-xl text-gray-300">
              I&apos;m Zach. Chef, dad, Colorado native. Based in Centennial.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-[#1f2523]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">The Short Version</h2>
              <div className="space-y-4 text-gray-400">
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
            <div className="relative aspect-square overflow-hidden rounded-lg">
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
      <section className="bg-vurmz-teal py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Build your order online or text me directly. Same-day response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="bg-vurmz-dark text-white px-8 py-4 font-semibold text-lg hover:bg-vurmz-dark/80 transition-colors inline-flex items-center justify-center gap-2 rounded-xl"
            >
              Start Your Order
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a
              href={getSmsLink()}
              className="border-2 border-white/30 text-white px-8 py-4 font-semibold text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center rounded-xl"
            >
              Text {siteInfo.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
