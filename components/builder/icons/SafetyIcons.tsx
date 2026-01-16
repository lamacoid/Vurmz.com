'use client'

import React, { ReactNode } from 'react'

// ============================================================================
// ISO 7010 Compliant Safety Symbol Components
// ============================================================================
// Standards Reference:
// - Prohibition (P): Red circle (#CC0000) with white background, diagonal bar 45 degrees
// - Warning (W): Yellow (#FFCC00) equilateral triangle with black border and symbol
// - Mandatory (M): Blue circle (#0066CC) with white symbol
// - Safe Condition (E): Green (#009933) rectangle with white symbol
// - Fire Equipment (F): Red (#CC0000) square with white symbol

// ============================================================================
// Type Definitions
// ============================================================================

export type SafetyIconCategory = 'prohibition' | 'warning' | 'mandatory' | 'safety' | 'fire'

export interface IconDefinition {
  id: string
  name: string
  category: SafetyIconCategory
  iso?: string // ISO 7010 reference code
}

export interface SafetyIconProps {
  className?: string
  size?: number
}

// ============================================================================
// Color Constants (ISO 7010 Compliant)
// ============================================================================

const COLORS = {
  prohibitionRed: '#CC0000',
  warningYellow: '#FFCC00',
  warningBorder: '#1a1a1a',
  mandatoryBlue: '#0066CC',
  safetyGreen: '#009933',
  fireRed: '#CC0000',
  white: '#FFFFFF',
  black: '#1a1a1a',
}

// ============================================================================
// Icon Definitions with Metadata
// ============================================================================

export const iconDefinitions: IconDefinition[] = [
  // Prohibition Signs (Red circle + diagonal slash)
  { id: 'no-smoking', name: 'No Smoking', category: 'prohibition', iso: 'P002' },
  { id: 'no-entry', name: 'No Entry', category: 'prohibition', iso: 'P001' },
  { id: 'no-flames', name: 'No Open Flame', category: 'prohibition', iso: 'P003' },
  { id: 'no-water', name: 'Do Not Extinguish with Water', category: 'prohibition', iso: 'P011' },

  // Warning Signs (Yellow triangle)
  { id: 'warning-electric', name: 'Electrical Hazard', category: 'warning', iso: 'W012' },
  { id: 'warning-toxic', name: 'Toxic/Poison', category: 'warning', iso: 'W016' },
  { id: 'warning-hot', name: 'Hot Surface', category: 'warning', iso: 'W017' },
  { id: 'warning-biohazard', name: 'Biohazard', category: 'warning', iso: 'W009' },
  { id: 'warning-radiation', name: 'Radiation', category: 'warning', iso: 'W003' },
  { id: 'warning-general', name: 'General Warning', category: 'warning', iso: 'W001' },
  { id: 'warning-laser', name: 'Laser Beam', category: 'warning', iso: 'W004' },
  { id: 'warning-corrosive', name: 'Corrosive', category: 'warning', iso: 'W023' },

  // Mandatory Signs (Blue circle)
  { id: 'wear-eye', name: 'Eye Protection Required', category: 'mandatory', iso: 'M004' },
  { id: 'wear-helmet', name: 'Hard Hat Required', category: 'mandatory', iso: 'M014' },
  { id: 'wear-ear', name: 'Hearing Protection Required', category: 'mandatory', iso: 'M003' },
  { id: 'wear-gloves', name: 'Gloves Required', category: 'mandatory', iso: 'M009' },

  // Safe Condition Signs (Green rectangle)
  { id: 'exit', name: 'Emergency Exit', category: 'safety', iso: 'E001' },
  { id: 'first-aid', name: 'First Aid', category: 'safety', iso: 'E003' },
  { id: 'safety-shower', name: 'Safety Shower', category: 'safety', iso: 'E012' },
  { id: 'assembly', name: 'Assembly Point', category: 'safety', iso: 'E007' },

  // Fire Equipment Signs (Red square)
  { id: 'fire-extinguisher', name: 'Fire Extinguisher', category: 'fire', iso: 'F001' },
  { id: 'fire-alarm', name: 'Fire Alarm', category: 'fire', iso: 'F005' },
  { id: 'fire-hose', name: 'Fire Hose', category: 'fire', iso: 'F002' },
]

// ============================================================================
// PROHIBITION SIGNS (Red Circle with Diagonal Slash)
// ============================================================================

