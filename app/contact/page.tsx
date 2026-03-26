'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook, Send, Check } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    // Simulate sending (replace with real email service like Resend/EmailJS later)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/30 mb-6">
            <Mail size={14} className="text-primary-500" />
            <span className="text-sm font-semibold text-primary-400 tracking-widest uppercase">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Contact <span className="gradient-text-orange">Us</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Questions, partnerships, press inquiries — we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-white">Contact Info</h2>

              {[
                { icon: Mail, label: 'Email', value: 'contact@afrobreak.com', href: 'mailto:contact@afrobreak.com' },
                { icon: Phone, label: 'Phone', value: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
                { icon: MapPin, label: 'Based in', value: 'Paris, France — Global', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-medium">{label}</p>
                    {href ? (
                      <a href={href} className="text-white font-medium hover:text-primary-400 transition-colors">{value}</a>
                    ) : (
                      <p className="text-white font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="bg-surface border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Follow Us</h2>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-primary-500 hover:bg-primary-500/10 hover:border-primary-500/30 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ quick links */}
            <div className="bg-surface border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Topics</h2>
              <div className="space-y-2">
                {['Partnership inquiry', 'Press & media', 'Event booking', 'Technical support', 'Sponsorship'].map(topic => (
                  <button key={topic} onClick={() => setForm(f => ({ ...f, subject: topic }))}
                    className="block w-full text-left text-sm text-text-secondary hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                    → {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-surface border border-white/5 rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
                  <p className="text-text-secondary mb-6">We'll get back to you within 24–48 hours.</p>
                  <button onClick={() => setSent(false)} className="text-primary-500 hover:text-primary-400 text-sm font-semibold transition-colors">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">Name <span className="text-red-400">*</span></label>
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name" className="input-base" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">Email <span className="text-red-400">*</span></label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com" className="input-base" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Subject</label>
                    <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="What's this about?" className="input-base" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Message <span className="text-red-400">*</span></label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us more..." rows={6} className="input-base resize-none" required />
                  </div>

                  <button type="submit" disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-60 transition-all duration-200">
                    {sending ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</span>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
