'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getEvents } from '@/lib/db'
import type { Event } from '@/lib/types'
import EventCard from '@/components/events/EventCard'

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    getEvents().then(all => setEvents(all.slice(0, 5)))
  }, [])

  return (
    <section className="py-16 lg:py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-secondary-400 text-sm font-semibold uppercase tracking-widest mb-2">
              Live & In-Person
            </p>
            <h2 className="heading-md text-white">Upcoming Events</h2>
          </div>
          <Link
            href="/events"
            className="flex items-center gap-1 text-sm font-medium text-secondary-400 hover:text-secondary-300 transition-colors group"
          >
            View All
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="scroll-container">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              className="w-[300px] sm:w-[320px] flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
