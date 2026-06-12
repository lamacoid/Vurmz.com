/**
 * VURMZ Site Information - Single Source of Truth
 *
 * All contact info, business details, and navigation should reference this file.
 * Never hardcode phone numbers, emails, or addresses elsewhere.
 */

export const siteInfo = {
  // Business Identity
  name: 'VURMZ',
  legalName: 'VURMZ LLC',
  tagline: 'Laser engraving for small business.',
  description: 'Premium laser engraving services in Centennial, Colorado. Branded pens, metal business cards, industrial labels, knife engraving, and more.',

  // Contact
  phone: '(719) 257-3834',
  phoneClean: '7192573834',
  email: 'zach@vurmz.com',

  // Location
  city: 'Centennial',
  state: 'Colorado',
  stateAbbr: 'CO',
  address: 'Centennial, CO', // For display purposes
  fullAddress: 'Centennial, CO 80112', // For NAP consistency and schema markup

  // Coordinates (for weather API, maps)
  coordinates: {
    lat: 39.58,
    lng: -104.87,
  },

  // URLs — www is the canonical host (metadataBase, live canonicals, and the
  // Pages custom domain all use www; keep JSON-LD and OG URLs consistent).
  url: 'https://www.vurmz.com',

  // Social (add when available)
  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
  },

  // Founder
  founder: {
    name: 'Zach',
    fullName: 'Zach DeMillo',
  },

  // Service Areas
  serviceAreas: [
    'Centennial',
    'Littleton',
    'Lone Tree',
    'Parker',
    'Highlands Ranch',
    'Englewood',
    'Castle Rock',
    'Aurora',
    'Greenwood Village',
    'Cherry Hills',
    'Denver',
  ],
} as const

// Navigation items — services section
export const servicesNavigation = [
  { name: 'Pricing', href: '/services/pricing' },
  { name: 'Materials', href: '/services/materials' },
  { name: 'Portfolio', href: '/services/portfolio' },
  { name: 'Community', href: '/services/centennial' },
  { name: 'Contact', href: '/services/contact' },
  { name: 'Shop', href: '/shop' },
] as const

// Alias for backward compat with Header/Footer
export const navigation = servicesNavigation

// Navigation items — shop section
export const shopNavigation = [
  { name: 'Products', href: '/shop' },
  { name: 'Contact', href: '/shop/contact' },
] as const

// Quick helper functions
export const getSmsLink = (message?: string) =>
  message ? `sms:${siteInfo.phoneClean}?body=${encodeURIComponent(message)}` : `sms:${siteInfo.phoneClean}`
// VURMZ is text-only — no call links anywhere.
export const getEmailLink = () => `mailto:${siteInfo.email}`
