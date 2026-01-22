'use client'

import React from 'react'

// ============================================================================
// Industrial Symbol Components
// ============================================================================
// Additional symbols for industrial labeling beyond ISO 7010
// Includes: Electrical, Pipe Marking, Machine Safety, LOTO, GHS

export interface IndustrialIconProps {
  className?: string
  size?: number
}

// ============================================================================
// Color Constants
// ============================================================================

const COLORS = {
  // Electrical
  electricalYellow: '#FFD700',
  electricalOrange: '#FF8C00',

  // Pipe marking (ANSI/ASME A13.1)
  pipeWater: '#0066CC',      // Blue - water
  pipeSteam: '#808080',       // Gray - steam
  pipeAir: '#00AA00',         // Green - air
  pipeGas: '#FFFF00',         // Yellow - gas/flammable
  pipeChemical: '#FF6600',    // Orange - toxic/corrosive

  // GHS
  ghsRed: '#FF0000',
  ghsBlack: '#000000',
  ghsWhite: '#FFFFFF',

  // Machine safety
  machineYellow: '#FFCC00',
  machineBlack: '#1a1a1a',

  // LOTO
  lotoRed: '#CC0000',
  lotoYellow: '#FFCC00',
}

// ============================================================================
// ELECTRICAL PANEL SYMBOLS
// ============================================================================

export function HighVoltageIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="High Voltage">
      <rect x="4" y="4" width="40" height="40" rx="4" fill={COLORS.electricalYellow} stroke={COLORS.machineBlack} strokeWidth="2"/>
      <path d="M27 8 L19 24 L25 24 L20 40 L30 22 L24 22 L27 8" fill={COLORS.machineBlack}/>
    </svg>
  )
}

export function GroundSymbolIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Ground/Earth">
      <circle cx="24" cy="24" r="20" fill="#E8E8E8" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <line x1="24" y1="10" x2="24" y2="22" stroke={COLORS.machineBlack} strokeWidth="3"/>
      <line x1="14" y1="22" x2="34" y2="22" stroke={COLORS.machineBlack} strokeWidth="3"/>
      <line x1="17" y1="28" x2="31" y2="28" stroke={COLORS.machineBlack} strokeWidth="3"/>
      <line x1="20" y1="34" x2="28" y2="34" stroke={COLORS.machineBlack} strokeWidth="3"/>
    </svg>
  )
}

export function DisconnectIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Disconnect">
      <rect x="4" y="4" width="40" height="40" rx="4" fill={COLORS.lotoRed} stroke={COLORS.machineBlack} strokeWidth="2"/>
      <line x1="12" y1="24" x2="20" y2="24" stroke={COLORS.ghsWhite} strokeWidth="4" strokeLinecap="round"/>
      <line x1="28" y1="24" x2="36" y2="24" stroke={COLORS.ghsWhite} strokeWidth="4" strokeLinecap="round"/>
      <line x1="20" y1="24" x2="26" y2="16" stroke={COLORS.ghsWhite} strokeWidth="4" strokeLinecap="round"/>
      <circle cx="20" cy="24" r="3" fill={COLORS.ghsWhite}/>
    </svg>
  )
}

export function Voltage120Icon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="120V">
      <rect x="4" y="4" width="40" height="40" rx="4" fill={COLORS.electricalOrange} stroke={COLORS.machineBlack} strokeWidth="2"/>
      <text x="24" y="28" textAnchor="middle" fontSize="14" fontWeight="bold" fill={COLORS.machineBlack}>120V</text>
    </svg>
  )
}

export function Voltage240Icon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="240V">
      <rect x="4" y="4" width="40" height="40" rx="4" fill={COLORS.electricalOrange} stroke={COLORS.machineBlack} strokeWidth="2"/>
      <text x="24" y="28" textAnchor="middle" fontSize="14" fontWeight="bold" fill={COLORS.machineBlack}>240V</text>
    </svg>
  )
}

export function Voltage480Icon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="480V">
      <rect x="4" y="4" width="40" height="40" rx="4" fill={COLORS.lotoRed} stroke={COLORS.machineBlack} strokeWidth="2"/>
      <text x="24" y="28" textAnchor="middle" fontSize="14" fontWeight="bold" fill={COLORS.ghsWhite}>480V</text>
    </svg>
  )
}

