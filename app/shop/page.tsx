import Link from 'next/link'

export default function ShopHome() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">VURMZ Shop</h1>
        <p className="text-[#243B39]/60 mb-8">Products and pricing coming soon.</p>
        <Link
          href="/"
          className="text-sm underline text-[#243B39]/50 hover:text-[#243B39] transition-colors"
        >
          Back to vurmz.com
        </Link>
      </div>
    </div>
  )
}
