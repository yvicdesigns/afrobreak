import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data: event } = await supabase.from('events').select('title, description, image, date, location').eq('id', id).single()

  if (!event) return { title: 'Event | AfroBreak' }

  const image = event.image || 'https://afrobreak.com/og-default.jpg'
  const title = `${event.title} | AfroBreak`
  const description = event.description
    ? event.description.slice(0, 160)
    : `AfroBreak event — ${event.date || ''} ${event.location ? '· ' + event.location : ''}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'AfroBreak',
      images: [{ url: image, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
