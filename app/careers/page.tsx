'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, ArrowRight, ChevronDown, ChevronUp, Heart, Zap, Globe, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getJobs } from '@/lib/db'

type Job = {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  active: boolean
}

const defaultJobs: Job[] = [
  {
    id: '1', title: 'Senior Full-Stack Developer', department: 'Engineering', location: 'Paris / Remote', type: 'Full-time', active: true,
    description: 'Build and scale the AfroBreak platform. You\'ll work on our Next.js frontend, Node.js backend, and Supabase infrastructure.',
    requirements: ['5+ years of experience with React / Next.js', 'Strong TypeScript skills', 'Experience with Supabase or PostgreSQL', 'Passion for culture and community products'],
  },
  {
    id: '2', title: 'Content & Video Producer', department: 'Content', location: 'Paris', type: 'Full-time', active: true,
    description: 'Lead the production of dance tutorials and documentary content. Work directly with our instructor team to create world-class video lessons.',
    requirements: ['3+ years video production experience', 'Experience with dance or sports content', 'Proficiency in Adobe Premiere or Final Cut', 'Strong eye for cultural authenticity'],
  },
  {
    id: '3', title: 'Community Manager', department: 'Community', location: 'Paris / Remote', type: 'Full-time', active: true,
    description: 'Grow and nurture the AfroBreak community across platforms. Build relationships with dancers, organizers, and cultural influencers.',
    requirements: ['2+ years community management', 'Active in Afro or urban dance scenes', 'Fluent in French and English', 'Social media expertise (Instagram, TikTok)'],
  },
  {
    id: '4', title: 'Dance Content Creator (Intern)', department: 'Content', location: 'Paris', type: 'Internship', active: true,
    description: 'Support our content team in creating engaging social media content, short-form videos, and behind-the-scenes coverage.',
    requirements: ['Passion for Afro and urban dance', 'Basic video editing skills', 'Active social media presence', 'Based in or near Paris'],
  },
  {
    id: '5', title: 'Marketing Manager', department: 'Marketing', location: 'Remote', type: 'Full-time', active: true,
    description: 'Drive growth through digital marketing, partnerships, and community campaigns. Own our acquisition and retention strategy.',
    requirements: ['4+ years digital marketing', 'Experience with subscription products', 'Data-driven approach', 'Passion for African diaspora culture'],
  },
]

const perks = [
  { icon: Heart, title: 'Culture First', desc: 'Work on something you love. Every decision at AfroBreak starts with cultural respect.' },
  { icon: Globe, title: 'Remote Friendly', desc: 'Many of our roles are fully remote. We trust you to do great work from anywhere.' },
  { icon: Zap, title: 'Fast Growth', desc: 'We\'re growing fast. Your impact here will be visible, meaningful, and rewarded.' },
  { icon: Users, title: 'Diverse Team', desc: 'Our team spans 8 nationalities. Different perspectives make better products.' },
]

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>(defaultJobs)
  const [openJob, setOpenJob] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    getJobs().then(data => {
      const active = (data as Job[]).filter(j => j.active)
      if (active.length > 0) setJobs(active)
    })
  }, [])

  const depts = ['All', ...Array.from(new Set(jobs.map(j => j.department)))]
  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.department === filter)

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <div className="relative bg-surface border-b border-white/5 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 via-transparent to-primary-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">We're Hiring</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Build the Future of <span className="gradient-text-orange">Dance Culture</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Join a passionate team dedicated to making Afro and urban dance accessible, authentic, and celebrated worldwide.
          </p>
          <p className="text-primary-400 font-semibold mt-4">{jobs.filter(j => j.active).length} open positions</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 bg-surface border border-white/5 rounded-2xl">
              <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-primary-500" />
              </div>
              <div>
                <p className="font-bold text-white text-sm mb-1">{title}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
          <div className="flex gap-2 flex-wrap mb-6">
            {depts.map(d => (
              <button key={d} onClick={() => setFilter(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === d ? 'bg-primary-500 text-white' : 'bg-surface border border-white/10 text-text-secondary hover:text-white'}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(job => (
              <div key={job.id} className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all">
                <button
                  onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-white">{job.title}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${job.type === 'Full-time' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>
                        {job.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {job.department}</span>
                    </div>
                  </div>
                  {openJob === job.id ? <ChevronUp size={16} className="text-text-muted flex-shrink-0" /> : <ChevronDown size={16} className="text-text-muted flex-shrink-0" />}
                </button>

                {openJob === job.id && (
                  <div className="px-5 pb-5 border-t border-white/5">
                    <p className="text-text-secondary text-sm leading-relaxed my-4">{job.description}</p>
                    <div className="mb-5">
                      <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">What we're looking for</p>
                      <ul className="space-y-1">
                        {job.requirements.map(r => (
                          <li key={r} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span className="text-primary-500 mt-0.5">→</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a href={`mailto:jobs@afrobreak.com?subject=Application: ${job.title}`}>
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>Apply Now</Button>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Spontaneous */}
        <div className="bg-gradient-to-r from-primary-500/15 to-secondary-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Don't see the right role?</h3>
          <p className="text-text-secondary mb-6">We always want to hear from passionate people. Send us your story.</p>
          <a href="mailto:jobs@afrobreak.com">
            <Button variant="secondary">Send Spontaneous Application</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
