import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Music | AfroBreak',
  description: 'Listen and buy AfroBreak original music — afrobeats, breaking anthems, and cultural soundscapes.',
  openGraph: {
    title: 'AfroBreak Music',
    description: 'Listen and buy AfroBreak original music.',
    images: [{ url: 'https://afrobreak.com/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AfroBreak Music', images: ['https://afrobreak.com/og-default.jpg'] },
}

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
