import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import FeaturedVideos from '@/components/home/FeaturedVideos'
import UpcomingEvents from '@/components/home/UpcomingEvents'
import AboutSection from '@/components/home/AboutSection'
import PartnersMarquee from '@/components/home/PartnersMarquee'
import LatestBlog from '@/components/home/LatestBlog'
import { getSetting } from '@/lib/db'

export const metadata: Metadata = {
  title: 'AfroBreak — Move to the Rhythm of Your Culture',
}

export default async function HomePage() {
  const heroImage = await getSetting('hero_image') || ''
  return (
    <>
      <Hero heroImage={heroImage} />
      <FeaturedVideos />
      <UpcomingEvents />
      <AboutSection />
      <PartnersMarquee />
      <LatestBlog />
    </>
  )
}
