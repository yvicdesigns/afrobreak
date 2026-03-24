'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
    'bg-gradient-to-r from-primary-500 to-primary-600',
    'text-white font-semibold',
    'hover:from-primary-400 hover:to-primary-500',
    'shadow-glow-orange hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]',
    'border border-primary-500/30',
    'disabled:from-primary-800 disabled:to-primary-900 disabled:shadow-none'
  ),
  secondary: clsx(
    'bg-transparent',
    'text-white font-semibold',
    'border border-white/20',
    'hover:border-primary-500/60 hover:bg-white/5',
    'disabled:opacity-40'
  ),
  ghost: clsx(
    'bg-transparent',
    'text-text-secondary font-medium',
    'hover:text-white hover:bg-white/5',
    'border border-transparent',
    'disabled:opacity-40'
  ),
  danger: clsx(
    'bg-gradient-to-r from-red-600 to-red-700',
    'text-white font-semibold',
    'hover:from-red-500 hover:to-red-600',
    'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    'disabled:opacity-40'
  ),
  gold: clsx(
    'bg-gradient-to-r from-gold to-gold-dark',
    'text-background font-bold',
    'hover:from-yellow-300 hover:to-yellow-500',
    'shadow-glow-gold',
    'disabled:opacity-40'
  ),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-background',
          'active:scale-[0.98]',
          'cursor-pointer select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          (disabled || loading) && 'cursor-not-allowed opacity-60',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        {children && <span>{children}</span>}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
