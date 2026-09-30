import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ambassadors | AfroBreak',
  description: 'Meet the AfroBreak Global Ambassadors — world-class dancers and instructors representing African breaking culture worldwide.',
  openGraph: {
    title: 'AfroBreak Global Ambassadors',
    description: 'World-class dancers and instructors representing African breaking culture worldwide.',
    images: [{ url: 'https://afrobreak.com/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'AfroBreak Ambassadors', images: ['https://afrobreak.com/og-default.jpg'] },
}

export default function InstructorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
