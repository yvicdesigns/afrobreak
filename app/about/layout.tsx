import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | AfroBreak',
  description: 'AfroBreak — the premier African breaking platform. Discover our story, mission, team, and impact across 28+ countries.',
  openGraph: {
    title: 'About AfroBreak',
    description: 'The premier African breaking platform — our story, mission, team, and global impact.',
    images: [{ url: 'https://afrobreak.com/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'About AfroBreak', images: ['https://afrobreak.com/og-default.jpg'] },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
