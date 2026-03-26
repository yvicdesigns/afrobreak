'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Heart, Share2, Clock, Eye, BookmarkPlus, ArrowLeft,
  User, Tag, ChevronRight
} from 'lucide-react'
import clsx from 'clsx'
import { getVideoById, getVideos } from '@/lib/db'
import type { Video } from '@/lib/types'
import VideoPlayer from '@/components/videos/VideoPlayer'
import VideoCard from '@/components/videos/VideoCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/lib/store'

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  const { currentUser, updateUser } = useAuthStore()
  const [video, setVideo] = useState<Video | null>(null)
  const [related, setRelated] = useState<Video[]>([])
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [watchLater, setWatchLater] = useState(false)
  const [shareMsg, setShareMsg] = useState('')

  useEffect(() => {
    Promise.all([getVideoById(params.id), getVideos()]).then(([v, all]) => {
      if (!v) { setLoading(false); return }
      setVideo(v)
      setLikeCount(v.likes)
      setSaved(currentUser?.favorites.includes(v.id) ?? false)
      setWatchLater(currentUser?.watchLater.includes(v.id) ?? false)
      setAllVideos(all)
      setRelated(all.filter(a => a.id !== v.id && (a.category === v.category || a.instructor === v.instructor)).slice(0, 4))
      setLoading(false)
    })
  }, [params.id, currentUser])

  if (loading) return <div className="min-h-screen pt-16 flex items-center justify-center"><p className="text-text-secondary">Loading...</p></div>
  if (!video) return notFound()

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleSave = () => {
    if (!currentUser) return
    const newFavs = saved
      ? currentUser.favorites.filter(id => id !== video.id)
      : [...currentUser.favorites, video.id]
    updateUser({ favorites: newFavs })
    setSaved(!saved)
  }

  const handleWatchLater = () => {
    if (!currentUser) return
    const newWL = watchLater
      ? currentUser.watchLater.filter(id => id !== video.id)
      : [...currentUser.watchLater, video.id]
    updateUser({ watchLater: newWL })
    setWatchLater(!watchLater)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareMsg('Link copied!')
      setTimeout(() => setShareMsg(''), 2000)
    } catch {
      setShareMsg('Copied!')
    }
  }

  const premiumCount = allVideos.filter(v => v.isPremium).length

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Videos
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <VideoPlayer video={video} />

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge label={video.category} variant={video.category} size="md" />
                <Badge label={video.level} variant={video.level} size="md" />
                {video.isPremium && <Badge label="Premium" variant="premium" size="md" />}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-primary-500" />
                  {video.instructor}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-primary-500" />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} className="text-primary-500" />
                  {formatViews(video.views)} views
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5">
                <button
                  onClick={handleLike}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200',
                    liked
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-surface-2 text-text-secondary border-white/10 hover:text-red-400 hover:border-red-500/30'
                  )}
                >
                  <Heart size={16} className={liked ? 'fill-red-400' : ''} />
                  {formatViews(likeCount)}
                </button>

                <button
                  onClick={handleSave}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200',
                    saved
                      ? 'bg-primary-500/20 text-primary-400 border-primary-500/40'
                      : 'bg-surface-2 text-text-secondary border-white/10 hover:text-primary-400 hover:border-primary-500/30'
                  )}
                >
                  <BookmarkPlus size={16} />
                  {saved ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={handleWatchLater}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200',
                    watchLater
                      ? 'bg-secondary-500/20 text-secondary-400 border-secondary-500/40'
                      : 'bg-surface-2 text-text-secondary border-white/10 hover:text-secondary-400 hover:border-secondary-500/30'
                  )}
                >
                  <Clock size={16} />
                  {watchLater ? 'Added' : 'Watch Later'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-surface-2 text-text-secondary border-white/10 hover:text-white hover:border-white/30 text-sm font-medium transition-all duration-200"
                >
                  <Share2 size={16} />
                  {shareMsg || 'Share'}
                </button>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold text-white text-lg mb-3">About this video</h2>
              <p className="text-text-secondary leading-relaxed">{video.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Tag size={14} className="text-text-muted mt-1" />
              {video.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-surface-2 border border-white/10 text-xs text-text-secondary hover:text-white hover:border-white/30 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold text-white text-lg mb-4">Your Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-primary-500/30">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80"
                    alt={video.instructor}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white">{video.instructor}</h3>
                  <p className="text-sm text-primary-400 mb-2">Dance Instructor</p>
                  <p className="text-sm text-text-secondary">
                    World-class instructor specializing in {video.category} dance. Join thousands of students learning from one of the best in the business.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-lg">Related Videos</h2>
              <Link
                href="/videos"
                className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-400 transition-colors"
              >
                See all <ChevronRight size={12} />
              </Link>
            </div>

            {related.length > 0 ? (
              <div className="space-y-4">
                {related.map(v => (
                  <VideoCard key={v.id} video={v} compact />
                ))}
              </div>
            ) : (
              <div className="text-sm text-text-muted text-center py-8">
                No related videos found.
              </div>
            )}

            {!currentUser?.isPremium && (
              <div className="bg-gradient-to-br from-gold-dark/20 to-gold-DEFAULT/10 border border-gold-DEFAULT/30 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">👑</div>
                <h3 className="font-bold text-white mb-2">Go Premium</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Unlock all {premiumCount} premium videos for just €9.99/month.
                </p>
                <Link href="/subscribe">
                  <Button variant="gold" size="sm" fullWidth>
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
