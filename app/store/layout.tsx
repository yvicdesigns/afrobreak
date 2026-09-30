import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Store | AfroBreak',
  description: 'Shop exclusive AfroBreak merchandise — apparel, accessories, and more. Represent the culture.',
  openGraph: {
    title: 'AfroBreak Store',
    description: 'Shop exclusive AfroBreak merchandise — apparel, accessories, and more.',
    images: [{ url: 'https://afrobreak.com/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AfroBreak Store', images: ['https://afrobreak.com/og-default.jpg'] },
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
