import Link from 'next/link'
import { Icon } from './icons'

export default function ComingSoon({
  title,
  chunk,
  description,
  ships,
}: {
  title: string
  chunk: number
  description: string
  ships: string
}) {
  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--a-ink)]">{title}</h1>
      </div>

      <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--a-accent)]/10 border border-[var(--a-accent)]/20 flex items-center justify-center text-[var(--a-accent)] font-mono text-sm">
            C{chunk}
          </div>
          <div className="flex-1">
            <p className="text-xs font-mono uppercase tracking-[0.15em] text-[var(--a-accent)] mb-2">Chunk {chunk}</p>
            <h2 className="text-lg font-bold text-[var(--a-ink)] mb-2">{ships}</h2>
            <p className="text-sm text-[var(--a-ink-soft)] leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="border-t border-[var(--a-line)] mt-6 pt-4 flex items-center justify-between text-xs text-[var(--a-ink-faint)]">
          <span>Foundation is ready — the data layer exists, the UI ships in Chunk {chunk}.</span>
          <Link href="/admin" className="text-[var(--a-accent)] hover:underline inline-flex items-center gap-1">
            Back to dashboard
            <Icon name="chevron" className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