// ============================================================================
// MACHINE SAFETY SYMBOLS
// ============================================================================

export function PinchPointIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Pinch Point">
      <path d="M24 4 L46 44 L2 44 Z" fill={COLORS.machineYellow} stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Hand */}
      <path d="M18 32 L18 26 L20 26 L20 22 L22 22 L22 20 L24 20 L24 22 L26 22 L26 26 L28 26 L28 32 Z" fill={COLORS.machineBlack}/>
      {/* Pinch rollers */}
      <circle cx="18" cy="20" r="4" fill="none" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <circle cx="30" cy="20" r="4" fill="none" stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Arrows pointing inward */}
      <path d="M12 20 L16 20 M14 18 L16 20 L14 22" stroke={COLORS.machineBlack} strokeWidth="1.5" fill="none"/>
      <path d="M36 20 L32 20 M34 18 L32 20 L34 22" stroke={COLORS.machineBlack} strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

export function RotatingMachineryIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Rotating Machinery">
      <path d="M24 4 L46 44 L2 44 Z" fill={COLORS.machineYellow} stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Gear/rotating part */}
      <circle cx="24" cy="26" r="8" fill="none" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <circle cx="24" cy="26" r="3" fill={COLORS.machineBlack}/>
      {/* Rotation arrows */}
      <path d="M24 16 Q32 16 32 24" stroke={COLORS.machineBlack} strokeWidth="2" fill="none"/>
      <path d="M30 22 L32 24 L34 22" fill={COLORS.machineBlack}/>
      <path d="M24 36 Q16 36 16 28" stroke={COLORS.machineBlack} strokeWidth="2" fill="none"/>
      <path d="M18 30 L16 28 L14 30" fill={COLORS.machineBlack}/>
    </svg>
  )
}

export function CrushingHazardIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Crushing Hazard">
      <path d="M24 4 L46 44 L2 44 Z" fill={COLORS.machineYellow} stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Top press */}
      <rect x="14" y="14" width="20" height="6" fill={COLORS.machineBlack}/>
      <path d="M16 20 L16 24 L32 24 L32 20" fill={COLORS.machineBlack}/>
      {/* Hand being crushed */}
      <path d="M20 28 L20 24 L22 24 L22 26 L24 26 L24 24 L26 24 L26 26 L28 26 L28 28 L28 34 L20 34 Z" fill={COLORS.machineBlack}/>
      {/* Bottom surface */}
      <rect x="14" y="34" width="20" height="4" fill={COLORS.machineBlack}/>
      {/* Down arrows */}
      <path d="M18 12 L18 16 M16 14 L18 16 L20 14" stroke={COLORS.machineBlack} strokeWidth="1.5"/>
      <path d="M30 12 L30 16 M28 14 L30 16 L32 14" stroke={COLORS.machineBlack} strokeWidth="1.5"/>
    </svg>
  )
}

export function EntanglementIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Entanglement Hazard">
      <path d="M24 4 L46 44 L2 44 Z" fill={COLORS.machineYellow} stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Rotating shaft with protrusions */}
      <ellipse cx="24" cy="26" rx="10" ry="6" fill="none" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <line x1="24" y1="20" x2="24" y2="14" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <line x1="32" y1="24" x2="38" y2="22" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <line x1="32" y1="28" x2="38" y2="30" stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Arm being caught */}
      <path d="M10 22 L18 26 L16 32 L12 30" stroke={COLORS.machineBlack} strokeWidth="2" fill="none"/>
      <circle cx="10" cy="20" r="3" fill={COLORS.machineBlack}/>
    </svg>
  )
}

export function MovingPartsIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Moving Parts">
      <path d="M24 4 L46 44 L2 44 Z" fill={COLORS.machineYellow} stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Gear 1 */}
      <circle cx="18" cy="24" r="6" fill="none" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <circle cx="18" cy="24" r="2" fill={COLORS.machineBlack}/>
      {/* Gear teeth */}
      <rect x="16" y="16" width="4" height="3" fill={COLORS.machineBlack}/>
      <rect x="16" y="29" width="4" height="3" fill={COLORS.machineBlack}/>
      <rect x="10" y="22" width="3" height="4" fill={COLORS.machineBlack}/>
      {/* Gear 2 */}
      <circle cx="32" cy="28" r="5" fill="none" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <circle cx="32" cy="28" r="2" fill={COLORS.machineBlack}/>
      {/* Motion lines */}
      <path d="M26 20 Q28 22 26 24" stroke={COLORS.machineBlack} strokeWidth="1.5" fill="none"/>
      <path d="M28 18 Q30 20 28 22" stroke={COLORS.machineBlack} strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

