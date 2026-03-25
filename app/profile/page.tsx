'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Crown, Edit3, Heart, Clock, Play, LogOut, X, Check } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/lib/store'
import { getVideos, updateProfile, toggleFavorite, toggleWatchLater } from '@/lib/db'
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
  const { currentUser, updateUser, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('favorites')
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [watchLater, setWatchLater] = useState<string[]>([])

  useEffect(() => {
    getVideos().then(setAllVideos)
  }, [])

  useEffect(() => {
    if (currentUser) {
      setFavorites(currentUser.favorites || [])
      setWatchLater(currentUser.watchLater || [])
    }
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in</h2>
          <p className="text-text-secondary mb-6">You need to be logged in to view your profile.</p>
          <Link href="/auth/login"><Button variant="primary">Sign In</Button></Link>
        </div>
      </div>
    )
  }

  const favoriteVideos = allVideos.filter(v => favorites.includes(v.id))
  const watchLaterVideos = allVideos.filter(v => watchLater.includes(v.id))
  const historyVideos = allVideos.slice(0, 3)

  const tabVideos: Record<Tab, Video[]> = {
    favorites: favoriteVideos,
    watchlater: watchLaterVideos,
    history: historyVideos,
  }

  const handleOpenEdit = () => {
    setEditName(currentUser.name)
    setEditAvatar(currentUser.avatar)
    setEditOpen(true)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const ok = await updateProfile(currentUser.id, { name: editName, avatar: editAvatar })
    if (ok) {
      updateUser({ name: editName, avatar: editAvatar })
      setSaveSuccess(true)
      setTimeout(() => { setSaveSuccess(false); setEditOpen(false) }, 1500)
    }
    setSaving(false)
  }

  const handleToggleFavorite = async (videoId: string) => {
    const updated = await toggleFavorite(currentUser.id, videoId, favorites)
    setFavorites(updated)
    updateUser({ favorites: updated })
  }

  const handleToggleWatchLater = async (videoId: string) => {
    const updated = await toggleWatchLater(currentUser.id, videoId, watchLater)
    setWatchLater(updated)
    updateUser({ watchLater: updated })
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-xl animate-slide-down">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Avatar preview */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-primary-500/30 flex-shrink-0">
                  <img src={editAvatar || currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${editName}&background=f97316&color=fff` }} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1.5">Avatar URL</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={e => setEditAvatar(e.target.value)}
                    placeholder="https://..."
                    className="input-base text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="input-base"
                />
              </div>
              {saveSuccess && (
                <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-3 text-sm">
                  <Check size={15} /> Profile updated!
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <Button variant="primary" fullWidth loading={saving} onClick={handleSaveProfile}>
                Save Changes
              </Button>
              <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile header */}
      <div className="relative bg-surface border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-primary-500/30">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
              {currentUser.isPremium && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-DEFAULT rounded-full flex items-center justify-center shadow-glow-gold">
                  <Crown size={14} className="text-background" />
                </div>
              )}
            </div>

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

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" leftIcon={<Edit3 size={14} />} onClick={handleOpenEdit}>
                Edit Profile
              </Button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {!currentUser.isPremium && (
            <div className="mt-6 bg-gradient-to-r from-gold-dark/20 to-gold-DEFAULT/10 border border-gold-DEFAULT/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white mb-1">Unlock Premium Access</p>
                <p className="text-sm text-text-secondary">Get unlimited access to all 500+ videos for just €9.99/month</p>
              </div>
              <Link href="/subscribe">
                <Button variant="gold" size="sm" leftIcon={<Crown size={14} />}>Upgrade Now</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-1 bg-surface rounded-xl p-1 border border-white/10 w-fit mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                activeTab === tab.id ? 'bg-primary-500 text-white shadow-sm' : 'text-text-secondary hover:text-white'
              )}
            >
              <tab.icon size={15} />
              {tab.label}
              {tabVideos[tab.id].length > 0 && (
                <span className={clsx('px-1.5 py-0.5 rounded-full text-[10px] font-bold', activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-text-muted')}>
                  {tabVideos[tab.id].length}
                </span>
              )}
            </button>
          ))}
        </div>

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
            <Link href="/videos"><Button variant="primary">Browse Videos</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tabVideos[activeTab].map(video => (
              <div key={video.id} className="relative group">
                <VideoCard video={video} />
                {activeTab !== 'history' && (
                  <button
                    onClick={() => activeTab === 'favorites' ? handleToggleFavorite(video.id) : handleToggleWatchLater(video.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
