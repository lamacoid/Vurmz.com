import { Metadata } from 'next'
import Link from 'next/link'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteInfo.name}`,
  description: `Terms of service and policies for ${siteInfo.name} laser engraving services in ${siteInfo.city}, ${siteInfo.state}.`,
  openGraph: {
    title: `Terms & Conditions | ${siteInfo.name}`,
    description: `Terms of service and policies for ${siteInfo.name} laser engraving services.`,
    url: `${siteInfo.url}/terms`,
    siteName: siteInfo.name,
    type: 'website',
    locale: 'en_US',
  },
}

export default function TermsPage() {
  const lastUpdated = 'January 2025'

  const sections = [
    {
      title: 'Business Information',
      content: [
        { label: 'Business Name', value: siteInfo.legalName },
        { label: 'Owner', value: siteInfo.founder.fullName },
        { label: 'Location', value: `${siteInfo.city}, ${siteInfo.state}` },
        { label: 'Contact', value: `${siteInfo.phone} | ${siteInfo.email}` },
      ],
    },
    {
      title: 'Services',
      text: `${siteInfo.name} provides laser engraving services including branded promotional items, metal business cards, industrial labels, equipment marking, and custom engraving projects. All services are performed in ${siteInfo.city}, ${siteInfo.state}. We serve the greater Denver metro area.`,
    },
    {
      title: 'Orders & Payment',
      items: [
        { term: 'Quotes', desc: 'All quotes are valid for 30 days from the date issued. Prices are subject to change based on material costs.' },
        { term: 'Payment', desc: 'Payment is due upon completion unless other arrangements are made. We accept cash, check, credit cards, and electronic payment.' },
        { term: 'Deposits', desc: 'A deposit may be required for large orders or custom materials. Deposits are non-refundable once work has begun.' },
      ],
    },
    {
      title: 'Artwork & Files',
      items: [
        { term: 'File Formats', desc: 'Vector files (SVG, AI, EPS) are preferred. High-resolution PNG or JPG (300+ DPI) may work depending on the project.' },
        { term: 'Ownership', desc: `You must own or have rights to use any logos, artwork, or designs you provide. ${siteInfo.name} is not responsible for verifying IP rights.` },
        { term: 'Proofs', desc: 'Digital proofs are provided for approval before production. Changes after approval may incur additional charges.' },
      ],
    },
    {
      title: 'Turnaround & Delivery',
      items: [
        { term: 'Standard', desc: 'Most orders are completed within 3-5 business days. Same-day and next-day turnaround is often available.' },
        { term: 'Pickup', desc: `Free local pickup is available by appointment in ${siteInfo.city}.` },
        { term: 'Delivery', desc: 'Free delivery on orders $100+ within south suburban Denver. Other areas may incur a fee.' },
      ],
    },
    {
      title: 'Warranty & Returns',
      items: [
        { term: 'Quality Guarantee', desc: 'All work is inspected before delivery. Defects in workmanship will be remade at no charge.' },
        { term: 'Customer-Supplied Items', desc: `${siteInfo.name} is not responsible for damage to customer-supplied items. Engraving inherently alters the surface.` },
        { term: 'No Returns on Custom', desc: 'Due to personalized nature of engraving, all sales are final. Review proofs carefully before approval.' },
      ],
    },
    {
      title: 'Liability',
      text: `${siteInfo.name}'s liability is limited to the cost of the order. We are not responsible for consequential, incidental, or indirect damages arising from use of our products or services.`,
    },
    {
      title: 'Privacy',
      text: 'We collect only information necessary to fulfill your order: name, contact information, and project details. We do not sell or share your information. Artwork and files are kept confidential.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-vurmz-teal font-medium mb-2 uppercase tracking-wider text-sm">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-300">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                <h2 className="text-xl font-bold text-vurmz-dark mb-4">{section.title}</h2>

                {'content' in section && section.content && (
                  <div className="space-y-2">
                    {section.content.map((item) => (
                      <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-gray-500 text-sm">{item.label}</span>
                        <span className="text-gray-700 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {'text' in section && section.text && (
                  <p className="text-gray-600 leading-relaxed">{section.text}</p>
                )}

                {'items' in section && section.items && (
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.term}>
                        <span className="text-vurmz-teal font-medium">{item.term}: </span>
                        <span className="text-gray-600">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Contact */}
            <div className="p-6 rounded-xl bg-vurmz-teal/10 border border-vurmz-teal/20">
              <h2 className="text-xl font-bold text-vurmz-dark mb-3">Questions?</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about these terms, please contact me:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={getSmsLink()}
                  className="inline-flex items-center px-5 py-2.5 bg-vurmz-teal text-white rounded-lg font-medium hover:bg-vurmz-teal-dark transition-all"
                >
                  Text {siteInfo.phone}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg font-medium text-vurmz-dark border border-gray-300 hover:bg-gray-50 transition-all"
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
