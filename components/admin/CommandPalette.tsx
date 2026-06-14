'use client'
import { Command } from 'cmdk'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminNav } from './nav-config'
import { Icon } from './icons'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div onClick={e => e.stopPropagation()} className="w-full max-w-xl bg-[#143E38] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <Command label="Global command menu" shouldFilter>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <Icon name="search" className="w-4 h-4 text-gray-400" />
                <Command.Input
                  placeholder="Search pages, products, customers…"
                  className="flex-1 bg-transparent outline-none text-cream placeholder:text-gray-500 text-sm"
                  autoFocus
                />
                <kbd className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">esc</kbd>
              </div>
              <Command.List className="max-h-[50vh] overflow-y-auto py-2">
                <Command.Empty className="px-4 py-8 text-sm text-gray-500 text-center">
                  No results.
                </Command.Empty>
                {adminNav.map(group => (
                  <Command.Group key={group.label} heading={group.label} className="px-2">
                    {group.items.map(item => (
                      <Command.Item
                        key={item.href}
                        value={`${group.label} ${item.label}`}
                        onSelect={() => {
                          setOpen(false)
                          router.push(item.href)
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm text-gray-200 data-[selected=true]:bg-white/5 data-[selected=true]:text-cream"
                      >
                        <Icon name={item.icon} className="w-4 h-4 text-[#2FE6C4]" />
                        <span className="flex-1">{item.label}</span>
                        {item.chunk != null && (
                          <span className="text-[9px] text-gray-500 font-mono">soon</span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
              <div className="px-4 py-2 border-t border-white/5 text-[10px] text-gray-500 flex gap-4">
                <span><kbd className="bg-white/5 px-1 py-0.5 rounded">↑↓</kbd> navigate</span>
                <span><kbd className="bg-white/5 px-1 py-0.5 rounded">↵</kbd> select</span>
                <span><kbd className="bg-white/5 px-1 py-0.5 rounded">⌘K</kbd> toggle</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  )
}
