import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | VURMZ',
  description: 'Checkout — VURMZ',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F0E6D3] text-[#1A4F48] min-h-screen" data-theme="shop">
      {children}
    </div>
  )
}
