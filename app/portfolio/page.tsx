import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, WrenchScrewdriverIcon, CreditCardIcon, SparklesIcon, ChatBubbleLeftIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'Portfolio | Laser Engraving Examples | VURMZ Centennial CO',
  description: 'Laser engraving work for local businesses in South Denver metro. Branded pens, metal cards, tool marking, knife engraving.',
}

const productCategories = [
  {
    title: 'Metal Business Cards',
    description: 'Anodized aluminum or stainless steel. Stand out from the stack.',
    icon: CreditCardIcon,
    images: [
      '/portfolio/metal-business-card-original.png',
      '/portfolio/metal-business-card.png',
    ],
    hasImages: true,
  },
  {
    title: 'Branded Pens',
    description: 'Metal stylus pens with your logo. Perfect for trade shows, client gifts, and staff.',
    icon: SparklesIcon,
    hasImages: false,
  },
  {
    title: 'Industrial Labels',
    description: 'ABS plastic signs for electrical panels, control boxes, and equipment.',
    icon: CreditCardIcon,
    hasImages: false,
  },
  {
    title: 'Knife Engraving',
    description: 'Permanent marking for kitchen knives and chef tools.',
    icon: WrenchScrewdriverIcon,
    hasImages: false,
  },
  {
    title: 'Tool Marking',
    description: 'Identify your equipment. Marking for power tools and hand tools.',
    icon: WrenchScrewdriverIcon,
    hasImages: false,
  },
  {
    title: 'Custom Projects',
    description: 'Something unique? We can engrave almost anything.',
    icon: SparklesIcon,
    hasImages: false,
  },
]


export default function PortfolioPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-vurmz-dark text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Portfolio
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              Real examples of laser engraving work. Every piece is precision-cut and built to last.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-vurmz-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category) => (
              <div key={category.title} className="group">
                {category.hasImages ? (
                  <>
                    {/* Category with images */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <category.icon className="h-6 w-6 text-vurmz-teal" />
                        <h3 className="text-lg sm:text-xl font-semibold text-white">{category.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-6">{category.description}</p>
                      <div className="space-y-4">
                        {category.images!.map((image, idx) => (
                          <div
                            key={idx}
                            className="aspect-[4/3] rounded-lg overflow-hidden bg-[#1f2523] border border-gray-700 group-hover:border-vurmz-teal/50 transition-all"
                          >
                            <Image
                              src={image}
                              alt={`${category.title} example ${idx + 1}`}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Category without images - placeholder card */}
                    <div className="bg-[#1f2523] border border-gray-700 rounded-lg p-6 h-full flex flex-col justify-between group-hover:border-vurmz-teal/50 transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <category.icon className="h-6 w-6 text-vurmz-teal" />
                          <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">{category.description}</p>
                        <div className="bg-vurmz-dark rounded p-4 text-center mb-4">
                          <p className="text-gray-300 text-sm font-medium">Samples available</p>
                          <p className="text-gray-500 text-xs mt-1">Text for photos</p>
                        </div>
                      </div>
                      <a
                        href={getSmsLink(`I'd like to see samples of ${category.title}`)}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-vurmz-teal hover:bg-vurmz-teal-dark text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        Text for samples
                      </a>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* See Samples In Person Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#1f2523]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-vurmz-dark border border-vurmz-teal/30 rounded-2xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-vurmz-teal/20 rounded-full mb-6">
              <PhoneIcon className="h-7 w-7 text-vurmz-teal" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Want to see samples in person?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              I&apos;ll bring samples directly to your office. No commitment needed. We can discuss your project, timeline, and budget in person.
            </p>
            <a
              href={getSmsLink("Can you bring samples by?")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-vurmz-teal hover:bg-vurmz-teal-dark text-white rounded-xl font-semibold transition-colors text-lg"
            >
              <PhoneIcon className="h-5 w-5" />
              Text to schedule
            </a>
          </div>
        </div>
      </section>

{/* CTA */}
      <section className="bg-vurmz-teal py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            See something you like?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-12">
            Start your order right now. Or text me first to discuss details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
            <Link
              href="/order"
              className="bg-white text-vurmz-dark px-8 py-4 sm:px-10 sm:py-5 font-semibold text-base sm:text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2 rounded-xl"
            >
              Start Your Order
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a
              href={getSmsLink("I'm interested in your laser engraving services")}
              className="border-2 border-white/30 text-white px-8 py-4 sm:px-10 sm:py-5 font-semibold text-base sm:text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 rounded-xl"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              Text {siteInfo.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
