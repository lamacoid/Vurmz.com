'use client'

import { ReactNode } from 'react'

// ISO 7010 Compliant Safety Symbols
// Shape Standards:
// - Prohibition (P): Red circle with diagonal bar at 45 degrees
// - Warning (W): Yellow/amber triangle with black border
// - Mandatory (M): Blue circle with white symbol
// - Safe Condition (E): Green rectangle with white symbol
// - Fire Equipment (F): Red square with white symbol

export type SafetyIconId = keyof typeof safetyIcons

interface IconDef {
  id: string
  name: string
  category: 'prohibition' | 'warning' | 'mandatory' | 'safety' | 'fire'
  iso?: string // ISO 7010 code if applicable
}

// Icon definitions with metadata
export const iconDefinitions: IconDef[] = [
  // Prohibition Signs (Red circle + slash)
  { id: 'no-entry', name: 'No Entry', category: 'prohibition', iso: 'P001' },
  { id: 'no-smoking', name: 'No Smoking', category: 'prohibition', iso: 'P002' },
  { id: 'no-flames', name: 'No Open Flames', category: 'prohibition', iso: 'P003' },
  { id: 'no-water', name: 'Do Not Extinguish with Water', category: 'prohibition', iso: 'P011' },

  // Warning Signs (Yellow triangle)
  { id: 'warning-general', name: 'General Warning', category: 'warning', iso: 'W001' },
  { id: 'warning-electric', name: 'Electrical Hazard', category: 'warning', iso: 'W012' },
  { id: 'warning-hot', name: 'Hot Surface', category: 'warning', iso: 'W017' },
  { id: 'warning-toxic', name: 'Toxic Material', category: 'warning', iso: 'W016' },
  { id: 'warning-corrosive', name: 'Corrosive', category: 'warning', iso: 'W023' },
  { id: 'warning-biohazard', name: 'Biohazard', category: 'warning', iso: 'W009' },
  { id: 'warning-radiation', name: 'Radiation', category: 'warning', iso: 'W003' },
  { id: 'warning-laser', name: 'Laser Beam', category: 'warning', iso: 'W004' },

  // Mandatory Signs (Blue circle)
  { id: 'wear-eye', name: 'Eye Protection', category: 'mandatory', iso: 'M004' },
  { id: 'wear-helmet', name: 'Hard Hat Required', category: 'mandatory', iso: 'M014' },
  { id: 'wear-gloves', name: 'Wear Gloves', category: 'mandatory', iso: 'M009' },
  { id: 'wear-ear', name: 'Hearing Protection', category: 'mandatory', iso: 'M003' },

  // Safe Condition Signs (Green rectangle)
  { id: 'exit', name: 'Emergency Exit', category: 'safety', iso: 'E001' },
  { id: 'first-aid', name: 'First Aid', category: 'safety', iso: 'E003' },
  { id: 'assembly', name: 'Assembly Point', category: 'safety', iso: 'E007' },

  // Fire Equipment Signs (Red square)
  { id: 'fire-extinguisher', name: 'Fire Extinguisher', category: 'fire', iso: 'F001' },
  { id: 'fire-hose', name: 'Fire Hose', category: 'fire', iso: 'F002' },
  { id: 'fire-alarm', name: 'Fire Alarm', category: 'fire', iso: 'F005' },
]

