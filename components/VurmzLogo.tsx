/**
 * The VURMZ logo, color-correct in both modes. Instead of loading the SVG as an
 * image (which forces its baked-in color and needs a filter hack), we use the
 * logo shape as a CSS mask and fill it with a brand token. So it renders deep
 * teal on paper (light) and oatmeal on teal (dark) automatically.
 *
 * Default color is var(--ink). Pass a color for fixed contexts (e.g. the footer,
 * which is always deep teal, wants var(--feature-ink)).
 */
const MASK = "url('/images/vurmz-logo-full.svg')"

export default function VurmzLogo({
  className = 'h-7 sm:h-8',
  color = 'var(--ink)',
}: {
  className?: string
  color?: string
}) {
  return (
    <span
      role="img"
      aria-label="VURMZ Laser Engraving"
      className={`inline-block ${className}`}
      style={{
        aspectRatio: '67.677 / 7.177',
        backgroundColor: color,
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'left center',
        maskPosition: 'left center',
      }}
    />
  )
}
