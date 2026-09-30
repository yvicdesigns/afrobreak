'use client'

import { useEffect, useRef } from 'react'

interface GoogleAdProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function GoogleAd({ slot, format = 'auto', className = '' }: GoogleAdProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <div className={`my-4 ${className}`}>
      {/* Subtle label so users know it's an ad — required by AdSense policy */}
      <p className="text-[10px] font-medium uppercase tracking-widest text-white/20 text-center mb-1.5 select-none">
        Publicité
      </p>
      <div className="rounded-xl overflow-hidden bg-[#0f0c20] border border-white/5">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4810430938005240"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}
