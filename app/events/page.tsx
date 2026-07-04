'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Calendar, History, Globe, Clock } from 'lucide-react'
import clsx from 'clsx'
import { getEvents } from '@/lib/db'
import { events as defaultEvents } from '@/lib/data'
import type { Event } from '@/lib/types'
import EventCard from '@/components/events/EventCard'

const tabs = [
  { key: 'upcoming', label: 'Upcoming', icon: Calendar, description: 'Next AfroBreak events — register and join us' },
  { key: 'international', label: 'International', icon: Globe, description: 'AfroBreak events across Africa and the world' },
  { key: 'history', label: 'History', icon: History, description: 'Our journey — all past events' },
]

function isPast(dateStr: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr) < today
}

function EventsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'upcoming'
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents().then(data => {
      setEvents(data.length > 0 ? data : defaultEvents)
      setLoading(false)
    })
  }, [])

  const { upcoming, international, history } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const upcoming = events
      .filter(e => !isPast(e.date))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const international = events
      .filter(e => e.is_international)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const history = events
      .filter(e => isPast(e.date))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return { upcoming, international, history }
  }, [events])

  const filtered = activeTab === 'upcoming' ? upcoming : activeTab === 'international' ? international : history

  const counts = { upcoming: upcoming.length, international: international.length, history: history.length }
  const currentTab = tabs.find(t => t.key === activeTab) || tabs[0]

  const setTab = (key: string) => router.push(`/events?tab=${key}`)

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
          {tabs.map(tab => {
            const count = counts[tab.key as keyof typeof counts]
            return (
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
                <span className={clsx(
                  'text-[11px] px-1.5 py-0.5 rounded-full font-bold',
                  activeTab === tab.key ? 'bg-primary-500/20 text-primary-400' : 'bg-white/10 text-text-muted'
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-surface rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {activeTab === 'upcoming' ? (
              <>
                <Clock size={48} className="text-text-muted mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No upcoming events yet</h3>
                <p className="text-text-secondary">The next event will be announced soon. Stay tuned!</p>
              </>
            ) : (
              <>
                <currentTab.icon size={48} className="text-text-muted mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No events in this category yet</h3>
                <p className="text-text-secondary">Check back soon.</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Upcoming: show "Next event" highlight */}
            {activeTab === 'upcoming' && filtered.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-sm text-emerald-400 font-medium">
                  Next event in {Math.ceil((new Date(filtered[0].date).getTime() - Date.now()) / 86400000)} days
                </p>
              </div>
            )}

            {/* History: section label */}
            {activeTab === 'history' && (
              <p className="text-sm text-text-secondary mb-6">
                <span className="text-white font-semibold">{filtered.length}</span> past event{filtered.length !== 1 ? 's' : ''} — sorted most recent first
              </p>
            )}

            {activeTab === 'international' && (
              <p className="text-sm text-text-secondary mb-6">
                <span className="text-white font-semibold">{filtered.length}</span> international event{filtered.length !== 1 ? 's' : ''} across Africa &amp; beyond
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(event => (
                <EventCard key={event.id} event={event} isPast={isPast(event.date)} />
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
