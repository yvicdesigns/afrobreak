'use client'

import Link from 'next/link'
import { Play, Lock, Heart, Eye, Clock } from 'lucide-react'
import clsx from 'clsx'
import type { Video } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface VideoCardProps {
  video: Video
  className?: string
  compact?: boolean
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export default function VideoCard({ video, className, compact = false }: VideoCardProps) {
  return (
    <Link
      href={`/videos/${video.id}`}
      className={clsx(
        'group relative block rounded-xl overflow-hidden',
        'bg-surface border border-white/5',
        'transition-all duration-300',
        'hover:border-white/15 hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-primary-500/90 flex items-center justify-center shadow-glow-orange transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={22} className="text-white fill-white ml-1" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <Clock size={10} className="text-text-secondary" />
          <span className="text-xs text-white font-medium">{video.duration}</span>
        </div>

        {/* Premium lock */}
        {video.isPremium && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-gold-DEFAULT/20 backdrop-blur-sm border border-gold-DEFAULT/40 px-2 py-1 rounded-lg">
            <Lock size={11} className="text-gold-DEFAULT" />
            <span className="text-[10px] font-bold text-gold-DEFAULT uppercase tracking-wider">Premium</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <Badge label={video.category} variant={video.category} />
        </div>
      </div>

      {/* Info */}
      <div className={clsx('p-4', compact && 'p-3')}>
        <h3 className={clsx(
          'font-semibold text-white line-clamp-2 leading-snug mb-1.5',
          compact ? 'text-sm' : 'text-base'
        )}>
          {video.title}
        </h3>

        <p className="text-sm text-text-secondary mb-3">{video.instructor}</p>

        <div className="flex items-center justify-between">
          <Badge label={video.level} variant={video.level} />

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {formatViews(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={12} />
              {formatViews(video.likes)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
