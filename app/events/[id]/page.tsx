'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, Clock, MapPin, Users, Euro, ArrowLeft,
  Share2, ExternalLink, ChevronRight
} from 'lucide-react'
import { getEventById, getEvents } from '@/lib/db'
import type { Event } from '@/lib/types'
import EventCard from '@/components/events/EventCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [similar, setSimilar] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    Promise.all([getEventById(params.id), getEvents()]).then(([e, all]) => {
      if (!e) { setLoading(false); return }
      setEvent(e)
      setSimilar(all.filter(a => a.id !== e.id && a.type === e.type).slice(0, 3))
      setLoading(false)
    })
  }, [params.id])

  if (loading) return <div className="min-h-screen pt-16 flex items-center justify-center"><p className="text-text-secondary">Loading...</p></div>
  if (!event) return notFound()

  const spotsLeft = event.capacity - event.registered
  const soldOut = spotsLeft <= 0
  const fillPercent = Math.min((event.registered / event.capacity) * 100, 100)

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="relative h-72 sm:h-96 lg:h-[500px] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-6 lg:left-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-white bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-black/60 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>
        </div>

        <div className="absolute top-6 right-4 sm:right-6 lg:right-8">
          <Badge label={event.type} variant={event.type} size="md" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{event.title}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-xl p-4">
                  <Calendar size={20} className="text-primary-500" />
                  <div>
                    <p className="text-xs text-text-secondary">Date</p>
                    <p className="text-sm font-semibold text-white">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-xl p-4">
                  <Clock size={20} className="text-primary-500" />
                  <div>
                    <p className="text-xs text-text-secondary">Time</p>
                    <p className="text-sm font-semibold text-white">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-xl p-4">
                  <MapPin size={20} className="text-primary-500" />
                  <div>
                    <p className="text-xs text-text-secondary">Location</p>
                    <p className="text-sm font-semibold text-white">{event.location}</p>
                    <p className="text-xs text-text-secondary">{event.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-xl p-4">
                  <Users size={20} className="text-primary-500" />
                  <div>
                    <p className="text-xs text-text-secondary">Instructor</p>
                    <p className="text-sm font-semibold text-white">{event.instructor}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4">About This Event</h2>
              <p className="text-text-secondary leading-relaxed">{event.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-surface-2 border border-white/10 text-xs text-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-surface-2 to-surface-3 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)'
                  }}
                />
                <div className="text-center relative z-10">
                  <MapPin size={32} className="text-primary-500 mx-auto mb-2" />
                  <p className="font-semibold text-white">{event.location}</p>
                  <p className="text-sm text-text-secondary mb-4">{event.city}, France</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.location + ', ' + event.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    View on Google Maps <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Price</span>
                  <div className="flex items-center gap-1">
                    {event.price === 0 ? (
                      <span className="text-2xl font-black text-emerald-400">Free</span>
                    ) : (
                      <>
                        <Euro size={18} className="text-gold-DEFAULT" />
                        <span className="text-2xl font-black text-white">{event.price}</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-text-secondary">Availability</span>
                    <span className={soldOut ? 'text-red-400' : 'text-emerald-400'}>
                      {soldOut ? 'Sold Out' : `${spotsLeft} spots left`}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${soldOut ? 'bg-red-500' : 'bg-primary-500'}`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>{event.registered} registered</span>
                    <span>{event.capacity} capacity</span>
                  </div>
                </div>

                {registered ? (
                  <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-4 text-center">
                    <p className="text-emerald-400 font-semibold">You&apos;re registered!</p>
                    <p className="text-xs text-text-secondary mt-1">Check your email for confirmation.</p>
                  </div>
                ) : (
                  <Button
                    variant={soldOut ? 'ghost' : 'primary'}
                    size="lg"
                    fullWidth
                    disabled={soldOut}
                    onClick={() => setRegistered(true)}
                  >
                    {soldOut ? 'Sold Out' : event.price === 0 ? 'Register Free' : `Register — €${event.price}`}
                  </Button>
                )}

                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 text-sm text-text-secondary hover:text-white hover:border-white/30 transition-all"
                >
                  <Share2 size={15} />
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Similar Events</h2>
              <Link
                href="/events"
                className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
