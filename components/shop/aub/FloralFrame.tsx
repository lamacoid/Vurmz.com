/**
 * FloralFrame — wraps page content in a thick Morris-pattern border ring.
 * The loud floral lives only in this band; the content area inside stays
 * calm beige. One pattern per page (pass `pattern`).
 */

const PATTERNS: Record<string, string> = {
  'strawberry-thief': '/shop/ornaments/strawberry_thief.jpg',
  marigold: '/shop/ornaments/marigold_panel.jpg',
}

export default function FloralFrame({
  children,
  pattern = 'strawberry-thief',
}: {
  children: React.ReactNode
  pattern?: keyof typeof PATTERNS | string
}) {
  const src = PATTERNS[pattern] ?? PATTERNS['strawberry-thief']
  return (
    <div className="floral-frame" style={{ backgroundImage: `url(${src})` }}>
      <div className="floral-frame-inner">{children}</div>
    </div>
  )
}
