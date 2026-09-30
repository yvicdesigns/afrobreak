import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabase.from('blog_posts').select('title, excerpt, image, author, category').eq('slug', slug).single()

  if (!post) return { title: 'Blog | AfroBreak' }

  const image = post.image || 'https://afrobreak.com/og-default.jpg'
  const title = `${post.title} | AfroBreak`
  const description = post.excerpt?.slice(0, 160) || `${post.category} — AfroBreak Blog`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'AfroBreak',
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
