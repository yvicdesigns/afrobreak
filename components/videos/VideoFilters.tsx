'use client'

import { SlidersHorizontal } from 'lucide-react'
import clsx from 'clsx'
import type { VideoCategory, VideoLevel } from '@/lib/types'

const categories: (VideoCategory | 'All')[] = ['All', 'Afro', 'Hip-Hop', 'Tutorial', 'Dancehall', 'Contemporary', 'Kids']
const levels: (VideoLevel | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced']

const categoryColors: Record<string, string> = {
  All: 'bg-white/10 text-white border-white/20 hover:border-white/40',
  Afro: 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:border-orange-400',
  'Hip-Hop': 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:border-purple-400',
  Tutorial: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-400',
  Dancehall: 'bg-green-500/10 text-green-400 border-green-500/30 hover:border-green-400',
  Contemporary: 'bg-pink-500/10 text-pink-400 border-pink-500/30 hover:border-pink-400',
  Kids: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:border-yellow-400',
}

const categoryActiveColors: Record<string, string> = {
  All: 'bg-white text-background border-white',
  Afro: 'bg-orange-500 text-white border-orange-500',
  'Hip-Hop': 'bg-purple-500 text-white border-purple-500',
  Tutorial: 'bg-blue-500 text-white border-blue-500',
  Dancehall: 'bg-green-500 text-white border-green-500',
  Contemporary: 'bg-pink-500 text-white border-pink-500',
  Kids: 'bg-yellow-500 text-background border-yellow-500',
}

interface VideoFiltersProps {
  selectedCategory: VideoCategory | 'All'
  selectedLevel: VideoLevel | 'All'
  onCategoryChange: (cat: VideoCategory | 'All') => void
  onLevelChange: (level: VideoLevel | 'All') => void
  showPremiumOnly?: boolean
  onPremiumToggle?: (val: boolean) => void
}

export default function VideoFilters({
  selectedCategory,
  selectedLevel,
  onCategoryChange,
  onLevelChange,
  showPremiumOnly = false,
  onPremiumToggle,
}: VideoFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Category pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-text-secondary mr-2 flex-shrink-0">
          <SlidersHorizontal size={15} />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200',
              selectedCategory === cat ? categoryActiveColors[cat] : categoryColors[cat]
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Level + premium filter row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary font-medium">Level:</span>
          <div className="flex items-center gap-1">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => onLevelChange(level)}
                className={clsx(
                  'px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-200',
                  selectedLevel === level
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-surface-2 text-text-secondary border-white/10 hover:border-white/30 hover:text-white'
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {onPremiumToggle && (
          <button
            onClick={() => onPremiumToggle(!showPremiumOnly)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-200',
              showPremiumOnly
                ? 'bg-gold-DEFAULT/20 text-gold-DEFAULT border-gold-DEFAULT/40'
                : 'bg-surface-2 text-text-secondary border-white/10 hover:border-white/30 hover:text-white'
            )}
          >
            Premium Only
          </button>
        )}
      </div>
    </div>
  )
}