// SVG Icon Components
export const safetyIcons = {
  // === PROHIBITION (Red circle with slash) ===
  'no-entry': (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="#CC0000" strokeWidth="4" fill="white"/>
      <line x1="10" y1="38" x2="38" y2="10" stroke="#CC0000" strokeWidth="4"/>
    </svg>
  ),

  'no-smoking': (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="#CC0000" strokeWidth="4" fill="white"/>
      <rect x="12" y="21" width="16" height="6" fill="#1a1a1a" rx="1"/>
      <rect x="28" y="18" width="3" height="9" fill="#1a1a1a"/>
      <path d="M31 18 Q34 14 32 10" stroke="#666" strokeWidth="1.5" fill="none"/>
      <line x1="10" y1="38" x2="38" y2="10" stroke="#CC0000" strokeWidth="4"/>
    </svg>
  ),

  'no-flames': (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="#CC0000" strokeWidth="4" fill="white"/>
      <path d="M24 14 Q28 18 26 24 Q30 20 28 28 Q24 32 20 28 Q18 20 22 24 Q20 18 24 14" fill="#1a1a1a"/>
      <line x1="10" y1="38" x2="38" y2="10" stroke="#CC0000" strokeWidth="4"/>
    </svg>
  ),

  'no-water': (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="#CC0000" strokeWidth="4" fill="white"/>
      <path d="M24 12 L30 22 Q32 28 24 32 Q16 28 18 22 Z" fill="#1a1a1a"/>
      <line x1="10" y1="38" x2="38" y2="10" stroke="#CC0000" strokeWidth="4"/>
    </svg>
  ),

  // === WARNING (Yellow triangle) ===
  'warning-general': (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 L4 42 Z" fill="#FFCC00" stroke="#1a1a1a" strokeWidth="2"/>
      <text x="24" y="36" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1a1a1a">!</text>
    </svg>
  ),

  'warning-electric': (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 L4 42 Z" fill="#FFCC00" stroke="#1a1a1a" strokeWidth="2"/>
      <path d="M26 14 L20 26 L26 26 L22 38 L28 24 L22 24 Z" fill="#1a1a1a"/>
    </svg>
  ),

  'warning-hot': (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 L4 42 Z" fill="#FFCC00" stroke="#1a1a1a" strokeWidth="2"/>
      <path d="M16 30 Q16 24 20 24 Q20 30 24 30 Q24 24 28 24 Q28 30 32 30" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
      <rect x="14" y="32" width="20" height="4" fill="#1a1a1a" rx="1"/>
    </svg>
  ),

  'warning-toxic': (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 L4 42 Z" fill="#FFCC00" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="24" cy="24" r="6" fill="#1a1a1a"/>
      <circle cx="21" cy="22" r="1.5" fill="#FFCC00"/>
      <circle cx="27" cy="22" r="1.5" fill="#FFCC00"/>
      <path d="M21 26 Q24 29 27 26" fill="none" stroke="#FFCC00" strokeWidth="1.5"/>
      <line x1="24" y1="30" x2="24" y2="36" stroke="#1a1a1a" strokeWidth="3"/>
      <line x1="18" y1="30" x2="16" y2="34" stroke="#1a1a1a" strokeWidth="3"/>
      <line x1="30" y1="30" x2="32" y2="34" stroke="#1a1a1a" strokeWidth="3"/>
    </svg>
  ),

  'warning-corrosive': (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 L4 42 Z" fill="#FFCC00" stroke="#1a1a1a" strokeWidth="2"/>
      <path d="M20 16 L20 22 Q18 26 22 28" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
      <path d="M28 16 L28 22 Q30 26 26 28" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
      <ellipse cx="24" cy="34" rx="8" ry="3" fill="#1a1a1a"/>
    </svg>
  ),

  'warning-biohazard': (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 L4 42 Z" fill="#FFCC00" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="24" cy="26" r="3" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M24 16 Q27 20 24 23" fill="#1a1a1a"/>
      <path d="M24 16 Q21 20 24 23" fill="#1a1a1a"/>
      <path d="M17 32 Q20 28 24 29" fill="#1a1a1a"/>
      <path d="M31 32 Q28 28 24 29" fill="#1a1a1a"/>
    </svg>
  ),

  'warning-radiation': (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 L4 42 Z" fill="#FFCC00" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="24" cy="28" r="4" fill="#1a1a1a"/>
      <path d="M24 16 L28 24 L24 24 Z" fill="#1a1a1a"/>
      <path d="M16 36 L20 28 L24 32 Z" fill="#1a1a1a"/>
      <path d="M32 36 L28 28 L24 32 Z" fill="#1a1a1a"/>
    </svg>
  ),

  'warning-laser': (
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L44 42 L4 42 Z" fill="#FFCC00" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="24" cy="26" r="4" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
      <line x1="12" y1="26" x2="18" y2="26" stroke="#1a1a1a" strokeWidth="2"/>
      <line x1="30" y1="26" x2="36" y2="26" stroke="#1a1a1a" strokeWidth="2"/>
      <line x1="24" y1="16" x2="24" y2="20" stroke="#1a1a1a" strokeWidth="2"/>
      <line x1="24" y1="32" x2="24" y2="38" stroke="#1a1a1a" strokeWidth="2"/>
    </svg>
  ),

  // === MANDATORY (Blue circle) ===
  'wear-eye': (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#0066CC"/>
      <ellipse cx="16" cy="24" rx="6" ry="4" fill="none" stroke="white" strokeWidth="2"/>
      <ellipse cx="32" cy="24" rx="6" ry="4" fill="none" stroke="white" strokeWidth="2"/>
      <path d="M22 24 L26 24" stroke="white" strokeWidth="2"/>
      <circle cx="16" cy="24" r="2" fill="white"/>
      <circle cx="32" cy="24" r="2" fill="white"/>
    </svg>
  ),

  'wear-helmet': (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#0066CC"/>
      <ellipse cx="24" cy="30" rx="12" ry="5" fill="white"/>
      <path d="M12 30 Q12 18 24 16 Q36 18 36 30" fill="white"/>
      <line x1="12" y1="30" x2="36" y2="30" stroke="#0066CC" strokeWidth="1"/>
    </svg>
  ),

  'wear-gloves': (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#0066CC"/>
      <path d="M18 34 L18 20 Q18 16 22 16 L22 12 Q22 10 24 10 Q26 10 26 12 L26 16 Q30 16 30 20 L30 34 Q30 36 24 36 Q18 36 18 34" fill="white"/>
      <line x1="22" y1="16" x2="22" y2="26" stroke="#0066CC" strokeWidth="1"/>
      <line x1="26" y1="16" x2="26" y2="26" stroke="#0066CC" strokeWidth="1"/>
    </svg>
  ),

  'wear-ear': (
    <svg viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" fill="#0066CC"/>
      <ellipse cx="16" cy="24" rx="4" ry="6" fill="white"/>
      <ellipse cx="32" cy="24" rx="4" ry="6" fill="white"/>
      <path d="M20 24 Q24 20 28 24" stroke="white" strokeWidth="3" fill="none"/>
    </svg>
  ),

  // === SAFE CONDITION (Green rectangle) ===
  'exit': (
    <svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="8" width="40" height="32" rx="2" fill="#00AA00"/>
      <rect x="28" y="16" width="8" height="16" fill="white"/>
      <circle cx="20" cy="16" r="3" fill="white"/>
      <path d="M17 19 L17 30 L14 30 L14 34 L26 34 L26 30 L23 30 L23 19 Z" fill="white"/>
      <path d="M17 22 L12 26" stroke="white" strokeWidth="2"/>
      <path d="M36 20 L40 24 L36 28" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  ),

  'first-aid': (
    <svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="8" width="40" height="32" rx="2" fill="#00AA00"/>
      <rect x="20" y="14" width="8" height="20" fill="white"/>
      <rect x="14" y="20" width="20" height="8" fill="white"/>
    </svg>
  ),

  'assembly': (
    <svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="8" width="40" height="32" rx="2" fill="#00AA00"/>
      <circle cx="24" cy="18" r="4" fill="white"/>
      <circle cx="16" cy="26" r="3" fill="white"/>
      <circle cx="32" cy="26" r="3" fill="white"/>
      <circle cx="20" cy="34" r="3" fill="white"/>
      <circle cx="28" cy="34" r="3" fill="white"/>
      <path d="M24 22 L24 30" stroke="white" strokeWidth="2"/>
      <path d="M16 29 L24 30 L32 29" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  ),

  // === FIRE EQUIPMENT (Red square) ===
  'fire-extinguisher': (
    <svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="2" fill="#CC0000"/>
      <rect x="18" y="14" width="12" height="26" rx="2" fill="white"/>
      <rect x="20" y="8" width="8" height="8" fill="white"/>
      <rect x="14" y="18" width="6" height="10" fill="white"/>
      <path d="M14 28 L10 36" stroke="white" strokeWidth="2"/>
    </svg>
  ),

  'fire-hose': (
    <svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="2" fill="#CC0000"/>
      <circle cx="24" cy="24" r="10" fill="none" stroke="white" strokeWidth="3"/>
      <circle cx="24" cy="24" r="4" fill="white"/>
      <path d="M34 24 L40 24" stroke="white" strokeWidth="3"/>
    </svg>
  ),

  'fire-alarm': (
    <svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="2" fill="#CC0000"/>
      <rect x="16" y="14" width="16" height="20" rx="2" fill="white"/>
      <circle cx="24" cy="24" r="4" fill="#CC0000"/>
      <rect x="20" y="10" width="8" height="6" fill="white"/>
    </svg>
  ),
}