// ============================================================================
// LOCKOUT/TAGOUT SYMBOLS
// ============================================================================

export function LockoutIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Lockout">
      <rect x="4" y="4" width="40" height="40" rx="4" fill={COLORS.lotoRed}/>
      {/* Padlock body */}
      <rect x="16" y="22" width="16" height="14" rx="2" fill={COLORS.ghsWhite}/>
      {/* Padlock shackle */}
      <path d="M20 22 L20 16 Q20 12 24 12 Q28 12 28 16 L28 22" fill="none" stroke={COLORS.ghsWhite} strokeWidth="3"/>
      {/* Keyhole */}
      <circle cx="24" cy="28" r="2" fill={COLORS.lotoRed}/>
      <rect x="23" y="28" width="2" height="4" fill={COLORS.lotoRed}/>
    </svg>
  )
}

export function DoNotOperateIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Do Not Operate">
      <circle cx="24" cy="24" r="20" fill={COLORS.ghsWhite}/>
      <circle cx="24" cy="24" r="20" stroke={COLORS.lotoRed} strokeWidth="3" fill="none"/>
      {/* Hand symbol */}
      <path d="M20 30 L20 20 L22 20 L22 16 L24 16 L24 14 L26 14 L26 16 L28 16 L28 20 L30 20 L30 30 Q30 34 25 34 Q20 34 20 30" fill={COLORS.machineBlack}/>
      {/* Diagonal slash */}
      <line x1="10" y1="38" x2="38" y2="10" stroke={COLORS.lotoRed} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

export function LockedOutIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Equipment Locked Out">
      <rect x="4" y="4" width="40" height="40" rx="4" fill={COLORS.lotoYellow} stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Padlock */}
      <rect x="18" y="24" width="12" height="10" rx="1" fill={COLORS.machineBlack}/>
      <path d="M21 24 L21 20 Q21 17 24 17 Q27 17 27 20 L27 24" fill="none" stroke={COLORS.machineBlack} strokeWidth="2"/>
      {/* Text */}
      <text x="24" y="14" textAnchor="middle" fontSize="6" fontWeight="bold" fill={COLORS.machineBlack}>LOCKED</text>
      <text x="24" y="44" textAnchor="middle" fontSize="6" fontWeight="bold" fill={COLORS.machineBlack}>OUT</text>
    </svg>
  )
}

// ============================================================================
// GHS HAZARD SYMBOLS (Globally Harmonized System)
// ============================================================================

export function GHSFlammableIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Flammable">
      {/* Diamond shape */}
      <path d="M24 2 L46 24 L24 46 L2 24 Z" fill={COLORS.ghsWhite} stroke={COLORS.ghsRed} strokeWidth="2"/>
      {/* Flame */}
      <path d="M24 10 C30 16 34 22 30 30 C34 24 36 28 34 36 C30 42 18 42 14 36 C12 28 14 24 18 30 C14 22 18 16 24 10" fill={COLORS.ghsBlack}/>
    </svg>
  )
}

export function GHSOxidizerIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Oxidizer">
      <path d="M24 2 L46 24 L24 46 L2 24 Z" fill={COLORS.ghsWhite} stroke={COLORS.ghsRed} strokeWidth="2"/>
      {/* Flame over circle (oxidizer symbol) */}
      <circle cx="24" cy="30" r="8" fill="none" stroke={COLORS.ghsBlack} strokeWidth="2"/>
      <path d="M24 12 C28 16 30 20 28 26 C30 22 32 24 30 30" fill={COLORS.ghsBlack}/>
    </svg>
  )
}

