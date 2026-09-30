import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | AfroBreak',
  description: 'Get in touch with AfroBreak — for partnerships, press inquiries, event bookings, and more.',
  openGraph: {
    title: 'Contact AfroBreak',
    description: 'Get in touch for partnerships, press inquiries, event bookings, and more.',
    images: [{ url: 'https://afrobreak.com/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Contact AfroBreak', images: ['https://afrobreak.com/og-default.jpg'] },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
