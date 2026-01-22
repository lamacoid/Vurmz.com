import { Metadata } from 'next'
import PremiumBuilder from '@/components/PremiumBuilder'

export const metadata: Metadata = {
  title: 'Start Your Order',
  description: 'Build your custom laser engraving order online. Metal business cards, branded pens, industrial labels, and more. Same-day turnaround in Denver metro.',
  keywords: [
    'laser engraving order Denver',
    'custom engraving builder',
    'metal business cards order',
    'branded pens Colorado',
    'Centennial laser engraving',
    'Denver metro custom engraving',
  ],
  openGraph: {
    title: 'Start Your Order | VURMZ Laser Engraving',
    description: 'Build your custom laser engraving order. Metal business cards, branded pens, industrial labels. Same-day service in Denver metro.',
    type: 'website',
    url: 'https://www.vurmz.com/order',
  },
  alternates: {
    canonical: 'https://www.vurmz.com/order',
  },
}

export default function OrderPage() {
  return <PremiumBuilder />
}
