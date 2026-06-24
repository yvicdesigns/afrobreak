'use client'

import { useState } from 'react'
import { Trophy, Crown, Medal, Globe, X, MapPin, Calendar } from 'lucide-react'

type Champion = {
  name: string
  country: string
  flag: string
  year: string
  category: 'Boys' | 'Girls' | 'Regional'
  photo?: string
  desc: string
  event: string
}

const champions: Champion[] = [
  // ── 2025 ─────────────────────────────────────────────────────────
  {
    name: 'Zinji', country: 'Algeria', flag: '🇩🇿', year: '2025',
    category: 'Boys',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    desc: 'Zinji from Algeria claimed the AfroBreak Africa Final 2025 Boys title in a historic night at the Accra Sports Complex, representing North Africa at the highest level of continental breaking.',
    event: 'AfroBreak Africa Final — Accra, Ghana',
  },
  {
    name: 'Kris', country: 'Nigeria', flag: '🇳🇬', year: '2025',
    category: 'Girls',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    desc: 'Kris from Nigeria was crowned AfroBreak African Girls Champion 2025, bringing power, precision and pure Nigerian breaking energy to claim her place in the Hall of Champions.',
    event: 'AfroBreak Africa Final — Accra, Ghana',
  },
  {
    name: 'Pencil', country: 'Uganda', flag: '🇺🇬', year: '2025',
    category: 'Regional',
    desc: 'East Africa qualifier champion representing Uganda — one of the fastest-rising breaking scenes on the continent.',
    event: 'AfroBreak East Africa Qualifier — Kampala',
  },
  {
    name: 'David', country: 'Mauritius', flag: '🇲🇺', year: '2025',
    category: 'Regional',
    desc: 'Island nation champion. David put Mauritius on the breaking map with his qualifier win, bringing Indian Ocean culture to the AfroBreak stage.',
    event: 'AfroBreak Mauritius Qualifier',
  },
  {
    name: 'Lil Dan', country: 'Kenya', flag: '🇰🇪', year: '2025',
    category: 'Regional',
    desc: 'East Africa representative from Kenya. Lil Dan is a rising force in the Nairobi breaking community and a key figure in growing the culture across East Africa.',
    event: 'AfroBreak East Africa Qualifier',
  },
  {
    name: 'Blesso', country: 'Ghana', flag: '🇬🇭', year: '2025',
    category: 'Regional',
    desc: 'Home country hero. Blesso has consistently represented Ghana with distinction across multiple AfroBreak editions, earning his place among the continental elite.',
    event: 'AfroBreak Ghana Qualifier — Accra',
  },
  {
    name: 'Tris Naomi', country: 'Ghana', flag: '🇬🇭', year: '2025',
    category: 'Regional',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    desc: 'One of the most dominant female breakers on the continent. Tris Naomi has been a fixture in AfroBreak since 2023, consistently pushing the level of girls breaking in Ghana and Africa.',
    event: 'AfroBreak Ghana Qualifier — Accra',
  },
  {
    name: 'Blanchard', country: 'Ivory Coast', flag: '🇨🇮', year: '2025',
    category: 'Regional',
    desc: 'Ivory Coast champion and one of the standout talents from Francophone West Africa. Blanchard brings technical breaking and cultural depth to every performance.',
    event: 'AfroBreak Ivory Coast Qualifier — Abidjan',
  },
  // ── 2024 ─────────────────────────────────────────────────────────
  {
    name: 'Smith', country: 'Benin', flag: '🇧🇯', year: '2024',
    category: 'Boys',
    photo: 'https://images.unsplash.com/photo-1526483291330-fe44429f3e0d?w=400&q=80',
    desc: 'Smith from Benin became AfroBreak African Champion 2024 with an electrifying performance at the Accra Sports Complex. One of West Africa\'s most consistent elite breakers and an ABA Global Ambassador.',
    event: 'AfroBreak Africa Final — Accra, Ghana',
  },
  {
    name: 'Courtnea Paul', country: 'South Africa', flag: '🇿🇦', year: '2024',
    category: 'Girls',
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
    desc: 'Courtnea Paul claimed the Girls title at AfroBreak Africa Final 2024, representing South Africa with style and power. A landmark moment for Southern African breaking.',
    event: 'AfroBreak Africa Final — Accra, Ghana',
  },
  {
    name: 'Dansi', country: 'Burkina Faso', flag: '🇧🇫', year: '2024',
    category: 'Regional',
    desc: 'Dansi represents one of West Africa\'s most vibrant breaking scenes. His qualifier win in Ouagadougou showcased the depth of talent coming from Burkina Faso.',
    event: 'AfroBreak Burkina Faso Qualifier — Ouagadougou',
  },
  {
    name: 'ZH', country: 'Benin', flag: '🇧🇯', year: '2024',
    category: 'Regional',
    desc: 'Benin qualifier champion. ZH follows in the footsteps of compatriot Smith, proving that Benin is one of the most consistent breaking nations on the continent.',
    event: 'AfroBreak Benin Qualifier — Cotonou',
  },
  {
    name: 'Nagi', country: 'Ghana', flag: '🇬🇭', year: '2024',
    category: 'Regional',
    desc: 'Ghana qualifier champion 2024. Nagi brings creativity and explosive footwork to the battle floor, a key player in the Accra breaking scene.',
    event: 'AfroBreak Ghana Qualifier — Accra',
  },
  {
    name: 'Viks', country: 'Ghana', flag: '🇬🇭', year: '2024',
    category: 'Regional',
    desc: 'Girls qualifier champion from Ghana 2024. Viks is one of the leading female breakers in West Africa and a role model for the next generation of girl breakers.',
    event: 'AfroBreak Ghana Qualifier — Accra',
  },
  // ── 2023 ─────────────────────────────────────────────────────────
  {
    name: 'Lil Vic', country: 'Nigeria', flag: '🇳🇬', year: '2023',
    category: 'Boys',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    desc: 'Lil Vic from Nigeria became AfroBreak African Champion 2023 in a brilliant performance that showcased Nigerian breaking at its finest. A cultural ambassador for the movement across West Africa.',
    event: 'AfroBreak Africa Final — Accra, Ghana',
  },
  {
    name: 'Sandrine', country: 'Benin', flag: '🇧🇯', year: '2023',
    category: 'Girls',
    desc: 'Sandrine from Benin was crowned Girls champion at the AfroBreak Africa Final 2023, the second edition of the Girls category. Her win cemented Benin as a powerhouse of continental breaking.',
    event: 'AfroBreak Africa Final — Accra, Ghana',
  },
  {
    name: 'Chris Paul', country: 'Togo', flag: '🇹🇬', year: '2023',
    category: 'Regional',
    desc: 'Qualifier champion from Lomé. Chris Paul is one of the faces of Togo\'s breaking scene — technical, creative, and consistent on the AfroBreak stage across multiple editions.',
    event: 'AfroBreak Togo Qualifier — Lomé',
  },
  {
    name: 'Zira', country: 'Togo', flag: '🇹🇬', year: '2023',
    category: 'Regional',
    desc: 'Girls qualifier champion from Togo. Zira is a standout female breaker from Lomé, proving that Togo punches above its weight in both boys and girls categories.',
    event: 'AfroBreak Togo Qualifier — Lomé',
  },
  {
    name: 'Ola', country: 'Benin', flag: '🇧🇯', year: '2023',
    category: 'Regional',
    desc: 'Benin qualifier champion 2023. Ola brings raw power and West African breaking culture to the floor, a respected name in the Cotonou dance community.',
    event: 'AfroBreak Benin Qualifier — Cotonou',
  },
  {
    name: 'Vicky', country: 'Nigeria', flag: '🇳🇬', year: '2023',
    category: 'Regional',
    desc: 'Nigeria qualifier champion in the Girls category 2023. Vicky is part of Nigeria\'s growing pool of elite female breakers, trained and battle-tested on the AfroBreak circuit.',
    event: 'AfroBreak Nigeria Qualifier — Lagos',
  },
  {
    name: 'The Curse', country: 'South Africa', flag: '🇿🇦', year: '2023',
    category: 'Regional',
    desc: 'Southern Africa qualifier champion. The Curse represents the strength of South African breaking, a scene known for its power moves and distinctive style.',
    event: 'AfroBreak Southern Africa Qualifier',
  },
  {
    name: 'Blesso', country: 'Ghana', flag: '🇬🇭', year: '2023',
    category: 'Regional',
    desc: 'Multi-year qualifier champion from Ghana. Blesso is one of the most decorated breakers on the AfroBreak circuit and a pillar of the Accra breaking community.',
    event: 'AfroBreak Ghana Qualifier — Accra',
  },
  {
    name: 'Tris Naomi', country: 'Ghana', flag: '🇬🇭', year: '2023',
    category: 'Regional',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    desc: 'Girls qualifier champion from Ghana 2023. Tris Naomi\'s consistency across multiple editions of AfroBreak makes her one of the most respected female competitors on the continent.',
    event: 'AfroBreak Ghana Qualifier — Accra',
  },
  // ── 2022 ─────────────────────────────────────────────────────────
  {
    name: 'Pape', country: 'Senegal', flag: '🇸🇳', year: '2022',
    category: 'Boys',
    desc: 'Pape from Senegal was the inaugural AfroBreak African Champion in 2022, setting the standard for what African breaking excellence looks like on the continental stage.',
    event: 'AfroBreak Africa Final — Accra Cultural Centre, Ghana',
  },
  {
    name: 'Roxy', country: 'Ghana', flag: '🇬🇭', year: '2022',
    category: 'Regional',
    desc: 'Ghana qualifier champion 2022. Roxy was part of the founding generation of AfroBreak competitors — helping establish the event as the premier breaking platform in Africa.',
    event: 'AfroBreak Ghana Qualifier — Accra',
  },
]

