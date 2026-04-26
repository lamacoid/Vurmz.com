'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mobileTabs } from './nav-config'
import { Icon } from './icons'

export default function MobileTabBar() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a2f2e]/95 backdrop-blur border-t border-white/5">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {mobileTabs.map(tab => {
          const active = tab.href === '/admin' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${active ? 'text-[#6BB8B2]' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Icon name={tab.icon} className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
