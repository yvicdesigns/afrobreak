'use client'

import { useState } from 'react'
import { CheckCircle, ArrowRight, Music, Video, Calendar, Users, Building, Handshake, Quote } from 'lucide-react'
import Button from '@/components/ui/Button'

const partnerTypes = [
  {
    icon: Video,
    title: 'Dance Instructor',
    desc: 'Teach on AfroBreak and reach thousands of students globally. Set your own schedule, earn from every view, and build your brand.',
    benefits: ['Revenue share on your videos', 'Professional filming support', 'Global audience of 10,000+ dancers', 'Marketing & promotion included', 'Dedicated instructor profile'],
    cta: 'Apply to Teach',
  },
  {
    icon: Calendar,
    title: 'Event Organizer',
    desc: 'List and sell tickets to your dance events, workshops, and battles on AfroBreak. Access our community directly.',
    benefits: ['Free event listings', 'Ticket sales integration', 'Promotion to our audience', 'AfroBreak co-branding', 'Analytics & reporting'],
    cta: 'List Your Event',
  },
  {
    icon: Music,
    title: 'Music Artist / Label',
    desc: 'Sell your music directly to the AfroBreak dance community — the most engaged audience for Afro and urban sounds.',
    benefits: ['Music store placement', 'Featured in dance videos', 'Playlist curation', 'Artist profile page', 'Revenue from downloads'],
    cta: 'Distribute Music',
  },
  {
    icon: Building,
    title: 'Dance Studio / School',
    desc: 'Partner with AfroBreak to offer your students a premium online resource and bring our community to your studio.',
    benefits: ['White-label options', 'Group subscriptions for students', 'Co-branded content', 'Cross-promotion', 'Revenue sharing'],
    cta: 'Partner Your Studio',
  },
  {
    icon: Users,
    title: 'Brand & Sponsor',
    desc: 'Reach a passionate, culturally engaged audience through content partnerships, event sponsorships, and campaigns.',
    benefits: ['Sponsored content creation', 'Event naming rights', 'Social media campaigns', 'Newsletter placements', 'Custom activations'],
    cta: 'Discuss Partnership',
  },
  {
    icon: Handshake,
    title: 'Community Organization',
    desc: 'We partner with cultural associations, diaspora organizations, and NGOs to make dance education accessible.',
    benefits: ['Subsidized memberships', 'Community content creation', 'Joint events', 'Grant opportunities', 'Cultural programs'],
    cta: 'Connect With Us',
  },
]

const currentPartners = [
  { name: 'Ghana Olympic Committee', type: 'Sports', logo: '🏅' },
  { name: 'KGL Foundation', type: 'Foundation', logo: '🌍' },
  { name: 'The Ruggeds Crew', type: 'Netherlands', logo: '💪' },
  { name: 'Elavanyo School', type: 'Education', logo: '🏫' },
  { name: 'WDSF', type: 'Dance Sport', logo: '🕺' },
]

const testimonials = [
  {
    quote: "Collaborating with Africa Breaking Academy has been a transformative experience. Their commitment to storytelling, youth empowerment, and promoting Hip Hop across the African continent aligns seamlessly with our mission. Their professionalism and innovative approach to youth empowerment training is truly setting a new standard.",
    name: 'Sammy Heywood',
    org: 'Ghana Olympic Committee',
  },
  {
    quote: "Africa Breaking Academy continues to raise the bar in youth-led education initiatives. Their innovative workshops and programs bring practical, real-world value to our students. It's a privilege to work alongside a team that so deeply understands the pulse of Africa's next generation.",
    name: 'Madam Precious',
    org: 'Head Mistress, Elavanyo School',
  },
  {
    quote: "We've worked with many youth organizations, but Africa Breaking Academy stands out. Their passion, structure, and ability to mobilize young leaders is exceptional. Together, we've reached thousands with training, mentorship, and opportunity.",
    name: 'KGL Foundation Team',
    org: 'KGL Foundation',
  },
  {
    quote: "Partnering with Africa Breaking Academy has given us access to a vibrant, driven youth Hip Hop audience in West Africa eager to embrace next level development in breaking and Hip Hop. Their leadership is forward-thinking, agile, and always collaborative. We're proud to support their mission.",
    name: 'The Ruggeds Crew',
    org: 'Netherlands',
  },
  {
    quote: "Afrobreak's intention of building mind, body, and soul connections in Africa is incredibly important. Staying connected to our roots while uplifting one another and creating opportunities is key to our growth. If you continue to stay true to this vision, I have no doubt that this event will thrive and have a lasting impact.",
    name: 'Elvina Vee',
    org: 'WDSF Licensed Judge, South Africa',
  },
]

export default function PartnersPage() {
  const [selected, setSelected] = useState<typeof partnerTypes[0] | null>(null)
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <div className="relative bg-surface border-b border-white/5 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-gold-DEFAULT/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">Partnerships</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Grow With <span className="gradient-text-orange">AfroBreak</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Whether you're an instructor, artist, brand, or organization — there's a partnership that works for you. Let's build together.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Partnership Types */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">How We Work Together</h2>
            <p className="text-text-secondary">Choose the partnership model that fits your goals</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map(type => (
              <div
                key={type.title}
                className="group bg-surface border border-white/5 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300 cursor-pointer"
                onClick={() => setSelected(type)}
              >
                <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/25 transition-colors">
                  <type.icon size={22} className="text-primary-500" />
                </div>
                <h3 className="font-bold text-white mb-2">{type.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{type.desc}</p>
                <ul className="space-y-1 mb-5">
                  {type.benefits.slice(0, 3).map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs text-text-secondary">
                      <CheckCircle size={11} className="text-primary-500 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                  {type.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Current Partners */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Our Partners</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {currentPartners.map(partner => (
              <div key={partner.name} className="bg-surface border border-white/5 rounded-2xl p-4 text-center hover:border-white/15 transition-all">
                <span className="text-3xl block mb-2">{partner.logo}</span>
                <p className="text-white text-xs font-semibold">{partner.name}</p>
                <p className="text-text-muted text-[10px]">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">What Our Partners Say</h2>
            <p className="text-text-secondary">Voices from across the AfroBreak network</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface border border-white/5 rounded-2xl p-6 flex flex-col hover:border-primary-500/20 transition-all">
                <Quote size={22} className="text-primary-500/40 mb-4 flex-shrink-0" />
                <p className="text-text-secondary text-sm leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-primary-500 text-xs mt-0.5">{t.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Start a Conversation</h2>
            <p className="text-text-secondary">Tell us about yourself and we'll get back to you within 48 hours.</p>
          </div>
          {sent ? (
            <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-8 text-center">
              <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
              <p className="text-text-secondary">Our team will contact you within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface border border-white/10 rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Your Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input-base" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Organization / Project</label>
                <input type="text" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} placeholder="Your studio, label, or brand" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Tell us about your partnership idea *</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="What kind of partnership are you looking for? What are your goals?" className="input-base resize-none" />
              </div>
              <Button type="submit" variant="primary" fullWidth size="lg" rightIcon={<ArrowRight size={16} />}>
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