export function GHSHealthHazardIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Health Hazard">
      <path d="M24 2 L46 24 L24 46 L2 24 Z" fill={COLORS.ghsWhite} stroke={COLORS.ghsRed} strokeWidth="2"/>
      {/* Person silhouette with damage */}
      <circle cx="24" cy="14" r="4" fill={COLORS.ghsBlack}/>
      <path d="M24 18 L24 32 M24 22 L18 28 M24 22 L30 28 M24 32 L20 40 M24 32 L28 40" stroke={COLORS.ghsBlack} strokeWidth="2" strokeLinecap="round"/>
      {/* Star/damage burst on chest */}
      <path d="M22 24 L24 22 L26 24 L24 26 Z" fill={COLORS.ghsWhite}/>
    </svg>
  )
}

export function GHSEnvironmentIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Environmental Hazard">
      <path d="M24 2 L46 24 L24 46 L2 24 Z" fill={COLORS.ghsWhite} stroke={COLORS.ghsRed} strokeWidth="2"/>
      {/* Dead tree */}
      <path d="M24 12 L24 32 M20 16 L24 20 M28 18 L24 22 M18 22 L24 26" stroke={COLORS.ghsBlack} strokeWidth="2"/>
      {/* Dead fish */}
      <ellipse cx="24" cy="38" rx="8" ry="4" fill={COLORS.ghsBlack}/>
      <path d="M32 38 L38 34 L38 42 Z" fill={COLORS.ghsBlack}/>
      <circle cx="18" cy="37" r="1" fill={COLORS.ghsWhite}/>
    </svg>
  )
}

export function GHSCompressedGasIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Compressed Gas">
      <path d="M24 2 L46 24 L24 46 L2 24 Z" fill={COLORS.ghsWhite} stroke={COLORS.ghsRed} strokeWidth="2"/>
      {/* Gas cylinder */}
      <rect x="18" y="14" width="12" height="24" rx="2" fill={COLORS.ghsBlack}/>
      <ellipse cx="24" cy="14" rx="6" ry="2" fill={COLORS.ghsBlack}/>
      <rect x="22" y="10" width="4" height="6" fill={COLORS.ghsBlack}/>
      {/* Valve */}
      <rect x="21" y="8" width="6" height="4" fill={COLORS.ghsBlack}/>
    </svg>
  )
}

export function GHSCorrosiveIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Corrosive">
      <path d="M24 2 L46 24 L24 46 L2 24 Z" fill={COLORS.ghsWhite} stroke={COLORS.ghsRed} strokeWidth="2"/>
      {/* Test tubes pouring */}
      <path d="M16 12 L16 20 L20 28 L20 32 L12 32 L12 28 L16 20" fill={COLORS.ghsBlack}/>
      <path d="M32 12 L32 20 L28 28 L28 32 L36 32 L36 28 L32 20" fill={COLORS.ghsBlack}/>
      {/* Surface being corroded */}
      <rect x="10" y="34" width="28" height="4" fill={COLORS.ghsBlack}/>
      {/* Drips */}
      <path d="M18 28 Q20 32 18 36" stroke={COLORS.ghsBlack} strokeWidth="2"/>
      <path d="M30 28 Q28 32 30 36" stroke={COLORS.ghsBlack} strokeWidth="2"/>
    </svg>
  )
}

export function GHSExplosiveIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Explosive">
      <path d="M24 2 L46 24 L24 46 L2 24 Z" fill={COLORS.ghsWhite} stroke={COLORS.ghsRed} strokeWidth="2"/>
      {/* Exploding bomb */}
      <circle cx="24" cy="28" r="8" fill={COLORS.ghsBlack}/>
      {/* Explosion rays */}
      <line x1="24" y1="18" x2="24" y2="10" stroke={COLORS.ghsBlack} strokeWidth="2"/>
      <line x1="32" y1="22" x2="38" y2="16" stroke={COLORS.ghsBlack} strokeWidth="2"/>
      <line x1="16" y1="22" x2="10" y2="16" stroke={COLORS.ghsBlack} strokeWidth="2"/>
      <line x1="34" y1="28" x2="40" y2="28" stroke={COLORS.ghsBlack} strokeWidth="2"/>
      <line x1="14" y1="28" x2="8" y2="28" stroke={COLORS.ghsBlack} strokeWidth="2"/>
      {/* Debris */}
      <rect x="12" y="36" width="4" height="4" fill={COLORS.ghsBlack} transform="rotate(15 14 38)"/>
      <rect x="32" y="36" width="4" height="4" fill={COLORS.ghsBlack} transform="rotate(-15 34 38)"/>
    </svg>
  )
}

