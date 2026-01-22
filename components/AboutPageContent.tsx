'use client'

// import Link from 'next/link'
import { ArrowRightIcon, UserIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Hero, CTA, DarkSection, LightSection } from '@/components/PageSections'
import { FadeIn, StaggerContainer, StaggerItem, BlurIn } from '@/components/ScrollAnimations'

// Service areas
const serviceAreas = [
  { name: 'Centennial', primary: true },
  { name: 'Greenwood Village' },
  { name: 'Cherry Hills' },
  { name: 'Highlands Ranch' },
  { name: 'Lone Tree' },
  { name: 'Englewood' },
  { name: 'Littleton' },
  { name: 'Denver' },
  { name: 'Aurora' },
  { name: 'Parker' },
]

export default function AboutPageContent() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <Hero
        badge="Centennial, Colorado"
        title="About"
        titleAccent="VURMZ"
        subtitle="Precision laser engraving for local businesses."
      />

      {/* ABOUT ME - With Photo */}
      <LightSection gradient="to-gray">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo placeholder */}
            <FadeIn>
              <div
                className="aspect-[4/5] rounded-3xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'rgba(247, 245, 240, 1)',
                  border: '1px solid rgba(106, 140, 140, 0.12)',
                  boxShadow: '0 4px 16px rgba(61, 68, 65, 0.08)',
                }}
              >
                {/* Replace this div with an Image component when you have the photo */}
                <div className="text-center p-8">
                  <UserIcon className="w-24 h-24 mx-auto mb-4" style={{ color: 'rgba(196, 181, 165, 1)' }} />
                  <span className="text-sm" style={{ color: 'rgba(156, 161, 157, 1)' }}>Your photo here</span>
                </div>
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn delay={0.2}>
              <div className="space-y-6">
                <div>
                  <p className="text-vurmz-teal font-semibold text-sm uppercase tracking-wider mb-3">
                    Meet Zach
                  </p>
                  <h2
                    className="text-3xl md:text-4xl font-bold text-vurmz-dark tracking-tight"
                    style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
                  >
                    Owner & Operator
                  </h2>
                </div>

                <p className="text-lg leading-relaxed" style={{ color: 'rgba(90, 95, 92, 1)' }}>
                  I grew up in South Metro Denver before Centennial was even incorporated. This is my community, and I take pride in helping local businesses look professional.
                </p>

                <p className="text-lg leading-relaxed" style={{ color: 'rgba(90, 95, 92, 1)' }}>
                  Before starting VURMZ, I spent years in professional kitchens. That background taught me what precision and consistency really mean. Every piece that leaves my shop is inspected for clean lines, proper depth, and accurate positioning.
                </p>

                <p className="text-lg leading-relaxed" style={{ color: 'rgba(90, 95, 92, 1)' }}>
                  The attention to detail and pride in results that I brought to cooking—I bring the same to laser engraving. Your brand deserves that level of care.
                </p>

                <div className="pt-4">
                  <a
                    href="sms:+17192573834"
                    className="inline-flex items-center gap-2 text-vurmz-teal font-semibold hover:text-vurmz-teal-dark transition-colors"
                  >
                    Text me: (719) 257-3834
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </LightSection>

      {/* WHAT I DO */}
      <LightSection gradient="from-gray">
        <BlurIn className="text-center mb-16">
          <p className="text-vurmz-teal font-semibold text-sm uppercase tracking-wider mb-4">
            Services
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-vurmz-dark tracking-tight"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            What I Do
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'rgba(90, 95, 92, 1)' }}>
            Permanent marking solutions that last the life of your products.
          </p>
        </BlurIn>

        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: 'Branded Merchandise',
              description: 'Pens, coasters, and promotional items with your logo permanently engraved.',
              icon: '🖊️',
            },
            {
              title: 'Industrial Marking',
              description: 'Asset tags, safety labels, and equipment identification that withstands harsh conditions.',
              icon: '🏷️',
            },
            {
              title: 'Custom Signage',
              description: 'Professional signs, nameplates, and plaques for offices, warehouses, and storefronts.',
              icon: '📋',
            },
            {
              title: 'Business Cards',
              description: 'Metal business cards that make a lasting impression.',
              icon: '💳',
            },
          ].map((service) => (
            <StaggerItem key={service.title}>
              <motion.div
                className="p-8 rounded-2xl transition-all"
                style={{
                  background: 'rgba(250, 251, 249, 1)',
                  border: '1px solid rgba(106, 140, 140, 0.12)',
                  boxShadow: '0 2px 8px rgba(61, 68, 65, 0.06)',
                }}
                whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(61, 68, 65, 0.10)' }}
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3
                  className="text-xl font-semibold text-vurmz-dark mb-2"
                  style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.06)' }}
                >
                  {service.title}
                </h3>
                <p style={{ color: 'rgba(90, 95, 92, 1)' }}>{service.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </LightSection>

      {/* SERVICE AREAS - Now light background */}
      <DarkSection>
        <BlurIn className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-vurmz-dark tracking-tight mb-4"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            Serving South Metro Denver
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(90, 95, 92, 1)' }}>
            Based in Centennial. Delivery available throughout the metro area.
          </p>
        </BlurIn>

        <StaggerContainer staggerDelay={0.03} className="flex flex-wrap gap-3 justify-center mb-10">
          {serviceAreas.map((area) => (
            <StaggerItem key={area.name}>
              <motion.span
                className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: area.primary ? 'rgba(106, 140, 140, 1)' : 'rgba(250, 251, 249, 1)',
                  color: area.primary ? 'white' : 'rgba(61, 68, 65, 1)',
                  border: area.primary ? 'none' : '1px solid rgba(106, 140, 140, 0.15)',
                  boxShadow: area.primary ? '0 4px 20px rgba(106, 140, 140, 0.2)' : '0 2px 8px rgba(61, 68, 65, 0.06)',
                }}
                whileHover={{ scale: 1.05 }}
              >
                {area.name}
              </motion.span>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <p className="text-center" style={{ color: 'rgba(90, 95, 92, 1)' }}>
            <span className="text-vurmz-teal font-medium">Free delivery</span> on orders over $100
          </p>
        </FadeIn>
      </DarkSection>

      {/* CTA */}
      <CTA
        title="Ready to Get Started?"
        subtitle="Send a quote request or text me directly. I respond the same day."
        buttonLabel="Request a Quote"
        buttonHref="/order"
      />
    </div>
  )
}
