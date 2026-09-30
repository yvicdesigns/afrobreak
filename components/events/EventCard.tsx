'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Play, X, Tag, Share2, Check } from 'lucide-react'
import clsx from 'clsx'
import type { Event } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/lib/LanguageContext'

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
  const { tr } = useLanguage()
  const [open, setOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const spotsLeft = event.capacity - event.registered

  const eventUrl = typeof window !== 'undefined' ? `${window.location.origin}/events/${event.id}` : `/events/${event.id}`
  const shareText = `${event.title}\n${event.city} — ${new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(eventUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => { setCopied(false); setShareOpen(false) }, 2000)
  }
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
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/20">{tr.events.viewDetails}</span>
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
                {soldOut ? tr.events.soldOut : almostFull ? tr.events.onlyLeft.replace('{n}', String(spotsLeft)) : tr.events.spotsLabel.replace('{n}', String(spotsLeft))}
              </span>
              <span className="text-text-muted">{event.registered}/{event.capacity}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={clsx('h-full rounded-full transition-all duration-500', soldOut ? 'bg-red-500' : almostFull ? 'bg-amber-500' : 'bg-primary-500')} style={{ width: `${fillPercent}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              {event.youtubeUrl ? (
                <div onClick={e => e.stopPropagation()}>
                  <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm" fullWidth leftIcon={<Play size={13} className="fill-primary-500" />}>{tr.events.watchRecording}</Button>
                  </a>
                </div>
              ) : isPast ? (
                <Button variant="ghost" size="sm" fullWidth disabled>{tr.events.pastEvent}</Button>
              ) : (
                <Button variant={soldOut ? 'ghost' : 'primary'} size="sm" fullWidth disabled={soldOut}>
                  {soldOut ? tr.events.soldOut : tr.events.viewRegister}
                </Button>
              )}
            </div>
            {/* Share button */}
            <div className="relative flex-shrink-0" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setShareOpen(v => !v)}
                className="p-2 rounded-lg border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-all"
              >
                <Share2 size={15} />
              </button>
              {shareOpen && (
                <div className="absolute bottom-full right-0 mb-2 z-50 w-48 bg-surface border border-white/10 rounded-xl p-2 shadow-2xl">
                  <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${eventUrl}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X (Twitter)
                  </a>
                  <button onClick={copyLink} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white transition-all">
                    {copied ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} className="text-text-muted" />}
                    {copied ? tr.events.copied : tr.events.copyLink}
                  </button>
                </div>
              )}
            </div>
          </div>
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
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">{tr.events.freeEntry}</span>
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
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{tr.events.dateAndTime}</p>
                  <p className="text-white text-sm font-semibold">{formatDate(event.date)}</p>
                  <p className="text-text-secondary text-xs">{event.time}</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{tr.events.location}</p>
                  <p className="text-white text-sm font-semibold">{event.city}</p>
                  <p className="text-text-secondary text-xs truncate">{event.location}</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{tr.events.organizer}</p>
                  <p className="text-white text-sm font-semibold">{event.instructor}</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{tr.events.capacityLabel}</p>
                  <p className={clsx('text-sm font-semibold', soldOut ? 'text-red-400' : 'text-white')}>{soldOut ? tr.events.soldOut : tr.events.spotsLeft.replace('{n}', String(spotsLeft))}</p>
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
                  <Button variant="secondary" fullWidth leftIcon={<Play size={14} className="fill-primary-500" />}>{tr.events.watchRecording}</Button>
                </a>
              ) : (
                <Link href={`/events/${event.id}`} onClick={() => setOpen(false)}>
                  <Button variant={soldOut ? 'ghost' : 'primary'} fullWidth disabled={soldOut}>
                    {soldOut ? tr.events.soldOut : tr.events.registerNow}
                  </Button>
                </Link>
              )}
              {/* Share row in modal */}
              <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-text-muted">{tr.events.share}:</span>
                <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${eventUrl}`)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all" title="WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all" title="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all" title="X">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <button onClick={copyLink} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all" title="Copy link">
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} className="text-text-secondary" />}
                </button>
              </div>
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
