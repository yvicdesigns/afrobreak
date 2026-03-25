'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Globe, Users, Zap, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getTeamMembers } from '@/lib/db'

const values = [
  { icon: Heart, title: 'Culture First', desc: 'Everything we build starts with respect for the cultures that created these dance forms. We never strip moves from their context.' },
  { icon: Globe, title: 'Global Community', desc: 'Dance knows no borders. We connect dancers from Lagos to London, Dakar to Paris, Kingston to Amsterdam.' },
  { icon: Users, title: 'Inclusive Space', desc: 'Whether you\'re a beginner or a champion, AfroBreak is for you. No gatekeeping, no judgment — just movement.' },
  { icon: Zap, title: 'Excellence', desc: 'We partner only with instructors who are masters of their craft and passionate about teaching.' },
]

const timeline = [
  { year: '2020', title: 'The Idea', desc: 'AfroBreak was founded in Paris by a group of dancers frustrated by the lack of quality online resources for Afro and urban dance.' },
  { year: '2021', title: 'First Videos', desc: 'We launched with 20 videos and 4 instructors. Within 3 months, we had 1,000 subscribers from 15 countries.' },
  { year: '2022', title: 'Going Live', desc: 'We expanded into live events, hosting our first workshop series across Paris, Lyon, and Marseille.' },
  { year: '2023', title: 'European Expansion', desc: 'With 500+ videos and 50+ instructors, AfroBreak became the leading Afro dance platform in Europe.' },
  { year: '2024', title: 'Premium Platform', desc: 'We launched our premium subscription, community forums, and battle championship series.' },
  { year: '2025', title: 'Global Reach', desc: 'Over 10,000 active members across 40+ countries. The AfroBreak community is now truly global.' },
]

const defaultTeam = [
  { id: 'd1', name: 'Yvic Tchissambou', role: 'Founder & CEO', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Dancer, entrepreneur, and culture advocate. Built AfroBreak to give the global diaspora a home.', display_order: 0 },
  { id: 'd2', name: 'Kemi Adeyemi', role: 'Head of Content', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80', bio: 'Lagos-born, Paris-based choreographer with 12 years of teaching experience.', display_order: 1 },
  { id: 'd3', name: 'Marcus Johnson', role: 'Community Director', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', bio: 'Hip-hop veteran who built the battle culture programs and community events.', display_order: 2 },
  { id: 'd4', name: 'Amara Diallo', role: 'Creative Director', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80', bio: 'Choreographer and visual artist who shapes the AfroBreak aesthetic and brand.', display_order: 3 },
]

export default function AboutPage() {
  const [team, setTeam] = useState(defaultTeam)

  useEffect(() => {
    getTeamMembers().then(data => { if (data.length > 0) setTeam(data as typeof defaultTeam) })
  }, [])

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-surface border-b border-white/5 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6">
            Rooted in Culture,<br />
            <span className="gradient-text-orange">Built for You</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            AfroBreak was born from a simple belief: that Afro and urban dance deserves a platform as rich, deep, and vibrant as the cultures that created it.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-secondary-400 text-sm font-semibold uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-3xl font-black text-white mb-6">More than steps — it's a movement</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>AfroBreak was founded in Paris in 2020 by a group of dancers who were tired of watching Afro and urban dance styles be diluted, decontextualized, and underrepresented online.</p>
              <p>We believed the world needed a platform that treated these dances with the depth they deserve — one that connected the steps to the stories, the moves to the music, and the dancers to each other.</p>
              <p>Today, AfroBreak is home to over 10,000 dancers across 40+ countries, with 500+ videos, 50+ world-class instructors, and a live event program spanning 10 European cities.</p>
            </div>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link href="/videos"><Button variant="primary" rightIcon={<ArrowRight size={16} />}>Explore Videos</Button></Link>
              <Link href="/instructors"><Button variant="secondary">Meet Instructors</Button></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '10,000+', label: 'Active Members' },
              { value: '500+', label: 'Video Lessons' },
              { value: '50+', label: 'Instructors' },
              { value: '40+', label: 'Countries' },
            ].map(stat => (
              <div key={stat.label} className="bg-surface border border-white/5 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black gradient-text-orange mb-1">{stat.value}</p>
                <p className="text-text-secondary text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-surface border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-3xl font-black text-white">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-background border border-white/5 hover:border-primary-500/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-primary-500" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">Since 2020</p>
          <h2 className="text-3xl font-black text-white">Our Journey</h2>
        </div>
        <div className="relative">
          <div className="absolute left-16 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-8">
            {timeline.map(item => (
              <div key={item.year} className="flex gap-6 items-start">
                <div className="w-14 text-right flex-shrink-0">
                  <span className="text-primary-500 font-black text-sm">{item.year}</span>
                </div>
                <div className="w-3 h-3 rounded-full bg-primary-500 mt-1 flex-shrink-0 z-10 relative" />
                <div className="flex-1 pb-2">
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-surface border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">The People</p>
            <h2 className="text-3xl font-black text-white">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.id} className="bg-background border border-white/5 rounded-2xl p-6 text-center hover:border-primary-500/20 transition-all">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 ring-2 ring-primary-500/20">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary-500 text-xs font-semibold mb-3">{member.role}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Ready to join the movement?</h2>
        <p className="text-text-secondary mb-8">Join 10,000+ dancers already learning, connecting, and growing with AfroBreak.</p>
        <Link href="/auth/signup"><Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>Get Started Free</Button></Link>
      </div>
    </div>
  )
}
