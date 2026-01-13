import { Metadata } from 'next'
import Providers from '@/components/Providers'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | VURMZ Admin'
  },
  robots: {
    index: false,
    follow: false
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}