export function NoSmokingIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="No Smoking"
      role="img"
    >
      {/* White background circle */}
      <circle cx="24" cy="24" r="20" fill={COLORS.white} />
      {/* Cigarette body */}
      <rect x="10" y="21" width="18" height="6" fill={COLORS.black} rx="1" />
      {/* Cigarette filter */}
      <rect x="28" y="21" width="5" height="6" fill="#D4A574" rx="1" />
      {/* Smoke wisps */}
      <path
        d="M33 21 Q36 18 34 14 M36 21 Q39 17 37 12"
        stroke="#888888"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Red circle border */}
      <circle cx="24" cy="24" r="20" stroke={COLORS.prohibitionRed} strokeWidth="3" fill="none" />
      {/* Diagonal slash */}
      <line
        x1="10"
        y1="38"
        x2="38"
        y2="10"
        stroke={COLORS.prohibitionRed}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NoEntryIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="No Entry"
      role="img"
    >
      {/* White background circle */}
      <circle cx="24" cy="24" r="20" fill={COLORS.white} />
      {/* Horizontal bar (entry prohibition symbol) */}
      <rect x="10" y="20" width="28" height="8" fill={COLORS.black} rx="1" />
      {/* Red circle border */}
      <circle cx="24" cy="24" r="20" stroke={COLORS.prohibitionRed} strokeWidth="3" fill="none" />
      {/* Diagonal slash */}
      <line
        x1="10"
        y1="38"
        x2="38"
        y2="10"
        stroke={COLORS.prohibitionRed}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NoFlameIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="No Open Flame"
      role="img"
    >
      {/* White background circle */}
      <circle cx="24" cy="24" r="20" fill={COLORS.white} />
      {/* Flame shape */}
      <path
        d="M24 12 C28 16 30 20 28 26 C30 22 32 26 30 32 C28 36 20 36 18 32 C16 26 18 22 20 26 C18 20 20 16 24 12"
        fill={COLORS.black}
      />
      {/* Inner flame detail */}
      <path
        d="M24 20 C26 22 26 26 24 28 C22 26 22 22 24 20"
        fill={COLORS.white}
      />
      {/* Red circle border */}
      <circle cx="24" cy="24" r="20" stroke={COLORS.prohibitionRed} strokeWidth="3" fill="none" />
      {/* Diagonal slash */}
      <line
        x1="10"
        y1="38"
        x2="38"
        y2="10"
        stroke={COLORS.prohibitionRed}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NoWaterIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Do Not Extinguish with Water"
      role="img"
    >
      {/* White background circle */}
      <circle cx="24" cy="24" r="20" fill={COLORS.white} />
      {/* Water drop */}
      <path
        d="M24 10 L32 24 C34 30 30 36 24 36 C18 36 14 30 16 24 Z"
        fill={COLORS.black}
      />
      {/* Water drop highlight */}
      <ellipse cx="20" cy="26" rx="2" ry="3" fill={COLORS.white} opacity="0.5" />
      {/* Red circle border */}
      <circle cx="24" cy="24" r="20" stroke={COLORS.prohibitionRed} strokeWidth="3" fill="none" />
      {/* Diagonal slash */}
      <line
        x1="10"
        y1="38"
        x2="38"
        y2="10"
        stroke={COLORS.prohibitionRed}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ============================================================================
// WARNING SIGNS (Yellow Triangle with Black Border)
// ============================================================================

export function WarningElectricIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Electrical Hazard"
      role="img"
    >
      {/* Yellow triangle */}
      <path
        d="M24 4 L46 44 L2 44 Z"
        fill={COLORS.warningYellow}
        stroke={COLORS.warningBorder}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Lightning bolt */}
      <path
        d="M27 14 L21 26 L26 26 L22 38 L29 24 L24 24 L27 14"
        fill={COLORS.black}
      />
    </svg>
  )
}

