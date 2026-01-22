/*
 * UI Component Library
 *
 * Base primitives for the VURMZ design system.
 * All components follow Scandinavian + Frutiger Aero + Clay aesthetic.
 */

// Button
export { Button } from './Button'
export type { default as ButtonType } from './Button'

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card'

// Input & Forms
export { Input, Textarea, Select } from './Input'

// Badge
export { Badge, PulseBadge } from './Badge'

// Layout
export { Container, Section, Grid, Stack } from './Container'

// Motion
export {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
  Parallax,
  Float,
  HoverCard,
  Magnetic,
  PageTransition,
  Presence,
  RevealText,
  easings,
  durations,
  springPresets,
} from './Motion'
