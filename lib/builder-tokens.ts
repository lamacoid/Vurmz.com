/*
 * VURMZ Builder Design Tokens
 *
 * Shared design constants for the unified product builder.
 * Premium earth-tone aesthetic with Apple-like polish and liquid motion.
 */

// Premium earth-tone gradients
export const gradients = {
  // Preview area backgrounds
  preview: 'linear-gradient(180deg, #F7F9F8 0%, #EFF3F1 100%)',
  previewAlt: 'linear-gradient(180deg, #FAFBFA 0%, #F5F7F6 100%)',

  // Control panel background
  control: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFA 100%)',

  // Header gradient
  header: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAF9 100%)',

  // Selected/accent state
  accent: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',

  // Sky blue accent
  sky: 'linear-gradient(135deg, var(--color-sky) 0%, var(--color-sky-dark) 100%)',

  // Subtle overlay
  overlay: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
}

// Apple-inspired shadows with muted earth tones
export const shadows = {
  // Subtle elevation for inputs
  subtle: '0 1px 3px rgba(44,53,51,0.05)',

  // Card/option elevation
  card: '0 4px 12px rgba(44,53,51,0.08)',

  // Elevated/hover state
  elevated: '0 8px 24px rgba(44,53,51,0.1)',

  // Preview area main shadow
  preview: '0 20px 50px rgba(44,53,51,0.12)',

  // Inner shadow for depth
  inner: 'inset 0 1px 2px rgba(44,53,51,0.06)',

  // Focus ring shadow
  focus: '0 0 0 3px rgba(106,140,140,0.2)',

  // Glow effect
  glow: '0 0 20px rgba(106,140,140,0.15)',

  // Clay shadow (matching design system)
  clay: '0 4px 20px rgba(61,68,65,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
}

// Border radius system
export const radii = {
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  xxl: '28px',
  full: '9999px',
}

// Liquid motion easing curves
export const easing = {
  // Liquid/organic feel (primary)
  liquid: [0.23, 1, 0.32, 1] as const,

  // Smooth default
  smooth: [0.4, 0, 0.2, 1] as const,

  // Quick snap
  snap: [0.16, 1, 0.3, 1] as const,

  // Bouncy spring
  bounce: [0.68, -0.55, 0.265, 1.55] as const,

  // Gentle deceleration
  gentle: [0.25, 0.1, 0.25, 1] as const,
}

// Animation durations (seconds)
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  morph: 0.5,
  stagger: 0.05,
}

// Spring configurations for Framer Motion
export const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
  responsive: { type: 'spring' as const, stiffness: 200, damping: 25 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 15 },
  stiff: { type: 'spring' as const, stiffness: 400, damping: 30 },
}

// Framer Motion variants for liquid transitions
export const motionVariants = {
  // Product switch animation (main morph)
  productMorph: {
    initial: {
      opacity: 0,
      scale: 0.96,
      filter: 'blur(8px)',
      y: 10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: durations.morph,
        ease: easing.liquid,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(4px)',
      y: -5,
      transition: {
        duration: durations.fast,
        ease: easing.smooth,
      },
    },
  },

  // Staggered children entrance
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: durations.stagger,
        delayChildren: 0.1,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.normal,
        ease: easing.liquid,
      },
    },
  },

  // Option hover/select animations
  optionHover: {
    rest: {
      y: 0,
      boxShadow: shadows.subtle,
    },
    hover: {
      y: -2,
      boxShadow: shadows.card,
      transition: {
        duration: durations.fast,
        ease: easing.liquid,
      },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  },

  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: durations.normal },
    },
    exit: {
      opacity: 0,
      transition: { duration: durations.fast },
    },
  },

  // Slide up entrance
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.normal,
        ease: easing.liquid,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: durations.fast,
      },
    },
  },

  // Scale entrance
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: durations.normal,
        ease: easing.liquid,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: durations.fast,
      },
    },
  },
}

// Spacing scale
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
}

// Preview container sizes
export const previewSizes = {
  compact: { minHeight: '280px' },
  standard: { minHeight: '360px' },
  expanded: { minHeight: '440px' },
}

// Breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Z-index layers
export const layers = {
  base: 0,
  controls: 10,
  preview: 20,
  overlay: 50,
  modal: 100,
  tooltip: 150,
}

// CSS class helpers (for quick styling)
export const builderClasses = {
  // Control section wrapper
  controlSection: `
    bg-white rounded-xl p-5
    shadow-[0_1px_3px_rgba(44,53,51,0.05)]
    border border-[rgba(106,140,140,0.1)]
  `.trim(),

  // Section header
  sectionHeader: `
    text-sm font-semibold text-[var(--color-dark)]
    mb-3 uppercase tracking-wide
  `.trim(),

  // Option button base
  optionButton: `
    px-4 py-2.5 rounded-lg
    border-2 border-[rgba(106,140,140,0.15)]
    text-sm font-medium
    transition-all duration-200
    hover:border-[rgba(106,140,140,0.3)]
  `.trim(),

  // Option button selected
  optionSelected: `
    border-[var(--color-primary)]
    bg-[var(--color-primary-wash)]
    text-[var(--color-primary)]
  `.trim(),

  // Input field
  input: `
    w-full px-4 py-3 rounded-lg
    border-2 border-[rgba(106,140,140,0.15)]
    text-sm
    focus:border-[var(--color-primary)]
    focus:ring-2 focus:ring-[var(--color-primary-wash)]
    transition-all duration-200
    bg-white
  `.trim(),

  // Preview container
  previewContainer: `
    bg-gradient-to-b from-[#F7F9F8] to-[#EFF3F1]
    rounded-2xl p-8
    flex items-center justify-center
    min-h-[360px]
    shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]
  `.trim(),
}
