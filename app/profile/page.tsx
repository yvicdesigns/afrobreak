'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Crown, Edit3, Heart, Clock, Play, LogOut, Settings } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/lib/store'
import { getVideos } from '@/lib/db'
import type { Video } from '@/lib/types'
import VideoCard from '@/components/videos/VideoCard'
import Button from '@/components/ui/Button'

type Tab = 'favorites' | 'watchlater' | 'history'

const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'watchlater', label: 'Watch Later', icon: Clock },
  { id: 'history', label: 'Watch History', icon: Play },
]

export default function ProfilePage() {
  const router = useRouter()
  const { currentUser, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('favorites')
  const [allVideos, setAllVideos] = useState<Video[]>([])

  useEffect(() => {
    getVideos().then(setAllVideos)
  }, [])

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in</h2>
          <p className="text-text-secondary mb-6">You need to be logged in to view your profile.</p>
          <Link href="/auth/login">
            <Button variant="primary">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const favoriteVideos = allVideos.filter(v => currentUser.favorites.includes(v.id))
  const watchLaterVideos = allVideos.filter(v => currentUser.watchLater.includes(v.id))
  const historyVideos = allVideos.slice(0, 3)

  const tabVideos: Record<Tab, Video[]> = {
    favorites: favoriteVideos,
    watchlater: watchLaterVideos,
    history: historyVideos,
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Profile header */}
      <div className="relative bg-surface border-b border-white/5 overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-primary-500/30">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {currentUser.isPremium && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-DEFAULT rounded-full flex items-center justify-center shadow-glow-gold">
                  <Crown size={14} className="text-background" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white mb-1">{currentUser.name}</h1>
              <p className="text-text-secondary mb-3">{currentUser.email}</p>
              <div className="flex flex-wrap items-center gap-3">
                {currentUser.isPremium ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 text-xs font-bold text-gold-DEFAULT uppercase tracking-wider">
                    <Crown size={12} /> Premium Member
                  </span>
                ) : (
                  <Link href="/subscribe">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 border border-white/10 text-xs font-bold text-text-secondary uppercase tracking-wider hover:border-primary-500/30 transition-colors cursor-pointer">
                      Free Plan
                    </span>
                  </Link>
                )}
                <span className="text-xs text-text-muted">
                  {favoriteVideos.length} favorites · {watchLaterVideos.length} watch later
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" leftIcon={<Edit3 size={14} />}>
                Edit Profile
              </Button>
              <button
                className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"
                title="Settings"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Subscription card */}
          {!currentUser.isPremium && (
            <div className="mt-6 bg-gradient-to-r from-gold-dark/20 to-gold-DEFAULT/10 border border-gold-DEFAULT/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white mb-1">Unlock Premium Access</p>
                <p className="text-sm text-text-secondary">Get unlimited access to all 500+ videos for just €9.99/month</p>
              </div>
              <Link href="/subscribe">
                <Button variant="gold" size="sm" leftIcon={<Crown size={14} />}>
                  Upgrade Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-1 bg-surface rounded-xl p-1 border border-white/10 w-fit mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-text-secondary hover:text-white'
              )}
            >
              <tab.icon size={15} />
              {tab.label}
              {tabVideos[tab.id].length > 0 && (
                <span className={clsx(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-text-muted'
                )}>
                  {tabVideos[tab.id].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Video grid */}
        {tabVideos[activeTab].length === 0 ? (
          <div className="text-center py-20">
            {activeTab === 'favorites' && <Heart size={48} className="text-text-muted mx-auto mb-4" />}
            {activeTab === 'watchlater' && <Clock size={48} className="text-text-muted mx-auto mb-4" />}
            {activeTab === 'history' && <Play size={48} className="text-text-muted mx-auto mb-4" />}
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === 'favorites' ? 'No favorites yet' : activeTab === 'watchlater' ? 'Watch Later is empty' : 'No watch history'}
            </h3>
            <p className="text-text-secondary mb-6">
              {activeTab === 'favorites' ? 'Heart videos to save them here.' : activeTab === 'watchlater' ? 'Save videos to watch them later.' : 'Start watching to build your history.'}
            </p>
            <Link href="/videos">
              <Button variant="primary">Browse Videos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tabVideos[activeTab].map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
