import type { Metadata } from 'next'
import MaterialsClient from './MaterialsClient'

export const metadata: Metadata = {
  title: 'Materials & Capabilities',
  description: 'What VURMZ can engrave: metal, wood, glass, acrylic, leather, anodized aluminum, stainless steel. Material capability reference for laser engraving in Centennial, CO.',
  alternates: { canonical: 'https://www.vurmz.com/services/materials' },
}

export default function Page() {
  return <MaterialsClient />
}
