'use client'

import Link from 'next/link'
import {
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CubeIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Hero, CTA, DarkSection, LightSection } from '@/components/PageSections'
import { FadeIn, StaggerContainer, StaggerItem, BlurIn, SlideIn } from '@/components/ScrollAnimations'
import { TiltCard, SpotlightCard } from '@/components/PremiumAnimations'

const pricingCategories = [
  {
    category: 'Promotional Items',
    items: [
      { name: 'Metal Stylus Pens', price: '$3-$7/pen', note: 'Price varies with upgrades' },
      { name: 'Keychains', price: 'Starting at $4/unit', note: 'Various styles' },
      { name: 'Coasters', price: 'Starting at $6/unit', note: 'Wood or metal' },
      { name: 'Bottle Openers', price: 'Starting at $5/unit', note: 'Metal' },
    ],
  },
  {
    category: 'Tool & Equipment Marking',
    items: [
      { name: 'Kitchen Pans (existing)', price: '$3-$5/pan', note: '9th, 6th, hotel pans, sheet trays' },
      { name: 'Knife Engraving (your knife)', price: '$15/knife', note: 'Bring your own knife' },
      { name: 'Pocket Knife + Engraving', price: '$40', note: 'Basic pocket knife included' },
      { name: 'Chef Knife + Engraving', price: '$50', note: 'Basic chef knife included' },
      { name: 'Power Tools', price: '$30-$75/item', note: 'Complexity varies' },
    ],
  },
  {
    category: 'Business Cards & Signage',
    items: [
      { name: 'Metal Business Cards', price: '$3-$6/card', note: 'Stainless steel from $15' },
      { name: 'Name Plates', price: 'Starting at $15', note: 'Desk or door mount' },
      { name: 'Custom Signs', price: 'Quote based', note: 'Size and material dependent' },
    ],
  },
  {
    category: 'Industrial Labels & Signs',
    items: [
      { name: 'Panel Labels (small)', price: '$8-$12/sign', note: 'Under 2" x 4"' },
      { name: 'Panel Labels (medium)', price: '$12-$20/sign', note: '2" x 4" to 4" x 6"' },
      { name: 'Equipment Signs (large)', price: '$20-$40/sign', note: 'Larger sizes' },
    ],
  },
]

const comparison = [
  { factor: 'Turnaround', vurmz: 'Next-day possible', online: '1-3 weeks' },
  { factor: 'Minimum Order', vurmz: 'No minimum', online: '50-250 pieces' },
  { factor: 'Shipping', vurmz: 'Free local pickup', online: '$15-$50+' },
  { factor: 'Communication', vurmz: 'Direct with owner', online: 'Support tickets' },
  { factor: 'Rush Orders', vurmz: 'Usually yes', online: 'Extra fees' },
]

const whyLocal = [
  { icon: ClockIcon, title: 'Fast Turnaround', desc: 'Days, not weeks' },
  { icon: CubeIcon, title: 'No Minimums', desc: 'Order what you need' },
  { icon: UserIcon, title: 'Direct Communication', desc: 'Talk to the owner' },
  { icon: TruckIcon, title: 'Local Service', desc: 'Pickup or delivery' },
]

