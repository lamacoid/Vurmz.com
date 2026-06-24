/**
 * The VURMZ logo: the standalone wordmark (the RM-ligature mark, the only logo),
 * pulled into its own clean SVG. We use it as a CSS mask and fill it with a brand
 * token so it is color-correct in both modes. Pass `glow` for the neon, lit look
 * used in the banner; pass a fixed `color` for contexts like the footer.
 */
const MASK = "url('/images/vurmz-wordmark.svg')"
const NEON = '#7FCFD4'

export default function VurmzLogo({
  className = 'h-7 sm:h-8',
  color = 'var(--ink)',
  glow = false,
}: {
  className?: string
  color?: string
  glow?: boolean
}) {
  return (
    <span
      role="img"
      aria-label="VURMZ"
      className={`inline-block ${className}`}
      style={{
        aspectRatio: '23.7 / 7.18',
        backgroundColor: glow ? NEON : color,
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'left center',
        maskPosition: 'left center',
        filter: glow
          ? 'drop-shadow(0 0 4px rgba(127,207,212,0.95)) drop-shadow(0 0 11px rgba(127,207,212,0.6)) drop-shadow(0 0 22px rgba(127,207,212,0.35))'
          : undefined,
      }}
    />
  )
}
