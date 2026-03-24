'use client'

import { useState } from 'react'
import { Lock, Crown, Play } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import type { Video } from '@/lib/types'
import { useAuthStore } from '@/lib/store'
import Button from '@/components/ui/Button'

interface VideoPlayerProps {
  video: Video
  className?: string
}

export default function VideoPlayer({ video, className }: VideoPlayerProps) {
  const { currentUser } = useAuthStore()
  const [playing, setPlaying] = useState(false)

  const canWatch = !video.isPremium || (currentUser?.isPremium ?? false)

  // Paywall overlay
  if (!canWatch) {
    return (
      <div
        className={clsx(
          'relative rounded-2xl overflow-hidden bg-surface border border-white/10',
          'aspect-video flex items-center justify-center',
          className
        )}
      >
        {/* Blurred thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105 opacity-40"
        />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

        {/* Paywall content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-gold-DEFAULT/20 border border-gold-DEFAULT/40 flex items-center justify-center mb-6">
            <Lock size={32} className="text-gold-DEFAULT" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Premium Content</h3>
          <p className="text-text-secondary mb-6">
            This video is part of our Premium library. Unlock unlimited access to all {500}+ videos for just €9.99/month.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link href="/subscribe">
              <Button variant="gold" size="lg" leftIcon={<Crown size={18} />}>
                Upgrade to Premium
              </Button>
            </Link>
            {!currentUser && (
              <Link href="/auth/login">
                <Button variant="secondary" size="lg">
                  Log In
                </Button>
              </Link>
            )}
          </div>
          {video.price && (
            <p className="text-xs text-text-muted mt-4">
              Or purchase this video individually for €{video.price}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Check if YouTube URL
  const isYouTube = video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')

  if (isYouTube) {
    const embedUrl = video.videoUrl.includes('/embed/')
      ? video.videoUrl
      : video.videoUrl.replace('watch?v=', 'embed/')

    return (
      <div className={clsx('relative rounded-2xl overflow-hidden bg-black aspect-video', className)}>
        {!playing ? (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer group" onClick={() => setPlaying(true)}>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="relative z-10 w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center shadow-glow-orange group-hover:scale-110 transition-transform">
              <Play size={30} className="text-white fill-white ml-1" />
            </div>
          </div>
        ) : (
          <iframe
            src={`${embedUrl}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        )}
      </div>
    )
  }

  return (
    <div className={clsx('relative rounded-2xl overflow-hidden bg-black aspect-video', className)}>
      <video
        src={video.videoUrl}
        poster={video.thumbnail}
        controls
        className="w-full h-full"
        preload="metadata"
      >
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
