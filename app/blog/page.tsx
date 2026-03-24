'use client'

import { useState, useMemo, useEffect } from 'react'
import clsx from 'clsx'
import { getBlogPosts } from '@/lib/db'
import type { BlogPost, BlogCategory } from '@/lib/types'
import BlogCard from '@/components/blog/BlogCard'
import { BookOpen } from 'lucide-react'

const categories: (BlogCategory | 'All')[] = ['All', 'Dance Tips', 'Culture', 'Interviews', 'Lifestyle', 'News']

const catColors: Record<string, string> = {
  All: 'bg-white/10 text-white border-white/20 hover:border-white/40',
  'Dance Tips': 'bg-teal-500/10 text-teal-400 border-teal-500/30 hover:border-teal-400',
  Culture: 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:border-orange-400',
  Interviews: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:border-indigo-400',
  Lifestyle: 'bg-lime-500/10 text-lime-400 border-lime-500/30 hover:border-lime-400',
  News: 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:border-sky-400',
}

const catActiveColors: Record<string, string> = {
  All: 'bg-white text-background border-white',
  'Dance Tips': 'bg-teal-500 text-white border-teal-500',
  Culture: 'bg-orange-500 text-white border-orange-500',
  Interviews: 'bg-indigo-500 text-white border-indigo-500',
  Lifestyle: 'bg-lime-500 text-background border-lime-500',
  News: 'bg-sky-500 text-white border-sky-500',
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All')

  useEffect(() => {
    getBlogPosts().then(setPosts)
  }, [])

  const featured = posts.find(p => p.featured)
  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory
      return matchCat && !p.featured
    })
  }, [posts, selectedCategory])

  return (
    <div className="min-h-screen pt-16">
      {featured && (
        <section className="relative py-10 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 mb-4">
                <BookOpen size={14} className="text-gold-DEFAULT" />
                <span className="text-sm font-semibold text-gold-DEFAULT uppercase tracking-widest">
                  The AfroBreak Journal
                </span>
              </div>
              <h1 className="heading-lg text-white">
                Stories for <span className="gradient-text-orange">Dancers</span>
              </h1>
            </div>
            <BlogCard post={featured} featured />
          </div>
        </section>
      )}

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-10 py-4 border-y border-white/5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200',
                  selectedCategory === cat ? catActiveColors[cat] : catColors[cat]
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-sm text-text-secondary mb-6">
            <span className="text-white font-semibold">{filtered.length}</span> article{filtered.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && (
              <span> in <span className="text-primary-400">{selectedCategory}</span></span>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-text-secondary">More content coming soon in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
