'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getVideos } from '@/lib/db'
import type { Video } from '@/lib/types'
import VideoCard from '@/components/videos/VideoCard'

export default function FeaturedVideos() {
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    getVideos().then(all => setVideos(all.slice(0, 8)))
  }, [])

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-2">
              Top Picks
            </p>
            <h2 className="heading-md text-white">Featured Videos</h2>
          </div>
          <Link
            href="/videos"
            className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-400 transition-colors group"
          >
            View All
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="scroll-container pb-4">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              className="w-[280px] sm:w-[300px] lg:w-[320px] flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
