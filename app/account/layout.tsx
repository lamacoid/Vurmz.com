import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Account · VURMZ',
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a2f2e] text-gray-100">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-wider text-cream">VURMZ</Link>
          <Link href="/" className="text-xs text-gray-400 hover:text-cream">← Back to site</Link>
        </div>
      </header>
      {children}
    </div>
  )
}
