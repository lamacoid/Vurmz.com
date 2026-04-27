import type { Metadata } from 'next'
import UnsubscribeForm from './UnsubscribeForm'

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from VURMZ newsletter updates.',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams
  return (
    <div className="min-h-screen bg-vurmz-dark flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-cream mb-3">Unsubscribe</h1>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
          Sorry to see you go. Enter your email below and I&apos;ll take you off the list.
        </p>
        <UnsubscribeForm initialEmail={params.email ?? ''} />
      </div>
    </div>
  )
}
