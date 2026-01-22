import { Metadata } from 'next'
import QuoteForm from './QuoteForm'
import { CheckCircleIcon, TruckIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Start Your Order',
  description: 'Order custom laser engraving in Centennial and Denver metro. No minimums, fast turnaround, local service.',
}

export default function QuotePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Start Your Order
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Build your order below. For standard products, you&apos;ll see live pricing. For custom work, I&apos;ll get back to you same-day with a quote.
            </p>
            <p className="text-gray-400">
              No minimum orders. No setup fees for repeat customers. No surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <QuoteForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-vurmz-light p-8 sticky top-24">
                <h3 className="text-xl font-bold text-vurmz-dark mb-6">What to Expect</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <ClockIcon className="h-6 w-6 text-vurmz-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-vurmz-dark">Same-Day Response</h4>
                      <p className="text-gray-600 text-sm">
                        I respond within hours, not days. Your quote includes exact pricing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircleIcon className="h-6 w-6 text-vurmz-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-vurmz-dark">No Minimums</h4>
                      <p className="text-gray-600 text-sm">
                        Need 10 pens? 5 pans? One knife? That is fine.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <TruckIcon className="h-6 w-6 text-vurmz-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-vurmz-dark">Free Local Pickup</h4>
                      <p className="text-gray-600 text-sm">
                        Pick up in Centennial or I can deliver for orders over $100.
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-gray-300" />

                <div>
                  <h4 className="font-semibold text-vurmz-dark mb-3">Prefer to Text?</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Skip the form. Text me directly:
                  </p>
                  <a
                    href="sms:+17192573834"
                    className="flex items-center justify-center gap-2 bg-vurmz-teal text-white px-6 py-3 font-semibold hover:bg-vurmz-teal-dark transition-colors"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    (719) 257-3834
                  </a>
                </div>

                <hr className="my-8 border-gray-300" />

                <div className="text-sm text-gray-600">
                  <h4 className="font-semibold text-vurmz-dark mb-3">Service Area</h4>
                  <p>
                    Based in Centennial. Serving all of south suburban Denver and the metro area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