// ============================================================================
// PIPE MARKING SYMBOLS (ANSI/ASME A13.1)
// ============================================================================

export function PipeWaterIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Water Pipe">
      <rect x="4" y="16" width="40" height="16" fill={COLORS.pipeWater}/>
      <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill={COLORS.ghsWhite}>WATER</text>
      {/* Flow arrow */}
      <path d="M38 24 L44 24 M42 20 L46 24 L42 28" stroke={COLORS.ghsWhite} strokeWidth="2" fill="none"/>
    </svg>
  )
}

export function PipeSteamIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Steam Pipe">
      <rect x="4" y="16" width="40" height="16" fill={COLORS.pipeSteam}/>
      <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill={COLORS.ghsWhite}>STEAM</text>
      <path d="M38 24 L44 24 M42 20 L46 24 L42 28" stroke={COLORS.ghsWhite} strokeWidth="2" fill="none"/>
    </svg>
  )
}

export function PipeAirIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Air Pipe">
      <rect x="4" y="16" width="40" height="16" fill={COLORS.pipeAir}/>
      <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill={COLORS.ghsWhite}>AIR</text>
      <path d="M38 24 L44 24 M42 20 L46 24 L42 28" stroke={COLORS.ghsWhite} strokeWidth="2" fill="none"/>
    </svg>
  )
}

export function PipeGasIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Gas Pipe">
      <rect x="4" y="16" width="40" height="16" fill={COLORS.pipeGas}/>
      <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill={COLORS.machineBlack}>GAS</text>
      <path d="M38 24 L44 24 M42 20 L46 24 L42 28" stroke={COLORS.machineBlack} strokeWidth="2" fill="none"/>
    </svg>
  )
}

export function PipeChemicalIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Chemical Pipe">
      <rect x="4" y="16" width="40" height="16" fill={COLORS.pipeChemical}/>
      <text x="24" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill={COLORS.machineBlack}>CHEMICAL</text>
      <path d="M38 24 L44 24 M42 20 L46 24 L42 28" stroke={COLORS.machineBlack} strokeWidth="2" fill="none"/>
    </svg>
  )
}

export function FlowArrowIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Flow Direction">
      <rect x="4" y="18" width="30" height="12" fill={COLORS.machineBlack}/>
      <path d="M34 12 L46 24 L34 36 Z" fill={COLORS.machineBlack}/>
    </svg>
  )
}

// ============================================================================
// EQUIPMENT IDENTIFICATION
// ============================================================================

export function EquipmentIDIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Equipment ID">
      <rect x="4" y="8" width="40" height="32" rx="2" fill="#E8E8E8" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <rect x="8" y="12" width="32" height="8" fill={COLORS.ghsWhite} stroke={COLORS.machineBlack} strokeWidth="1"/>
      <text x="24" y="18" textAnchor="middle" fontSize="5" fill={COLORS.machineBlack}>EQUIPMENT ID</text>
      <rect x="8" y="24" width="32" height="12" fill={COLORS.ghsWhite} stroke={COLORS.machineBlack} strokeWidth="1"/>
      {/* Barcode lines */}
      <g fill={COLORS.machineBlack}>
        <rect x="10" y="26" width="1" height="8"/>
        <rect x="12" y="26" width="2" height="8"/>
        <rect x="16" y="26" width="1" height="8"/>
        <rect x="18" y="26" width="3" height="8"/>
        <rect x="23" y="26" width="1" height="8"/>
        <rect x="25" y="26" width="2" height="8"/>
        <rect x="29" y="26" width="1" height="8"/>
        <rect x="32" y="26" width="2" height="8"/>
        <rect x="36" y="26" width="1" height="8"/>
        <rect x="38" y="26" width="1" height="8"/>
      </g>
    </svg>
  )
}

export function AssetTagIcon({ className = '', size = 48 }: IndustrialIconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-label="Asset Tag">
      <rect x="4" y="10" width="40" height="28" rx="2" fill="#C0C0C0" stroke={COLORS.machineBlack} strokeWidth="2"/>
      <text x="24" y="22" textAnchor="middle" fontSize="6" fontWeight="bold" fill={COLORS.machineBlack}>ASSET #</text>
      <rect x="8" y="26" width="32" height="8" fill={COLORS.ghsWhite}/>
      <text x="24" y="33" textAnchor="middle" fontSize="7" fontFamily="monospace" fill={COLORS.machineBlack}>000000</text>
      {/* Mounting hole */}
      <circle cx="8" cy="14" r="2" fill={COLORS.ghsWhite} stroke={COLORS.machineBlack} strokeWidth="1"/>
    </svg>
  )
}

