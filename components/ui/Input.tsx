'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'

/*
 * Input Component
 *
 * Design principles:
 * - Warm, inviting surfaces
 * - Soft focus glow, not harsh rings
 * - Clear labeling and error states
 * - Accessible and keyboard-friendly
 */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
  iconRight?: ReactNode
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const baseInputStyles = `
  w-full
  bg-[var(--color-white)]
  text-[var(--color-dark)]
  placeholder:text-[var(--color-muted)]
  border border-[rgba(106,140,140,0.12)]
  rounded-xl
  px-4 py-3
  text-base
  outline-none
  transition-all duration-200
  focus:border-[var(--color-primary)]
  focus:shadow-[0_0_0_3px_rgba(106,140,140,0.1)]
  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-cream)]
`

const errorInputStyles = `
  border-[var(--color-error)]
  focus:border-[var(--color-error)]
  focus:shadow-[0_0_0_3px_rgba(181,122,122,0.1)]
`

const labelStyles = `
  block mb-2
  text-sm font-medium
  text-[var(--color-dark)]
`

const hintStyles = `
  mt-1.5
  text-sm
  text-[var(--color-muted)]
`

const errorStyles = `
  mt-1.5
  text-sm
  text-[var(--color-error)]
`

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              ${baseInputStyles}
              ${error ? errorInputStyles : ''}
              ${icon ? 'pl-12' : ''}
              ${iconRight ? 'pr-12' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {iconRight && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
              {iconRight}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className={errorStyles} role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className={hintStyles}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

/*
 * Textarea Component
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className={labelStyles}>
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`
            ${baseInputStyles}
            ${error ? errorInputStyles : ''}
            min-h-[120px] resize-y
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${textareaId}-error`} className={errorStyles} role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${textareaId}-hint`} className={hintStyles}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

/*
 * Select Component
 */
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className={labelStyles}>
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              ${baseInputStyles}
              ${error ? errorInputStyles : ''}
              appearance-none
              pr-10
              cursor-pointer
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className={errorStyles} role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${selectId}-hint`} className={hintStyles}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Input
