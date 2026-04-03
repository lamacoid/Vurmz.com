import { Metadata } from 'next'
import Link from 'next/link'
import { siteInfo } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'Privacy Policy | VURMZ Laser Engraving',
  description: `Privacy policy for ${siteInfo.legalName}. How we handle your information when you use our laser engraving services in ${siteInfo.city}, CO.`,
}

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-cream py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            Last updated: February 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14 bg-[#0d1b1a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-sm max-w-none space-y-8">

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">Who We Are</h2>
              <p className="text-gray-400 leading-relaxed">
                {siteInfo.legalName} (&quot;VURMZ,&quot; &quot;we,&quot; &quot;us&quot;) is a laser engraving business based in {siteInfo.city}, {siteInfo.state}.
                This policy describes how we collect, use, and protect your personal information when you use our website at vurmz.com or purchase our services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">Information We Collect</h2>
              <p className="text-gray-400 leading-relaxed mb-3">
                We collect information you voluntarily provide when placing an order or contacting us:
              </p>
              <ul className="text-gray-400 space-y-2 list-disc list-inside">
                <li>Name and business name</li>
                <li>Email address and phone number</li>
                <li>Order details, artwork files, and project specifications</li>
                <li>Payment information (processed securely through Square)</li>
                <li>Delivery address for local orders</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">How We Use Your Information</h2>
              <ul className="text-gray-400 space-y-2 list-disc list-inside">
                <li>Process and fulfill your engraving orders</li>
                <li>Communicate about your order status and proofs</li>
                <li>Send invoices and process payments via Square</li>
                <li>Respond to your questions and requests</li>
                <li>Improve our services and website</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-3">
                We do not sell, rent, or share your personal information with third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">Payment Processing</h2>
              <p className="text-gray-400 leading-relaxed">
                Payments are processed through Square, Inc. We never store your credit card information directly.
                Square&apos;s privacy policy governs how they handle payment data. You can review it at{' '}
                <a href="https://squareup.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-vurmz-teal hover:text-cream transition-colors">
                  squareup.com/legal/privacy
                </a>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">Email Communications</h2>
              <p className="text-gray-400 leading-relaxed">
                We send transactional emails related to your orders (confirmations, proofs, invoices, shipping updates).
                We use Resend as our email service provider. You can unsubscribe from any non-transactional communications at any time.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">Data Security</h2>
              <p className="text-gray-400 leading-relaxed">
                We use industry-standard security measures to protect your data, including encrypted connections (HTTPS),
                secure payment processing, and access controls on our systems. Your data is stored on Cloudflare&apos;s infrastructure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">Cookies & Analytics</h2>
              <p className="text-gray-400 leading-relaxed">
                Our website uses minimal cookies necessary for site functionality (such as remembering your theme preference).
                We do not use third-party advertising trackers.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">Your Rights</h2>
              <p className="text-gray-400 leading-relaxed">
                You can request access to, correction of, or deletion of your personal information at any time.
                Colorado residents have additional rights under the Colorado Privacy Act.
                Contact us to exercise any of these rights.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-cream mb-3">Contact</h2>
              <p className="text-gray-400 leading-relaxed">
                Questions about this policy? Reach out directly:
              </p>
              <div className="mt-3 space-y-1 text-gray-400">
                <p>{siteInfo.founder.name}</p>
                <p>{siteInfo.legalName}</p>
                <p>{siteInfo.city}, {siteInfo.state}</p>
                <p>
                  <a href={`mailto:${siteInfo.email}`} className="text-vurmz-teal hover:text-cream transition-colors">
                    {siteInfo.email}
                  </a>
                </p>
                <p>
                  <a href={`tel:${siteInfo.phone.replace(/[^0-9]/g, '')}`} className="text-vurmz-teal hover:text-cream transition-colors">
                    {siteInfo.phone}
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="bg-vurmz-dark py-8 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-cream text-sm transition-colors"
          >
            &larr; Back to VURMZ
          </Link>
        </div>
      </section>
    </div>
  )
}
