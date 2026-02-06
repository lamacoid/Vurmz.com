import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'Personalized Gifts & Awards | Laser Engraving | VURMZ Centennial CO',
  description: `Custom laser engraved gifts, trophies, team items, and awards. Baseball bats, pens, plaques, and personalized gifts for any occasion in ${siteInfo.city}.`,
  openGraph: {
    title: 'Personalized Gifts & Awards | Laser Engraving | VURMZ Centennial CO',
    description: `Custom laser engraved gifts, trophies, team items, and awards.`,
    url: `${siteInfo.url}/gifts`,
    siteName: siteInfo.name,
    type: 'website',
    locale: 'en_US',
  },
}

const categories = [
  { name: 'Sports Teams', emoji: '⚾' },
  { name: 'Trophies & Awards', emoji: '🏆' },
  { name: 'Signs & Plaques', emoji: '🪵' },
  { name: 'Graduations', emoji: '🎓' },
  { name: 'Personal Gifts', emoji: '🎁' },
]

const sportsTeam = [
  { name: 'Baseball Bats', price: 'From $25', desc: 'Player names, team logos, season records. Wood or aluminum.' },
  { name: 'Water Bottles', price: 'From $50', desc: 'Stainless steel with player names, numbers, team logo.' },
  { name: 'Team Plaques', price: 'From $35', desc: 'Roster boards, championship plaques, coach appreciation.' },
  { name: 'Individual Awards', price: 'From $15', desc: 'MVP, All-Star, Most Improved. Glass, wood, or metal.' },
]

const trophiesAwards = [
  { name: 'Glass Awards', price: 'From $20', desc: 'Crystal-look glass, perfect for corporate recognition.' },
  { name: 'Wood Plaques', price: 'From $25', desc: 'Classic walnut or oak. Engraved plates included.' },
  { name: 'Acrylic Trophies', price: 'From $18', desc: 'Modern look, custom shapes available.' },
  { name: 'Medals', price: 'From $8/ea', desc: 'Gold, silver, bronze. Custom text on back.' },
]

const signsPlayques = [
  { name: 'Wood Yard Signs', price: 'From $35', desc: 'Weather-resistant finish. Great for graduations, birthdays, real estate.' },
  { name: 'Address Plaques', price: 'From $40', desc: 'House numbers on wood or metal. Indoor or outdoor.' },
  { name: 'Memorial Plaques', price: 'From $30', desc: 'Benches, trees, gardens. Lasting tributes.' },
  { name: 'Business Signs', price: 'From $50', desc: 'Small shop signs, desk nameplates, door signs.' },
]

const personalGifts = [
  { name: 'Cutting Boards', price: 'From $45', desc: 'Family name, established date. Heirloom quality.' },
  { name: 'Pocket Knives', price: 'From $25', desc: 'Names, dates, short messages. Great for groomsmen.' },
  { name: 'Photo Frames', price: 'From $20', desc: 'Engraved wood frames with custom text.' },
  { name: 'Keepsake Boxes', price: 'From $30', desc: 'Jewelry boxes, memory boxes. Personalized lids.' },
]

