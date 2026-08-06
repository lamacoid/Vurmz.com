import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * THE KIT. Every control, in the states it ships in.
 *
 * The rule that makes this worth having: nothing on a page is hand-styled.
 * If a page needs a button, it uses Button. If a page needs a panel, it uses
 * Card. When a new thing gets added to the site it lands in a shape that
 * already exists, which is the whole point.
 *
 * Sizes, radii, type steps and the motion curve all come from the tokens in
 * globals.css. Do not put a raw hex or a raw pixel size in here.
 */

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

/* ────────────────────────────────────────────────────────────── Eyebrow ── */

export function Eyebrow({
  children,
  bordered = false,
  tone = 'coral',
  className,
}: {
  children: ReactNode
  bordered?: boolean
  tone?: 'coral' | 'ink' | 'glass'
  className?: string
}) {
  const tones = {
    coral: 'text-[var(--eyebrow)]',
    ink: 'text-[var(--ink)]',
    glass: 'text-[var(--feature-accent)]',
  }
  return (
    <p
      className={cx(
        'font-mono uppercase text-[length:var(--step-eyebrow)] tracking-[0.26em]',
        tones[tone],
        bordered && 'inline-block border border-current/40 rounded-[var(--r-control)] px-2.5 py-1',
        className,
      )}
    >
      {children}
    </p>
  )
}

/* ───────────────────────────────────────────────────────────────  Button ── */

type ButtonVariant = 'coral' | 'teal' | 'outline' | 'ghost' | 'imessage'
type ButtonSize = 'sm' | 'md' | 'lg'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // The one real action on a view. Never two.
  coral: 'bg-[var(--coral)] text-white hover:bg-[var(--coral-hover)]',
  // The business-side action, the other brand colour.
  teal: 'bg-[var(--feature-accent)] text-[var(--feature-deep)] hover:brightness-95',
  outline: 'border border-[var(--ink)]/25 text-[var(--ink)] hover:border-[var(--coral)]',
  ghost: 'text-[var(--ink)] hover:bg-[var(--ink)]/[0.06]',
  // Carries the chat glyph. Apple's bubble blue on purpose, so it reads as
  // Messages and not as a brand colour. Never redraw the glyph.
  imessage: 'bg-[#0B93F6] text-white hover:bg-[#0A84FF]',
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[length:var(--step-fine)] gap-1.5',
  md: 'h-11 px-5 text-[length:var(--step-body)] gap-2',
  lg: 'h-[52px] px-7 text-[length:var(--step-lead)] gap-2.5',
}

