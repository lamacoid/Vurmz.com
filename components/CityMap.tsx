/**
 * The real streets around the shop, pulled from OpenStreetMap by
 * scripts/build-street-map.py. The SVG is used as a CSS mask, so the
 * streets take whatever ink the band they sit on uses: dark ink on the
 * paper, cream on the teal room. Decorative only.
 */
export default function CityMap({
  className = '',
  color = 'var(--ink)',
  opacity = 0.07,
}: {
  className?: string
  color?: string
  opacity?: number
}) {
  const mask = 'url(/images/maps/centennial-streets.svg)'
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none absolute ${className}`}
      style={{
        backgroundColor: color,
        opacity,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: 'cover',
        maskSize: 'cover',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    />
  )
}
