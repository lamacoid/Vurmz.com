// VURMZ Builder Design Tokens
// Premium earth-tone aesthetic with Apple-like polish

export const gradients = {
  // Preview area background
  preview: 'linear-gradient(180deg, #F5F7F6 0%, #E8ECEA 100%)',
  // Control panel background
  control: 'linear-gradient(180deg, #FAFBFA 0%, #F5F7F6 100%)',
  // Header/dark areas
  header: 'linear-gradient(180deg, #2C3533 0%, #1E2422 100%)',
  // Selected state accent
  selected: 'linear-gradient(135deg, var(--vurmz-teal) 0%, var(--vurmz-teal-dark) 100%)',
  // Sky blue accent
  sky: 'linear-gradient(135deg, var(--vurmz-sky) 0%, var(--vurmz-sky-dark) 100%)',
}

// Apple-inspired shadow system
export const shadows = {
  // Subtle elevation for inputs
  subtle: '0 1px 3px rgba(44, 53, 51, 0.06)',
  // Card/option elevation
  card: '0 4px 12px rgba(44, 53, 51, 0.08)',
  // Elevated/hover state
  elevated: '0 8px 24px rgba(44, 53, 51, 0.1)',
  // Preview area main shadow
  preview: '0 20px 40px rgba(44, 53, 51, 0.12), 0 8px 16px rgba(44, 53, 51, 0.08)',
  // Focus ring shadow
  focus: '0 0 0 3px rgba(140, 174, 196, 0.3)',
}

// Border radius system
export const radii = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  full: '9999px',
}

// Timing/easing functions
export const easing = {
  // Smooth default
  smooth: [0.4, 0, 0.2, 1] as const,
  // Bouncy/spring
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  // Liquid/organic feel
  liquid: [0.23, 1, 0.32, 1] as const,
  // Quick snap
  snap: [0.16, 1, 0.3, 1] as const,
}

// Animation durations (ms)
export const durations = {
  fast: 150,
  normal: 300,
  slow: 500,
  morph: 600,
}

// Bezier easing curve type for framer-motion
type BezierCurve = [number, number, number, number]

// Liquid easing curve (reusable)
const liquidEase: BezierCurve = [0.23, 1, 0.32, 1]

// Framer Motion variants for liquid transitions
export const motionVariants = {
  // Product switch animation
  productMorph: {
    initial: {
      opacity: 0,
      scale: 0.96,
      filter: 'blur(8px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: liquidEase,
      }
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      filter: 'blur(4px)',
      transition: {
        duration: 0.3,
      }
    }
  },

  // Staggered children entrance
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: liquidEase,
      }
    }
  },

  // Option hover/select
  optionHover: {
    rest: {
      y: 0,
      boxShadow: '0 1px 3px rgba(44, 53, 51, 0.06)'
    },
    hover: {
      y: -2,
      boxShadow: '0 8px 24px rgba(44, 53, 51, 0.1)',
      transition: {
        duration: 0.25,
        ease: liquidEase,
      }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },

  // Preview container morph
  previewMorph: {
    initial: { borderRadius: '14px' },
    animate: {
      borderRadius: '14px',
      transition: { duration: 0.6, ease: liquidEase }
    }
  },

  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  },
}

// CSS class helpers
export const builderClasses = {
  // Control section wrapper
  controlSection: 'bg-white rounded-lg p-5 shadow-sm border border-gray-100',
  // Section header
  sectionHeader: 'text-sm font-semibold text-vurmz-dark mb-3 uppercase tracking-wide',
  // Option button base
  optionButton: 'px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200',
  // Option button selected
  optionSelected: 'border-vurmz-teal bg-vurmz-teal/10 text-vurmz-teal ring-1 ring-vurmz-teal',
  // Input field
  input: 'w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-vurmz-sky focus:ring-2 focus:ring-vurmz-sky/20 transition-all duration-200',
  // Preview container
  previewContainer: 'bg-gradient-to-b from-vurmz-light to-gray-100 rounded-xl p-8 flex items-center justify-center min-h-[300px]',
}
