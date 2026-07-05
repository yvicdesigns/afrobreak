'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPartners } from '@/lib/db'

const staticPartners = [
  { id: 's1', name: 'KGL Foundation', logo_url: '', website: '' },
  { id: 's2', name: 'France Ghana', logo_url: '', website: '' },
  { id: 's3', name: 'Tropisme', logo_url: '', website: '' },
  { id: 's4', name: 'Elavanyo School', logo_url: '', website: '' },
  { id: 's5', name: 'Fitrip Ghana', logo_url: '', website: '' },
  { id: 's6', name: 'The Ruggeds', logo_url: '', website: '' },
  { id: 's7', name: 'Street Off', logo_url: '', website: '' },
  { id: 's8', name: 'Red Bull', logo_url: '', website: '' },
  { id: 's9', name: 'Institut Français', logo_url: '', website: '' },
  { id: 's10', name: 'European Union', logo_url: '', website: '' },
]

type Partner = typeof staticPartners[0]

export default function PartnersMarquee() {
  const [partners, setPartners] = useState<Partner[]>(staticPartners)

  useEffect(() => {
    getPartners().then(data => { if (data && data.length > 0) setPartners(data as Partner[]) })
  }, [])

  return (
    <section className="py-14 bg-background border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-center justify-between">
        <div>
          <p className="text-primary-500 text-xs font-semibold uppercase tracking-widest mb-1">They trust us</p>
          <h2 className="text-2xl font-black text-white">Our Partners</h2>
        </div>
        <Link href="/partners" className="text-sm text-primary-500 hover:text-primary-400 font-medium transition-colors">
          View all →
        </Link>
      </div>

      {/* White marquee strip */}
      <div className="relative overflow-hidden bg-white py-8">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
          style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
          style={{ background: 'linear-gradient(to left, white, transparent)' }} />

        {/* Scrolling track — duplicated for seamless loop */}
        <div className="animate-marquee flex items-center" style={{ width: 'max-content' }}>
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex items-center justify-center px-10 ${partner.website ? 'cursor-pointer group' : ''}`}
              onClick={() => partner.website ? window.open(partner.website, '_blank') : undefined}
            >
              <div className="h-14 flex items-center justify-center">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-14 w-auto object-contain opacity-75 group-hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '120px' }}
                  />
                ) : (
                  <span className="text-gray-500 font-bold text-sm text-center whitespace-nowrap">
                    {partner.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
