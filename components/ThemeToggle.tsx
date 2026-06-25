'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

/**
 * Light/dark switch. The actual theme is applied before paint by the inline
 * script in app/layout.tsx (reads vurmz-theme, falls back to the OS setting);
 * this button just flips the `.dark` class on <html> and remembers the choice.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  // Start null so the icon doesn't flash the wrong way before we read the DOM.
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.style.colorScheme = next ? 'dark' : 'light'
    try {
      localStorage.setItem('vurmz-theme', next ? 'dark' : 'light')
    } catch {}
    setDark(next)
  }

  const label = dark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-full p-2 text-[var(--ink-soft)] hover:text-vurmz-cta transition-colors ${className}`}
    >
      {/* Show the icon for the mode you'd switch TO. Before hydration, render the
          moon as a stable default so markup matches and there's no warning. */}
      {dark ? <SunIcon className="w-[18px] h-[18px]" /> : <MoonIcon className="w-[18px] h-[18px]" />}
    </button>
  )
}
