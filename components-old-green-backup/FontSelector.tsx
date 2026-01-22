'use client'

import { fontOptions, fontsByCategory, categoryLabels } from '@/lib/fonts'

interface FontSelectorProps {
  value: string
  onChange: (value: string) => void
  previewText?: string
}

export default function FontSelector({ value, onChange, previewText = 'Abc' }: FontSelectorProps) {
  const selectedFont = fontOptions.find(f => f.value === value) || fontOptions[0]

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none bg-white"
      >
        {Object.entries(fontsByCategory).map(([category, fonts]) => (
          <optgroup key={category} label={categoryLabels[category as keyof typeof categoryLabels]}>
            {fonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </optgroup>
        ))}
        <option value="custom">Other - describe in notes</option>
      </select>
      {/* Font Preview */}
      <div
        className="mt-2 p-2 bg-gray-100 text-center text-sm border border-gray-200"
        style={selectedFont?.style}
      >
        {previewText}
      </div>
    </div>
  )
}
