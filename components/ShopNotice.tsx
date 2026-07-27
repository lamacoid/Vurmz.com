import { siteInfo, getSmsLink } from '@/lib/site-info'

// Floating notice for the pause in work. Static server component, no state,
// no dismiss. Sits bottom-right; lifts above the LaserCursor toggle
// (fixed bottom-4 left-4) on mobile, where the two would otherwise collide.
export default function ShopNotice() {
  return (
    <aside
      aria-label="A note about orders"
      className="fixed bottom-16 right-3 sm:bottom-4 sm:right-4 z-30 w-[calc(100vw-1.5rem)] max-w-[280px] sm:max-w-[300px] rounded-xl border border-[var(--hairline)] bg-[var(--surface)] p-4 shadow-lg shadow-black/10"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C67A6F]" aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--eyebrow)]">
          Orders are paused
        </p>
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
        I had a house fire. Everyone is safe. I am displaced and cannot work
        orders until I find a longer-term setup. I am still glad to talk through
        ideas or answer questions, and I hope to be back soon.
      </p>
      <a
        href={getSmsLink()}
        className="mt-3 inline-block text-[12.5px] font-medium text-[var(--ink)] underline underline-offset-4 decoration-[var(--hairline)] hover:decoration-[#C67A6F] transition-colors"
      >
        Text {siteInfo.phone}
      </a>
    </aside>
  )
}
