// ============================================================================
// VURMZ GLASS DESIGN SYSTEM
// Premium tempered teal glass aesthetic - Apple-inspired liquid glass
// ============================================================================

// Core glass colors - teal-tinted tempered glass with sky blue accents
export const glassColors = {
  // Primary teal glass tint (green tempered glass)
  teal: {
    light: 'rgba(106, 140, 140, 0.08)',
    medium: 'rgba(106, 140, 140, 0.12)',
    strong: 'rgba(106, 140, 140, 0.18)',
    solid: 'rgba(106, 140, 140, 0.25)',
  },
  // Sky blue glass tint (dusty sky blue accents)
  sky: {
    light: 'rgba(140, 174, 196, 0.08)',
    medium: 'rgba(140, 174, 196, 0.12)',
    strong: 'rgba(140, 174, 196, 0.18)',
    solid: 'rgba(140, 174, 196, 0.25)',
  },
  // White glass (for light backgrounds)
  white: {
    light: 'rgba(255, 255, 255, 0.5)',
    medium: 'rgba(255, 255, 255, 0.7)',
    strong: 'rgba(255, 255, 255, 0.85)',
    solid: 'rgba(255, 255, 255, 0.95)',
  },
  // Dark glass (for dark backgrounds)
  dark: {
    light: 'rgba(44, 53, 51, 0.3)',
    medium: 'rgba(44, 53, 51, 0.5)',
    strong: 'rgba(44, 53, 51, 0.7)',
    solid: 'rgba(44, 53, 51, 0.9)',
  },
}

// Glass surface styles
export const glassSurfaces = {
  // Light mode surfaces
  light: {
    card: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
      backdropFilter: 'blur(40px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.5)',
      boxShadow: '0 8px 32px rgba(106,140,140,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
    },
    panel: {
      background: 'linear-gradient(180deg, rgba(106,140,140,0.08) 0%, rgba(106,140,140,0.04) 100%)',
      backdropFilter: 'blur(40px) saturate(180%)',
      border: '1px solid rgba(106,140,140,0.1)',
      boxShadow: '0 8px 32px rgba(106,140,140,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
    },
    input: {
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(106,140,140,0.15)',
      boxShadow: 'inset 0 2px 4px rgba(106,140,140,0.05)',
    },
  },
  // Dark mode surfaces
  dark: {
    card: {
      background: 'linear-gradient(180deg, rgba(106,140,140,0.12) 0%, rgba(106,140,140,0.06) 100%)',
      backdropFilter: 'blur(40px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    panel: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(40px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
    },
    input: {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
    },
  },
}

// Glass edge highlights (the top edge reflection that makes glass look real)
export const glassEdges = {
  top: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.6) 50%, transparent 95%)',
  topStrong: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.9) 50%, transparent 95%)',
  bottom: 'linear-gradient(90deg, transparent 5%, rgba(106,140,140,0.2) 50%, transparent 95%)',
  left: 'linear-gradient(180deg, transparent 5%, rgba(255,255,255,0.4) 50%, transparent 95%)',
}

// Glass inner glow (the subtle highlight on the inside)
export const glassInnerGlow = {
  light: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(106,140,140,0.1)',
  medium: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(106,140,140,0.15)',
  dark: 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)',
}

// Glass buttons
export const glassButtons = {
  primary: {
    background: 'linear-gradient(135deg, rgba(106,140,140,0.9) 0%, rgba(90,122,122,0.95) 100%)',
    boxShadow: '0 8px 32px rgba(106,140,140,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
    hoverBackground: 'linear-gradient(135deg, rgba(106,140,140,1) 0%, rgba(90,122,122,1) 100%)',
  },
  secondary: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
    boxShadow: '0 4px 16px rgba(106,140,140,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
    border: '1px solid rgba(106,140,140,0.2)',
  },
  ghost: {
    background: 'rgba(106,140,140,0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
    hoverBackground: 'rgba(106,140,140,0.15)',
  },
}

// Animation easing for liquid glass feel
export const glassEasing = {
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  liquid: [0.23, 1, 0.32, 1] as [number, number, number, number],
  bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springStiff: { type: 'spring' as const, stiffness: 500, damping: 35 },
}

// Blur values
export const glassBlur = {
  xs: 'blur(8px)',
  sm: 'blur(16px)',
  md: 'blur(24px)',
  lg: 'blur(40px)',
  xl: 'blur(60px)',
  '2xl': 'blur(80px)',
}

// Border radius for glass elements
export const glassRadius = {
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.25rem',   // 20px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '2.5rem', // 40px
  full: '9999px',
}

// Helper function to apply glass surface styles
export function getGlassStyle(
  variant: 'card' | 'panel' | 'input',
  mode: 'light' | 'dark' = 'light'
) {
  return glassSurfaces[mode][variant]
}

// Helper to create glass background with tint
export function createGlassBackground(
  opacity: number = 0.08,
  tint: 'teal' | 'sky' | 'white' | 'dark' = 'teal'
) {
  const colors = {
    teal: [106, 140, 140],  // Green tempered glass
    sky: [140, 174, 196],   // Dusty sky blue
    white: [255, 255, 255],
    dark: [44, 53, 51],
  }
  const [r, g, b] = colors[tint]
  return `linear-gradient(180deg, rgba(${r},${g},${b},${opacity}) 0%, rgba(${r},${g},${b},${opacity * 0.5}) 100%)`
}

// CSS class strings for easy application
export const glassClasses = {
  card: 'backdrop-blur-2xl rounded-3xl border border-white/10',
  panel: 'backdrop-blur-xl rounded-2xl border border-gray-200/50',
  button: 'backdrop-blur-sm rounded-2xl',
  input: 'backdrop-blur-sm rounded-xl border border-gray-200/50',
  badge: 'backdrop-blur-xl rounded-full px-4 py-2 border border-white/10',
}
