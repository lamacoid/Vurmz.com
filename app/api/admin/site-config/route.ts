export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

// Default configuration
const defaultConfig = {
  header: {
    logoUrl: '/images/vurmz-logo-full.svg',
    navItems: [
      { id: 'services', label: 'Services', href: '/services', enabled: true, order: 0 },
      { id: 'portfolio', label: 'Portfolio', href: '/portfolio', enabled: true, order: 1 },
      { id: 'pricing', label: 'Pricing', href: '/pricing', enabled: true, order: 2 },
      { id: 'about', label: 'About', href: '/about', enabled: true, order: 3 },
      { id: 'contact', label: 'Contact', href: '/contact', enabled: true, order: 4 },
    ],
    ctaText: 'Start Order',
    ctaLink: '/order',
  },
  footer: {
    copyrightText: '© VURMZ Laser Engraving. Centennial, Colorado.',
    showSocial: true,
    links: [
      { id: 'services', label: 'Services', href: '/services', enabled: true },
      { id: 'pricing', label: 'Pricing', href: '/pricing', enabled: true },
      { id: 'contact', label: 'Contact', href: '/contact', enabled: true },
      { id: 'privacy', label: 'Privacy', href: '/privacy', enabled: false },
    ],
  },
  colors: {
    primary: '#6A8C8C',
    primaryDark: '#5A7A7A',
    secondary: '#8CAEC4',
    accent: '#F5F5F0',
    dark: '#3D4441',
    light: '#FAFBF9',
  },
  content: {
    heroTitle: 'Equipment Labels & Industrial Engraving',
    heroSubtitle: 'ABS panel labels, asset tags, valve tags, safety placards, and equipment nameplates. No minimum orders. Same-day turnaround for Denver metro.',
    tagline: 'Build your order online or text me directly. Same-day response.',
    ctaText: 'Start Your Order',
    footerText: '© VURMZ Laser Engraving. Centennial, Colorado.',
  },
  contact: {
    phone: '(719) 257-3834',
    email: 'zach@vurmz.com',
    address: 'Centennial',
    city: 'Centennial',
    state: 'Colorado',
  },
  products: [
    {
      id: 'metal-business-cards',
      name: 'Metal Business Cards',
      description: 'Premium stainless steel cards with custom engraving',
      price: 'Starting at $5/card',
      enabled: true,
      hasDesigner: true,
      order: 0,
    },
    {
      id: 'industrial-labels',
      name: 'Industrial Labels & Tags',
      description: 'Durable labels for equipment, safety, and compliance',
      price: 'Quote based',
      enabled: true,
      hasDesigner: false,
      isIndustrial: true,
      order: 1,
    },
    {
      id: 'nametags',
      name: 'Name Tags & Badges',
      description: 'Professional name tags for your team',
      price: 'Starting at $8/tag',
      enabled: true,
      hasDesigner: true,
      order: 2,
    },
    {
      id: 'custom',
      name: 'Custom Projects',
      description: 'Knives, tools, gifts, and more',
      price: 'Quote based',
      enabled: true,
      hasDesigner: false,
      isCustom: true,
      order: 3,
    },
  ],
  photos: [
    { id: 'hero', name: 'Hero Image', description: 'Main homepage banner', filename: null, uploadedAt: null },
    { id: 'business-cards', name: 'Business Cards', description: 'Metal business card example', filename: null, uploadedAt: null },
    { id: 'industrial', name: 'Industrial Labels', description: 'Equipment or safety label', filename: null, uploadedAt: null },
    { id: 'nametags', name: 'Name Tags', description: 'Name tag example', filename: null, uploadedAt: null },
    { id: 'custom-1', name: 'Custom Work 1', description: 'Knife or tool engraving', filename: null, uploadedAt: null },
    { id: 'custom-2', name: 'Custom Work 2', description: 'Another custom piece', filename: null, uploadedAt: null },
  ],
  media: [],
  industries: [
    { id: 'electrical', name: 'Electrical Contractors', icon: 'bolt', enabled: true },
    { id: 'hvac', name: 'HVAC', icon: 'fire', enabled: true },
    { id: 'plumbing', name: 'Plumbing', icon: 'wrench', enabled: true },
    { id: 'restaurants', name: 'Restaurants', icon: 'utensils', enabled: true },
    { id: 'medical', name: 'Medical/Dental', icon: 'heart', enabled: true },
    { id: 'auto', name: 'Automotive', icon: 'car', enabled: true },
  ],
  testimonials: [],
  seo: {
    siteTitle: 'VURMZ | Laser Engraving in Centennial, Colorado',
    siteDescription: 'Professional laser engraving services for businesses in Denver metro. Metal business cards, industrial labels, name tags, and custom projects.',
    ogImage: '/images/og-image.jpg',
    keywords: 'laser engraving, Centennial Colorado, Denver metro, metal business cards, industrial labels, name tags',
  },
  social: {
    instagram: '',
    facebook: '',
    google: '',
    linkedin: '',
    yelp: '',
  },
  hours: {
    display: 'Flexible hours - text anytime',
    monday: '9am - 6pm',
    tuesday: '9am - 6pm',
    wednesday: '9am - 6pm',
    thursday: '9am - 6pm',
    friday: '9am - 6pm',
    saturday: 'By appointment',
    sunday: 'Closed',
  },
  pricing: [
    {
      category: 'Industrial Labels & Tags',
      items: [
        { name: 'ABS Panel Labels', price: 'Quote per job', note: 'Breaker boxes, equipment panels' },
        { name: 'Asset Tags', price: 'Quote per job', note: 'Equipment identification' },
        { name: 'Custom Industrial Signage', price: 'Quote per job', note: 'Size and quantity dependent' },
      ],
    },
    {
      category: 'Awards & Trophies',
      items: [
        { name: 'Acrylic Awards', price: 'Quote based', note: 'Crystal-clear finish' },
        { name: 'Glass Trophies', price: 'Quote based', note: 'Premium recognition' },
        { name: 'Wood Plaques', price: 'Quote based', note: 'Classic look' },
        { name: 'Brass Name Plates', price: 'Quote based', note: 'Desk or door mount' },
      ],
    },
    {
      category: 'Branded Pens (Pack of 15)',
      items: [
        { name: 'Fully loaded stylus pen', price: '$7.50/pen = $112.50', note: '2 lines + logo + both sides' },
        { name: 'Simple (1 line only)', price: '$3/pen = $45', note: 'Text only, one side' },
      ],
    },
    {
      category: 'Coasters (Pack of 15)',
      items: [
        { name: 'Base (logo + 1 line)', price: '$4/coaster = $60', note: 'Slate or stainless' },
        { name: '+ QR Code', price: '+$2/coaster', note: 'Link to menu, reviews, etc.' },
        { name: '+ Extra text', price: '+$2/coaster', note: 'Additional lines' },
      ],
    },
    {
      category: 'Keychains (Pack of 15)',
      items: [
        { name: 'Acrylic base (1 side)', price: '$3/keychain = $45', note: 'Lightweight, colorful' },
        { name: 'Metal base (1 side)', price: '$4/keychain = $60', note: 'Premium feel' },
        { name: '+ Same on back', price: '+$2/keychain', note: 'Duplicate design' },
        { name: '+ Different on back', price: '+$3/keychain', note: 'Unique second side' },
      ],
    },
    {
      category: 'Metal Business Cards',
      items: [
        { name: 'Fully loaded (matte black)', price: '$6/card', note: 'QR + logo + back side' },
        { name: 'Fully loaded (stainless)', price: '$18/card', note: 'QR + logo + back side' },
        { name: 'Simple (text only)', price: '$3/card', note: 'One side, no extras' },
      ],
    },
    {
      category: 'Other Items',
      items: [
        { name: 'Cutting Boards (pack of 15)', price: '~$45/board = $675', note: 'Hardwood' },
        { name: 'Signs (min 5)', price: 'Quote based', note: 'Custom sizing' },
        { name: 'Tool/Equipment Marking', price: 'Quote based', note: 'Bring your items' },
      ],
    },
  ],
}

