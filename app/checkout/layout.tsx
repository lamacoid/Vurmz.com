import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | VURMZ',
  description: 'Checkout — VURMZ',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#DED6C3] text-[#16525C] min-h-screen" data-theme="shop">
      {children}
    </div>
  )
}