// ============================================================================
// Icon Definitions & Registry
// ============================================================================

export const industrialIconDefinitions = [
  // Electrical
  { id: 'high-voltage', name: 'High Voltage', category: 'electrical' },
  { id: 'ground-symbol', name: 'Ground/Earth', category: 'electrical' },
  { id: 'disconnect', name: 'Disconnect', category: 'electrical' },
  { id: 'voltage-120', name: '120V', category: 'electrical' },
  { id: 'voltage-240', name: '240V', category: 'electrical' },
  { id: 'voltage-480', name: '480V', category: 'electrical' },

  // Machine Safety
  { id: 'pinch-point', name: 'Pinch Point', category: 'machine' },
  { id: 'rotating-machinery', name: 'Rotating Machinery', category: 'machine' },
  { id: 'crushing-hazard', name: 'Crushing Hazard', category: 'machine' },
  { id: 'entanglement', name: 'Entanglement', category: 'machine' },
  { id: 'moving-parts', name: 'Moving Parts', category: 'machine' },

  // LOTO
  { id: 'lockout', name: 'Lockout', category: 'loto' },
  { id: 'do-not-operate', name: 'Do Not Operate', category: 'loto' },
  { id: 'locked-out', name: 'Locked Out', category: 'loto' },

  // GHS
  { id: 'ghs-flammable', name: 'Flammable (GHS)', category: 'ghs' },
  { id: 'ghs-oxidizer', name: 'Oxidizer (GHS)', category: 'ghs' },
  { id: 'ghs-health', name: 'Health Hazard (GHS)', category: 'ghs' },
  { id: 'ghs-environment', name: 'Environmental (GHS)', category: 'ghs' },
  { id: 'ghs-gas', name: 'Compressed Gas (GHS)', category: 'ghs' },
  { id: 'ghs-corrosive', name: 'Corrosive (GHS)', category: 'ghs' },
  { id: 'ghs-explosive', name: 'Explosive (GHS)', category: 'ghs' },

  // Pipe Marking
  { id: 'pipe-water', name: 'Water Pipe', category: 'pipe' },
  { id: 'pipe-steam', name: 'Steam Pipe', category: 'pipe' },
  { id: 'pipe-air', name: 'Air Pipe', category: 'pipe' },
  { id: 'pipe-gas', name: 'Gas Pipe', category: 'pipe' },
  { id: 'pipe-chemical', name: 'Chemical Pipe', category: 'pipe' },
  { id: 'flow-arrow', name: 'Flow Direction', category: 'pipe' },

  // Equipment
  { id: 'equipment-id', name: 'Equipment ID', category: 'equipment' },
  { id: 'asset-tag', name: 'Asset Tag', category: 'equipment' },
]

