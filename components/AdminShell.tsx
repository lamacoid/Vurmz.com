'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminSidebar from './AdminSidebar'

interface AdminShellProps {
  children: React.ReactNode
  title: string
}

const liquidEase = [0.23, 1, 0.32, 1] as const

export default function AdminShell({ children, title }: AdminShellProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(106,140,140,0.2)', borderTopColor: '#6a8c8c' }}
          />
          <p className="text-sm text-gray-500">Loading...</p>
        </motion.div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Ambient background effects */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 85% 10%, rgba(106,140,140,0.06) 0%, transparent 50%), radial-gradient(ellipse 50% 30% at 10% 90%, rgba(140,174,196,0.04) 0%, transparent 50%)',
        }}
      />

      <AdminSidebar />

      <div className="ml-72">
        {/* Header */}
        <header
          className="sticky top-0 z-30 px-8 py-5"
          style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(106,140,140,0.08)',
          }}
        >
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: liquidEase }}
              className="text-2xl font-semibold text-gray-800 tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: liquidEase }}
              className="flex items-center gap-3"
            >
              <div
                className="px-4 py-2 rounded-xl text-sm"
                style={{
                  background: 'rgba(106,140,140,0.06)',
                  border: '1px solid rgba(106,140,140,0.1)',
                }}
              >
                <span className="text-gray-600">{session.user?.name || session.user?.email}</span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: liquidEase }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
