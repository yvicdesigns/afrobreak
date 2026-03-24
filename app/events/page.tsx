'use client'

import { useState, useMemo, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import clsx from 'clsx'
import { getEvents } from '@/lib/db'
import type { Event, EventType } from '@/lib/types'
import EventCard from '@/components/events/EventCard'

const eventTypes: (EventType | 'All')[] = ['All', 'Workshop', 'Class', 'Show', 'Battle']

const typeColors: Record<string, string> = {
  All: 'bg-white/10 text-white border-white/20 hover:border-white/40',
  Workshop: 'bg-violet-500/10 text-violet-400 border-violet-500/30 hover:border-violet-400',
  Class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
  Show: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:border-rose-400',
  Battle: 'bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-400',
}

const typeActiveColors: Record<string, string> = {
  All: 'bg-white text-background border-white',
  Workshop: 'bg-violet-500 text-white border-violet-500',
  Class: 'bg-cyan-500 text-white border-cyan-500',
  Show: 'bg-rose-500 text-white border-rose-500',
  Battle: 'bg-red-500 text-white border-red-500',
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedType, setSelectedType] = useState<EventType | 'All'>('All')

  useEffect(() => {
    getEvents().then(setEvents)
  }, [])

  const filtered = useMemo(() => {
    return events.filter(e => selectedType === 'All' || e.type === selectedType)
  }, [events, selectedType])

  return (
    <div className="min-h-screen pt-16">
      <div className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=1920&q=80"
            alt="Events"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-500/15 border border-secondary-500/30 mb-6">
            <Calendar size={14} className="text-secondary-400" />
            <span className="text-sm font-semibold text-secondary-400 uppercase tracking-widest">
              Live Events
            </span>
          </div>
          <h1 className="heading-lg text-white mb-4">
            Upcoming <span className="gradient-text-purple">Events</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Workshops, classes, shows, and battles happening across Europe. Connect with the community in person.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-wrap gap-3 mb-10">
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={clsx(
                'px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200',
                selectedType === type ? typeActiveColors[type] : typeColors[type]
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-secondary">
            <span className="text-white font-semibold">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Calendar size={48} className="text-text-muted mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-text-secondary">Check back soon for new events in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
