'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem('ab_sid')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem('ab_sid', id)
    }
    return id
  } catch {
    return ''
  }
}

export default function VisitorTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return
    // Avoid double-tracking the same path in the same render cycle
    if (lastTracked.current === pathname) return
    lastTracked.current = pathname

    const session_id = getSessionId()
    const referrer = typeof document !== 'undefined' ? document.referrer : ''

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, session_id, referrer }),
    }).catch(() => {})
  }, [pathname])

  return null
}