export const industrialCategorizedIcons = {
  electrical: [
    { id: 'high-voltage', name: 'High Voltage', Component: HighVoltageIcon },
    { id: 'ground-symbol', name: 'Ground/Earth', Component: GroundSymbolIcon },
    { id: 'disconnect', name: 'Disconnect', Component: DisconnectIcon },
    { id: 'voltage-120', name: '120V', Component: Voltage120Icon },
    { id: 'voltage-240', name: '240V', Component: Voltage240Icon },
    { id: 'voltage-480', name: '480V', Component: Voltage480Icon },
  ],
  machine: [
    { id: 'pinch-point', name: 'Pinch Point', Component: PinchPointIcon },
    { id: 'rotating-machinery', name: 'Rotating Machinery', Component: RotatingMachineryIcon },
    { id: 'crushing-hazard', name: 'Crushing Hazard', Component: CrushingHazardIcon },
    { id: 'entanglement', name: 'Entanglement', Component: EntanglementIcon },
    { id: 'moving-parts', name: 'Moving Parts', Component: MovingPartsIcon },
  ],
  loto: [
    { id: 'lockout', name: 'Lockout', Component: LockoutIcon },
    { id: 'do-not-operate', name: 'Do Not Operate', Component: DoNotOperateIcon },
    { id: 'locked-out', name: 'Locked Out', Component: LockedOutIcon },
  ],
  ghs: [
    { id: 'ghs-flammable', name: 'Flammable', Component: GHSFlammableIcon },
    { id: 'ghs-oxidizer', name: 'Oxidizer', Component: GHSOxidizerIcon },
    { id: 'ghs-health', name: 'Health Hazard', Component: GHSHealthHazardIcon },
    { id: 'ghs-environment', name: 'Environmental', Component: GHSEnvironmentIcon },
    { id: 'ghs-gas', name: 'Compressed Gas', Component: GHSCompressedGasIcon },
    { id: 'ghs-corrosive', name: 'Corrosive', Component: GHSCorrosiveIcon },
    { id: 'ghs-explosive', name: 'Explosive', Component: GHSExplosiveIcon },
  ],
  pipe: [
    { id: 'pipe-water', name: 'Water', Component: PipeWaterIcon },
    { id: 'pipe-steam', name: 'Steam', Component: PipeSteamIcon },
    { id: 'pipe-air', name: 'Air', Component: PipeAirIcon },
    { id: 'pipe-gas', name: 'Gas', Component: PipeGasIcon },
    { id: 'pipe-chemical', name: 'Chemical', Component: PipeChemicalIcon },
    { id: 'flow-arrow', name: 'Flow Arrow', Component: FlowArrowIcon },
  ],
  equipment: [
    { id: 'equipment-id', name: 'Equipment ID', Component: EquipmentIDIcon },
    { id: 'asset-tag', name: 'Asset Tag', Component: AssetTagIcon },
  ],
}

export const industrialIconCategories = {
  electrical: {
    label: 'Electrical',
    color: '#FF8C00',
    bgColor: '#FFF3E0',
    description: 'Electrical panel and voltage labels'
  },
  machine: {
    label: 'Machine Safety',
    color: '#B45309',
    bgColor: '#FEF3C7',
    description: 'Machine and equipment hazards'
  },
  loto: {
    label: 'Lockout/Tagout',
    color: '#CC0000',
    bgColor: '#FEE2E2',
    description: 'LOTO safety procedures'
  },
  ghs: {
    label: 'GHS Hazard',
    color: '#CC0000',
    bgColor: '#FEE2E2',
    description: 'Globally Harmonized System chemical hazards'
  },
  pipe: {
    label: 'Pipe Marking',
    color: '#0066CC',
    bgColor: '#DBEAFE',
    description: 'ANSI/ASME A13.1 pipe identification'
  },
  equipment: {
    label: 'Equipment ID',
    color: '#666666',
    bgColor: '#F3F4F6',
    description: 'Asset and equipment identification'
  },
}

// Get icon component by ID
export function IndustrialIcon({ icon, size = 32, className = '' }: { icon: string; size?: number; className?: string }) {
  const iconEntry = Object.values(industrialCategorizedIcons)
    .flat()
    .find(entry => entry.id === icon)

  if (!iconEntry) return null

  const IconComponent = iconEntry.Component
  return <IconComponent size={size} className={className} />
}

export default {
  // Components
  HighVoltageIcon,
  GroundSymbolIcon,
  DisconnectIcon,
  Voltage120Icon,
  Voltage240Icon,
  Voltage480Icon,
  PinchPointIcon,
  RotatingMachineryIcon,
  CrushingHazardIcon,
  EntanglementIcon,
  MovingPartsIcon,
  LockoutIcon,
  DoNotOperateIcon,
  LockedOutIcon,
  GHSFlammableIcon,
  GHSOxidizerIcon,
  GHSHealthHazardIcon,
  GHSEnvironmentIcon,
  GHSCompressedGasIcon,
  GHSCorrosiveIcon,
  GHSExplosiveIcon,
  PipeWaterIcon,
  PipeSteamIcon,
  PipeAirIcon,
  PipeGasIcon,
  PipeChemicalIcon,
  FlowArrowIcon,
  EquipmentIDIcon,
  AssetTagIcon,

  // Main component
  IndustrialIcon,

  // Data
  industrialIconDefinitions,
  industrialCategorizedIcons,
  industrialIconCategories,
}
