import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Shop | VURMZ',
    template: '%s | VURMZ Shop',
  },
  description: 'Shop laser engraved products from VURMZ. Pens, coasters, keychains, business cards, and more. Browse with pricing, order in packs.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F0E6D3] text-[#243B39] min-h-screen" data-theme="shop">
      {children}
    </div>
  )
}
