import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { AuthProvider } from '@/lib/store'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: {
    default: 'AfroBreak — Move to the Rhythm of Your Culture',
    template: '%s | AfroBreak',
  },
  description:
    'The premier platform for Afro and urban dance. Learn from world-class instructors with 500+ video tutorials, attend live events across Europe, and connect with a global community of dancers.',
  keywords: [
    'afrobeat dance',
    'afro dance',
    'hip hop dance',
    'dancehall',
    'dance platform',
    'online dance classes',
    'urban dance',
    'afro contemporary',
  ],
  authors: [{ name: 'AfroBreak' }],
  creator: 'AfroBreak',
  publisher: 'AfroBreak',
  metadataBase: new URL('https://afrobreak.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://afrobreak.com',
    siteName: 'AfroBreak',
    title: 'AfroBreak — Move to the Rhythm of Your Culture',
    description:
      'The premier platform for Afro and urban dance. 500+ videos, live events, world-class instructors.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'AfroBreak — Dance Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AfroBreak — Move to the Rhythm of Your Culture',
    description: 'The premier platform for Afro and urban dance.',
    images: ['https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('afrobreak-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}` }} />
      </head>
      <body className="bg-background text-white antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <WhatsAppButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
