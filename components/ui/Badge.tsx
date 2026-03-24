import clsx from 'clsx'
import type { VideoCategory, VideoLevel, EventType, BlogCategory } from '@/lib/types'

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'gold'
  | 'success'
  | 'danger'
  | 'muted'
  | 'premium'
  | VideoCategory
  | VideoLevel
  | EventType
  | BlogCategory

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  className?: string
}

const variantMap: Record<string, string> = {
  primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
  secondary: 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
  gold: 'bg-gold-DEFAULT/20 text-gold-DEFAULT border border-gold-DEFAULT/30',
  success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  muted: 'bg-white/5 text-text-secondary border border-white/10',
  premium: 'bg-gradient-to-r from-gold-dark/30 to-gold-DEFAULT/30 text-gold-DEFAULT border border-gold-DEFAULT/40',
  // Categories
  'Afro': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  'Hip-Hop': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'Tutorial': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'Dancehall': 'bg-green-500/20 text-green-400 border border-green-500/30',
  'Contemporary': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
  'Kids': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  // Levels
  'Beginner': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'Intermediate': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  'Advanced': 'bg-red-500/20 text-red-400 border border-red-500/30',
  // Event types
  'Workshop': 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
  'Class': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  'Show': 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  'Battle': 'bg-red-500/20 text-red-400 border border-red-500/40',
  // Blog categories
  'Dance Tips': 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
  'Lifestyle': 'bg-lime-500/20 text-lime-400 border border-lime-500/30',
  'Culture': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  'Interviews': 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  'News': 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
}

export default function Badge({ label, variant = 'muted', size = 'sm', className }: BadgeProps) {
  const styles = variantMap[variant] ?? variantMap.muted
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-semibold tracking-wide uppercase',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        styles,
        className
      )}
    >
      {label}
    </span>
  )
}