// GET - Load site config
export async function GET() {
  try {
    const db = getD1()

    const result = await db.prepare(
      "SELECT config FROM site_config WHERE id = 'main' LIMIT 1"
    ).first() as { config: string } | null

    if (result?.config) {
      const config = JSON.parse(result.config)
      return NextResponse.json({ ...defaultConfig, ...config })
    }

    return NextResponse.json(defaultConfig)
  } catch (error) {
    console.error('Error loading site config:', error)
    return NextResponse.json(defaultConfig)
  }
}

type SiteConfig = typeof defaultConfig

// POST - Save site config
export async function POST(request: NextRequest) {
  try {
    const db = getD1()
    const updates = await request.json() as Partial<SiteConfig>

    let currentConfig = defaultConfig
    try {
      const result = await db.prepare(
        "SELECT config FROM site_config WHERE id = 'main' LIMIT 1"
      ).first() as { config: string } | null

      if (result?.config) {
        currentConfig = { ...defaultConfig, ...JSON.parse(result.config) }
      }
    } catch {
      // Use defaults
    }

    const newConfig = { ...currentConfig, ...updates }
    const configJson = JSON.stringify(newConfig)

    await db.prepare(
      "INSERT INTO site_config (id, config, updated_at) VALUES ('main', ?, datetime('now')) ON CONFLICT(id) DO UPDATE SET config = excluded.config, updated_at = datetime('now')"
    ).bind(configJson).run()

    return NextResponse.json(newConfig)
  } catch (error) {
    console.error('Error saving site config:', error)
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
