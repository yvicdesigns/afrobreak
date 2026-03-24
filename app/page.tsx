import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import FeaturedVideos from '@/components/home/FeaturedVideos'
import UpcomingEvents from '@/components/home/UpcomingEvents'
import AboutSection from '@/components/home/AboutSection'
import LatestBlog from '@/components/home/LatestBlog'

export const metadata: Metadata = {
  title: 'AfroBreak — Move to the Rhythm of Your Culture',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedVideos />
      <UpcomingEvents />
      <AboutSection />
      <LatestBlog />
    </>
  )
}
