'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Calendar, History, FolderOpen, MapPin, Trophy } from 'lucide-react'
import clsx from 'clsx'
import { getEvents } from '@/lib/db'
import type { Event } from '@/lib/types'
import EventCard from '@/components/events/EventCard'

const tabs = [
  { key: 'all', label: 'All Events', icon: Calendar, description: 'Browse all AfroBreak events' },
  { key: 'history', label: 'History', icon: History, description: 'Our journey and past events' },
  { key: 'projects', label: 'Projects', icon: FolderOpen, description: 'Ongoing and upcoming projects' },
  { key: 'qualifiers', label: 'Qualifiers', icon: MapPin, description: 'Regional qualifier tournaments' },
  { key: 'africa-final', label: 'Africa Final', icon: Trophy, description: 'The grand championship' },
]

// Map tab keys to event types in the DB
const tabTypeMap: Record<string, string[]> = {
  all: [],
  history: ['Show', 'Battle'],
  projects: ['Workshop', 'Class'],
  qualifiers: ['Battle'],
  'africa-final': ['Show'],
}

function EventsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'all'
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents().then(data => { setEvents(data); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    const types = tabTypeMap[activeTab] || []
    if (types.length === 0) return events
    return events.filter(e => types.includes(e.type))
  }, [events, activeTab])

  const currentTab = tabs.find(t => t.key === activeTab) || tabs[0]

  const setTab = (key: string) => {
    if (key === 'all') router.push('/events')
    else router.push(`/events?tab=${key}`)
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=1920&q=80" alt="Events" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-500/15 border border-secondary-500/30 mb-6">
            <currentTab.icon size={14} className="text-secondary-400" />
            <span className="text-sm font-semibold text-secondary-400 uppercase tracking-widest">
              {currentTab.label}
            </span>
          </div>
          <h1 className="heading-lg text-white mb-4">
            AfroBreak <span className="gradient-text-purple">Events</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">{currentTab.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={clsx(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-primary-500/15 text-primary-400 border-primary-500/40'
                  : 'text-text-secondary border-white/10 hover:text-white hover:bg-white/5'
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-surface rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <currentTab.icon size={48} className="text-text-muted mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No events in this category yet</h3>
            <p className="text-text-secondary">Check back soon — new events are being added.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-secondary mb-6">
              <span className="text-white font-semibold">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <EventsContent />
    </Suspense>
  )
}
