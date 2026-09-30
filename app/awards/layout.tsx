import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AfroBreak Culture Awards | Champions',
  description: 'Discover the AfroBreak Culture Awards — celebrating African breaking champions across Boys, Girls, and Regional categories.',
  openGraph: {
    title: 'AfroBreak Culture Awards',
    description: 'Celebrating African breaking champions across the continent.',
    images: [{ url: 'https://afrobreak.com/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AfroBreak Culture Awards', images: ['https://afrobreak.com/og-default.jpg'] },
}

export default function AwardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