export function Button({
  children,
  variant = 'coral',
  size = 'md',
  href,
  icon,
  iconRight,
  fullWidth,
  disabled,
  type = 'button',
  onClick,
  className,
  ...rest
}: {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
  className?: string
  'aria-label'?: string
}) {
  const classes = cx(
    'inline-flex items-center justify-center whitespace-nowrap font-semibold',
    'rounded-[var(--r-control)] transition-colors duration-[var(--t-hover)] ease-[var(--ease)]',
    // Press sinks 1px. Buttons stay flat: no shadow, no gradient, no scale.
    'active:translate-y-px',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    fullWidth && 'w-full',
    disabled && 'opacity-50 pointer-events-none',
    className,
  )
  const inner = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  )

  if (href && !disabled) {
    const external = href.startsWith('http') || href.startsWith('sms:') || href.startsWith('mailto:')
    return external ? (
      <a href={href} className={classes} {...rest}>{inner}</a>
    ) : (
      <Link href={href} className={classes} {...rest}>{inner}</Link>
    )
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {inner}
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────── Pill ── */
// Filters, tags, service areas. Never a sidebar of checkboxes.

export function Pill({
  children,
  active = false,
  tone = 'outline',
  href,
  onClick,
  className,
}: {
  children: ReactNode
  active?: boolean
  tone?: 'outline' | 'soft' | 'coral'
  href?: string
  onClick?: () => void
  className?: string
}) {
  const tones = {
    outline: 'border border-[var(--ink)]/20 text-[var(--ink-soft)] hover:border-[var(--coral)] hover:text-[var(--ink)]',
    soft: 'bg-[var(--surface)] border border-[var(--hairline)] text-[var(--ink)]',
    coral: 'bg-[var(--coral)]/[0.14] border border-[var(--coral)]/45 text-[var(--ink)]',
  }
  const classes = cx(
    'inline-flex items-center rounded-full px-3.5 py-1.5 font-medium',
    'text-[length:var(--step-fine)] transition-colors duration-[var(--t-hover)] ease-[var(--ease)]',
    active
      ? 'border-[1.5px] border-[var(--ink)] bg-[var(--glass)] font-semibold text-[var(--ink)]'
      : tones[tone],
    className,
  )
  if (href) return <Link href={href} className={classes}>{children}</Link>
  if (onClick) return <button type="button" onClick={onClick} className={classes} aria-pressed={active}>{children}</button>
  return <span className={classes}>{children}</span>
}

/* ───────────────────────────────────────────────────────────────── Badge ── */
// Status and category labels. A badge states a fact; a pill is a choice.

export function Badge({
  children,
  tone = 'soft',
  className,
}: {
  children: ReactNode
  tone?: 'soft' | 'teal' | 'coral'
  className?: string
}) {
  const tones = {
    soft: 'border-[var(--ink)]/25 text-[var(--ink-soft)]',
    teal: 'border-[var(--feature-accent)] text-[var(--ink)] bg-[var(--glass)]',
    coral: 'border-[var(--eyebrow)]/40 text-[var(--eyebrow)]',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center whitespace-nowrap rounded-[var(--r-control)] border px-1.5 py-px',
        'font-mono uppercase text-[10px] tracking-[0.15em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────── Card ── */
// Panels. paper = the cream surface, feature = the deep teal band,
// flat = the quiet glass panel that lifts by tint alone.

export function Card({
  children,
  variant = 'paper',
  padding = 'md',
  radius = 'panel',
  interactive = false,
  href,
  className,
}: {
  children: ReactNode
  variant?: 'paper' | 'feature' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  radius?: 'tile' | 'panel' | 'band'
  interactive?: boolean
  href?: string
  className?: string
}) {
  const variants = {
    paper: 'bg-[var(--surface)] border border-[var(--hairline)] text-[var(--ink)]',
    feature: 'bg-[var(--feature)] text-[var(--feature-ink)]',
    flat: 'bg-[var(--glass)] border border-[var(--hairline)] text-[var(--ink)]',
  }
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8 sm:p-10' }
  const radii = {
    tile: 'rounded-[var(--r-tile)]',
    panel: 'rounded-[var(--r-panel)]',
    band: 'rounded-[var(--r-band)]',
  }
  const classes = cx(
    variants[variant],
    paddings[padding],
    radii[radius],
    interactive && 'transition-colors duration-[var(--t-hover)] ease-[var(--ease)] hover:border-[var(--coral)]',
    className,
  )
  if (href) return <Link href={href} className={cx('block', classes)}>{children}</Link>
  return <div className={classes}>{children}</div>
}

/* ───────────────────────────────────────────────────────────────── Input ── */

export function Input({
  id,
  label,
  hint,
  className,
  ...props
}: {
  id: string
  label: string
  hint?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[length:var(--step-row)] font-medium text-[var(--ink-soft)] mb-1.5">
        {label}
      </label>
      <input
        id={id}
        className={cx(
          'w-full rounded-[var(--r-control)] border border-[var(--hairline)] bg-[var(--page)]',
          'px-3.5 py-2.5 text-[length:var(--step-body)] text-[var(--ink)]',
          'placeholder:text-[var(--ink-soft)]/60',
          'transition-colors duration-[var(--t-hover)] ease-[var(--ease)] focus:border-[var(--coral)] focus:outline-none',
        )}
        {...props}
      />
      {hint && <p className="mt-1.5 text-[length:var(--step-fine)] text-[var(--ink-soft)]">{hint}</p>}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── Stepper ── */
// The one control the kit did not ship. Built from Input's border and radius
// so it belongs to the same family.

export function Stepper({
  value,
  onDecrement,
  onIncrement,
  label,
  unit,
}: {
  value: number
  onDecrement: () => void
  onIncrement: () => void
  label: string
  unit?: string
}) {
  const btn =
    'w-[46px] h-[50px] flex items-center justify-center text-[length:var(--step-section)] leading-none ' +
    'text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors duration-[var(--t-hover)] ease-[var(--ease)]'
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-[var(--ink)]/25 rounded-[var(--r-control)] overflow-hidden">
        <button type="button" aria-label={`Fewer ${label}`} onClick={onDecrement} className={cx(btn, 'border-r border-[var(--ink)]/15')}>
          &minus;
        </button>
        <span aria-live="polite" className="w-[84px] text-center text-[length:var(--step-section)] font-semibold text-[var(--ink)] tabular-nums">
          {value}
        </span>
        <button type="button" aria-label={`More ${label}`} onClick={onIncrement} className={cx(btn, 'border-l border-[var(--ink)]/15')}>
          +
        </button>
      </div>
      {unit && <span className="text-[length:var(--step-body)] text-[var(--ink-soft)]">{unit}</span>}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── Section ── */
// The rhythm rule, made structural: air first, then one hairline, then a tint
// change only if the section really is a different kind of thing. Never two
// borders in a row, never a shadow to separate.

export function Section({
  children,
  eyebrow,
  title,
  lede,
  tint = 'none',
  id,
  className,
}: {
  children?: ReactNode
  eyebrow?: string
  title?: string
  lede?: string
  tint?: 'none' | 'glass' | 'feature'
  id?: string
  className?: string
}) {
  const tints = {
    none: '',
    glass: 'bg-[var(--glass-soft)]',
    feature: 'bg-[var(--feature)] text-[var(--feature-ink)]',
  }
  return (
    <section
      id={id}
      className={cx('py-14 sm:py-[72px] scroll-mt-24', tints[tint], className)}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-11">
        {eyebrow && <Eyebrow tone={tint === 'feature' ? 'glass' : 'coral'}>{eyebrow}</Eyebrow>}
        {title && (
          <h2
            className="mt-3 text-[length:var(--step-section)] leading-tight font-semibold tracking-[-0.01em] text-balance"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {title}
          </h2>
        )}
        {lede && (
          <p className="mt-3 max-w-[var(--measure)] text-[length:var(--step-lead)] leading-[1.7] opacity-80">
            {lede}
          </p>
        )}
        {children && <div className={cx(eyebrow || title || lede ? 'mt-8' : '')}>{children}</div>}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────── Rows ── */
// The menu line: name, dotted leader, value. Used anywhere a list of facts
// needs to read like a posted price list.

export function Rows({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('text-[length:var(--step-row)] text-[var(--ink-soft)]', className)}>{children}</div>
}

export function Row({ label, value, leader = false }: { label: ReactNode; value: ReactNode; leader?: boolean }) {
  return (
    <span className="flex items-baseline gap-2.5 py-2.5 border-b border-[var(--hairline)] last:border-b-0">
      <span className="font-semibold text-[var(--ink)]">{label}</span>
      {leader && <span className="flex-1 -translate-y-[3px] border-b border-dotted border-[var(--ink)]/25 min-w-[1.5rem]" aria-hidden />}
      <span className={cx('tabular-nums', leader ? 'whitespace-nowrap' : 'ml-auto text-right')}>{value}</span>
    </span>
  )
}
