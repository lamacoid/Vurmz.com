'use client'

import PortfolioGallery from '@/components/PortfolioGallery'
import { motion } from 'framer-motion'
import { Hero, CTA, DarkSection, LightSection } from '@/components/PageSections'
import { FadeIn, StaggerContainer, StaggerItem, BlurIn } from '@/components/ScrollAnimations'

// Portfolio items - real completed work
const portfolioItems = [
  {
    id: 'business-1',
    title: 'Metal Business Cards',
    description: 'Brushed stainless steel business cards with laser engraved text and QR code',
    category: 'Business Items',
    industry: 'Professional Services',
    location: 'Centennial',
    imageUrl: '/portfolio/metal-business-card.png',
  },
  {
    id: 'retail-1',
    title: 'Nordstrom Beauty Perfume Atomizers',
    description: 'Branded perfume atomizer cases for Nordstrom Beauty department',
    category: 'Retail',
    industry: 'Retail',
    location: 'Cherry Creek',
  },
]

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'Retail', label: 'Retail' },
  { id: 'Culinary', label: 'Culinary' },
  { id: 'Business Items', label: 'Business' },
  { id: 'Custom Projects', label: 'Custom' },
]

// Materials I can engrave
const materials = [
  { name: 'Stainless Steel', icon: '🔩' },
  { name: 'Aluminum', icon: '🪙' },
  { name: 'Brass', icon: '🔔' },
  { name: 'Wood', icon: '🪵' },
  { name: 'Bamboo', icon: '🎍' },
  { name: 'Acrylic', icon: '💠' },
  { name: 'Leather', icon: '👜' },
  { name: 'Glass', icon: '🥃' },
  { name: 'Anodized Metal', icon: '✨' },
  { name: 'Coated Metals', icon: '🛡️' },
  { name: 'Plastic', icon: '🔲' },
  { name: 'Stone', icon: '🪨' },
]

export default function PortfolioPageContent() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <Hero
        badge="Featured Work"
        title="My"
        titleAccent="Work"
        subtitle="Types of projects I handle for local businesses. Photos coming as I document more work."
      />

      {/* PORTFOLIO GALLERY */}
      <LightSection gradient="to-gray">
        <FadeIn>
          <PortfolioGallery items={portfolioItems} categories={categories} />
        </FadeIn>
      </LightSection>

      {/* MATERIALS - Now light background */}
      <DarkSection>
        <BlurIn className="text-center mb-16">
          <p className="text-vurmz-teal font-semibold text-sm uppercase tracking-wider mb-4">
            Materials
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-vurmz-dark tracking-tight"
            style={{ textShadow: '0 1px 2px rgba(61, 68, 65, 0.08)' }}
          >
            What I Can Engrave
          </h2>
        </BlurIn>

        <StaggerContainer staggerDelay={0.06} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {materials.map((material) => (
            <StaggerItem key={material.name}>
              <motion.div
                className="p-6 rounded-2xl text-center transition-all"
                style={{
                  background: 'rgba(250, 251, 249, 1)',
                  border: '1px solid rgba(106, 140, 140, 0.12)',
                  boxShadow: '0 2px 8px rgba(61, 68, 65, 0.06)',
                }}
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  boxShadow: '0 8px 32px rgba(61, 68, 65, 0.10)',
                }}
              >
                <div className="text-3xl mb-3">{material.icon}</div>
                <p className="text-vurmz-dark font-medium text-sm">{material.name}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </DarkSection>

      {/* CTA */}
      <CTA
        title="Have a Project in Mind?"
        subtitle="Tell me what you need. I respond the same day with pricing and turnaround time."
        buttonLabel="Request a Quote"
        buttonHref="/order"
      />
    </div>
  )
}