const bulkItems = [
  { name: 'Water Bottles', price: '$50 ea', min: '5+', desc: 'Stainless steel, names or text' },
  { name: 'Coasters', price: '$4-6 ea', min: '5+', desc: 'Wood, slate, or steel' },
  { name: 'Keychains', price: '$4 ea', min: '5+', desc: 'Wood or metal options' },
  { name: 'Bottle Openers', price: '$5 ea', min: '5+', desc: 'Custom text engraved' },
]

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F7]">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F5EDE6]/80 via-transparent to-[#E8E0D8]/50" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#D4B896]/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#C9B8A8]/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[#A08060] font-medium tracking-[0.2em] text-sm mb-6 uppercase">
            Custom Engraved
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#3D3428] tracking-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Personalized Gifts<br />They&apos;ll Actually Keep
          </h1>
          <p className="text-lg text-[#6B5A48]/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Baseball bats, trophies, corporate gifts, personal keepsakes.
            Rush orders welcome. Same-day turnaround often possible.
          </p>

          {/* Category tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((c) => (
              <span
                key={c.name}
                className="px-4 py-2 rounded-full bg-white/80 border border-[#E0D6C8] text-[#5C4A3A] text-sm shadow-sm"
              >
                <span className="mr-1.5">{c.emoji}</span>
                {c.name}
              </span>
            ))}
          </div>

          <a
            href={getSmsLink('Hi! I\'m interested in custom engraved items.')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#3D3428] text-white rounded-full font-medium hover:bg-[#2D2418] transition-all shadow-lg shadow-[#3D3428]/20"
          >
            Tell me what you need
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </section>

      <div className="max-w-xs mx-auto border-t border-[#E0D6C8]" />

      {/* Portfolio Showcase for Gifts */}
      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#A08060] font-medium tracking-[0.15em] text-sm mb-3 uppercase">Examples</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#3D3428]" style={{ fontFamily: 'Georgia, serif' }}>
              See what we can engrave
            </h2>
            <p className="text-[#6B5A48]/70 mt-3">Real examples from actual client projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Real metal business card images (can be gifts too) */}
            <div className="group rounded-2xl overflow-hidden border border-[#E8E0D8] bg-white hover:shadow-lg transition-all">
              <div className="aspect-[4/3] relative bg-[#F0EBE6]">
                <Image
                  src="/portfolio/metal-business-card-original.png"
                  alt="Metal Business Card Gift"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[#3D3428] mb-2">Premium Metal Cards</h3>
                <p className="text-[#6B5A48]/70 text-sm">Perfect corporate gifts that clients keep and use.</p>
              </div>
            </div>

            <div className="group rounded-2xl overflow-hidden border border-[#E8E0D8] bg-white hover:shadow-lg transition-all">
              <div className="aspect-[4/3] relative bg-[#F0EBE6]">
                <Image
                  src="/portfolio/metal-business-card.png"
                  alt="Metal Business Card Samples"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[#3D3428] mb-2">Precision Engraving</h3>
                <p className="text-[#6B5A48]/70 text-sm">Sharp details on wood, metal, acrylic, leather, and more.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[#6B5A48]/80 text-lg mb-6">
              Don&apos;t see what you&apos;re looking for? <br className="hidden sm:inline" />
              <span className="text-[#3D3428] font-medium">Text me for custom samples.</span>
            </p>
            <a
              href={getSmsLink("Can you show me examples of [your item]?")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#3D3428] text-white rounded-full font-medium hover:bg-[#2D2418] transition-all shadow-lg shadow-[#3D3428]/20"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Text for samples
            </a>
          </div>
        </div>
      </section>

      {/* Sports Teams Section */}
      <section id="sports" className="py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#A08060] font-medium tracking-[0.15em] text-sm mb-3 uppercase">Sports Teams</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#3D3428]" style={{ fontFamily: 'Georgia, serif' }}>
              Baseball, softball, any team
            </h2>
            <p className="text-[#6B5A48]/70 mt-3">Player gifts, team awards, coach recognition.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {sportsTeam.map((item) => (
              <div
                key={item.name}
                className="group p-6 bg-white rounded-2xl border border-[#E8E0D8] hover:border-[#D4B896] hover:shadow-lg hover:shadow-[#D4B896]/10 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-[#3D3428]">{item.name}</h3>
                  <span className="text-[#A08060] font-medium">{item.price}</span>
                </div>
                <p className="text-[#6B5A48]/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trophies & Awards Section */}
      <section id="trophies" className="py-20 lg:py-24 bg-gradient-to-b from-[#F5EDE6] to-[#FBF9F7] scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#A08060] font-medium tracking-[0.15em] text-sm mb-3 uppercase">Trophies & Awards</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#3D3428]" style={{ fontFamily: 'Georgia, serif' }}>
              Recognition that lasts
            </h2>
            <p className="text-[#6B5A48]/70 mt-3">Glass, wood, acrylic. Single pieces or full sets.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {trophiesAwards.map((item) => (
              <div
                key={item.name}
                className="group p-6 bg-white rounded-2xl border border-[#E8E0D8] hover:border-[#D4B896] hover:shadow-lg hover:shadow-[#D4B896]/10 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-[#3D3428]">{item.name}</h3>
                  <span className="text-[#A08060] font-medium">{item.price}</span>
                </div>
                <p className="text-[#6B5A48]/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signs & Plaques Section */}
      <section id="signs" className="py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#A08060] font-medium tracking-[0.15em] text-sm mb-3 uppercase">Signs & Plaques</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#3D3428]" style={{ fontFamily: 'Georgia, serif' }}>
              Yard signs, address plaques, memorials
            </h2>
            <p className="text-[#6B5A48]/70 mt-3">Indoor or outdoor. Weather-resistant options available.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {signsPlayques.map((item) => (
              <div
                key={item.name}
                className="group p-6 bg-white rounded-2xl border border-[#E8E0D8] hover:border-[#D4B896] hover:shadow-lg hover:shadow-[#D4B896]/10 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-[#3D3428]">{item.name}</h3>
                  <span className="text-[#A08060] font-medium">{item.price}</span>
                </div>
                <p className="text-[#6B5A48]/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Gifts Section */}
      <section id="personal" className="py-20 lg:py-24 bg-gradient-to-b from-[#F5EDE6] to-[#FBF9F7] scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#A08060] font-medium tracking-[0.15em] text-sm mb-3 uppercase">Personal Gifts</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#3D3428]" style={{ fontFamily: 'Georgia, serif' }}>
              Weddings, graduations, milestones
            </h2>
            <p className="text-[#6B5A48]/70 mt-3">Single items welcome. No minimum order.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {personalGifts.map((item) => (
              <div
                key={item.name}
                className="group p-6 bg-white rounded-2xl border border-[#E8E0D8] hover:border-[#D4B896] hover:shadow-lg hover:shadow-[#D4B896]/10 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-[#3D3428]">{item.name}</h3>
                  <span className="text-[#A08060] font-medium">{item.price}</span>
                </div>
                <p className="text-[#6B5A48]/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Items */}
      <section id="bulk" className="py-20 lg:py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#A08060] font-medium tracking-[0.15em] text-sm mb-3 uppercase">Bulk Orders</p>
            <h2 className="text-3xl sm:text-4xl font-light text-[#3D3428]" style={{ fontFamily: 'Georgia, serif' }}>
              Event favors & giveaways
            </h2>
            <p className="text-[#6B5A48]/70 mt-3">Small packs available. Better pricing on larger orders.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bulkItems.map((item) => (
              <div
                key={item.name}
                className="p-5 bg-white rounded-xl border border-[#E8E0D8] text-center"
              >
                <h3 className="font-medium text-[#3D3428] mb-1">{item.name}</h3>
                <p className="text-xs text-[#6B5A48]/60 mb-3">{item.desc}</p>
                <div className="flex justify-center gap-3 text-sm">
                  <span className="text-[#A08060] font-medium">{item.price}</span>
                  <span className="text-[#6B5A48]/40">min {item.min}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-24 bg-[#3D3428] text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4B896] font-medium tracking-[0.15em] text-sm mb-3 uppercase">The Process</p>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: 'Georgia, serif' }}>
              Simple as it should be
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Tell me', desc: 'Text what you need, how many, and when.' },
              { num: '02', title: 'Quote', desc: 'I\'ll confirm pricing and timeline same day.' },
              { num: '03', title: 'Approve', desc: 'See a proof before I engrave.' },
              { num: '04', title: 'Pickup', desc: 'Local pickup or delivery available.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="text-4xl font-light text-[#D4B896]/40 mb-3">{step.num}</div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#A08060] font-medium tracking-[0.15em] text-sm mb-3 uppercase">Questions</p>
            <h2 className="text-3xl font-light text-[#3D3428]" style={{ fontFamily: 'Georgia, serif' }}>
              Quick answers
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Can you engrave baseball bats?', a: 'Yes - wood or aluminum. Player names, numbers, team logos, season stats. Great for end-of-season gifts.' },
              { q: 'How fast can you turn around trophies?', a: 'Usually 2-3 days. Rush orders often possible - text me your deadline.' },
              { q: 'Do you do single items or only bulk?', a: 'Both. Single personalized gifts are welcome. Bulk orders (5+) get better per-item pricing.' },
              { q: 'Can you match specific team colors or styles?', a: 'Yes - I can work with specific materials, fonts, and layouts. Send me what you have in mind.' },
            ].map((faq) => (
              <div key={faq.q} className="p-6 bg-white rounded-xl border border-[#E8E0D8]">
                <h3 className="font-medium text-[#3D3428] mb-2">{faq.q}</h3>
                <p className="text-[#6B5A48]/70 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-[#F5EDE6] to-[#E8E0D8]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-light text-[#3D3428] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Got a project in mind?
          </h2>
          <p className="text-[#6B5A48]/80 text-lg mb-8">
            Text me what you need. I&apos;ll get back to you same day with pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getSmsLink('Hi! I\'m interested in custom engraved items.')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#3D3428] text-white rounded-full font-medium hover:bg-[#2D2418] transition-all shadow-lg shadow-[#3D3428]/20"
            >
              Text {siteInfo.phone}
              <ArrowRightIcon className="w-4 h-4" />
            </a>
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#3D3428] rounded-full font-medium border border-[#D4C8B8] hover:bg-[#F9F6F3] transition-all"
            >
              Build an order
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-[#D4C8B8]">
            <Link
              href="/"
              className="text-[#6B5A48]/60 text-sm hover:text-[#3D3428] transition-colors"
            >
              ← Back to vurmz.com for business services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
