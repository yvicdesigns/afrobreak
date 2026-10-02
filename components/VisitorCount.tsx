'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

type Stats = { total: number; month: number; today: number }

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
  return n.toString()
}

export default function VisitorCount() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  if (!stats || stats.total === 0) return null

  return (
    <div className="flex items-center gap-2 text-xs text-text-muted">
      <Users size={13} className="text-primary-500 flex-shrink-0" />
      <span>
        <span className="font-bold text-white">{fmt(stats.total)}</span> total visitors
        {stats.today > 0 && (
          <> · <span className="font-bold text-emerald-400">{fmt(stats.today)}</span> today</>
        )}
      </span>
    </div>
  )
}
