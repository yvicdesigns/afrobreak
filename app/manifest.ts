import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AfroBreak',
    short_name: 'AfroBreak',
    description: 'The premier platform for Afro and urban dance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0A1A',
    theme_color: '#FDCA00',
    orientation: 'portrait-primary',
    categories: ['entertainment', 'lifestyle', 'education'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    screenshots: [
      {
        src: '/og-default.jpg',
        sizes: '1200x630',
        type: 'image/jpeg',
      },
    ],
  }
}
