import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { AuthProvider } from '@/lib/store'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import ThemeProvider from '@/components/ThemeProvider'
import { LanguageProvider } from '@/lib/LanguageContext'
import PwaRegister from '@/components/PwaRegister'
import VisitorTracker from '@/components/VisitorTracker'

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
        url: 'https://afrobreak.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'AfroBreak — Move to the Rhythm of Your Culture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AfroBreak — Move to the Rhythm of Your Culture',
    description: 'The premier platform for Afro and urban dance.',
    images: ['https://afrobreak.com/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AfroBreak',
  },
  other: {
    'mobile-web-app-capable': 'yes',
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
        <meta name="theme-color" content="#FDCA00" />
        <link rel="apple-touch-icon" href="/logo-auth.png" />
      </head>
      {/* Google AdSense — Auto Ads (Google places ads automatically in good spots) */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4810430938005240"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <body className="bg-background text-white antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <WhatsAppButton />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <PwaRegister />
        <VisitorTracker />
      </body>
    </html>
  )
}
