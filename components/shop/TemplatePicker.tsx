'use client'
/**
 * TemplatePicker — layout chips for the metal card products. Each chip is a
 * small abstract thumbnail of the layout (silver structure on the dark card),
 * drawn in code so there is no asset pipeline and nothing to keep in sync.
 * The choice rides the order as options.template (the label); Zach lays the
 * card out at proof time from vurmz-control/CARD-TEMPLATES.md. Picking one
 * is optional: no selection means Zach chooses the layout.
 *
 * Templates come from product metadata (orderTemplates); unknown keys get a
 * generic thumbnail so new data never breaks the page.
 */

export interface OrderTemplate {
  key: string
  label: string
}

const CARD_BG = '#212326'
const MARK = '#c9cdd1'
const ETCH = '#6f7478'

function Thumb({ tplKey }: { tplKey: string }) {
  const shapes = (() => {
    switch (tplKey) {
      case 'crest':
        return (
          <>
            <circle cx="67" cy="21" r="8" fill="none" stroke={MARK} strokeWidth="1.5" />
            <rect x="47" y="35" width="40" height="3" fill={MARK} />
            <rect x="57" y="43" width="20" height="1" fill={MARK} />
            <rect x="49" y="49" width="36" height="5" fill={MARK} />
            <rect x="55" y="58" width="24" height="3" fill={MARK} />
            <rect x="42" y="70" width="50" height="3" fill={MARK} />
          </>
        )
      case 'divider':
        return (
          <>
            <rect x="20" y="28" width="20" height="12" fill={MARK} />
            <rect x="18" y="46" width="24" height="3" fill={MARK} />
            <rect x="52" y="18" width="1" height="49" fill={MARK} />
            <rect x="62" y="26" width="40" height="5" fill={MARK} />
            <rect x="62" y="35" width="28" height="3" fill={MARK} />
            <rect x="62" y="47" width="44" height="3" fill={MARK} />
            <rect x="62" y="54" width="44" height="3" fill={MARK} />
            <rect x="62" y="61" width="44" height="3" fill={MARK} />
          </>
        )
      case 'letterhead':
        return (
          <>
            <rect x="16" y="15" width="44" height="4" fill={MARK} />
            <rect x="16" y="23" width="14" height="2" fill={MARK} />
            <rect x="16" y="48" width="40" height="6" fill={MARK} />
            <rect x="16" y="58" width="26" height="3" fill={MARK} />
            <rect x="16" y="67" width="54" height="3" fill={MARK} />
          </>
        )
      case 'monogram':
        return (
          <>
            <text x="12" y="70" fill={MARK} fontSize="60" fontFamily="Georgia, serif">R</text>
            <rect x="85" y="50" width="34" height="4" fill={MARK} />
            <rect x="93" y="58" width="26" height="3" fill={MARK} />
            <rect x="85" y="66" width="34" height="3" fill={MARK} />
          </>
        )
      case 'frame':
        return (
          <>
            <rect x="10" y="8" width="115" height="69" fill="none" stroke={MARK} strokeWidth="1.5" />
            <rect x="14" y="12" width="107" height="61" fill="none" stroke={MARK} strokeWidth="0.5" />
            <rect x="47" y="26" width="40" height="3" fill={MARK} />
            <rect x="45" y="36" width="44" height="5" fill={MARK} />
            <rect x="53" y="45" width="28" height="3" fill={MARK} />
            <rect x="42" y="57" width="50" height="3" fill={MARK} />
          </>
        )
      case 'band':
        return (
          <>
            {[[10, 12], [22, 20], [12, 32], [24, 42], [10, 52], [21, 62], [13, 73], [24, 10], [25, 30], [11, 42]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="2" fill={ETCH} />
            ))}
            <rect x="38" y="22" width="40" height="4" fill={MARK} />
            <rect x="38" y="34" width="44" height="6" fill={MARK} />
            <rect x="38" y="44" width="28" height="3" fill={MARK} />
            <rect x="38" y="56" width="44" height="3" fill={MARK} />
          </>
        )
      case 'scan':
        return (
          <>
            <rect x="16" y="24" width="36" height="3" fill={MARK} />
            <rect x="16" y="32" width="40" height="5" fill={MARK} />
            <rect x="16" y="41" width="26" height="3" fill={MARK} />
            <rect x="16" y="53" width="32" height="3" fill={MARK} />
            <rect x="86" y="22" width="10" height="10" fill="none" stroke={MARK} strokeWidth="2.5" />
            <rect x="108" y="22" width="10" height="10" fill="none" stroke={MARK} strokeWidth="2.5" />
            <rect x="86" y="44" width="10" height="10" fill="none" stroke={MARK} strokeWidth="2.5" />
            <rect x="102" y="40" width="4" height="4" fill={MARK} />
            <rect x="109" y="47" width="4" height="4" fill={MARK} />
            <rect x="102" y="52" width="4" height="4" fill={MARK} />
            <rect x="94" y="36" width="4" height="4" fill={MARK} />
          </>
        )
      case 'signature':
        return (
          <>
            <path d="M 25 44 q 10 -20 20 -2 t 20 0 t 20 0 t 22 -4" fill="none" stroke={MARK} strokeWidth="2" strokeLinecap="round" />
            <rect x="48" y="54" width="38" height="3" fill={MARK} />
            <rect x="42" y="68" width="50" height="3" fill={MARK} />
          </>
        )
      default:
        return (
          <>
            <rect x="45" y="30" width="44" height="5" fill={MARK} />
            <rect x="53" y="40" width="28" height="3" fill={MARK} />
            <rect x="42" y="54" width="50" height="3" fill={MARK} />
          </>
        )
    }
  })()

  return (
    <svg viewBox="0 0 135 85" width="108" height="68" aria-hidden className="block rounded-[3px]">
      <rect x="0" y="0" width="135" height="85" rx="5" fill={CARD_BG} />
      {shapes}
    </svg>
  )
}

export default function TemplatePicker({
  templates,
  value,
  onChange,
}: {
  templates: OrderTemplate[]
  value: string | null
  onChange: (key: string | null) => void
}) {
  if (templates.length === 0) return null
  return (
    <div className="mb-4">
      <span className="block text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-2">Layout</span>
      <div className="flex flex-wrap gap-2">
        {templates.map(t => {
          const isSel = t.key === value
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(isSel ? null : t.key)}
              aria-pressed={isSel}
              className={`p-1.5 pb-1 rounded-sm border text-center transition-colors ${
                isSel
                  ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10'
                  : 'border-[var(--hairline)] hover:border-[var(--ink)]/40'
              }`}
            >
              <Thumb tplKey={t.key} />
              <span className={`block mt-1 text-[11px] ${isSel ? 'text-[var(--ink)] font-semibold' : 'text-[var(--ink-soft)]'}`}>
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-[var(--ink-soft)]">Optional. No pick means I lay it out from what you send.</p>
    </div>
  )
}