export function WarningToxicIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Toxic/Poison"
      role="img"
    >
      {/* Yellow triangle */}
      <path
        d="M24 4 L46 44 L2 44 Z"
        fill={COLORS.warningYellow}
        stroke={COLORS.warningBorder}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Skull */}
      <ellipse cx="24" cy="22" rx="8" ry="7" fill={COLORS.black} />
      {/* Eye sockets */}
      <ellipse cx="21" cy="21" rx="2" ry="2.5" fill={COLORS.warningYellow} />
      <ellipse cx="27" cy="21" rx="2" ry="2.5" fill={COLORS.warningYellow} />
      {/* Nose */}
      <path d="M24 24 L23 26 L25 26 Z" fill={COLORS.warningYellow} />
      {/* Jaw/Teeth */}
      <rect x="18" y="29" width="12" height="6" fill={COLORS.black} rx="1" />
      <line x1="20" y1="29" x2="20" y2="35" stroke={COLORS.warningYellow} strokeWidth="1" />
      <line x1="24" y1="29" x2="24" y2="35" stroke={COLORS.warningYellow} strokeWidth="1" />
      <line x1="28" y1="29" x2="28" y2="35" stroke={COLORS.warningYellow} strokeWidth="1" />
      {/* Crossbones */}
      <path
        d="M12 36 L20 30 M12 30 L20 36"
        stroke={COLORS.black}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M36 36 L28 30 M36 30 L28 36"
        stroke={COLORS.black}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function WarningHotIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Hot Surface"
      role="img"
    >
      {/* Yellow triangle */}
      <path
        d="M24 4 L46 44 L2 44 Z"
        fill={COLORS.warningYellow}
        stroke={COLORS.warningBorder}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Heat waves */}
      <path
        d="M14 28 Q16 24 18 28 Q20 32 22 28"
        stroke={COLORS.black}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M22 28 Q24 24 26 28 Q28 32 30 28"
        stroke={COLORS.black}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M30 28 Q32 24 34 28"
        stroke={COLORS.black}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Hot surface/plate */}
      <rect x="12" y="32" width="24" height="5" fill={COLORS.black} rx="1" />
    </svg>
  )
}

export function WarningBiohazardIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Biohazard"
      role="img"
    >
      {/* Yellow triangle */}
      <path
        d="M24 4 L46 44 L2 44 Z"
        fill={COLORS.warningYellow}
        stroke={COLORS.warningBorder}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Biohazard symbol - three interlocking circles */}
      <g fill={COLORS.black}>
        {/* Center ring */}
        <circle cx="24" cy="26" r="4" fill={COLORS.warningYellow} stroke={COLORS.black} strokeWidth="2" />
        {/* Top lobe */}
        <path d="M24 14 C28 14 31 18 31 22 C28 20 24 22 24 26 C24 22 20 20 17 22 C17 18 20 14 24 14" />
        {/* Bottom left lobe */}
        <path d="M14 34 C14 30 16 27 20 26 C18 29 20 32 24 32 C20 32 18 35 18 38 C15 37 14 35 14 34" />
        {/* Bottom right lobe */}
        <path d="M34 34 C34 35 33 37 30 38 C30 35 28 32 24 32 C28 32 30 29 28 26 C32 27 34 30 34 34" />
      </g>
    </svg>
  )
}

export function WarningRadiationIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Radiation"
      role="img"
    >
      {/* Yellow triangle */}
      <path
        d="M24 4 L46 44 L2 44 Z"
        fill={COLORS.warningYellow}
        stroke={COLORS.warningBorder}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Radiation trefoil - center circle */}
      <circle cx="24" cy="26" r="4" fill={COLORS.black} />
      {/* Radiation trefoil - three blades */}
      <path
        d="M24 22 L28 14 A12 12 0 0 0 20 14 Z"
        fill={COLORS.black}
      />
      <path
        d="M20.5 27.5 L12 32 A12 12 0 0 0 20 38 Z"
        fill={COLORS.black}
      />
      <path
        d="M27.5 27.5 L36 32 A12 12 0 0 1 28 38 Z"
        fill={COLORS.black}
      />
    </svg>
  )
}

export function WarningGeneralIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="General Warning"
      role="img"
    >
      {/* Yellow triangle */}
      <path
        d="M24 4 L46 44 L2 44 Z"
        fill={COLORS.warningYellow}
        stroke={COLORS.warningBorder}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Exclamation mark stem */}
      <rect x="21" y="14" width="6" height="16" rx="2" fill={COLORS.black} />
      {/* Exclamation mark dot */}
      <circle cx="24" cy="36" r="3" fill={COLORS.black} />
    </svg>
  )
}

