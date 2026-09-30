import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Press & Media | AfroBreak',
  description: 'AfroBreak newsroom — press coverage, documentaries, interviews and media resources for journalists.',
  openGraph: {
    title: 'AfroBreak Press & Media',
    description: 'Press coverage, documentaries, interviews and media resources.',
    images: [{ url: 'https://afrobreak.com/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AfroBreak Press & Media', images: ['https://afrobreak.com/og-default.jpg'] },
}

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
