import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSmsLink, siteInfo } from '@/lib/site-info'
import { portfolioItems } from '@/lib/portfolio'

export const metadata: Metadata = {
  title: { absolute: 'The work | VURMZ laser engraving, Centennial CO' },
  description: 'Eight pieces: knives, a MacBook lid, mirrors, a full-wrap bottle, an amp faceplate, a branded tumbler. What it is, what it is made of, how it was marked.',
  alternates: { canonical: '/services/portfolio' },
  openGraph: {
    title: 'The work | VURMZ',
    description: 'Knives, a MacBook lid, mirrors, a full-wrap bottle, an amp faceplate, a branded tumbler. What it is and how it was marked.',
    url: 'https://www.vurmz.com/services/portfolio',
    images: ['/portfolio/denver-map-mirror-closeup.jpg'],
  },
}

const display = { fontFamily: 'var(--font-display), Georgia, serif' }

// The eight strongest, with a plain caption: what it is, not a pitch.
const STRONGEST: Array<{ slug: string; what: string }> = [
  { slug: 'wolverines-knife', what: 'A championship knife, two logos and a line on the blade' },
  { slug: 'culinary-cleaver', what: 'A cleaver, named for the chef' },
  { slug: 'macbook-personalization', what: 'A MacBook lid, a columbine on the aluminum' },
  { slug: 'denver-map-mirror', what: 'A Denver street map on a beveled mirror' },
  { slug: 'medieval-water-bottle', what: 'A water bottle, wrapped the whole way around' },
  { slug: 'pocket-knife', what: 'A pocket knife, pattern on the bolster' },
  { slug: 'clga-amp-faceplate', what: 'An amp faceplate, a recurring run' },
  { slug: 'branded-tumbler', what: 'A tumbler with a Cherry Creek logo' },
]

export default function PortfolioPage() {
  const items = STRONGEST.map(s => ({ ...s, item: portfolioItems.find(p => p.slug === s.slug)! })).filter(x => x.item)
  const rest = portfolioItems.filter(p => !STRONGEST.some(s => s.slug === p.slug))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
      <header className="max-w-[60ch]">
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--feature)] mb-3">The work</p>
        <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>
          Eight pieces, so you know what the machine can do.
        </h1>
        <p className="mt-4 text-[length:var(--step-lead)] leading-relaxed text-[var(--ink-soft)]">
          Metal, glass, coated steel, anodized aluminum. Each caption says what it is and how it was marked.
        </p>
      </header>

      <ul className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 list-none p-0 m-0">
        {items.map(({ slug, what, item }) => (
          <li key={slug}>
            <Link href={`/services/portfolio/${slug}`} className="group block">
              <span className="relative block aspect-square rounded-[var(--r-tile)] overflow-hidden border border-[var(--hairline)]">
                <Image src={item.src} alt={item.label} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </span>
              <span className="block mt-2 text-[14.5px] leading-snug text-[var(--ink)] group-hover:text-[var(--ink)] transition-colors">{what}</span>
              <span className="block mt-0.5 text-[11.5px] font-mono tracking-[0.06em] text-[var(--ink-soft)]">{item.material} · {item.process}</span>
            </Link>
          </li>
        ))}
      </ul>

      {rest.length > 0 && (
        <p className="mt-8 text-[14px] text-[var(--ink-soft)]">
          Also:{' '}
          {rest.map((p, i) => (
            <span key={p.slug}>
              <Link href={`/services/portfolio/${p.slug}`} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">{p.label.toLowerCase()}</Link>
              {i < rest.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
      )}

      <div className="mt-14 pt-8 border-t border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-[length:var(--step-panel)] leading-tight text-[var(--ink)]" style={display}>Have something like this? Send a photo.</p>
        <div className="sm:ml-auto flex flex-wrap gap-3">
          <Link href="/engrave" className="inline-flex items-center justify-center h-11 px-6 rounded-[var(--r-control)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-[14.5px] font-semibold transition-colors">
            Get a number
          </Link>
          <a href={getSmsLink('I saw the work and I have something to engrave: ')} className="inline-flex items-center justify-center h-11 px-6 rounded-[var(--r-control)] border border-[var(--hairline)] hover:border-[var(--feature)]/40 text-[var(--ink)] text-[14.5px] font-semibold transition-colors">
            Text {siteInfo.phone}
          </a>
        </div>
      </div>
    </div>
  )
}
