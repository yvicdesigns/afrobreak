'use client'

import { Trophy, Star, Medal, Award, Crown, Globe } from 'lucide-react'

const awards = [
  {
    year: '2024',
    title: 'Best African Dance Platform',
    organization: 'African Entertainment Awards',
    category: 'Digital Innovation',
    icon: Trophy,
    color: 'from-gold-DEFAULT to-yellow-600',
  },
  {
    year: '2023',
    title: 'Africa Final Champion',
    organization: 'AfroBreak World Championship',
    category: 'Dance Competition',
    icon: Crown,
    color: 'from-primary-500 to-primary-700',
  },
  {
    year: '2023',
    title: 'Community Impact Award',
    organization: 'Diaspora Culture Festival',
    category: 'Cultural Contribution',
    icon: Star,
    color: 'from-secondary-500 to-purple-700',
  },
  {
    year: '2022',
    title: 'Top Dance Qualifier — Europe',
    organization: 'AfroBreak European Cup',
    category: 'Qualifiers',
    icon: Medal,
    color: 'from-emerald-500 to-teal-700',
  },
  {
    year: '2022',
    title: 'Best Online Dance School',
    organization: 'Global Dance Awards',
    category: 'Education',
    icon: Award,
    color: 'from-blue-500 to-blue-700',
  },
  {
    year: '2021',
    title: 'International Expansion Award',
    organization: 'African Diaspora Summit',
    category: 'Global Reach',
    icon: Globe,
    color: 'from-rose-500 to-pink-700',
  },
]

const champions = [
  { name: 'Kofi Mensah', country: '🇬🇭 Ghana', year: '2024', title: 'Africa Final Champion', avatar: 'KM' },
  { name: 'Aminata Diallo', country: '🇸🇳 Senegal', year: '2023', title: 'AfroBreak World Champion', avatar: 'AD' },
  { name: 'David Okafor', country: '🇳🇬 Nigeria', year: '2022', title: 'Qualifier — Europe Winner', avatar: 'DO' },
  { name: 'Fatou Ndiaye', country: '🇸🇳 Senegal', year: '2021', title: 'Best Female Performer', avatar: 'FN' },
]

export default function AwardsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 mb-6">
            <Trophy size={14} className="text-gold-DEFAULT" />
            <span className="text-sm font-semibold text-gold-DEFAULT tracking-widest uppercase">Recognition & Achievements</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-DEFAULT to-yellow-400">Awards</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Celebrating excellence in African dance culture, community building, and global impact.
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {awards.map((award, i) => (
            <div key={i} className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${award.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <award.icon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">{award.year}</span>
                  <h3 className="text-base font-bold text-white mt-0.5 leading-snug">{award.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{award.organization}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-muted">
                    {award.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Champions section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Hall of Champions</h2>
            <p className="text-text-secondary">The dancers who made history on the AfroBreak stage</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {champions.map((c, i) => (
              <div key={i} className="bg-surface border border-white/5 rounded-2xl p-6 text-center hover:border-gold-DEFAULT/20 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-DEFAULT to-yellow-600 flex items-center justify-center mx-auto mb-4 text-xl font-black text-white shadow-lg">
                  {c.avatar}
                </div>
                <h3 className="font-bold text-white">{c.name}</h3>
                <p className="text-sm text-text-secondary mt-0.5">{c.country}</p>
                <p className="text-xs text-primary-500 font-semibold mt-2">{c.title}</p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 text-gold-DEFAULT">{c.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats banner */}
        <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-white/5 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '6+', label: 'International Awards' },
              { value: '38+', label: 'Countries Represented' },
              { value: '10K+', label: 'Community Members' },
              { value: '5+', label: 'Years of Excellence' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">{stat.value}</div>
                <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
