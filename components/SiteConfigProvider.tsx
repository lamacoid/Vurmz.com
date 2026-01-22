'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface NavItem {
  id: string
  label: string
  href: string
  enabled: boolean
  order: number
}

interface FooterLink {
  id: string
  label: string
  href: string
  enabled: boolean
}

interface SiteHeader {
  logoUrl: string
  navItems: NavItem[]
  ctaText: string
  ctaLink: string
}

interface SiteFooter {
  copyrightText: string
  showSocial: boolean
  links: FooterLink[]
}

interface SiteColors {
  primary: string
  primaryDark: string
  secondary: string
  accent: string
  dark: string
  light: string
}

interface SiteContent {
  heroTitle: string
  heroSubtitle: string
  tagline: string
  ctaText: string
  footerText: string
}

interface SiteContact {
  phone: string
  email: string
  address: string
  city: string
  state: string
}

interface Product {
  id: string
  name: string
  description: string
  price: string
  enabled: boolean
  hasDesigner: boolean
  isIndustrial?: boolean
  isCustom?: boolean
  order: number
}

interface Industry {
  id: string
  name: string
  icon: string
  enabled: boolean
}

interface Testimonial {
  id: string
  name: string
  company: string
  text: string
  enabled: boolean
}

interface SocialLinks {
  instagram: string
  facebook: string
  google: string
  linkedin: string
  yelp: string
}

interface BusinessHours {
  display: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

export interface SiteConfig {
  header: SiteHeader
  footer: SiteFooter
  colors: SiteColors
  content: SiteContent
  contact: SiteContact
  products: Product[]
  industries: Industry[]
  testimonials: Testimonial[]
  social: SocialLinks
  hours: BusinessHours
}

const defaultConfig: SiteConfig = {
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
    ],
  },
  colors: {
    primary: '#6A8C8C',
    primaryDark: '#5A7A7A',
    secondary: '#8BA888',
    accent: '#A8C8C8',
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
  products: [],
  industries: [],
  testimonials: [],
  social: {
    instagram: '',
    facebook: '',
    google: '',
    linkedin: '',
    yelp: '',
  },
  hours: {
    display: 'Flexible hours for local businesses',
    monday: '9am - 5pm',
    tuesday: '9am - 5pm',
    wednesday: '9am - 5pm',
    thursday: '9am - 5pm',
    friday: '9am - 5pm',
    saturday: 'By appointment',
    sunday: 'Closed',
  },
}

const SiteConfigContext = createContext<SiteConfig>(defaultConfig)

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)

  useEffect(() => {
    // Load config from API
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/admin/site-config')
        const data = await res.json() as SiteConfig
        setConfig(data)
        // Apply colors as CSS variables
        applyColors(data.colors)
      } catch {
        // Use defaults on error
        applyColors(defaultConfig.colors)
      }
    }
    loadConfig()
  }, [])

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  )
}

function applyColors(colors: SiteColors) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-primary-dark', colors.primaryDark)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-dark', colors.dark)
  root.style.setProperty('--color-light', colors.light)

  // Also set vurmz-specific variables for backwards compatibility
  root.style.setProperty('--vurmz-teal', colors.primary)
  root.style.setProperty('--vurmz-teal-dark', colors.primaryDark)
  root.style.setProperty('--vurmz-sage', colors.secondary)
  root.style.setProperty('--vurmz-powder', colors.accent)
  root.style.setProperty('--vurmz-dark', colors.dark)
  root.style.setProperty('--vurmz-light', colors.light)
}