export function WarningLaserIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Laser Beam"
      role="img"
    >
      {/* Yellow triangle */}
      <path
        d="M24 4 L46 44 L2 44 Z"
        fill={COLORS.warningYellow}
        stroke={COLORS.warningBorder}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Starburst/laser effect */}
      <circle cx="24" cy="26" r="5" fill={COLORS.black} />
      {/* Radiating beams */}
      <line x1="24" y1="14" x2="24" y2="19" stroke={COLORS.black} strokeWidth="2.5" />
      <line x1="24" y1="33" x2="24" y2="38" stroke={COLORS.black} strokeWidth="2.5" />
      <line x1="12" y1="26" x2="17" y2="26" stroke={COLORS.black} strokeWidth="2.5" />
      <line x1="31" y1="26" x2="36" y2="26" stroke={COLORS.black} strokeWidth="2.5" />
      {/* Diagonal beams */}
      <line x1="16" y1="18" x2="19.5" y2="21.5" stroke={COLORS.black} strokeWidth="2" />
      <line x1="28.5" y1="30.5" x2="32" y2="34" stroke={COLORS.black} strokeWidth="2" />
      <line x1="32" y1="18" x2="28.5" y2="21.5" stroke={COLORS.black} strokeWidth="2" />
      <line x1="19.5" y1="30.5" x2="16" y2="34" stroke={COLORS.black} strokeWidth="2" />
    </svg>
  )
}

export function WarningCorrosiveIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Corrosive"
      role="img"
    >
      {/* Yellow triangle */}
      <path
        d="M24 4 L46 44 L2 44 Z"
        fill={COLORS.warningYellow}
        stroke={COLORS.warningBorder}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Test tube/container */}
      <path
        d="M20 14 L20 24 L16 32 L16 36 L32 36 L32 32 L28 24 L28 14"
        fill="none"
        stroke={COLORS.black}
        strokeWidth="2"
      />
      {/* Liquid drops */}
      <path d="M22 26 L22 30 Q22 32 24 32 Q26 32 26 30 L26 26" fill={COLORS.black} />
      {/* Dripping/corroding surface */}
      <path
        d="M16 36 L16 40 Q18 42 20 40 Q22 38 24 40 Q26 42 28 40 Q30 38 32 40 L32 36"
        fill={COLORS.black}
      />
      {/* Hand being corroded */}
      <path
        d="M10 32 L14 28 L14 24 L12 24 L12 28 L8 32"
        stroke={COLORS.black}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

// ============================================================================
// MANDATORY SIGNS (Blue Circle with White Symbol)
// ============================================================================

export function WearEyeProtectionIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Eye Protection Required"
      role="img"
    >
      {/* Blue circle background */}
      <circle cx="24" cy="24" r="22" fill={COLORS.mandatoryBlue} />
      {/* Safety glasses frame */}
      <path
        d="M8 24 Q8 18 16 18 L18 18 Q20 18 22 20 L26 20 Q28 18 30 18 L32 18 Q40 18 40 24 Q40 30 32 30 L30 30 Q28 30 26 28 L22 28 Q20 30 18 30 L16 30 Q8 30 8 24"
        fill="none"
        stroke={COLORS.white}
        strokeWidth="2"
      />
      {/* Left lens */}
      <ellipse cx="14" cy="24" rx="5" ry="4" fill={COLORS.white} opacity="0.3" stroke={COLORS.white} strokeWidth="1.5" />
      {/* Right lens */}
      <ellipse cx="34" cy="24" rx="5" ry="4" fill={COLORS.white} opacity="0.3" stroke={COLORS.white} strokeWidth="1.5" />
      {/* Bridge */}
      <path d="M19 24 L29 24" stroke={COLORS.white} strokeWidth="2" />
      {/* Temples */}
      <line x1="8" y1="20" x2="6" y2="18" stroke={COLORS.white} strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="20" x2="42" y2="18" stroke={COLORS.white} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function WearHelmetIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Hard Hat Required"
      role="img"
    >
      {/* Blue circle background */}
      <circle cx="24" cy="24" r="22" fill={COLORS.mandatoryBlue} />
      {/* Hard hat dome */}
      <path
        d="M10 28 Q10 14 24 12 Q38 14 38 28"
        fill={COLORS.white}
      />
      {/* Hard hat brim */}
      <path
        d="M8 28 L40 28 L38 32 L10 32 Z"
        fill={COLORS.white}
      />
      {/* Hard hat ridge/detail */}
      <path
        d="M14 20 Q24 16 34 20"
        stroke={COLORS.mandatoryBlue}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Interior headband indication */}
      <path
        d="M12 28 Q24 24 36 28"
        stroke={COLORS.mandatoryBlue}
        strokeWidth="1"
        fill="none"
      />
    </svg>
  )
}

