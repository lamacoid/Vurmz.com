'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline'

type Theme = 'light' | 'dark' | 'trippy'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('light')
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

  const currentTheme = themes.find(t => t.id === theme) || themes[0]
  const CurrentIcon = currentTheme.icon

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Expanded menu */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[140px]">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                theme === t.id
                  ? 'bg-vurmz-teal/10 text-vurmz-teal'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <t.icon className="h-5 w-5" />
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
          theme === 'trippy'
            ? 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-trippy-button text-white'
            : theme === 'dark'
            ? 'bg-gray-800 text-yellow-400 border border-gray-700'
            : 'bg-white text-gray-700 border border-gray-200'
        }`}
        title="Change theme"
      >
        <CurrentIcon className="h-6 w-6" />
      </button>
    </div>
  )
}
