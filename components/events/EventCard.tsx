'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users, Euro } from 'lucide-react'
import clsx from 'clsx'
import type { Event } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface EventCardProps {
  event: Event
  className?: string
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function EventCard({ event, className }: EventCardProps) {
  const spotsLeft = event.capacity - event.registered
  const soldOut = spotsLeft <= 0
  const almostFull = spotsLeft > 0 && spotsLeft <= 5
  const fillPercent = Math.min((event.registered / event.capacity) * 100, 100)

  return (
    <div
      className={clsx(
        'group relative rounded-xl overflow-hidden',
        'bg-surface border border-white/5',
        'transition-all duration-300',
        'hover:border-white/15 hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <Badge label={event.type} variant={event.type} />
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          {event.price === 0 ? (
            <span className="text-sm font-bold text-emerald-400">Free</span>
          ) : (
            <>
              <Euro size={13} className="text-gold-DEFAULT" />
              <span className="text-sm font-bold text-white">{event.price}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-white text-lg leading-tight mb-3 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar size={14} className="text-primary-500 flex-shrink-0" />
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin size={14} className="text-primary-500 flex-shrink-0" />
            <span className="truncate">{event.city} — {event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Users size={14} className="text-primary-500 flex-shrink-0" />
            <span>By {event.instructor}</span>
          </div>
        </div>

        {/* Spots */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={clsx(
              'font-medium',
              soldOut ? 'text-red-400' : almostFull ? 'text-amber-400' : 'text-text-secondary'
            )}>
              {soldOut ? 'Sold Out' : almostFull ? `Only ${spotsLeft} spots left!` : `${spotsLeft} spots remaining`}
            </span>
            <span className="text-text-muted">{event.registered}/{event.capacity}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-500',
                soldOut ? 'bg-red-500' : almostFull ? 'bg-amber-500' : 'bg-primary-500'
              )}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        <Link href={`/events/${event.id}`}>
          <Button
            variant={soldOut ? 'ghost' : 'primary'}
            size="sm"
            fullWidth
            disabled={soldOut}
          >
            {soldOut ? 'Sold Out' : 'Register Now'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
