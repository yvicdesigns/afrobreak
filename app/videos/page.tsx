'use client'

import { useState, useMemo, useEffect } from 'react'
import { getVideos } from '@/lib/db'
import type { Video, VideoCategory } from '@/lib/types'
import VideoCard from '@/components/videos/VideoCard'
import VideoFilters from '@/components/videos/VideoFilters'
import SearchBar from '@/components/ui/SearchBar'
import { Video as VideoIcon, SearchX } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function VideosPage() {
  const { tr } = useLanguage()
  const [videos, setVideos] = useState<Video[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'All'>('All')
  const [premiumOnly, setPremiumOnly] = useState(false)

  useEffect(() => {
    getVideos().then(setVideos)
  }, [])

  const filtered = useMemo(() => {
    return videos.filter(v => {
      const matchSearch =
        !search ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.instructor.toLowerCase().includes(search.toLowerCase()) ||
        v.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))

      const matchCategory = selectedCategory === 'All' || v.category === selectedCategory
      const matchPremium = !premiumOnly || v.isPremium

      return matchSearch && matchCategory && matchPremium
    })
  }, [videos, search, selectedCategory, premiumOnly])

  return (
    <div className="min-h-screen pt-16">
      <div className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-primary-500/15 via-background to-secondary-500/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/30 mb-6">
            <VideoIcon size={14} className="text-primary-500" />
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-widest">
              {tr.videos.videoLibrary}
            </span>
          </div>
          <h1 className="heading-lg text-white mb-4">
            {tr.videos.allVideos.split(' ')[0]} <span className="gradient-text-orange">{tr.videos.allVideos.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mb-8">
            {tr.videos.libraryDesc.replace('{n}', String(videos.length))}
          </p>
          <SearchBar
            placeholder={tr.videos.searchPlaceholderFull}
            value={search}
            onChange={setSearch}
            variant="hero"
            className="mx-auto"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="sticky top-16 z-20 py-4 bg-background/90 backdrop-blur-xl border-b border-white/5 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <VideoFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showPremiumOnly={premiumOnly}
            onPremiumToggle={setPremiumOnly}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-secondary">
            {tr.videos.showing} <span className="text-white font-semibold">{filtered.length}</span> {filtered.length !== 1 ? tr.videos.title.toLowerCase() : 'video'}
            {(selectedCategory !== 'All' || search) && (
              <span className="text-text-muted"> {tr.videos.matchingFilters}</span>
            )}
          </p>
          <button
            onClick={() => {
              setSearch('')
              setSelectedCategory('All')
              setPremiumOnly(false)
            }}
            className="text-xs text-primary-500 hover:text-primary-400 font-medium transition-colors"
          >
            {tr.videos.clearFilters}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SearchX size={48} className="text-text-muted mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{tr.videos.noVideosFound}</h3>
            <p className="text-text-secondary mb-6">{tr.videos.tryAdjusting}</p>
            <button
              onClick={() => {
                setSearch('')
                setSelectedCategory('All')
                setPremiumOnly(false)
              }}
              className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
            >
              {tr.videos.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
