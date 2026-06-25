// Shown while the shop's edge/D1 data loads, so a cold start never shows a
// blank document. Matches the paper theme; the layout (header/footer) stays put.
export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-8 w-48 rounded-md bg-[var(--ink)]/10 animate-pulse mb-3" />
      <div className="h-4 w-72 rounded bg-[var(--ink)]/10 animate-pulse mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--hairline)] overflow-hidden">
            <div className="aspect-square bg-[var(--ink)]/10 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 rounded bg-[var(--ink)]/10 animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-[var(--ink)]/10 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