export function WearEarProtectionIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Hearing Protection Required"
      role="img"
    >
      {/* Blue circle background */}
      <circle cx="24" cy="24" r="22" fill={COLORS.mandatoryBlue} />
      {/* Headband */}
      <path
        d="M12 18 Q24 8 36 18"
        stroke={COLORS.white}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left ear muff */}
      <ellipse cx="12" cy="26" rx="5" ry="8" fill={COLORS.white} />
      <ellipse cx="12" cy="26" rx="3" ry="5" fill={COLORS.mandatoryBlue} />
      {/* Right ear muff */}
      <ellipse cx="36" cy="26" rx="5" ry="8" fill={COLORS.white} />
      <ellipse cx="36" cy="26" rx="3" ry="5" fill={COLORS.mandatoryBlue} />
      {/* Connecting bands to ear muffs */}
      <line x1="12" y1="18" x2="12" y2="20" stroke={COLORS.white} strokeWidth="3" />
      <line x1="36" y1="18" x2="36" y2="20" stroke={COLORS.white} strokeWidth="3" />
    </svg>
  )
}

export function WearGlovesIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Gloves Required"
      role="img"
    >
      {/* Blue circle background */}
      <circle cx="24" cy="24" r="22" fill={COLORS.mandatoryBlue} />
      {/* Glove shape */}
      <path
        d="M16 38 L16 22 L16 18 Q16 14 20 14 L20 10 Q20 8 22 8 Q24 8 24 10 L24 14
           L26 14 L26 10 Q26 8 28 8 Q30 8 30 10 L30 14 Q32 14 32 18 L32 22 L32 38
           Q32 40 24 40 Q16 40 16 38"
        fill={COLORS.white}
      />
      {/* Thumb */}
      <path
        d="M16 22 L12 22 Q10 22 10 26 Q10 30 14 30 L16 30"
        fill={COLORS.white}
      />
      {/* Finger separation lines */}
      <line x1="20" y1="14" x2="20" y2="26" stroke={COLORS.mandatoryBlue} strokeWidth="1" />
      <line x1="24" y1="14" x2="24" y2="26" stroke={COLORS.mandatoryBlue} strokeWidth="1" />
      <line x1="28" y1="14" x2="28" y2="26" stroke={COLORS.mandatoryBlue} strokeWidth="1" />
      {/* Cuff */}
      <rect x="16" y="34" width="16" height="4" fill={COLORS.white} stroke={COLORS.mandatoryBlue} strokeWidth="0.5" />
    </svg>
  )
}

// ============================================================================
// SAFE CONDITION SIGNS (Green Rectangle with White Symbol)
// ============================================================================

export function EmergencyExitIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Emergency Exit"
      role="img"
    >
      {/* Green rectangle background */}
      <rect x="2" y="6" width="44" height="36" rx="2" fill={COLORS.safetyGreen} />
      {/* Running person - head */}
      <circle cx="18" cy="14" r="3" fill={COLORS.white} />
      {/* Running person - body */}
      <path
        d="M18 17 L18 26 M18 20 L12 24 M18 20 L24 18 M18 26 L14 34 M18 26 L22 34"
        stroke={COLORS.white}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Door frame */}
      <rect x="30" y="12" width="10" height="24" fill={COLORS.white} />
      {/* Door opening indication */}
      <rect x="32" y="14" width="6" height="20" fill={COLORS.safetyGreen} />
      {/* Arrow pointing to exit */}
      <path
        d="M26 24 L36 24 M33 20 L37 24 L33 28"
        stroke={COLORS.white}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function FirstAidIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="First Aid"
      role="img"
    >
      {/* Green rectangle background */}
      <rect x="2" y="6" width="44" height="36" rx="2" fill={COLORS.safetyGreen} />
      {/* White cross - vertical bar */}
      <rect x="20" y="12" width="8" height="24" fill={COLORS.white} />
      {/* White cross - horizontal bar */}
      <rect x="10" y="18" width="28" height="12" fill={COLORS.white} />
    </svg>
  )
}

