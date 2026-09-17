import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ReserveList from '@/components/shop/ReserveList'
import RoomTheme from '@/components/shop/RoomTheme'
import { SOURCING, SIGNATURE, ONSITE } from '@/lib/pricing'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: { absolute: 'The Reserve | VURMZ' },
  description: 'Pieces found, engraved, and hand-delivered to order across the south Denver metro. Shun, Smithey, Benchmade, Boos and more, the laser brought to your event, jewelry and watch marking. One person, hand delivered.',
  alternates: { canonical: '/shop/reserve' },
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`

// The room's other offers. Every number is read from lib/pricing so this
// page can never drift from the posted terms.
const OFFERS = [
  {
    h: 'The laser, at your table',
    p: `A half day on site from ${usd(ONSITE.halfDay)}. Client dinners, launches, the holiday party. Guests watch their piece marked and take it home.`,
    cta: 'How a day on site works',
    href: '/services/live-engraving',
  },
  {
    h: 'Jewelry and watches',
    p: `Rings, pendants, case backs, bracelets. Names, dates, coordinates, a line of handwriting. From ${usd(SIGNATURE.jewelryFrom)}.`,
    cta: 'Send a photo',
    href: getSmsLink('Hi Zach. I have a piece of jewelry to mark: '),
  },
  {
    h: 'Boxed, and marked twice',
    p: `A gift box for ${usd(SOURCING.giftBox)}. A second placement, the inside of a lid or the back of a blade, for ${usd(SOURCING.secondLocation)}.`,
    cta: 'Ask for it with the piece',
    href: getSmsLink('Hi Zach. From the reserve list, boxed, I would like a '),
  },
  {
    h: 'Cards for the office',
    p: 'Anodized aluminum, designed here on the site, proofed on screen before a single card is cut. Sets of ten and up.',
    cta: 'Design a set',
    href: '/shop/metal-cards',
  },
]

export default function ReservePage() {
  const display = { fontFamily: 'var(--font-display), Georgia, serif' }
  return (
    // The room: the old VURMZ glass, full bleed, pulled up under the header.
    <div className="relative -mt-[92px] sm:-mt-[100px] pt-[124px] sm:pt-[140px] pb-16 bg-[#123F47] text-[#DED6C3] overflow-hidden">
      <RoomTheme />
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <Image
          src="/portfolio/denver-map-mirror-closeup.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={50}
          className="object-cover opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-[#123F47]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7FCFD4]/[0.08] via-transparent to-[#0D2F35]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="inline-block text-[length:var(--step-fine)] font-mono tracking-[0.2em] uppercase text-[#7FCFD4]/80 hover:text-[#7FCFD4] transition-colors">
          Back to the shop
        </Link>

        <p className="mt-8 text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[#7FCFD4] mb-3">
          The reserve
        </p>
        <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-white/95" style={display}>
          The knife they will hand down.<br className="hidden sm:block" /> Their name already on it.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[length:var(--step-lead)] leading-relaxed text-[#DED6C3]/85">
          Chef knives from Seki and Solingen. Folders in S30V and titanium. Cast iron, hard maple, a cooler
          that outlives the truck. I find the piece, mark it with your words, and bring it to your door,
          receipt in the box.
        </p>
        <p className="mt-3 font-mono text-[length:var(--step-fine)] tracking-[0.04em] text-[#DED6C3]/70">
          The piece at its price + {usd(SOURCING.reserveFee)} to find it, mark it, and bring it
        </p>

        {/* The shelves */}
        <div className="mt-10">
          <ReserveList />
        </div>
        <div className="mt-10 rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] backdrop-blur-md p-5 sm:p-8">
          <p className="max-w-[64ch] text-[length:var(--step-fine)] leading-relaxed text-[#DED6C3]/65">
            Anything else, name it: a different steel, a bigger board, the everyday brands too. The {usd(SOURCING.reserveFee)} covers finding it, the engraving, and the delivery.
            A deposit holds the piece before I buy, fully returned if you change your mind before then.
          </p>
          <a
            href={getSmsLink('Hi Zach. From the reserve list, I would like a ')}
            className="puffy-btn mt-6 inline-flex items-center justify-center h-11 px-6 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-[length:var(--step-body)] font-semibold hover:bg-[var(--coral-hover)] transition-colors duration-[var(--t-hover)]"
          >
            Name the piece
          </a>
        </div>

        {/* The rest of the room */}
        <p className="mt-14 text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[#7FCFD4] mb-5">
          Also in the room
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {OFFERS.map(o => (
            <div key={o.h} className="rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] backdrop-blur-md p-5 sm:p-6 flex flex-col">
              <h2 className="text-[length:var(--step-panel)] leading-tight text-white/95" style={display}>{o.h}</h2>
              <p className="mt-2.5 text-[length:var(--step-row)] leading-relaxed text-[#DED6C3]/80 flex-1">{o.p}</p>
              <Link href={o.href} className="mt-5 inline-flex items-center gap-2 text-[length:var(--step-body)] font-semibold text-[#7FCFD4] hover:text-white transition-colors duration-[var(--t-hover)]">
                {o.cta}
                <span aria-hidden>&rsaquo;</span>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-[56ch] text-[length:var(--step-row)] leading-relaxed text-[#DED6C3]/75">
          Same hands, same care, same delivery run as everything else I make. The coasters and the Shun get
          the same care. I am {siteInfo.founder.name}, one shop in {siteInfo.city}.
        </p>
        <p className="mt-6 max-w-[64ch] text-[11px] leading-relaxed text-[#DED6C3]/45">
          VURMZ is an independent engraver, not affiliated with or endorsed by any maker named here. Engraving a piece may void its maker&apos;s warranty.
        </p>
        <a
          href={getSmsLink('Hi Zach, from the reserve: ')}
          className="mt-5 inline-flex items-center text-[length:var(--step-body)] font-semibold text-[#7FCFD4] hover:text-white transition-colors duration-[var(--t-hover)]"
        >
          Text {siteInfo.phone}
        </a>
      </div>
    </div>
  )
}
