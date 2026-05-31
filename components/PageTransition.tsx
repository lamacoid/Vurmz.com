'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

/**
 * Wraps page content so each screen reveals with a smooth fade + rise
 * instead of a hard swap. Lives inside a section `template.tsx`, which
 * re-mounts on every navigation — so the entrance animation replays each
 * time a new screen is selected, while the section's layout (header,
 * footer, cart) stays mounted and perfectly still.
 *
 * Content-only: no `position: fixed` elements live inside this wrapper,
 * so animating its transform never disturbs the chrome.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}