// Category labels and colors
export const iconCategories = {
  prohibition: { label: 'Prohibition', color: '#CC0000', bgColor: '#FEE2E2' },
  warning: { label: 'Warning', color: '#B45309', bgColor: '#FEF3C7' },
  mandatory: { label: 'Mandatory', color: '#0066CC', bgColor: '#DBEAFE' },
  safety: { label: 'Safe Condition', color: '#00AA00', bgColor: '#D1FAE5' },
  fire: { label: 'Fire Equipment', color: '#CC0000', bgColor: '#FEE2E2' },
}

// SafetyIcon component
interface SafetyIconProps {
  icon: SafetyIconId
  size?: number
  className?: string
}

export function SafetyIcon({ icon, size = 32, className = '' }: SafetyIconProps) {
  const iconSvg = safetyIcons[icon]
  if (!iconSvg) return null

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
    >
      {iconSvg}
    </div>
  )
}

// Icon Picker Component
interface IconPickerProps {
  value: string | null
  onChange: (iconId: string | null) => void
  showCategories?: boolean
}

export function IconPicker({ value, onChange, showCategories = true }: IconPickerProps) {
  const groupedIcons = iconDefinitions.reduce((acc, icon) => {
    if (!acc[icon.category]) acc[icon.category] = []
    acc[icon.category].push(icon)
    return acc
  }, {} as Record<string, IconDef[]>)

  return (
    <div className="space-y-4">
      {/* None option */}
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`
          w-full px-4 py-2 text-sm text-left rounded-lg border transition-all
          ${value === null
            ? 'border-vurmz-teal bg-vurmz-teal/10 text-vurmz-teal'
            : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }
        `}
      >
        No Icon
      </button>

      {/* Categorized icons */}
      {Object.entries(groupedIcons).map(([category, icons]) => (
        <div key={category}>
          {showCategories && (
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-2 px-2 py-1 rounded"
              style={{
                color: iconCategories[category as keyof typeof iconCategories].color,
                backgroundColor: iconCategories[category as keyof typeof iconCategories].bgColor,
              }}
            >
              {iconCategories[category as keyof typeof iconCategories].label}
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {icons.map((iconDef) => (
              <button
                key={iconDef.id}
                type="button"
                onClick={() => onChange(iconDef.id)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg border transition-all
                  ${value === iconDef.id
                    ? 'border-vurmz-teal bg-vurmz-teal/10 ring-1 ring-vurmz-teal'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                title={iconDef.name}
              >
                <SafetyIcon icon={iconDef.id as SafetyIconId} size={28} />
                <span className="text-[10px] text-gray-600 truncate w-full text-center">
                  {iconDef.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
