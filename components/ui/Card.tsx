'use client'

import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

/*
 * Card Component
 *
 * Design principles:
 * - Surfaces feel like warm paper or soft clay
 * - Shadows are diffuse and natural, like sunlight
 * - Subtle lift on hover for interactive cards
 * - Never cold or harsh
 */

type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  interactive?: boolean
  children: ReactNode
}

const variantStyles = {
  default: `
    bg-[var(--color-white)]
    border border-[rgba(106,140,140,0.08)]
    shadow-[var(--shadow-sm)]
  `,
  elevated: `
    bg-[var(--color-white)]
    border border-[rgba(106,140,140,0.06)]
    shadow-[var(--shadow-md)]
  `,
  outlined: `
    bg-transparent
    border border-[rgba(106,140,140,0.15)]
  `,
  ghost: `
    bg-[var(--color-primary-mist)]
    border border-transparent
  `,
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const roundedStyles = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      rounded = 'lg',
      interactive = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClassName = `
      ${variantStyles[variant]}
      ${paddingStyles[padding]}
      ${roundedStyles[rounded]}
      ${className}
    `

    if (interactive) {
      return (
        <motion.div
          ref={ref}
          className={`${baseClassName} cursor-pointer`}
          whileHover={{
            y: -2,
            boxShadow:
              '0 4px 8px rgba(61, 68, 65, 0.04), 0 8px 16px rgba(61, 68, 65, 0.05), 0 16px 32px rgba(61, 68, 65, 0.04)',
          }}
          whileTap={{
            y: 0,
            scale: 0.995,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={baseClassName} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/*
 * Card Header
 */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`mb-4 pb-4 border-b border-[rgba(106,140,140,0.08)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

/*
 * Card Title
 */
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4'
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, as: Component = 'h3', className = '', ...props }, ref) => (
    <Component
      ref={ref}
      className={`text-lg font-semibold text-[var(--color-dark)] ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
)

CardTitle.displayName = 'CardTitle'

/*
 * Card Description
 */
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-[var(--color-medium)] leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  )
)

CardDescription.displayName = 'CardDescription'

/*
 * Card Content
 */
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

/*
 * Card Footer
 */
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`mt-4 pt-4 border-t border-[rgba(106,140,140,0.08)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'

export default Card
