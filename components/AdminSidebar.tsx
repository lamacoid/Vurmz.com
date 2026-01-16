'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
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

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed inset-y-0 left-0 w-72 flex flex-col z-40"
      style={{
        background: 'linear-gradient(180deg, #2c3533 0%, #232928 100%)',
      }}
    >
      {/* Glass overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(106,140,140,0.05) 0%, transparent 30%)',
        }}
      />

      {/* Right edge highlight */}
      <div
        className="absolute top-0 right-0 bottom-0 w-px"
        style={{
          background: 'linear-gradient(180deg, rgba(106,140,140,0.2) 0%, rgba(106,140,140,0.05) 100%)',
        }}
      />

      {/* Logo */}
      <div className="relative p-6 pb-4">
        <Link href="/admin/dashboard" className="flex flex-col gap-3">
          <Image
            src="/images/vurmz-logo-full.svg"
            alt="VURMZ"
            width={160}
            height={45}
            className="h-9 w-auto brightness-0 invert opacity-90"
            priority
          />
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full self-start"
            style={{
              background: 'rgba(106,140,140,0.15)',
              border: '1px solid rgba(106,140,140,0.2)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-gray-300">Customer Portal</span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div
        className="mx-6 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(106,140,140,0.15), transparent)',
        }}
      />

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item, i) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: liquidEase }}
              >
                <Link
                  href={item.href}
                  className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(106,140,140,0.25) 0%, rgba(106,140,140,0.15) 100%)'
                      : 'transparent',
                    boxShadow: isActive
                      ? '0 2px 12px rgba(106,140,140,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
                      : 'none',
                    border: isActive ? '1px solid rgba(106,140,140,0.2)' : '1px solid transparent',
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg, #6a8c8c, #8caec4)' }}
                      transition={{ duration: 0.3, ease: liquidEase }}
                    />
                  )}
                  <item.icon
                    className={`h-5 w-5 transition-colors duration-300 ${
                      isActive ? 'text-[#8caec4]' : 'text-gray-500'
                    }`}
                  />
                  <span
                    className={`font-medium transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-1">
        {/* Divider */}
        <div
          className="mb-3 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(106,140,140,0.15), transparent)',
          }}
        />

        <Link
          href="/home"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
        >
          <GlobeAltIcon className="h-5 w-5" />
          <span className="font-medium">View Website</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 w-full"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
