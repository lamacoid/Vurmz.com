/**
 * Site Configuration System
 *
 * This powers the admin site manager. Settings are stored in a JSON file
 * and loaded at runtime so changes are instant.
 */

import fs from 'fs/promises'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'site-config.json')

export interface SiteColors {
  primary: string        // Main teal color
  primaryDark: string    // Darker teal for hover
  secondary: string      // Sage accent
  accent: string         // Powder blue accent
  dark: string           // Dark text/backgrounds
  light: string          // Light backgrounds
}

export interface SiteContent {
  heroTitle: string
  heroSubtitle: string
  tagline: string
  ctaText: string
  footerText: string
}

export interface SiteContact {
  phone: string
  email: string
  address: string
  city: string
  state: string
}

export interface PhotoSlot {
  id: string
  name: string
  description: string
  filename: string | null
  uploadedAt: string | null
}

export interface SiteConfig {
  colors: SiteColors
  content: SiteContent
  contact: SiteContact
  photos: PhotoSlot[]
  updatedAt: string
}

// Default configuration
export const DEFAULT_CONFIG: SiteConfig = {
  colors: {
    primary: '#6A8C8C',
    primaryDark: '#5A7A7A',
    secondary: '#8BA888',
    accent: '#A8C8C8',
    dark: '#3D4441',
    light: '#FAFBF9',
  },
  content: {
    heroTitle: 'Equipment Nameplates, Data Plates & Industrial Engraving',
    heroSubtitle: 'Laser engraved ABS panel labels, asset identification tags, valve tags, and safety placards. Fast turnaround for electrical contractors, HVAC technicians, and facilities management.',
    tagline: 'Same-day service. Local pickup or delivery. Text me directly.',
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
  photos: [
    { id: 'pens', name: 'Branded Pens', description: 'Metal stylus pens with engraving', filename: null, uploadedAt: null },
    { id: 'cards', name: 'Metal Business Cards', description: 'Stack of black anodized cards', filename: null, uploadedAt: null },
    { id: 'nameplates', name: 'Name Plates', description: 'Desk nameplate with stand', filename: null, uploadedAt: null },
    { id: 'coasters', name: 'Custom Coasters', description: 'Wood, slate, or stainless steel', filename: null, uploadedAt: null },
    { id: 'industrial', name: 'Industrial Labels', description: 'Panel label or valve tag', filename: null, uploadedAt: null },
    { id: 'knives', name: 'Knife Engraving', description: 'Chef or pocket knife with engraving', filename: null, uploadedAt: null },
    { id: 'tools', name: 'Tool Marking', description: 'Power tool with company name', filename: null, uploadedAt: null },
    { id: 'keychains', name: 'Keychains', description: 'Assorted engraved keychains', filename: null, uploadedAt: null },
    { id: 'closeup', name: 'Engraving Close-up', description: 'Shows precision quality', filename: null, uploadedAt: null },
    { id: 'qr', name: 'QR Code', description: 'Scannable QR on product', filename: null, uploadedAt: null },
  ],
  updatedAt: new Date().toISOString(),
}

// Load config from file (or return defaults)
export async function loadSiteConfig(): Promise<SiteConfig> {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8')
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) }
  } catch {
    // File doesn't exist, return defaults
    return DEFAULT_CONFIG
  }
}

// Save config to file
export async function saveSiteConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = await loadSiteConfig()
  const updated: SiteConfig = {
    ...current,
    ...config,
    updatedAt: new Date().toISOString(),
  }
  await fs.writeFile(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8')
  return updated
}

// Update a specific photo slot
export async function updatePhotoSlot(slotId: string, filename: string): Promise<SiteConfig> {
  const config = await loadSiteConfig()
  const photos = config.photos.map(photo =>
    photo.id === slotId
      ? { ...photo, filename, uploadedAt: new Date().toISOString() }
      : photo
  )
  return saveSiteConfig({ photos })
}

// Generate CSS variables from colors
export function generateCSSVariables(colors: SiteColors): string {
  return `
:root {
  --color-primary: ${colors.primary};
  --color-primary-dark: ${colors.primaryDark};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-dark: ${colors.dark};
  --color-light: ${colors.light};
}
  `.trim()
}
