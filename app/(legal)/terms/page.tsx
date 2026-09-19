import { Metadata } from 'next'
import Link from 'next/link'
import { siteInfo, getSmsLink } from '@/lib/site-info'
import { SOURCING, SHOP_POLICY, BUSINESS, DELIVERY } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `Terms of service and policies for ${siteInfo.name} laser engraving services in ${siteInfo.city}, ${siteInfo.state}.`,
  openGraph: {
    title: 'Terms & Conditions',
    description: `Terms of service and policies for ${siteInfo.name} laser engraving services.`,
    url: `${siteInfo.url}/terms`,
    siteName: siteInfo.name,
    type: 'website',
    locale: 'en_US',
  },
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  const lastUpdated = 'September 19, 2026'
  const fee = SOURCING.reserveFee

  const sections = [
    {
      title: 'Who you are dealing with',
      content: [
        { label: 'Business', value: siteInfo.legalName },
        { label: 'Owner', value: siteInfo.founder.fullName },
        { label: 'Where', value: `${siteInfo.city}, ${siteInfo.state}` },
        { label: 'Reach me', value: `${siteInfo.phone} or ${siteInfo.email}` },
      ],
    },
    {
      title: 'What I do',
      text: `${siteInfo.name} is one person doing laser engraving and marking in ${siteInfo.city}, ${siteInfo.state}: pieces from the shop, pieces you bring me, business runs, and pieces I find and buy on your behalf (the reserve). Everything is made here and delivered across the south Denver metro. These terms cover all of it. By placing an order you agree to them.`,
    },
    {
      title: 'Prices, quotes, and payment',
      items: [
        { term: 'Posted prices', desc: 'The prices on the site are the prices. Anything not posted is quoted by text or email, and a quote holds for 30 days.' },
        { term: 'Shop orders', desc: 'Paid at checkout through Square. I never see or store your card.' },
        { term: 'Business accounts', desc: `Invoiced after delivery on NET-${BUSINESS.netTermsDays} terms once an account is set up. Invoices are due in full; a balance more than 30 days past due may pause new work on the account.` },
        { term: 'Rush', desc: `Next-day work runs ${Math.round(SHOP_POLICY.rushNextDayPct * 100)}% more (at least $${SHOP_POLICY.rushNextDayMin}); same-day runs ${Math.round(SHOP_POLICY.rushSameDayPct * 100)}% more (at least $${SHOP_POLICY.rushSameDayMin}). I will say so before I take it on.` },
        { term: 'Sales tax', desc: 'Colorado and local sales tax are added to taxable goods where the law requires it.' },
      ],
    },
    {
      title: 'The reserve: pieces I buy for you',
      items: [
        { term: 'What it is', desc: `You name a piece, or pick one of my starting points, and I find it, buy it new, engrave it with your words, and bring it to you. You pay the piece at its price with the receipt in the box, plus $${fee} that covers finding it, the engraving, and the delivery. Gift boxing and a second engraving placement are priced separately.` },
        { term: 'The deposit', desc: 'A reservation is not an order until the deposit is paid. The deposit is the price of the piece plus half the fee. Until I have bought the piece, you can cancel and the deposit comes back in full. Once I have bought it, the deposit covers the piece, and the balance is due when it is in your hands.' },
        { term: 'Prices on the site', desc: 'The delivered prices shown are based on the maker\'s list price on the day I checked. If the store price is different when I go to buy it, I tell you the real number before I buy, and you can say no.' },
        { term: 'Availability', desc: 'Some pieces are stocked locally and some are ordered in. I give you the honest lead time before you commit. If a piece cannot be had, the deposit comes back in full.' },
        { term: 'Not affiliated', desc: `${siteInfo.name} is an independent engraver. I am not affiliated with, sponsored by, or endorsed by any maker whose products I buy on your behalf. Their names appear on the site only to describe what I can buy for you. Their trademarks belong to them.` },
        { term: 'Warranties', desc: 'Engraving permanently alters a piece and may void the maker\'s warranty. The maker\'s warranty, if any, is between you and the maker. My own guarantee on the engraving is below.' },
      ],
    },
    {
      title: 'Your own pieces',
      items: [
        { term: 'What you bring', desc: 'When you bring or ship me something of yours, I mark it as agreed and return it. I handle every piece with care, but engraving is permanent and some materials behave unpredictably under a laser.' },
        { term: 'Risk', desc: `You accept that risk when you hand me the piece. If I damage a piece through my own carelessness, I will make it right up to the piece\'s replacement value. I am not responsible for a material that reacts in a way neither of us could have known, for heirlooms with no replacement value, or for pieces that arrive damaged.` },
        { term: 'Photos and a heads-up', desc: 'If I have a concern about how a piece will take a mark, I tell you before I start. If you want a photo before I run it, ask when you order.' },
      ],
    },
    {
      title: 'Artwork, words, and rights',
      items: [
        { term: 'What you send me', desc: `You must own, or have the right to use, any logo, artwork, words, or design you ask me to engrave. I do not verify rights, and you agree to cover ${siteInfo.name} for any claim that comes from what you asked me to mark.` },
        { term: 'What I will not do', desc: 'I do not engrave other people\'s trademarks for resale, hateful content, or anything I judge unlawful. That call is mine.' },
        { term: 'Files', desc: 'Vector files (SVG, PDF, AI) reproduce exactly. A sharp PNG usually works. Redrawing a logo by hand is quoted separately.' },
        { term: 'Your files stay yours', desc: 'I keep your artwork and settings on file so reorders match. I do not share them, and I delete them if you ask.' },
      ],
    },
    {
      title: 'Turnaround and delivery',
      items: [
        { term: 'Timing', desc: 'Most pieces are ready in 24 to 72 hours. Reserve pieces that are stocked locally are usually in hand within the week; pieces ordered in take one to two weeks. I say the real date before you commit.' },
        { term: 'Delivery', desc: `Hand-delivered across the ${DELIVERY.area}, free over $${DELIVERY.freeThreshold} and free at any size on a business account. Pickup by appointment in ${siteInfo.city}. Shipping is available and quoted at cost.` },
        { term: 'Shipping risk', desc: 'Once a shipped piece leaves my hands, the carrier\'s terms apply. I insure anything over $200 unless you ask me not to.' },
      ],
    },
    {
      title: 'My guarantee, and returns',
      items: [
        { term: 'The engraving', desc: 'If the mark is not what we agreed, I redo it or refund the engraving, your choice. If the piece cannot be redone, I refund what you paid me for the engraving and the fee.' },
        { term: 'Engraved pieces are final', desc: 'A piece marked with your words cannot be sold to anyone else, so sales are final once the piece is engraved. Before that point, you can cancel any order and the deposit or payment comes back in full.' },
        { term: 'Mistakes in what you sent', desc: 'I engrave exactly what you give me. A misspelling in the words you typed is not a defect, though I will always tell you if something looks off before I run it.' },
      ],
    },
    {
      title: 'Liability',
      text: `My total liability for any order is limited to what you paid me for that order. I am not responsible for indirect, incidental, or consequential losses. Nothing here limits liability that Colorado law does not allow to be limited.`,
    },
    {
      title: 'Privacy',
      text: 'I collect only what I need to make and deliver your order: your name, how to reach you, and the details of the piece. I do not sell or share your information. The full privacy policy is at the link below.',
    },
    {
      title: 'The rest',
      text: `These terms are governed by the laws of Colorado. If a dispute cannot be settled by talking, which is how I would prefer to settle it, it goes to the courts of Arapahoe County, Colorado. I may update these terms; the date at the top is the date they last changed.`,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[var(--page)] text-[var(--ink)] py-14 sm:py-[72px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[var(--eyebrow)] font-medium mb-2 uppercase tracking-wider text-sm">Legal</p>
          <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] font-semibold tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-[var(--ink-soft)]">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 sm:py-[72px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="max-w-3xl space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="p-6 rounded-xl bg-[var(--glass-soft)] border border-[var(--hairline)]">
                <h2 className="text-[length:var(--step-panel)] font-semibold text-vurmz-dark mb-4">{section.title}</h2>

                {'content' in section && section.content && (
                  <div className="space-y-2">
                    {section.content.map((item) => (
                      <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-[var(--ink-soft)] text-sm">{item.label}</span>
                        <span className="text-[var(--ink-soft)] font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {'text' in section && section.text && (
                  <p className="text-[var(--ink-soft)] leading-relaxed">{section.text}</p>
                )}

                {'items' in section && section.items && (
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.term}>
                        <span className="text-[var(--eyebrow)] font-medium">{item.term}: </span>
                        <span className="text-[var(--ink-soft)]">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Contact */}
            <div className="p-6 rounded-xl bg-[var(--feature)]/10 border border-vurmz-teal/20">
              <h2 className="text-[length:var(--step-panel)] font-semibold text-vurmz-dark mb-3">Questions?</h2>
              <p className="text-[var(--ink-soft)] mb-4">
                Questions about any of this? Ask me.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={getSmsLink()}
                  className="inline-flex items-center px-5 py-2.5 bg-[var(--feature)] text-white rounded-lg font-medium hover:bg-[var(--feature-deep)] transition-all"
                >
                  Text {siteInfo.phone}
                </a>
                <Link
                  href="/services/contact"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg font-medium text-vurmz-dark border border-[var(--hairline)] hover:bg-[var(--glass-soft)] transition-all"
                >
                  Contact Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
