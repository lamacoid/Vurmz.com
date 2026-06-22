import type { Metadata } from 'next'

// Server layout wrapping all /admin routes. Its only job is metadata: it makes
// the admin installable as a standalone Mac/desktop app (Safari "Add to Dock",
// Chrome "Install") via the manifest + Apple web-app tags, and keeps the back
// office out of search indexes. The interactive shell lives in (app)/layout.tsx.
export const metadata: Metadata = {
  title: 'VURMZ Admin',
  manifest: '/admin.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'VURMZ Admin',
    statusBarStyle: 'black-translucent',
  },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
