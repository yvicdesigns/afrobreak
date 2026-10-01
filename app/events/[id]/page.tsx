'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, Clock, MapPin, Users, ArrowLeft,
  Share2, ExternalLink, ChevronRight, X, Loader2, Check
} from 'lucide-react'
import { getEventById, getEvents } from '@/lib/db'
import type { Event } from '@/lib/types'
import EventCard from '@/components/events/EventCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import PaystackCheckoutModal from '@/components/ui/PaystackCheckoutModal'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { tr } = useLanguage()
  const [event, setEvent] = useState<Event | null>(null)
  const [similar, setSimilar] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [showRegModal, setShowRegModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleFreeRegister = async () => {
    setRegError('')
    if (!regName) { setRegError('Please enter your name.'); return }
    if (!regEmail || !/\S+@\S+\.\S+/.test(regEmail)) { setRegError('Please enter a valid email.'); return }
    setRegLoading(true)
    const { error: regErr } = await supabase.from('event_registrations').insert({
      event_id: event?.id,
      event_title: event?.title,
      name: regName,
      email: regEmail,
      amount_paid: 0,
      status: 'confirmed',
    })
    setRegLoading(false)
    if (regErr) { setRegError('Registration failed. Please try again.'); return }
    setShowRegModal(false)
    setRegistered(true)
  }

  useEffect(() => {
    Promise.all([getEventById(params.id), getEvents()]).then(([e, all]) => {
      if (!e) { setLoading(false); return }
      setEvent(e)
      setSimilar(all.filter(a => a.id !== e.id && a.type === e.type).slice(0, 3))
      setLoading(false)
    })
  }, [params.id])

  if (loading) return <div className="min-h-screen pt-16 flex items-center justify-center"><p className="text-text-secondary">{tr.common.loading}</p></div>
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
            {tr.events.backToEvents}
          </Link>
        </div>

        <div className="absolute top-6 right-4 sm:right-6 lg:right-8 flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowShare(v => !v)}
              className="inline-flex items-center gap-2 text-sm text-white bg-black/40 backdrop-blur-sm px-3 py-2 rounded-xl hover:bg-black/60 transition-all"
            >
              <Share2 size={15} />
              {tr.events.share}
            </button>
            {showShare && (
              <div className="absolute right-0 top-full mt-2 z-30 w-52 bg-surface border border-white/10 rounded-xl p-2 shadow-2xl">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${event.title}\n${event.city}${event.country ? `, ${event.country}` : ''} — ${formatDate(event.date)}\n\n${window.location.href}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${event.title} — ${event.city}${event.country ? `, ${event.country}` : ''} | AfroBreak`)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X (Twitter)
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href).catch(() => {})
                    setCopied(true)
                    setTimeout(() => { setCopied(false); setShowShare(false) }, 2000)
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} className="text-text-muted" />}
                  {copied ? tr.events.copied : tr.events.copyLink}
                </button>
              </div>
            )}
          </div>
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
                    <p className="text-xs text-text-secondary">{tr.events.date}</p>
                    <p className="text-sm font-semibold text-white">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-xl p-4">
                  <Clock size={20} className="text-primary-500" />
                  <div>
                    <p className="text-xs text-text-secondary">{tr.events.timeLabel}</p>
                    <p className="text-sm font-semibold text-white">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-xl p-4">
                  <MapPin size={20} className="text-primary-500" />
                  <div>
                    <p className="text-xs text-text-secondary">{tr.events.location}</p>
                    <p className="text-sm font-semibold text-white">{event.location}</p>
                    <p className="text-xs text-text-secondary">{event.city}{event.country ? `, ${event.country}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-xl p-4">
                  <Users size={20} className="text-primary-500" />
                  <div>
                    <p className="text-xs text-text-secondary">{tr.events.organizer}</p>
                    <p className="text-sm font-semibold text-white">{event.instructor}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4">{tr.events.aboutEvent}</h2>
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
                  <p className="text-sm text-text-secondary mb-4">{event.city}{event.country ? `, ${event.country}` : ''}</p>
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
                  <span className="text-text-secondary">{tr.events.priceLabel}</span>
                  <div className="flex items-center gap-1">
                    {event.price === 0 ? (
                      <span className="text-2xl font-black text-emerald-400">{tr.common.free}</span>
                    ) : (
                      <span className="text-2xl font-black text-white">₵{event.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-text-secondary">{tr.events.availabilityLabel}</span>
                    <span className={soldOut ? 'text-red-400' : 'text-emerald-400'}>
                      {soldOut ? tr.events.soldOut : tr.events.spotsLeft.replace('{n}', String(spotsLeft))}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${soldOut ? 'bg-red-500' : 'bg-primary-500'}`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>{tr.events.registered.replace('{n}', String(event.registered))}</span>
                    <span>{tr.events.capacityNum.replace('{n}', String(event.capacity))}</span>
                  </div>
                </div>

                {registered ? (
                  <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-4 text-center">
                    <Check size={24} className="text-emerald-400 mx-auto mb-2" />
                    <p className="text-emerald-400 font-semibold">{tr.events.youreRegistered}</p>
                    <p className="text-xs text-text-secondary mt-1">{tr.events.checkEmail}</p>
                  </div>
                ) : (
                  <Button
                    variant={soldOut ? 'ghost' : 'primary'}
                    size="lg"
                    fullWidth
                    disabled={soldOut}
                    onClick={() => event.price === 0 ? setShowRegModal(true) : setShowPayment(true)}
                  >
                    {soldOut ? tr.events.soldOut : event.price === 0 ? tr.events.registerFree : `${tr.events.viewRegister} — ₵${event.price.toFixed(2)}`}
                  </Button>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => setShowShare(v => !v)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 text-sm text-text-secondary hover:text-white hover:border-white/30 transition-all"
                  >
                    <Share2 size={15} />
                    {tr.events.share}
                  </button>

                  {showShare && (
                    <div className="bg-background border border-white/10 rounded-xl p-3 space-y-2 animate-fade-in">
                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`${event.title}\n${event.city}${event.country ? `, ${event.country}` : ''} — ${formatDate(event.date)}\n\n${window.location.href}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                      {/* Facebook */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                      </a>
                      {/* X / Twitter */}
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${event.title} — ${event.city}${event.country ? `, ${event.country}` : ''} | AfroBreak`)}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        X (Twitter)
                      </a>
                      {/* Copy link */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                      >
                        {copied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} className="text-text-muted" />}
                        {copied ? tr.events.copied : tr.events.copyLink}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free registration modal */}
        {showRegModal && event && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="font-bold text-white">Register — {event.title}</h2>
                <button onClick={() => setShowRegModal(false)} className="p-2 rounded-xl hover:bg-white/10 text-text-muted transition-colors"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">{tr.events.fullName} <span className="text-red-400">*</span></label>
                  <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder={tr.events.fullName} className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">{tr.events.email} <span className="text-red-400">*</span></label>
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@example.com" className="input-base" />
                </div>
                {regError && <p className="text-red-400 text-sm">{regError}</p>}
                <button
                  onClick={handleFreeRegister}
                  disabled={regLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-60 transition-all"
                >
                  {regLoading ? <><Loader2 size={18} className="animate-spin" /> {tr.events.registering}</> : tr.events.confirmRegistration}
                </button>
                <p className="text-center text-xs text-text-muted">{tr.events.freeNoPayment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Paid registration — Paystack */}
        {showPayment && event && (
          <PaystackCheckoutModal
            type="event"
            items={[{ id: event.id, name: event.title, price: event.price }]}
            totalUSD={event.price}
            onClose={() => setShowPayment(false)}
            onSuccess={(ref, email, name) => {
              supabase.from('event_registrations').insert({
                event_id: event.id,
                event_title: event.title,
                name,
                email,
                amount_paid: event.price,
                payment_ref: ref,
                status: 'confirmed',
              }).then(() => {
                setShowPayment(false)
                setRegistered(true)
              })
            }}
          />
        )}

        {similar.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{tr.events.similarEvents}</h2>
              <Link
                href="/events"
                className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                {tr.events.viewAll} <ChevronRight size={14} />
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
