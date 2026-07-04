'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Users, Play, X, Tag } from 'lucide-react'
import clsx from 'clsx'
import type { Event } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface EventCardProps {
  event: Event
  className?: string
  isPast?: boolean
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function EventCard({ event, className, isPast = false }: EventCardProps) {
  const [open, setOpen] = useState(false)
  const spotsLeft = event.capacity - event.registered
  const soldOut = spotsLeft <= 0
  const almostFull = spotsLeft > 0 && spotsLeft <= 5
  const fillPercent = Math.min((event.registered / event.capacity) * 100, 100)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={clsx(
          'group relative rounded-xl overflow-hidden cursor-pointer',
          'bg-surface border border-white/5',
          'transition-all duration-300',
          'hover:border-white/20 hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.02]',
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
          <div className="absolute top-3 left-3">
            <Badge label={event.type} variant={event.type} />
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            {event.price === 0 ? (
              <span className="text-sm font-bold text-emerald-400">Free</span>
            ) : (
              <span className="text-sm font-bold text-white">€{event.price.toFixed(2)}</span>
            )}
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20">View details</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-white text-lg leading-tight mb-3 line-clamp-2">{event.title}</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar size={14} className="text-primary-500 flex-shrink-0" />
              <span>{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin size={14} className="text-primary-500 flex-shrink-0" />
              <span className="truncate">{event.city} — {event.location}</span>
            </div>
          </div>

          {/* Spots bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className={clsx('font-medium', soldOut ? 'text-red-400' : almostFull ? 'text-amber-400' : 'text-text-secondary')}>
                {soldOut ? 'Sold Out' : almostFull ? `Only ${spotsLeft} left!` : `${spotsLeft} spots`}
              </span>
              <span className="text-text-muted">{event.registered}/{event.capacity}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={clsx('h-full rounded-full transition-all duration-500', soldOut ? 'bg-red-500' : almostFull ? 'bg-amber-500' : 'bg-primary-500')} style={{ width: `${fillPercent}%` }} />
            </div>
          </div>

          {event.youtubeUrl ? (
            <div onClick={e => e.stopPropagation()}>
              <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" fullWidth leftIcon={<Play size={13} className="fill-primary-500" />}>Watch Recording</Button>
              </a>
            </div>
          ) : isPast ? (
            <Button variant="ghost" size="sm" fullWidth disabled>Past Event</Button>
          ) : (
            <Button variant={soldOut ? 'ghost' : 'primary'} size="sm" fullWidth disabled={soldOut}>
              {soldOut ? 'Sold Out' : 'View & Register'}
            </Button>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          style={{ animation: 'fadeIn 0.2s ease' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-surface border border-white/10 rounded-3xl overflow-hidden"
            style={{ animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}
          >
            {/* Image banner */}
            <div className="relative h-52 overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" style={{ animation: 'zoomIn 0.6s ease' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all z-10">
                <X size={16} />
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Badge label={event.type} variant={event.type} size="md" />
                {event.price === 0 ? (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">Free Entry</span>
                ) : (
                  <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full backdrop-blur-sm">€{event.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="p-6" style={{ animation: 'fadeIn 0.3s ease 0.1s both' }}>
              <h2 className="text-xl font-black text-white mb-1">{event.title}</h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">{event.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-background rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Date & Time</p>
                  <p className="text-white text-sm font-semibold">{formatDate(event.date)}</p>
                  <p className="text-text-secondary text-xs">{event.time}</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Location</p>
                  <p className="text-white text-sm font-semibold">{event.city}</p>
                  <p className="text-text-secondary text-xs truncate">{event.location}</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Organizer</p>
                  <p className="text-white text-sm font-semibold">{event.instructor}</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Capacity</p>
                  <p className={clsx('text-sm font-semibold', soldOut ? 'text-red-400' : 'text-white')}>{soldOut ? 'Sold Out' : `${spotsLeft} spots left`}</p>
                  <p className="text-text-secondary text-xs">{event.registered}/{event.capacity}</p>
                </div>
              </div>

              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {event.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-white/5 text-text-secondary text-[10px] rounded-lg border border-white/5">
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {event.youtubeUrl ? (
                <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" fullWidth leftIcon={<Play size={14} className="fill-primary-500" />}>Watch Recording</Button>
                </a>
              ) : (
                <Link href={`/events/${event.id}`} onClick={() => setOpen(false)}>
                  <Button variant={soldOut ? 'ghost' : 'primary'} fullWidth disabled={soldOut}>
                    {soldOut ? 'Sold Out' : 'Register Now'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px) scale(0.95) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes zoomIn { from { transform:scale(1.1) } to { transform:scale(1) } }
      `}</style>
    </>
  )
}
