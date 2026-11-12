// Shown while the item list loads from D1, so a cold start never shows a
// blank document. The layout (header and footer) stays put.
export default function ShopLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
      <div className="h-8 w-48 rounded-md bg-[var(--ink)]/10 animate-pulse mb-3" />
      <div className="h-4 w-72 rounded bg-[var(--ink)]/10 animate-pulse mb-10" />
      <div className="space-y-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-baseline gap-3 pb-4 border-b border-[var(--hairline)]">
            <div className="h-4 w-1/2 rounded bg-[var(--ink)]/10 animate-pulse" />
            <div className="flex-1" />
            <div className="h-4 w-12 rounded bg-[var(--ink)]/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
