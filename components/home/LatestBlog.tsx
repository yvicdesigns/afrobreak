'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getBlogPosts } from '@/lib/db'
import type { BlogPost } from '@/lib/types'
import BlogCard from '@/components/blog/BlogCard'

export default function LatestBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    getBlogPosts().then(all => setPosts(all.slice(0, 3)))
  }, [])

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-gold-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">
              From The Community
            </p>
            <h2 className="heading-md text-white">Latest Articles</h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm font-medium text-gold-DEFAULT hover:text-yellow-300 transition-colors group"
          >
            View All
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
