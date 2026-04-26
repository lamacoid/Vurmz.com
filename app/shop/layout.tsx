import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Laser Engraving',
  description: 'Custom laser engraving in Centennial, CO. Bring your own item or tell me what you need. Knives, tumblers, cutting boards, laptops, and more. Hand-delivered across South Denver.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F0E6D3] text-[#243B39] min-h-screen" data-theme="shop">
      <SiteHeader variant="shop" />
      <main className="min-h-screen">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