export function SafetyShowerIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Safety Shower"
      role="img"
    >
      {/* Green rectangle background */}
      <rect x="2" y="6" width="44" height="36" rx="2" fill={COLORS.safetyGreen} />
      {/* Shower head */}
      <rect x="20" y="10" width="16" height="4" fill={COLORS.white} />
      {/* Shower pipe */}
      <rect x="34" y="10" width="4" height="16" fill={COLORS.white} />
      <rect x="34" y="22" width="8" height="4" fill={COLORS.white} />
      {/* Water drops */}
      <line x1="22" y1="14" x2="22" y2="20" stroke={COLORS.white} strokeWidth="1.5" />
      <line x1="26" y1="14" x2="26" y2="22" stroke={COLORS.white} strokeWidth="1.5" />
      <line x1="30" y1="14" x2="30" y2="20" stroke={COLORS.white} strokeWidth="1.5" />
      {/* Person underneath - head */}
      <circle cx="24" cy="22" r="3" fill={COLORS.white} />
      {/* Person underneath - body */}
      <path
        d="M24 25 L24 32 M24 28 L20 32 M24 28 L28 32 M24 32 L20 40 M24 32 L28 40"
        stroke={COLORS.white}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function AssemblyPointIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Assembly Point"
      role="img"
    >
      {/* Green rectangle background */}
      <rect x="2" y="6" width="44" height="36" rx="2" fill={COLORS.safetyGreen} />
      {/* Center person (larger) */}
      <circle cx="24" cy="16" r="4" fill={COLORS.white} />
      <path d="M24 20 L24 30 M24 24 L18 28 M24 24 L30 28 M24 30 L20 38 M24 30 L28 38" stroke={COLORS.white} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Left person (smaller) */}
      <circle cx="12" cy="20" r="3" fill={COLORS.white} />
      <path d="M12 23 L12 30 M12 26 L9 29 M12 26 L15 29 M12 30 L10 36 M12 30 L14 36" stroke={COLORS.white} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Right person (smaller) */}
      <circle cx="36" cy="20" r="3" fill={COLORS.white} />
      <path d="M36 23 L36 30 M36 26 L33 29 M36 26 L39 29 M36 30 L34 36 M36 30 L38 36" stroke={COLORS.white} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// ============================================================================
// FIRE EQUIPMENT SIGNS (Red Square with White Symbol)
// ============================================================================

export function FireExtinguisherIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Fire Extinguisher"
      role="img"
    >
      {/* Red square background */}
      <rect x="2" y="2" width="44" height="44" rx="2" fill={COLORS.fireRed} />
      {/* Extinguisher body */}
      <rect x="18" y="14" width="12" height="28" rx="2" fill={COLORS.white} />
      {/* Extinguisher top/valve */}
      <rect x="20" y="8" width="8" height="8" fill={COLORS.white} />
      <rect x="22" y="6" width="4" height="4" fill={COLORS.white} />
      {/* Handle */}
      <path
        d="M28 10 L32 10 L32 14 L28 14"
        fill={COLORS.white}
      />
      {/* Nozzle/hose */}
      <path
        d="M18 18 L14 18 L14 22 Q10 24 10 28 L10 32"
        stroke={COLORS.white}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Pressure gauge */}
      <circle cx="24" cy="20" r="3" fill={COLORS.fireRed} stroke={COLORS.white} strokeWidth="1" />
      {/* Label band */}
      <rect x="18" y="26" width="12" height="4" fill={COLORS.fireRed} />
    </svg>
  )
}

export function FireAlarmIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Fire Alarm"
      role="img"
    >
      {/* Red square background */}
      <rect x="2" y="2" width="44" height="44" rx="2" fill={COLORS.fireRed} />
      {/* Alarm box */}
      <rect x="14" y="12" width="20" height="24" rx="2" fill={COLORS.white} />
      {/* Pull handle */}
      <rect x="18" y="28" width="12" height="6" fill={COLORS.fireRed} rx="1" />
      {/* Alarm light/indicator */}
      <circle cx="24" cy="20" r="4" fill={COLORS.fireRed} />
      {/* Sound waves */}
      <path d="M34 16 Q38 20 34 24" stroke={COLORS.white} strokeWidth="2" fill="none" />
      <path d="M36 14 Q42 20 36 26" stroke={COLORS.white} strokeWidth="2" fill="none" />
      <path d="M14 16 Q10 20 14 24" stroke={COLORS.white} strokeWidth="2" fill="none" />
      <path d="M12 14 Q6 20 12 26" stroke={COLORS.white} strokeWidth="2" fill="none" />
      {/* Text indication */}
      <text x="24" y="36" textAnchor="middle" fontSize="4" fill={COLORS.white} fontWeight="bold">PULL</text>
    </svg>
  )
}

