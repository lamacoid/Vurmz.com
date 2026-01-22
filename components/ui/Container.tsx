'use client'

import { forwardRef, HTMLAttributes, ReactNode } from 'react'

/*
 * Container Component
 *
 * Design principles:
 * - Consistent max-widths and padding
 * - Responsive by default
 * - Clean, semantic markup
 */

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  centered?: boolean
  children: ReactNode
}

const sizeStyles = {
  sm: 'max-w-2xl',      // 672px
  md: 'max-w-4xl',      // 896px
  lg: 'max-w-6xl',      // 1152px
  xl: 'max-w-7xl',      // 1280px
  '2xl': 'max-w-[1440px]',
  full: 'max-w-none',
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'xl', centered = true, children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          w-full
          px-4 sm:px-6 lg:px-8
          ${sizeStyles[size]}
          ${centered ? 'mx-auto' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

/*
 * Section Component
 *
 * For page sections with consistent spacing
 */
type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article' | 'aside'
  spacing?: SectionSpacing
  background?: 'cream' | 'white' | 'gradient' | 'none'
  children: ReactNode
}

const spacingStyles = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
  xl: 'py-32 md:py-40',
}

const backgroundStyles = {
  cream: 'bg-[var(--color-cream)]',
  white: 'bg-[var(--color-white)]',
  gradient: `
    bg-gradient-to-b
    from-[var(--color-cream)]
    via-[rgba(106,140,140,0.03)]
    to-[var(--color-cream)]
  `,
  none: '',
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      as: Component = 'section',
      spacing = 'lg',
      background = 'none',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLDivElement>}
        className={`
          relative
          ${spacingStyles[spacing]}
          ${backgroundStyles[background]}
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Section.displayName = 'Section'

/*
 * Grid Component
 *
 * Responsive grid layouts
 */
type ColValue = 1 | 2 | 3 | 4 | 6 | 12

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: ColValue | { default?: ColValue; sm?: ColValue; md?: ColValue; lg?: ColValue; xl?: ColValue }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

const colsStyles: Record<ColValue, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
}

const responsiveColsStyles: Record<ColValue, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
}

const gapStyles = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
}

function getColsClassName(cols: GridProps['cols']): string {
  if (typeof cols === 'number') {
    return responsiveColsStyles[cols]
  }
  if (typeof cols === 'object') {
    const classes: string[] = []
    if (cols.default) classes.push(colsStyles[cols.default])
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
    return classes.join(' ')
  }
  return responsiveColsStyles[3]
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 3, gap = 'md', children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          grid
          ${getColsClassName(cols)}
          ${gapStyles[gap]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'

/*
 * Stack Component
 *
 * Vertical or horizontal stacks with spacing
 */
interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal'
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  children: ReactNode
}

const stackGapStyles = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const alignStyles = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const justifyStyles = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'vertical',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          flex
          ${direction === 'vertical' ? 'flex-col' : 'flex-row'}
          ${stackGapStyles[gap]}
          ${alignStyles[align]}
          ${justifyStyles[justify]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Stack.displayName = 'Stack'

export default Container
