'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import TopBar from '@/components/admin/TopBar'
import MobileTabBar from '@/components/admin/MobileTabBar'
import CommandPalette from '@/components/admin/CommandPalette'
import { Icon } from '@/components/admin/icons'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [paletteFake, setPaletteFake] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/me')
      .then(r => {
        if (r.ok) setAuthed(true)
        else { setAuthed(false); router.push('/admin/login') }
      })
      .catch(() => { setAuthed(false); router.push('/admin/login') })
  }, [router])

  // Note: deliberately NOT setting `is-admin` on body — globals.css has a rule
  // that hides non-<main> direct children of body when that class is set, which
  // black-holes the admin shell. Root layout renders no chrome, so no need.

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#1c474e] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    )
  }
  if (!authed) return null

  const openPalette = () => {
    setPaletteFake(x => x + 1)
    const ev = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    document.dispatchEvent(ev)
  }

  return (
    <div className="min-h-screen bg-[#1c474e] text-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-60 z-30">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-72 max-w-[80vw] h-full">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-3 right-3 p-2 text-gray-400 hover:text-cream"
            aria-label="Close"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="md:pl-60 flex flex-col min-h-screen">
        <TopBar onMenu={() => setDrawerOpen(true)} onOpenPalette={openPalette} />
        <main className="flex-1 pb-24 md:pb-8">{children}</main>
      </div>

      <MobileTabBar />
      <CommandPalette key={paletteFake} />
    </div>
  )
}
