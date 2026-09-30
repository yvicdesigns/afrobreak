'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Instagram, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type PhotoCategory = 'All' | 'Events' | 'Workshops' | 'Battles' | 'Schools Outreach' | 'Community'

interface Photo {
  id: string
  src: string
  title: string
  category: PhotoCategory
  photographer?: string
  location?: string
}

const categories: PhotoCategory[] = ['All', 'Events', 'Workshops', 'Battles', 'Schools Outreach', 'Community']

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    supabase.from('photos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) setPhotos(data as Photo[])
      setLoading(false)
    })
  }, [])

  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory)

  const openLightbox = (index: number) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null)
  const next = () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null)

  const currentPhoto = lightbox !== null ? filtered[lightbox] : null

  if (loading) return (
    <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <div className="bg-surface border-b border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">Gallery</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Our <span className="gradient-text-orange">Moments</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Creative Studio for AfroBreak Community captured in motion.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface border border-white/10 text-text-secondary hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-2 text-[10px] opacity-60">
                  {photos.filter(p => p.category === (cat as PhotoCategory)).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <Camera size={36} className="text-primary-500/50" />
            </div>
            <p className="text-white font-bold text-lg mb-2">No photos yet</p>
            <p className="text-text-muted text-sm">Photos will appear here once uploaded by the team.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3" style={{ columnGap: '12px' }}>
            {filtered.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative break-inside-avoid mb-3 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary-500/40 transition-all duration-300 shadow-lg hover:shadow-primary-500/10 hover:shadow-xl"
                style={{ display: 'inline-block', width: '100%' }}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-sm">{photo.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">{photo.location}</p>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-primary-500 text-white text-[10px] font-bold rounded-lg shadow">
                      {photo.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instagram CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-500/15 to-pink-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <Instagram size={32} className="text-pink-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Follow us on Instagram</h3>
          <p className="text-text-secondary mb-6">See more photos and videos from the AfroBreak community</p>
          <a
            href="https://www.instagram.com/afrobreakconcepts/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Instagram size={18} /> @afrobreakconcepts
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && currentPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
          style={{ animation: 'lbFadeIn 0.25s ease' }}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all z-10"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all z-10 hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full" style={{ animation: 'lbSlideUp 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                key={lightbox}
                src={currentPhoto.src}
                alt={currentPhoto.title}
                className="w-full max-h-[75vh] object-contain rounded-2xl"
                style={{ animation: 'lbZoom 0.4s cubic-bezier(0.16,1,0.3,1)' }}
              />
              <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-white/10" />
            </div>
            <div className="flex items-center justify-between mt-4" style={{ animation: 'lbFadeIn 0.3s ease 0.1s both' }}>
              <div>
                <p className="text-white font-bold">{currentPhoto.title}</p>
                <p className="text-white/50 text-sm">{currentPhoto.location} · {currentPhoto.photographer}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full">
                  {currentPhoto.category}
                </span>
                <span className="text-white/30 text-sm">{lightbox + 1} / {filtered.length}</span>
                <a
                  href={currentPhoto.src}
                  download
                  onClick={e => e.stopPropagation()}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all z-10 hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes lbFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes lbSlideUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
        @keyframes lbZoom { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }
      `}</style>
    </div>
  )
}
