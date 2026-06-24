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
          <div onClick={e => e.stopPropagation()} className="w-full max-w-xl bg-[var(--a-bg)] border border-[var(--a-line)] rounded-xl shadow-2xl overflow-hidden">
            <Command label="Global command menu" shouldFilter>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--a-line)]">
                <Icon name="search" className="w-4 h-4 text-[var(--a-ink-soft)]" />
                <Command.Input
                  placeholder="Search pages, products, customers…"
                  className="flex-1 bg-transparent outline-none text-[var(--a-ink)] placeholder:text-[var(--a-ink-faint)] text-sm"
                  autoFocus
                />
                <kbd className="text-[10px] text-[var(--a-ink-faint)] bg-white/5 px-1.5 py-0.5 rounded">esc</kbd>
              </div>
              <Command.List className="max-h-[50vh] overflow-y-auto py-2">
                <Command.Empty className="px-4 py-8 text-sm text-[var(--a-ink-faint)] text-center">
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
                        className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm text-[var(--a-ink)] data-[selected=true]:bg-white/5 data-[selected=true]:text-[var(--a-ink)]"
                      >
                        <Icon name={item.icon} className="w-4 h-4 text-[var(--a-accent)]" />
                        <span className="flex-1">{item.label}</span>
                        {item.chunk != null && (
                          <span className="text-[9px] text-[var(--a-ink-faint)] font-mono">soon</span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
              <div className="px-4 py-2 border-t border-[var(--a-line)] text-[10px] text-[var(--a-ink-faint)] flex gap-4">
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
