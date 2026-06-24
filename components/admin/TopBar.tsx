'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from './icons'
import { adminNav } from './nav-config'

function breadcrumbsFor(pathname: string): { label: string; href?: string }[] {
  if (pathname === '/admin' || pathname === '/admin/') return [{ label: 'Dashboard' }]
  for (const group of adminNav) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return [{ label: group.label }, { label: item.label, href: item.href }]
      }
    }
  }
  return [{ label: 'Admin' }]
}

export default function TopBar({ onMenu, onOpenPalette }: { onMenu: () => void; onOpenPalette: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const crumbs = breadcrumbsFor(pathname)

  return (
    <header className="sticky top-0 z-40 h-14 bg-[var(--a-bg)]/90 backdrop-blur border-b border-[var(--a-line)] flex items-center px-4 gap-3">
      <button
        onClick={onMenu}
        className="md:hidden p-2 -ml-2 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] rounded"
        aria-label="Open navigation"
      >
        <Icon name="menu" className="w-5 h-5" />
      </button>

      <nav className="flex items-center gap-2 text-xs font-medium text-[var(--a-ink-soft)]">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <Icon name="chevron" className="w-3 h-3 text-[var(--a-ink-faint)]" />}
            {c.href ? (
              <span className="text-[var(--a-ink)]">{c.label}</span>
            ) : (
              <span>{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      <button
        onClick={onOpenPalette}
        className="hidden sm:inline-flex items-center gap-2 px-3 h-8 bg-white/[0.04] hover:bg-white/[0.08] rounded-md text-xs text-[var(--a-ink-soft)] transition-colors border border-[var(--a-line)]"
      >
        <Icon name="search" className="w-3.5 h-3.5" />
        <span>Search…</span>
        <kbd className="text-[10px] text-[var(--a-ink-faint)] bg-white/5 px-1.5 py-0.5 rounded ml-2">⌘K</kbd>
      </button>

      <button
        onClick={async () => {
          await fetch('/api/admin/logout', { method: 'POST' })
          router.push('/admin/login')
        }}
        className="p-2 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] rounded"
        aria-label="Sign out"
      >
        <Icon name="logout" className="w-4 h-4" />
      </button>
    </header>
  )
}
