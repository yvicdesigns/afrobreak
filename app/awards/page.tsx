'use client'

import { Trophy, Crown, Medal, Globe } from 'lucide-react'

const africaFinalChampions = [
  {
    year: '2025',
    boys: { name: 'Zinji', country: '🇩🇿 Algeria' },
    girls: { name: 'Kris', country: '🇳🇬 Nigeria' },
  },
  {
    year: '2024',
    boys: { name: 'Smith', country: '🇧🇯 Benin' },
    girls: { name: 'Courtnea Paul', country: '🇿🇦 South Africa' },
  },
  {
    year: '2023',
    boys: { name: 'Lil Vic', country: '🇳🇬 Nigeria' },
    girls: { name: 'Sandrine', country: '🇧🇯 Benin' },
  },
  {
    year: '2022',
    boys: { name: 'Pape', country: '🇸🇳 Senegal' },
    girls: null,
  },
]

const regionalChampions = [
  { year: '2025', name: 'Zinji', country: '🇫🇷 France' },
  { year: '2025', name: 'David', country: '🇲🇺 Mauritius' },
  { year: '2025', name: 'Pencil', country: '🇺🇬 Uganda' },
  { year: '2025', name: 'Lil Dan', country: '🇰🇪 Kenya' },
  { year: '2025', name: 'Blesso', country: '🇬🇭 Ghana' },
  { year: '2025', name: 'Tris Naomi', country: '🇬🇭 Ghana' },
  { year: '2025', name: 'Blanchard', country: '🇨🇮 Ivory Coast' },
  { year: '2024', name: 'Dansi', country: '🇧🇫 Burkina Faso' },
  { year: '2024', name: 'ZH', country: '🇧🇯 Benin' },
  { year: '2024', name: 'Nagi', country: '🇬🇭 Ghana' },
  { year: '2024', name: 'Viks', country: '🇬🇭 Ghana' },
  { year: '2023', name: 'Chris Paul', country: '🇹🇬 Togo' },
  { year: '2023', name: 'Zira', country: '🇹🇬 Togo' },
  { year: '2023', name: 'Ola', country: '🇧🇯 Benin' },
  { year: '2023', name: 'Lil Vic', country: '🇳🇬 Nigeria' },
  { year: '2023', name: 'Vicky', country: '🇳🇬 Nigeria' },
  { year: '2023', name: 'The Curse', country: '🇿🇦 South Africa' },
  { year: '2023', name: 'Blesso', country: '🇬🇭 Ghana' },
  { year: '2023', name: 'Tris Naomi', country: '🇬🇭 Ghana' },
  { year: '2022', name: 'Roxy', country: '🇬🇭 Ghana' },
]

const years = ['2025', '2024', '2023', '2022']

export default function AwardsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 mb-6">
            <Trophy size={14} className="text-gold-DEFAULT" />
            <span className="text-sm font-semibold text-gold-DEFAULT tracking-widest uppercase">AfroBreak Dance Culture Awards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-DEFAULT to-yellow-400">Champions</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Recognize, celebrate and evaluate excellence in breaking and Hip Hop culture across Africa and the global dance community.
          </p>
        </div>

        {/* Africa Final Champions */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-DEFAULT to-yellow-600 flex items-center justify-center">
              <Crown size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Africa Final Champions</h2>
              <p className="text-text-secondary text-sm">AfroBreak Africa Final — Accra, Ghana</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {africaFinalChampions.map(edition => (
              <div key={edition.year} className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-gold-DEFAULT/20 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-black text-gold-DEFAULT uppercase tracking-widest px-3 py-1 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20">
                    {edition.year}
                  </span>
                  <span className="text-xs text-text-muted">AfroBreak Africa Final</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-background rounded-xl p-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-DEFAULT to-yellow-600 flex items-center justify-center mx-auto mb-2 text-lg font-black text-white shadow-lg">
                      {edition.boys.name[0]}
                    </div>
                    <p className="font-bold text-white text-sm">{edition.boys.name}</p>
                    <p className="text-text-secondary text-xs mt-0.5">{edition.boys.country}</p>
                    <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-400 font-bold">Boys</span>
                  </div>
                  {edition.girls ? (
                    <div className="text-center bg-background rounded-xl p-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-purple-700 flex items-center justify-center mx-auto mb-2 text-lg font-black text-white shadow-lg">
                        {edition.girls.name[0]}
                      </div>
                      <p className="font-bold text-white text-sm">{edition.girls.name}</p>
                      <p className="text-text-secondary text-xs mt-0.5">{edition.girls.country}</p>
                      <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-secondary-500/15 text-secondary-400 font-bold">Girls</span>
                    </div>
                  ) : (
                    <div className="text-center bg-background/50 rounded-xl p-4 flex items-center justify-center">
                      <p className="text-text-muted text-xs">Girls category introduced in 2023</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Champions */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Medal size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">National & Regional Champions</h2>
              <p className="text-text-secondary text-sm">AfroBreak Qualifiers — Across Africa & the Diaspora</p>
            </div>
          </div>

          <div className="space-y-8">
            {years.map(year => {
              const champs = regionalChampions.filter(c => c.year === year)
              return (
                <div key={year}>
                  <p className="text-primary-500 font-black text-sm uppercase tracking-widest mb-3">{year}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {champs.map((c, i) => (
                      <div key={i} className="bg-surface border border-white/5 rounded-xl p-4 text-center hover:border-primary-500/20 transition-all">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/10 flex items-center justify-center mx-auto mb-2 text-base font-black text-white border border-white/10">
                          {c.name[0]}
                        </div>
                        <p className="font-bold text-white text-sm leading-tight">{c.name}</p>
                        <p className="text-text-secondary text-xs mt-0.5">{c.country}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats banner */}
        <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-3 justify-center mb-6">
            <Globe size={18} className="text-primary-500" />
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-widest">AfroBreak by the numbers</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5', label: 'Editions' },
              { value: '28+', label: 'Countries Represented' },
              { value: '11K+', label: 'Beneficiaries' },
              { value: '270+', label: 'Events Organized' },
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
