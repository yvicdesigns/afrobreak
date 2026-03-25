'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Instagram } from 'lucide-react'

type PhotoCategory = 'All' | 'Events' | 'Classes' | 'Battles' | 'Backstage' | 'Community'

interface Photo {
  id: string
  src: string
  title: string
  category: PhotoCategory
  photographer?: string
  location?: string
}

const photos: Photo[] = [
  { id: '1', src: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80', title: 'Afrobeat Session', category: 'Classes', photographer: 'AfroBreak Media', location: 'Paris' },
  { id: '2', src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', title: 'Hip-Hop Cypher', category: 'Events', photographer: 'AfroBreak Media', location: 'Lyon' },
  { id: '3', src: 'https://images.unsplash.com/photo-1504680177321-2e6a879d4e8f?w=800&q=80', title: 'Dancehall Vibes', category: 'Classes', photographer: 'AfroBreak Media', location: 'Marseille' },
  { id: '4', src: 'https://images.unsplash.com/photo-1535525153412-5a42439a210e?w=800&q=80', title: 'Contemporary Fusion', category: 'Events', photographer: 'AfroBreak Media', location: 'Paris' },
  { id: '5', src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80', title: 'Battle Night', category: 'Battles', photographer: 'AfroBreak Media', location: 'Bordeaux' },
  { id: '6', src: 'https://images.unsplash.com/photo-1508700929628-c3d7819c1498?w=800&q=80', title: 'B-Boy Showcase', category: 'Battles', photographer: 'AfroBreak Media', location: 'Toulouse' },
  { id: '7', src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80', title: 'Backstage Moments', category: 'Backstage', photographer: 'AfroBreak Media', location: 'Paris' },
  { id: '8', src: 'https://images.unsplash.com/photo-1483362271674-7461064d5e66?w=800&q=80', title: 'Community Day', category: 'Community', photographer: 'AfroBreak Media', location: 'Paris' },
  { id: '9', src: 'https://images.unsplash.com/photo-1526483291330-fe44429f3e0d?w=800&q=80', title: 'Afro Workshop', category: 'Classes', photographer: 'AfroBreak Media', location: 'Nice' },
  { id: '10', src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', title: 'Kids Dance Party', category: 'Community', photographer: 'AfroBreak Media', location: 'Paris' },
  { id: '11', src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80', title: 'Show Night', category: 'Events', photographer: 'AfroBreak Media', location: 'Lyon' },
  { id: '12', src: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80', title: 'Urban Dance Festival', category: 'Events', photographer: 'AfroBreak Media', location: 'Paris' },
  { id: '13', src: 'https://images.unsplash.com/photo-1598387993441-a364f854cde4?w=800&q=80', title: 'Rehearsal Room', category: 'Backstage', photographer: 'AfroBreak Media', location: 'Paris' },
  { id: '14', src: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80', title: 'Battle Qualifiers', category: 'Battles', photographer: 'AfroBreak Media', location: 'Marseille' },
  { id: '15', src: 'https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?w=800&q=80', title: 'Community Gathering', category: 'Community', photographer: 'AfroBreak Media', location: 'Bordeaux' },
]

const categories: PhotoCategory[] = ['All', 'Events', 'Classes', 'Battles', 'Backstage', 'Community']

export default function PhotosPage() {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory)

  const openLightbox = (index: number) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prev = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null)
  const next = () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null)

  const currentPhoto = lightbox !== null ? filtered[lightbox] : null

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
            Behind the scenes, on stage, in the studio — the AfroBreak community captured in motion.
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
                  {photos.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filtered.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary-500/30 transition-all duration-300"
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm">{photo.title}</p>
                  <p className="text-white/60 text-xs">{photo.location}</p>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-primary-500/80 text-white text-[10px] font-bold rounded-lg">
                    {photo.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-500/15 to-pink-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <Instagram size={32} className="text-pink-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Follow us on Instagram</h3>
          <p className="text-text-secondary mb-6">See more photos and videos from the AfroBreak community</p>
          <a
            href="https://instagram.com/afrobreak"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Instagram size={18} /> @afrobreak
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && currentPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
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
            className="absolute left-4 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all z-10"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
            <img
              src={currentPhoto.src}
              alt={currentPhoto.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="flex items-center justify-between mt-4">
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
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <Download size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  )
}
