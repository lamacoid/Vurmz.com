/*
 * Builder Components
 *
 * Unified product builder system with premium styling and liquid transitions.
 */

// Core Shell - Main wrapper with two-column layout
export { default as BuilderShell } from './BuilderShell'
export {
  BuilderSection,
  BuilderOption,
  BuilderColorOption,
  BuilderInput,
  BuilderDivider,
} from './BuilderShell'

// Product Selection Cards
export { default as ProductCard } from './ProductCard'
export { ProductGrid, ProductCardSkeleton } from './ProductCard'

// Progress Indicators
export { default as StepIndicator } from './StepIndicator'
export { CompactStepIndicator, BreadcrumbStepIndicator } from './StepIndicator'

// Loading States
export {
  Skeleton,
  BuilderSkeleton,
  ProductGridSkeleton,
  Spinner,
  DotsLoader,
  ProgressBar,
  PulseLoader,
  LoadingOverlay,
} from './LoadingStates'

// Safety Icons (ISO 7010 compliant)
export { SafetyIcon, iconDefinitions } from './icons/SafetyIcons'

// Industrial Icons (Electrical, Machine Safety, LOTO, GHS, Pipe Marking)
export {
  IndustrialIcon,
  industrialIconDefinitions,
  industrialCategorizedIcons,
  industrialIconCategories,
} from './icons/IndustrialIcons'
