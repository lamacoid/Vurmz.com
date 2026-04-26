'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminNav } from './nav-config'
import { Icon } from './icons'

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <aside className="h-full flex flex-col bg-[#1a2f2e] border-r border-white/5">
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
        <span className="text-sm font-bold tracking-wider text-cream">VURMZ</span>
        <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">ADMIN</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {adminNav.map(group => (
          <div key={group.label}>
            <p className="px-2 mb-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = item.href === '/admin'
                  ? pathname === '/admin' || pathname === '/admin/'
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
                      active
                        ? 'bg-[#243B39] text-cream'
                        : 'text-gray-400 hover:text-cream hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon name={item.icon} className={`w-4 h-4 ${active ? 'text-[#6BB8B2]' : ''}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.chunk != null && (
                      <span className="text-[9px] text-gray-600 font-mono">soon</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-white/5">
        <a
          href="https://vurmz.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-gray-400 hover:text-cream transition-colors"
        >
          <Icon name="chevron" className="w-3 h-3 rotate-[-45deg]" />
          View live site
        </a>
      </div>
    </aside>
  )
}