const years = ['2025', '2024', '2023', '2022']

export default function AwardsPage() {
  const [selected, setSelected] = useState<Champion | null>(null)

  const africaFinals = champions.filter(c => c.category === 'Boys' || c.category === 'Girls')
  const regional = champions.filter(c => c.category === 'Regional')

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

          <div className="space-y-10">
            {years.map(year => {
              const yearChamps = africaFinals.filter(c => c.year === year)
              if (yearChamps.length === 0) return null
              return (
                <div key={year}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-black text-gold-DEFAULT uppercase tracking-widest px-3 py-1 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20">{year}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {yearChamps.map((c, i) => (
                      <ChampionCard key={i} champion={c} onClick={() => setSelected(c)} gold />
                    ))}
                  </div>
                </div>
              )
            })}
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

          <div className="space-y-10">
            {years.map(year => {
              const yearChamps = regional.filter(c => c.year === year)
              if (yearChamps.length === 0) return null
              return (
                <div key={year}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-black text-primary-400 uppercase tracking-widest px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20">{year}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {yearChamps.map((c, i) => (
                      <ChampionCard key={i} champion={c} onClick={() => setSelected(c)} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
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

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          style={{ animation: 'fadeIn 0.2s ease' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-surface border border-white/10 rounded-3xl overflow-hidden"
            style={{ animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}
          >
            {/* Top banner with photo */}
            <div className="relative h-52 bg-gradient-to-br from-primary-500/20 via-surface to-secondary-500/10 flex items-center justify-center overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: selected.category === 'Boys'
                    ? 'radial-gradient(circle at 50% 50%, #f97316 0%, transparent 70%)'
                    : selected.category === 'Girls'
                    ? 'radial-gradient(circle at 50% 50%, #a855f7 0%, transparent 70%)'
                    : 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)',
                }}
              />
              {selected.photo ? (
                <img
                  src={selected.photo}
                  alt={selected.name}
                  className="w-36 h-36 rounded-full object-cover ring-4 ring-white/20 z-20 relative shadow-2xl"
                  style={{ animation: 'popIn 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
                />
              ) : (
                <div
                  className="w-36 h-36 rounded-full flex items-center justify-center z-20 relative shadow-2xl ring-4 ring-white/20 text-5xl font-black text-white"
                  style={{
                    background: selected.category === 'Boys'
                      ? 'linear-gradient(135deg, #f97316, #ea580c)'
                      : selected.category === 'Girls'
                      ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                      : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    animation: 'popIn 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                  }}
                >
                  {selected.name[0]}
                </div>
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Info */}
            <div className="p-6" style={{ animation: 'fadeIn 0.3s ease 0.15s both' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{selected.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={12} className="text-text-muted" />
                    <span className="text-text-secondary text-sm">{selected.flag} {selected.country}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selected.category === 'Boys'
                      ? 'bg-primary-500/20 text-primary-400'
                      : selected.category === 'Girls'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selected.category === 'Regional' ? 'Regional Champion' : `${selected.category} Champion`}
                  </span>
                  <div className="flex items-center gap-1 text-gold-DEFAULT text-xs font-bold">
                    <Calendar size={11} />
                    {selected.year}
                  </div>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-4">{selected.desc}</p>

              <div className="p-3 bg-background rounded-xl border border-white/5">
                <p className="text-xs text-text-muted mb-0.5 uppercase tracking-wider">Event</p>
                <p className="text-white text-sm font-semibold">{selected.event}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6) }
          to { opacity: 1; transform: scale(1) }
        }
      `}</style>
    </div>
  )
}

function ChampionCard({ champion, onClick, gold = false }: { champion: Champion; onClick: () => void; gold?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full bg-surface border rounded-2xl p-4 text-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${
        gold
          ? 'border-gold-DEFAULT/20 hover:border-gold-DEFAULT/50 hover:bg-gold-DEFAULT/5'
          : 'border-white/5 hover:border-primary-500/30 hover:bg-primary-500/5'
      }`}
    >
      {/* Avatar */}
      <div className="relative mx-auto mb-3 w-16 h-16">
        {champion.photo ? (
          <img
            src={champion.photo}
            alt={champion.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-primary-500/40 transition-all"
          />
        ) : (
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white ring-2 ring-white/10 group-hover:ring-primary-500/40 transition-all ${
              champion.category === 'Boys'
                ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                : champion.category === 'Girls'
                ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                : 'bg-gradient-to-br from-primary-500/30 to-secondary-500/20'
            }`}
          >
            {champion.name[0]}
          </div>
        )}
        {/* Gold crown for Africa Final winners */}
        {gold && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-DEFAULT rounded-full flex items-center justify-center shadow-lg">
            <Crown size={10} className="text-white" />
          </div>
        )}
      </div>

      <p className="font-bold text-white text-sm leading-tight">{champion.name}</p>
      <p className="text-text-secondary text-xs mt-0.5">{champion.flag} {champion.country}</p>
      {champion.category !== 'Regional' && (
        <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-bold ${
          champion.category === 'Boys'
            ? 'bg-primary-500/15 text-primary-400'
            : 'bg-purple-500/15 text-purple-400'
        }`}>
          {champion.category}
        </span>
      )}
    </button>
  )
}
