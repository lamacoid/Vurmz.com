import Link from 'next/link'

export default function AccountStub({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link href="/account" className="text-xs text-gray-500 hover:text-cream mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold text-cream mb-3">{title}</h1>
      <p className="text-sm text-gray-400 max-w-xl leading-relaxed">{description}</p>
      <p className="mt-6 text-xs text-gray-600 font-mono uppercase tracking-wider">Available soon</p>
    </div>
  )
}
