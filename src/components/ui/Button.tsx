import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-terracotta-600 text-cream-50 hover:bg-terracotta-700 active:bg-terracotta-700 disabled:bg-ink-400/40',
  secondary:
    'bg-ink-900 text-cream-50 hover:bg-ink-800 active:bg-ink-800 disabled:bg-ink-400/40',
  outline:
    'bg-transparent text-ink-900 border border-ink-900/20 hover:border-ink-900/40 hover:bg-ink-900/[0.03] disabled:opacity-40',
  ghost: 'bg-transparent text-ink-900 hover:bg-ink-900/[0.05] disabled:opacity-40',
  danger: 'bg-error-500 text-cream-50 hover:brightness-95 disabled:opacity-40',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-13 px-7 text-base rounded-xl gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
