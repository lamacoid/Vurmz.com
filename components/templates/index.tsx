import type { ReactNode } from 'react'
import { Eyebrow, Button, Card } from '@/components/ui/kit'

/**
 * THREE TEMPLATES. Landing, index, detail. Everything else is a variant.
 *
 * These exist so a new page cannot invent its own layout. Each one takes
 * named slots, and the slots are the predetermined slices: you fill them,
 * you do not arrange them. Spacing, measure, grid and rhythm are decided
 * here once, so a page added six months from now sits at the same rhythm
 * as the ones built today.
 *
 *   A · Landing  → home, services, about
 *   B · Index    → shop, portfolio, any list with filters
 *   C · Detail   → product, portfolio piece, service detail
 *
 * The shared frame: 1280 max, 44px margins, 12 columns at 24px gutters,
 * content on 9 and rail on 3.
 */

const cx = (...p: (string | false | null | undefined)[]) => p.filter(Boolean).join(' ')

/** The one page frame. Nothing sets its own max width. */
export function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('max-w-[1280px] mx-auto px-5 sm:px-11', className)}>{children}</div>
}

/* ══════════════════════════════════════════════ A · LANDING FLOW ══════ */

export function LandingTemplate({
  eyebrow,
  title,
  lede,
  action,
  band,
  threeUp,
  panel,
  closing,
  children,
}: {
  eyebrow: string
  title: ReactNode
  lede: ReactNode
  /** The one primary. A landing page has exactly one. */
  action?: ReactNode
  /** Full-bleed image band directly under the opening. */
  band?: ReactNode
  /** Three tiles. The template holds the grid so they cannot drift. */
  threeUp?: ReactNode[]
  /** One quiet panel: the glass surface, facts not selling. */
  panel?: ReactNode
  /** The teal closing band. A line and one action. */
  closing?: { line: string; action: ReactNode }
  children?: ReactNode
}) {
  return (
    <div>
      <Frame className="pt-12 sm:pt-16 pb-14">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className="mt-3.5 text-[length:var(--step-display)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {title}
        </h1>
        <p className="mt-5 max-w-[var(--measure)] text-[length:var(--step-lead)] leading-[1.7] text-[var(--ink-soft)]">
          {lede}
        </p>
        {action && <div className="mt-8">{action}</div>}
      </Frame>

      {band && (
        <div className="mb-14">
          <Frame>
            <div className="relative overflow-hidden rounded-[var(--r-band)] bg-[var(--feature-deep)]">{band}</div>
          </Frame>
        </div>
      )}

      {threeUp && threeUp.length > 0 && (
        <Frame className="pb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {threeUp.map((tile, i) => (
              <div key={i}>{tile}</div>
            ))}
          </div>
        </Frame>
      )}

      {panel && (
        <Frame className="pb-14">
          <Card variant="flat" padding="lg" radius="panel">{panel}</Card>
        </Frame>
      )}

      {children}

      {closing && (
        <div className="bg-[var(--feature)] text-[var(--feature-ink)]">
          <Frame className="py-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <p
                className="text-[length:var(--step-section)] leading-tight font-semibold text-balance"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                {closing.line}
              </p>
              <div className="sm:ml-auto">{closing.action}</div>
            </div>
          </Frame>
        </div>
      )}
    </div>
  )
}

/* ═════════════════════════════════════════ B · INDEX WITH RAIL ══════ */

export function IndexTemplate({
  eyebrow,
  title,
  lede,
  filters,
  children,
  rail,
}: {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  /** Pills. Never a sidebar of checkboxes. */
  filters?: ReactNode
  /** The listing itself. */
  children: ReactNode
  /** Sticky, holds the running summary and the only primary. */
  rail?: ReactNode
}) {
  return (
    <div>
      <Frame className="pt-12 sm:pt-16 pb-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className="mt-3.5 text-[length:var(--step-display)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-[var(--measure)] text-[length:var(--step-lead)] leading-[1.7] text-[var(--ink-soft)]">
            {lede}
          </p>
        )}
      </Frame>

      {filters && (
        <div className="sticky top-0 z-30 bg-[var(--page)]/92 backdrop-blur border-y border-[var(--hairline)]">
          <Frame className="py-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">{filters}</div>
          </Frame>
        </div>
      )}

      <Frame className="pt-10 pb-14">
        {rail ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-[var(--gutter)] items-start">
            <div className="lg:col-span-9">{children}</div>
            <aside className="lg:col-span-3 lg:sticky lg:top-24">{rail}</aside>
          </div>
        ) : (
          children
        )}
      </Frame>
    </div>
  )
}

/* ════════════════════════════════════════════ C · DETAIL, TWO UP ══════ */

export function DetailTemplate({
  breadcrumb,
  media,
  eyebrow,
  title,
  lede,
  decisions,
  spec,
  related,
}: {
  breadcrumb?: ReactNode
  /** Media left. Photo, gallery, whatever the thing looks like. */
  media: ReactNode
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  /** Decisions right: the options, the price, one primary and one quiet alternate. */
  decisions: ReactNode
  /** The glassy teal spec panel. Facts about the thing, stated flat. */
  spec?: ReactNode
  /** Related work closes the page. */
  related?: ReactNode
}) {
  return (
    <div>
      {breadcrumb && <Frame className="pt-6">{breadcrumb}</Frame>}

      <Frame className="pt-8 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[var(--gutter)] items-start">
          <div className="lg:col-span-7">{media}</div>

          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            <div>
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              <h1
                className="mt-3 text-[length:var(--step-section)] leading-tight font-semibold tracking-[-0.01em] text-balance text-[var(--ink)]"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                {title}
              </h1>
              {lede && (
                <p className="mt-3 text-[length:var(--step-body)] leading-[1.65] text-[var(--ink-soft)]">{lede}</p>
              )}
            </div>

            {decisions}

            {spec && <Card variant="flat" padding="md" radius="panel">{spec}</Card>}
          </div>
        </div>
      </Frame>

      {related && (
        <Frame className="pb-14">{related}</Frame>
      )}
    </div>
  )
}

/** Re-export so a page imports its layout and its parts from one place. */
export { Button, Card, Eyebrow }
