'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline'

type Theme = 'light' | 'dark' | 'trippy'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('vurmz-theme') as Theme | null
    if (saved) {
      setTheme(saved)
      applyTheme(saved)
    }
  }, [])

  const applyTheme = (t: Theme) => {
    const html = document.documentElement
    html.classList.remove('dark', 'trippy')
    if (t === 'dark') {
      html.classList.add('dark')
    } else if (t === 'trippy') {
      html.classList.add('trippy')
    }
  }

  const handleThemeChange = (t: Theme) => {
    setTheme(t)
    applyTheme(t)
    localStorage.setItem('vurmz-theme', t)
    setIsOpen(false)
  }

  const themes = [
    { id: 'light' as Theme, name: 'Light', icon: SunIcon },
    { id: 'dark' as Theme, name: 'Dark', icon: MoonIcon },
    { id: 'trippy' as Theme, name: 'Trippy', icon: SparklesIcon },
  ]

  const currentTheme = themes.find(t => t.id === theme) || themes[1]
  const CurrentIcon = currentTheme.icon

  return (
    <div
      data-theme-switcher
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 9999,
      }}
    >
      {/* Expanded menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            left: '0',
            minWidth: '140px',
            background: theme === 'trippy' ? 'rgba(30, 30, 50, 0.95)' : theme === 'dark' ? '#1f2937' : 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 500,
                background: theme === t.id ? 'rgba(106,140,140,0.2)' : 'transparent',
                color: theme === t.id ? '#6A8C8C' : (theme === 'trippy' || theme === 'dark') ? '#d1d5db' : '#374151',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (theme !== t.id) {
                  e.currentTarget.style.background = theme === 'trippy' || theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (theme !== t.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <t.icon style={{ width: '20px', height: '20px' }} />
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          border: theme === 'trippy' ? '2px solid rgba(255,255,255,0.3)' : theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
          backgroundColor: theme === 'trippy' ? 'transparent' : theme === 'dark' ? '#1f2937' : 'white',
          backgroundImage: theme === 'trippy'
            ? 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)'
            : 'none',
          backgroundSize: theme === 'trippy' ? '300% 300%' : 'auto',
          animation: theme === 'trippy' ? 'trippy-button 2s ease infinite' : 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          color: theme === 'trippy' ? 'white' : theme === 'dark' ? '#fbbf24' : '#374151',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="Change theme"
      >
        <CurrentIcon style={{ width: '24px', height: '24px' }} />
      </button>
    </div>
  )
}