export function FireHoseIcon({ className = '', size = 48 }: SafetyIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-label="Fire Hose"
      role="img"
    >
      {/* Red square background */}
      <rect x="2" y="2" width="44" height="44" rx="2" fill={COLORS.fireRed} />
      {/* Hose reel - outer circle */}
      <circle cx="24" cy="24" r="14" fill="none" stroke={COLORS.white} strokeWidth="3" />
      {/* Hose reel - inner circle */}
      <circle cx="24" cy="24" r="6" fill={COLORS.white} />
      {/* Center hub */}
      <circle cx="24" cy="24" r="3" fill={COLORS.fireRed} />
      {/* Coiled hose indication */}
      <circle cx="24" cy="24" r="10" fill="none" stroke={COLORS.white} strokeWidth="1.5" />
      {/* Hose nozzle extending */}
      <path
        d="M38 24 L44 24"
        stroke={COLORS.white}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Nozzle tip */}
      <path
        d="M42 22 L46 24 L42 26"
        fill={COLORS.white}
      />
    </svg>
  )
}

// ============================================================================
// Icon Registry - Maps IDs to Components
// ============================================================================

export const safetyIcons: Record<string, ReactNode> = {
  // Prohibition
  'no-smoking': <NoSmokingIcon />,
  'no-entry': <NoEntryIcon />,
  'no-flames': <NoFlameIcon />,
  'no-water': <NoWaterIcon />,

  // Warning
  'warning-electric': <WarningElectricIcon />,
  'warning-toxic': <WarningToxicIcon />,
  'warning-hot': <WarningHotIcon />,
  'warning-biohazard': <WarningBiohazardIcon />,
  'warning-radiation': <WarningRadiationIcon />,
  'warning-general': <WarningGeneralIcon />,
  'warning-laser': <WarningLaserIcon />,
  'warning-corrosive': <WarningCorrosiveIcon />,

  // Mandatory
  'wear-eye': <WearEyeProtectionIcon />,
  'wear-helmet': <WearHelmetIcon />,
  'wear-ear': <WearEarProtectionIcon />,
  'wear-gloves': <WearGlovesIcon />,

  // Safety
  'exit': <EmergencyExitIcon />,
  'first-aid': <FirstAidIcon />,
  'safety-shower': <SafetyShowerIcon />,
  'assembly': <AssemblyPointIcon />,

  // Fire
  'fire-extinguisher': <FireExtinguisherIcon />,
  'fire-alarm': <FireAlarmIcon />,
  'fire-hose': <FireHoseIcon />,
}

// Type for icon IDs
export type SafetyIconId = keyof typeof safetyIcons

// ============================================================================
// Category Configuration
// ============================================================================

export const iconCategories = {
  prohibition: {
    label: 'Prohibition',
    color: '#CC0000',
    bgColor: '#FEE2E2',
    description: 'Actions that are not permitted'
  },
  warning: {
    label: 'Warning',
    color: '#B45309',
    bgColor: '#FEF3C7',
    description: 'Hazards and dangers'
  },
  mandatory: {
    label: 'Mandatory',
    color: '#0066CC',
    bgColor: '#DBEAFE',
    description: 'Required actions'
  },
  safety: {
    label: 'Safe Condition',
    color: '#009933',
    bgColor: '#D1FAE5',
    description: 'Emergency and safety equipment'
  },
  fire: {
    label: 'Fire Equipment',
    color: '#CC0000',
    bgColor: '#FEE2E2',
    description: 'Fire fighting equipment'
  },
}

// ============================================================================
// Categorized Icon Export for Selection UI
// ============================================================================

