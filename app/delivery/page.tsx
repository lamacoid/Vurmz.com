import type { Metadata } from 'next'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import Breadcrumbs from '@/components/Breadcrumbs'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import DeliveryMap from '@/components/DeliveryMap'

export const metadata: Metadata = {
  title: 'Delivery & Shipping',
  description: `Where VURMZ delivers: free hand-delivery across the Denver metro, from Castle Rock to Broomfield, and shipping anywhere in the US on small engraved goods.`,
  alternates: { canonical: '/delivery' },
}

const TIERS = [
  {
    sw: 'bg-[#8A4943]/70',
    h: 'Next door · free, no minimum',
    p: "Within about two miles of the shop, I'll bring it over, whatever it is. A single keychain, a single tag. No minimum, no charge. We're neighbors.",
  },
  {
    sw: 'bg-[#C67A6F]/60',
    h: 'Home zone · free over $50',
    p: 'Centennial, Littleton, Lone Tree, Highlands Ranch, Englewood, Greenwood Village, Parker, south Aurora. Free hand-delivery over $50, $5 under.',
  },
  {
    sw: 'bg-[#16525C]/20 border border-dashed border-[#16525C]',
    h: 'Greater metro · free over $500',
    p: 'Castle Rock in the south up to Broomfield in the north, foothills to the eastern plains. On a big order I make the drive to your door anywhere in here, free.',
  },
  {
    sw: 'border border-dashed border-[var(--ink-soft)] rounded-full',
    h: 'Boulder & beyond · just ask',
    p: "Further than the metro? Reach out and we'll work it out. For the right order I'll still come to you.",
  },
  {
    sw: 'bg-[var(--page)] border border-[var(--hairline)]',
    h: 'Everywhere else · it ships',
    p: 'Anywhere in the US via USPS, tracked: $6 for the light stuff (cards, tags, keychains, pens), more by weight from there. The exact price shows at checkout before you pay. In a hurry locally? Uber same-day courier is a checkout option too.',
  },
]

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--ink-soft)]">
      <SiteHeader variant="services" />
      <section className="pt-24 sm:pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'VURMZ', href: '/' }, { label: 'Delivery' }]} theme="landing" />

          <div className="mt-6 bg-[var(--surface)] border border-[var(--hairline)] rounded-sm shadow-sm px-5 sm:px-10 py-8 sm:py-10">
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)] mb-3">Delivery &amp; shipping</p>
            <h1
              className="text-3xl sm:text-4xl text-[var(--ink)] tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              Where I deliver
            </h1>
            <p className="text-sm text-[var(--ink-soft)] mt-2 max-w-2xl">
              Local means local. I bring your order to your door, myself, across the Denver metro. The map is approximate, centered on the shop in {siteInfo.city}.
            </p>

            <div className="mt-6 border-t-2 border-[var(--ink)]/25" aria-hidden />
            <div className="mt-[3px] border-t border-[var(--ink)]/25" aria-hidden />

            <div className="mt-8">
              <DeliveryMap />
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {TIERS.map(t => (
                <div key={t.h} className="flex items-start gap-3">
                  <span className={`mt-1 w-5 h-5 rounded-[4px] flex-shrink-0 ${t.sw}`} aria-hidden />
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--ink)]">{t.h}</h2>
                    <p className="text-[13px] text-[var(--ink-soft)] leading-snug mt-0.5">{t.p}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contactless is a real preference, not an edge case — and it
                doesn't mean paying to ship. A free drop-and-text is the
                default no-contact path; mailing stays for those who want it. */}
            <div className="mt-8 rounded-sm border border-[var(--hairline)] bg-[var(--ink)]/[0.03] px-5 py-4">
              <p className="text-sm text-[var(--ink)] font-semibold">Want it contactless? Just say so.</p>
              <p className="text-[13px] text-[var(--ink-soft)] leading-snug mt-1">
                I&rsquo;ll leave it at your door and text you a photo. No knock, no small talk, same free delivery. Or if you&rsquo;d rather it come by mail, that&rsquo;s an option too, from $6 by weight, priced at checkout.
              </p>
            </div>

            <p className="mt-8 pt-5 border-t border-[var(--hairline)] text-xs text-[var(--ink-soft)] text-center">
              Not sure which zone you&rsquo;re in?{' '}
              <a href={getSmsLink('Hi, which delivery zone am I in?')} className="text-[var(--eyebrow)] font-semibold hover:underline">
                Text {siteInfo.phone}
              </a>{' '}
              and I&rsquo;ll tell you.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
