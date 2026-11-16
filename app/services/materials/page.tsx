import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import MaterialsClient from './MaterialsClient'

export const metadata: Metadata = pageMeta({
  title: 'Materials I Engrave: Metal, Wood, Glass, Slate | VURMZ',
  description: 'What VURMZ engraves and how each material marks: stainless steel, anodized aluminum, brass, wood, glass, slate, leather, and acrylic. Centennial, Colorado.',
  path: '/services/materials',
})

export default function Page() {
  return <MaterialsClient />
}