export default function PricingPageContent() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <Hero
        badge="Honest Pricing"
        title="Transparent"
        titleAccent="Pricing"
        subtitle="Premium local service, honestly priced. Here's what things cost and why."
      />

      {/* WHY LOCAL */}
      <LightSection gradient="to-gray">
        <BlurIn className="text-center mb-20">
          <p className="text-vurmz-teal font-semibold text-sm uppercase tracking-wider mb-4">
            The Local Advantage
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            Why Local Costs More
          </h2>
        </BlurIn>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyLocal.map((item) => (
            <StaggerItem key={item.title}>
              <TiltCard className="h-full" intensity={6}>
                <SpotlightCard
                  className="p-8 h-full rounded-2xl text-center"
                  style={{
                    background: 'rgba(250, 251, 249, 1)',
                    border: '1px solid rgba(106, 140, 140, 0.12)',
                    boxShadow: '0 2px 8px rgba(61, 68, 65, 0.06)',
                  }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-vurmz-teal flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    style={{ boxShadow: '0 4px 20px rgba(106, 140, 140, 0.2)' }}
                  >
                    <item.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <h3
                    className="font-semibold text-vurmz-dark text-lg mb-2"
                    style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.06)' }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: 'rgba(90, 95, 92, 1)' }}>{item.desc}</p>
                </SpotlightCard>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </LightSection>

      {/* COST COMPARISON */}
      <LightSection>
        <BlurIn className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            The Real Cost Comparison
          </h2>
        </BlurIn>

        <FadeIn>
          <div
            className="p-8 md:p-12 rounded-3xl max-w-5xl mx-auto"
            style={{
              background: 'rgba(247, 245, 240, 1)',
              border: '1px solid rgba(106, 140, 140, 0.12)',
              boxShadow: '0 4px 16px rgba(61, 68, 65, 0.08)',
            }}
          >
            <h3
              className="text-2xl font-semibold text-vurmz-dark mb-10 text-center"
              style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.06)' }}
            >
              Example: 50 Branded Pens
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SlideIn direction="left">
                <div
                  className="p-8 h-full rounded-2xl"
                  style={{
                    background: 'rgba(250, 251, 249, 1)',
                    border: '1px solid rgba(106, 140, 140, 0.12)',
                    boxShadow: '0 2px 8px rgba(61, 68, 65, 0.06)',
                  }}
                >
                  <h4 className="font-semibold mb-6 text-lg" style={{ color: 'rgba(156, 161, 157, 1)' }}>
                    Online Wholesaler
                  </h4>
                  <ul className="space-y-4" style={{ color: 'rgba(90, 95, 92, 1)' }}>
                    <li className="flex justify-between">
                      <span>100 pens @ $2.00 (minimum)</span>
                      <span className="font-medium">$200</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Setup fee</span>
                      <span className="font-medium">$25</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium">$18</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Wait time</span>
                      <span className="font-medium">2 weeks</span>
                    </li>
                  </ul>
                  <div className="border-t mt-6 pt-6" style={{ borderColor: 'rgba(106, 140, 140, 0.15)' }}>
                    <p className="flex justify-between font-semibold text-vurmz-dark text-lg">
                      <span>Total</span>
                      <span>$243 + hassle</span>
                    </p>
                  </div>
                </div>
              </SlideIn>

              <SlideIn direction="right">
                <div
                  className="p-8 h-full rounded-2xl relative"
                  style={{
                    background: 'rgba(250, 251, 249, 1)',
                    border: '2px solid rgba(106, 140, 140, 1)',
                    boxShadow: '0 4px 20px rgba(106, 140, 140, 0.15)',
                  }}
                >
                  <div
                    className="absolute top-0 right-0 px-4 py-1.5 text-sm font-medium rounded-bl-xl text-white"
                    style={{ background: 'rgba(106, 140, 140, 1)' }}
                  >
                    Better Deal
                  </div>
                  <h4 className="font-semibold text-vurmz-teal mb-6 text-lg">VURMZ</h4>
                  <ul className="space-y-4" style={{ color: 'rgba(90, 95, 92, 1)' }}>
                    <li className="flex justify-between">
                      <span>50 pens @ $3</span>
                      <span className="font-medium">$150</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Setup fee</span>
                      <span className="font-medium text-vurmz-teal">$0</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Pickup in Centennial</span>
                      <span className="font-medium text-vurmz-teal">$0</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Wait time</span>
                      <span className="font-medium text-vurmz-teal">Next day</span>
                    </li>
                  </ul>
                  <div className="border-t mt-6 pt-6" style={{ borderColor: 'rgba(106, 140, 140, 0.3)' }}>
                    <p className="flex justify-between font-semibold text-vurmz-teal text-lg">
                      <span>Total</span>
                      <span>$150</span>
                    </p>
                  </div>
                </div>
              </SlideIn>
            </div>

            <p className="text-center mt-10 text-lg" style={{ color: 'rgba(90, 95, 92, 1)' }}>
              <span className="font-semibold text-vurmz-dark">Result:</span> You save $93 and get them next day.
            </p>
          </div>
        </FadeIn>
      </LightSection>

      {/* PRICING TABLES - Now light background */}
      <DarkSection>
        <BlurIn className="text-center mb-20">
          <h2
            className="text-5xl md:text-6xl font-bold text-vurmz-dark tracking-tight mb-6"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            Product Pricing
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(90, 95, 92, 1)' }}>
            Transparent pricing for all services. No hidden fees.
          </p>
        </BlurIn>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pricingCategories.map((category) => (
            <StaggerItem key={category.category}>
              <div
                className="h-full rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(250, 251, 249, 1)',
                  border: '1px solid rgba(106, 140, 140, 0.12)',
                  boxShadow: '0 4px 16px rgba(61, 68, 65, 0.08)',
                }}
              >
                <div className="bg-vurmz-teal px-6 py-5">
                  <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                </div>
                <div className="p-6">
                  <table className="w-full">
                    <tbody>
                      {category.items.map((item, idx) => (
                        <tr
                          key={item.name}
                          className="group"
                          style={{
                            borderBottom: idx < category.items.length - 1 ? '1px solid rgba(106, 140, 140, 0.1)' : 'none'
                          }}
                        >
                          <td className="py-4">
                            <p className="font-medium text-vurmz-dark">{item.name}</p>
                            <p className="text-sm" style={{ color: 'rgba(156, 161, 157, 1)' }}>{item.note}</p>
                          </td>
                          <td className="py-4 text-right">
                            <p className="font-semibold text-vurmz-teal">{item.price}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <p className="text-center mt-12 text-lg" style={{ color: 'rgba(90, 95, 92, 1)' }}>
            Prices are estimates. Final pricing depends on quantity, complexity, and materials.{' '}
            <Link href="/order" className="text-vurmz-teal font-medium hover:underline">
              Get an exact quote
            </Link>
          </p>
        </FadeIn>
      </DarkSection>

      {/* COMPARISON TABLE */}
      <LightSection gradient="from-gray">
        <BlurIn className="text-center mb-16">
          <p className="text-vurmz-teal font-semibold text-sm uppercase tracking-wider mb-4">
            Compare
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            VURMZ vs Online Wholesalers
          </h2>
        </BlurIn>

        <FadeIn>
          <div
            className="overflow-hidden rounded-3xl max-w-4xl mx-auto"
            style={{
              background: 'rgba(250, 251, 249, 1)',
              border: '1px solid rgba(106, 140, 140, 0.12)',
              boxShadow: '0 4px 16px rgba(61, 68, 65, 0.08)',
            }}
          >
            <table className="w-full">
              <thead>
                <tr className="bg-vurmz-dark text-white">
                  <th className="px-6 py-5 text-left font-semibold">Factor</th>
                  <th className="px-6 py-5 text-left font-semibold">VURMZ</th>
                  <th className="px-6 py-5 text-left font-semibold">Online</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <tr
                    key={row.factor}
                    className="transition-colors hover:bg-vurmz-cream/50"
                    style={{
                      borderBottom: idx < comparison.length - 1 ? '1px solid rgba(106, 140, 140, 0.1)' : 'none'
                    }}
                  >
                    <td className="px-6 py-5 font-medium text-vurmz-dark">{row.factor}</td>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-2 text-vurmz-teal">
                        <CheckCircleIcon className="h-5 w-5" />
                        {row.vurmz}
                      </span>
                    </td>
                    <td className="px-6 py-5" style={{ color: 'rgba(156, 161, 157, 1)' }}>{row.online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </LightSection>

      {/* CTA */}
      <CTA
        title="Get an Exact Quote"
        subtitle="Tell me what you need and I'll send you exact pricing the same day."
        buttonLabel="Request a Quote"
        buttonHref="/order"
      />
    </div>
  )
}
