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
      <label className="block text-sm font-medium text-[#5C4A3A] mb-2">Font Style</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#D4C8B8] px-3 py-2 text-sm text-[#5C4A3A] focus:border-[#7EB8C9] focus:ring-1 focus:ring-[#7EB8C9] outline-none bg-white"
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
        className="mt-2 p-2 bg-[#D4C8B8]/10 text-center text-sm text-[#6B5A48] border border-[#D4C8B8]"
        style={selectedFont?.style}
      >
        {previewText}
      </div>
    </div>
  )
}
