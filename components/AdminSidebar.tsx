'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  HomeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  SwatchIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  GlobeAltIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Revenue', href: '/admin/revenue', icon: CurrencyDollarIcon },
  { name: 'Quotes', href: '/admin/quotes', icon: DocumentTextIcon },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Customers', href: '/admin/customers', icon: UserGroupIcon },
  { name: 'Materials', href: '/admin/materials', icon: SwatchIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-vurmz-dark text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin/dashboard" className="flex flex-col gap-2">
          <Image
            src="/images/vurmz-logo.svg"
            alt="VURMZ"
            width={140}
            height={35}
            className="h-8 w-auto brightness-0 invert"
          />
          <span className="text-xs text-vurmz-teal">Admin Dashboard</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-vurmz-teal text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
        >
          <GlobeAltIcon className="h-5 w-5" />
          View Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