export const categorizedIcons = {
  prohibition: [
    { id: 'no-smoking', name: 'No Smoking', iso: 'P002', Component: NoSmokingIcon },
    { id: 'no-entry', name: 'No Entry', iso: 'P001', Component: NoEntryIcon },
    { id: 'no-flames', name: 'No Open Flame', iso: 'P003', Component: NoFlameIcon },
    { id: 'no-water', name: 'Do Not Extinguish with Water', iso: 'P011', Component: NoWaterIcon },
  ],
  warning: [
    { id: 'warning-electric', name: 'Electrical Hazard', iso: 'W012', Component: WarningElectricIcon },
    { id: 'warning-toxic', name: 'Toxic/Poison', iso: 'W016', Component: WarningToxicIcon },
    { id: 'warning-hot', name: 'Hot Surface', iso: 'W017', Component: WarningHotIcon },
    { id: 'warning-biohazard', name: 'Biohazard', iso: 'W009', Component: WarningBiohazardIcon },
    { id: 'warning-radiation', name: 'Radiation', iso: 'W003', Component: WarningRadiationIcon },
    { id: 'warning-general', name: 'General Warning', iso: 'W001', Component: WarningGeneralIcon },
    { id: 'warning-laser', name: 'Laser Beam', iso: 'W004', Component: WarningLaserIcon },
    { id: 'warning-corrosive', name: 'Corrosive', iso: 'W023', Component: WarningCorrosiveIcon },
  ],
  mandatory: [
    { id: 'wear-eye', name: 'Eye Protection Required', iso: 'M004', Component: WearEyeProtectionIcon },
    { id: 'wear-helmet', name: 'Hard Hat Required', iso: 'M014', Component: WearHelmetIcon },
    { id: 'wear-ear', name: 'Hearing Protection Required', iso: 'M003', Component: WearEarProtectionIcon },
    { id: 'wear-gloves', name: 'Gloves Required', iso: 'M009', Component: WearGlovesIcon },
  ],
  safety: [
    { id: 'exit', name: 'Emergency Exit', iso: 'E001', Component: EmergencyExitIcon },
    { id: 'first-aid', name: 'First Aid', iso: 'E003', Component: FirstAidIcon },
    { id: 'safety-shower', name: 'Safety Shower', iso: 'E012', Component: SafetyShowerIcon },
    { id: 'assembly', name: 'Assembly Point', iso: 'E007', Component: AssemblyPointIcon },
  ],
  fire: [
    { id: 'fire-extinguisher', name: 'Fire Extinguisher', iso: 'F001', Component: FireExtinguisherIcon },
    { id: 'fire-alarm', name: 'Fire Alarm', iso: 'F005', Component: FireAlarmIcon },
    { id: 'fire-hose', name: 'Fire Hose', iso: 'F002', Component: FireHoseIcon },
  ],
}

// ============================================================================
// Main SafetyIcon Component
// ============================================================================

interface SafetyIconComponentProps {
  icon: SafetyIconId
  size?: number
  className?: string
}

export function SafetyIcon({ icon, size = 32, className = '' }: SafetyIconComponentProps) {
  // Get the component based on icon ID
  const iconEntry = Object.values(categorizedIcons)
    .flat()
    .find(entry => entry.id === icon)

  if (!iconEntry) return null

  const IconComponent = iconEntry.Component

  return <IconComponent size={size} className={className} />
}

// ============================================================================
// Icon Picker Component for Selection UI
// ============================================================================

interface IconPickerProps {
  value: string | null
  onChange: (iconId: string | null) => void
  showCategories?: boolean
}

export function IconPicker({ value, onChange, showCategories = true }: IconPickerProps) {
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
      {Object.entries(categorizedIcons).map(([category, icons]) => (
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
            {icons.map((iconDef) => {
              const IconComponent = iconDef.Component
              return (
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
                  title={`${iconDef.name} (ISO ${iconDef.iso})`}
                >
                  <IconComponent size={28} />
                  <span className="text-[10px] text-gray-600 truncate w-full text-center">
                    {iconDef.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Default Export - All Icons and Utilities
// ============================================================================

export default {
  // Individual icon components
  NoSmokingIcon,
  NoEntryIcon,
  NoFlameIcon,
  NoWaterIcon,
  WarningElectricIcon,
  WarningToxicIcon,
  WarningHotIcon,
  WarningBiohazardIcon,
  WarningRadiationIcon,
  WarningGeneralIcon,
  WarningLaserIcon,
  WarningCorrosiveIcon,
  WearEyeProtectionIcon,
  WearHelmetIcon,
  WearEarProtectionIcon,
  WearGlovesIcon,
  EmergencyExitIcon,
  FirstAidIcon,
  SafetyShowerIcon,
  AssemblyPointIcon,
  FireExtinguisherIcon,
  FireAlarmIcon,
  FireHoseIcon,

  // Main component
  SafetyIcon,
  IconPicker,

  // Data exports
  iconDefinitions,
  iconCategories,
  categorizedIcons,
  safetyIcons,
}
