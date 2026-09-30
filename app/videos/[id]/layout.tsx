import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data: video } = await supabase.from('videos').select('title, description, thumbnail, instructor').eq('id', id).single()

  if (!video) return { title: 'Video | AfroBreak' }

  const image = video.thumbnail || 'https://afrobreak.com/og-default.jpg'
  const title = `${video.title} | AfroBreak`
  const description = video.description
    ? video.description.slice(0, 160)
    : `Watch ${video.title} by ${video.instructor} on AfroBreak`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'video.other',
      siteName: 'AfroBreak',
      images: [{ url: image, width: 1200, height: 630, alt: video.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function VideoDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
