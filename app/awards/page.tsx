'use client'

import { useState, useEffect, useRef } from 'react'
import { Trophy, Crown, Medal, Globe, X, MapPin, Calendar, Send, Check, Loader2 } from 'lucide-react'
import { getChampions, getSetting, getAwardCategories } from '@/lib/db'
import { useLanguage } from '@/lib/LanguageContext'

// ── Types ──────────────────────────────────────────────────────────
type Champion = {
  id?: string; name: string; country: string; flag: string; year: string
  category: 'Boys' | 'Girls' | 'Regional'; photo?: string; desc?: string; description?: string; event: string
}


// ── Award categories ──────────────────────────────────────────────
const awardSections = [
  {
    title: 'Individual Excellence Awards',
    subtitle: 'Categories 01 – 07',
    color: 'from-primary-500 to-primary-700',
    textColor: 'text-primary-400',
    borderColor: 'border-primary-500/20',
    bgColor: 'bg-primary-500/10',
    categories: [
      { num: 1, name: 'African Breaker of the Year (Male)', desc: 'Presented to the most outstanding male B-Boy on the African continent. Recognises technical mastery of Breaking fundamentals — power moves, freezes, footwork and toprock — combined with personal style, musicality and competitive impact over the award year.' },
      { num: 2, name: 'African Breaker of the Year (Female)', desc: 'Presented to the most outstanding female B-Girl on the African continent. Recognises technical excellence, creativity and competitive achievement in Breaking, celebrating the strength and representation of women in African Breaking culture.' },
      { num: 3, name: 'Breakout African Dancer of the Year', desc: 'Awarded to the most exciting emerging street dancer of any discipline who has made a significant breakthrough during the award year. Open to any gender and any street dance style — recognising raw talent, rapid growth and fresh impact on the African or international scene.' },
      { num: 4, name: 'Best AfroDancer of the Year (Male)', desc: 'Recognises the male dancer who has most powerfully embodied and advanced Afrodance — the family of movement styles rooted in African rhythm and culture, including Afrobeats dance, Afro-fusion and contemporary African popular dance forms.' },
      { num: 5, name: 'Best AfroDancer of the Year (Female)', desc: 'Recognises the female dancer who has most powerfully embodied and advanced Afrodance. Celebrates artistic excellence, cultural authenticity and the role women play in leading, innovating and preserving African dance movement culture.' },
      { num: 6, name: 'Best Breaker – Diaspora', desc: 'Awarded to the most outstanding B-Boy or B-Girl of African origin or heritage who is based outside the African continent. Recognises their excellence in Breaking and their role as a representative of African identity and culture on the global stage.' },
      { num: 7, name: 'Best AfroDancer – Diaspora', desc: 'Awarded to the most outstanding Afrodancer of African origin or heritage who is based outside the African continent. Celebrates their artistic contribution to Afrodance globally and their role as a cultural bridge between the African diaspora and the continent.' },
    ],
  },
  {
    title: 'Choreography & Creativity Awards',
    subtitle: 'Categories 08 – 10',
    color: 'from-purple-500 to-purple-700',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    bgColor: 'bg-purple-500/10',
    categories: [
      { num: 8, name: 'Best African Choreographer', desc: 'Recognises the choreographer who has demonstrated the highest level of artistic vision, technical craft and cultural relevance in their work over the award year. Eligible works include stage productions, music videos, live performances and HipHop theatre — open to all street and urban dance styles rooted in African culture.' },
      { num: 9, name: 'Best Creation / HipHop Theatre Performance', desc: 'Awarded to the most outstanding original theatre or stage dance production created within the HipHop and street dance tradition during the award year. Honours artistic ambition, storytelling, production quality and cultural depth — work that elevates street dance into a theatrical performance art form.' },
      { num: 10, name: 'Best Dance Video / Documentary (Africa)', desc: 'Awarded to the best filmed work celebrating African street dance culture — whether a dance performance video, short film or documentary. Judged on creative direction, cinematography, cultural storytelling and the ability to capture the essence and energy of African street dance for a wider audience.' },
    ],
  },
  {
    title: 'Group & Crew Awards',
    subtitle: 'Categories 11 – 14',
    color: 'from-emerald-500 to-emerald-700',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/10',
    categories: [
      { num: 11, name: 'Best Breaking / HipHop Crew', desc: 'Presented to the most outstanding Breaking or HipHop dance crew on the African continent. Evaluated on collective skill, crew chemistry, competitive achievements, community contribution and overall impact on African Breaking and HipHop culture during the award year.' },
      { num: 12, name: 'Best Afrodance Crew', desc: 'Awarded to the most impressive group or crew performing in Afrodance and African urban dance styles. Recognises synchronisation, creativity, cultural expression and the crew\'s ability to bring African rhythm and movement to life as a collective.' },
      { num: 13, name: 'Best Traditional Dance Group', desc: 'Recognises the group that has most powerfully preserved, presented and celebrated traditional African dance forms during the award year. Honours the role of traditional dance in maintaining cultural heritage, community identity and intergenerational knowledge.' },
      { num: 14, name: 'Best Female Dance Crew', desc: 'Dedicated to gender empowerment in African street dance culture. Presented to the most outstanding all-female or female-led dance crew — celebrating talent, discipline and the cultural impact of women who drive forward street dance culture across the continent as performers, leaders and role models.' },
    ],
  },
  {
    title: 'Regional Recognition Awards',
    subtitle: 'Categories 15 – 19',
    color: 'from-amber-500 to-amber-700',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/10',
    sectionNote: 'These awards celebrate the best B-Boy or B-Girl from each of Africa\'s five regions, ensuring that outstanding Breaking talent from every corner of the continent receives recognition alongside continental award winners.',
    categories: [
      { num: 15, name: 'Best Breaker – West Africa', desc: 'Awarded to the most outstanding B-Boy or B-Girl from West Africa, including Ghana, Nigeria, Senegal, Côte d\'Ivoire, Mali, Guinea, Burkina Faso and surrounding nations. Judged on technical skill, competitive results, style and contribution to regional Breaking culture.' },
      { num: 16, name: 'Best Breaker – East Africa', desc: 'Awarded to the most outstanding B-Boy or B-Girl from East Africa, including Kenya, Tanzania, Uganda, Ethiopia, Rwanda and surrounding nations. Recognises excellence, competitive achievement and the growing strength of Breaking culture across East Africa.' },
      { num: 17, name: 'Best Breaker – Central Africa', desc: 'Awarded to the most outstanding B-Boy or B-Girl from Central Africa, including the Democratic Republic of Congo, Cameroon, Republic of Congo, Gabon and surrounding nations. Celebrates the distinctive energy and style of Central African Breaking culture.' },
      { num: 18, name: 'Best Breaker – Southern Africa', desc: 'Awarded to the most outstanding B-Boy or B-Girl from Southern Africa, including South Africa, Zimbabwe, Mozambique, Zambia, Botswana and surrounding nations. Recognises technical mastery and the vibrant Breaking scenes of Southern Africa.' },
      { num: 19, name: 'Best Breaker – North Africa', desc: 'Awarded to the most outstanding B-Boy or B-Girl from North Africa, including Egypt, Morocco, Algeria, Tunisia, Libya and surrounding nations. Celebrates the dynamic Breaking culture and distinctive movement language of North African breakers.' },
    ],
  },
  {
    title: 'Industry & Impact Awards',
    subtitle: 'Categories 20 – 26',
    color: 'from-rose-500 to-rose-700',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/20',
    bgColor: 'bg-rose-500/10',
    categories: [
      { num: 20, name: 'Dance DJ of the Year', desc: 'Presented to the DJ who has made the most significant contribution to African street dance culture through music selections, event performances and cultural curation. Recognises the DJ\'s ability to move bodies, serve the culture and elevate the energy of Breaking, HipHop and Afrodance events across the continent and beyond.' },
      { num: 21, name: 'Dance Photographer of the Year', desc: 'Awarded to the photographer who has most powerfully captured and communicated African street dance culture through their lens. Judged on technical excellence, artistic composition and the ability to freeze the power, emotion and storytelling of dance in a single image.' },
      { num: 22, name: 'Dance Videographer / Director of the Year', desc: 'Recognises the videographer or director who has produced the most outstanding filmed content in service of African street dance culture. Celebrates technical skill, creative vision and the ability to grow the reach and visibility of the culture through moving image.' },
      { num: 23, name: 'Dance Educator of the Year', desc: 'Awarded to the individual who has made the most outstanding contribution to dance education within African street dance culture — through teaching, mentoring, workshops, curriculum development or community outreach. Recognises those who sustain and grow the culture for the next generation.' },
      { num: 24, name: 'Dance Event / Competition of the Year', desc: 'Presented to the event, festival or competition that made the greatest impact on African street dance culture during the award year. Judged on organisation, level of participation, cultural contribution, audience reach and lasting legacy for dancers and communities.' },
      { num: 25, name: 'Lifetime Achievement Award (African Dance)', desc: 'The highest individual honour of the Afrobreak Culture Festival Awards. Presented to a figure who has dedicated their life to advancing African dance culture — as a dancer, choreographer, educator, organiser or leader. Recognises a career of sustained excellence, cultural contribution and lasting impact.' },
      { num: 26, name: 'African Dance Ambassador Award', desc: 'Awarded to the individual who has most effectively carried African dance culture to a global audience — promoting, representing and advocating for the continent\'s street and urban dance traditions on international stages, through media, partnerships and cultural exchange.' },
    ],
  },
  {
    title: 'The Great 8 · Special Honour',
    subtitle: 'Category 27',
    color: 'from-gold to-yellow-600',
    textColor: 'text-gold',
    borderColor: 'border-gold/20',
    bgColor: 'bg-gold/10',
    isSpecial: true,
    categories: [
      { num: 27, name: 'The Great 8 — Pioneers of Breaking & HipHop in Africa', desc: 'A unique and historic honour presented not as a competitive award but as a formal act of recognition and gratitude. The Great 8 acknowledges eight key personalities — B-Boys, B-Girls, organisers, educators, promoters or cultural leaders — whose vision, sacrifice and dedication were foundational to the establishment and growth of Breaking and HipHop culture on the African continent and in the global arena. Honourees are selected by a panel of cultural elders, historians and community leaders within the African Breaking and HipHop community. Their names are inscribed permanently in the Afrobreak Culture Festival Hall of Record. The Great 8 are not nominees — they are legends, and this honour exists to ensure that the architects of African street dance culture are never forgotten.' },
    ],
  },
]

// derived inside component via liveSections
const _allCategoriesStatic = awardSections.flatMap(s => s.categories.map(c => ({ num: c.num, name: c.name, section: s.title })))

const africanRegions = ['West Africa', 'East Africa', 'Central Africa', 'Southern Africa', 'North Africa', 'Diaspora']

const emptyForm = {
  nominatorName: '', nominatorEmail: '', nominatorPhone: '', nominatorCountry: '', relationshipToNominee: '',
  categoryNum: '', categoryName: '', section: '',
  nomineeName: '', nomineeStage: '', nomineeGender: '', nomineeCountry: '', nomineeCity: '',
  nomineeRegion: '', nomineeEmail: '', nomineePhone: '', nomineeSocial: '', supportLinks: '',
  confirmAccurate: false, confirmContact: false,
}

export default function AwardsPage() {
  const { tr } = useLanguage()
  const [tab, setTab] = useState<'champions' | 'awards'>('champions')
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Champion | null>(null)
  const [awardsLogo, setAwardsLogo] = useState('')
  const [liveSections, setLiveSections] = useState(awardSections)
  const allCategories = liveSections.flatMap(s => s.categories.map(c => ({ num: c.num, name: c.name, section: s.title })))
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([getChampions(), getSetting('awards_logo'), getAwardCategories()]).then(([data, logo, cats]) => {
      setChampions((data || []).map((c: Record<string, unknown>) => ({
        ...c,
        year: String(c.year),
        desc: (c.description || c.desc || '') as string,
        photo: (c.photo || c.image || '') as string,
      })) as Champion[])
      if (logo) setAwardsLogo(logo)
      if (cats && cats.length > 0) {
        const catMap = new Map((cats as { num: number; name: string; description: string; section: string }[]).map(c => [c.num, c]))
        setLiveSections(awardSections.map(section => ({
          ...section,
          categories: section.categories.map(cat => {
            const live = catMap.get(cat.num)
            return live ? { ...cat, name: live.name, desc: live.description } : cat
          }),
        })))
      }
    }).finally(() => setLoading(false))
  }, [])

  const years = Array.from(new Set(champions.map(c => c.year))).sort((a, b) => Number(b) - Number(a))
  const africaFinals = champions.filter(c => c.category === 'Boys' || c.category === 'Girls')
  const regional = champions.filter(c => c.category === 'Regional')

  const setField = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    if (!form.nominatorName || !form.nominatorEmail || !form.categoryName || !form.nomineeName) {
      setSubmitError(tr.awards.nominations.errorRequired)
      return
    }
    if (!form.confirmAccurate || !form.confirmContact) {
      setSubmitError(tr.awards.nominations.errorConfirm)
      return
    }
    setSubmitting(true)
    try {
      // API route handles save (service role, bypasses RLS) + email notification
      const res = await fetch('/api/nominations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nominatorName: form.nominatorName,
          nominatorEmail: form.nominatorEmail,
          nominatorPhone: form.nominatorPhone,
          nominatorCountry: form.nominatorCountry,
          relationshipToNominee: form.relationshipToNominee,
          categoryNum: form.categoryNum,
          categoryName: form.categoryName,
          section: form.section,
          nomineeName: form.nomineeName,
          nomineeStage: form.nomineeStage,
          nomineeGender: form.nomineeGender,
          nomineeCountry: form.nomineeCountry,
          nomineeCity: form.nomineeCity,
          nomineeRegion: form.nomineeRegion,
          nomineeEmail: form.nomineeEmail,
          nomineePhone: form.nomineePhone,
          nomineeSocial: form.nomineeSocial,
          supportLinks: form.supportLinks,
          confirmedAccurate: form.confirmAccurate,
          confirmedContact: form.confirmContact,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')

      setSubmitted(true)
      setForm(emptyForm)
    } catch {
      setSubmitError(tr.awards.nominations.errorGeneral)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen pt-24 bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          {awardsLogo ? (
            <div className="flex justify-center mb-6">
              <img src={awardsLogo} alt="AfroBreak Culture Awards" className="h-24 w-auto object-contain" />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 border border-gold/30 mb-6">
              <Trophy size={14} className="text-gold" />
              <span className="text-sm font-semibold text-gold tracking-widest uppercase">AfroBreak Dance Culture Awards</span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            AfroBreak{' '}
            <span style={{ backgroundImage: 'linear-gradient(to right, #FDCA00, #FDE047)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Culture Awards
            </span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Recognize, celebrate and evaluate excellence in breaking and Hip Hop culture across Africa and the global dance community.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-white/10 pb-0">
          {[
            { key: 'champions', label: tr.awards.tabChampions, icon: Crown },
            { key: 'awards', label: tr.awards.tabAwards, icon: Trophy },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as 'champions' | 'awards')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl border-b-2 transition-all ${
                tab === key
                  ? 'text-primary-400 border-primary-500 bg-primary-500/5'
                  : 'text-text-secondary border-transparent hover:text-white'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB: Hall of Champions ─────────────────────────────── */}
        {tab === 'champions' && (
          <>
            {/* Africa Final Champions */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center">
                  <Crown size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{tr.awards.africaFinalChampions}</h2>
                  <p className="text-text-secondary text-sm">{tr.awards.africaFinalsDesc}</p>
                </div>
              </div>
              <div className="space-y-10">
                {years.map(year => {
                  const yearChamps = africaFinals.filter(c => c.year === year)
                  if (yearChamps.length === 0) return null
                  return (
                    <div key={year}>
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-xs font-black text-gold uppercase tracking-widest px-3 py-1 rounded-full bg-gold/10 border border-gold/20">{year}</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {yearChamps.map((c, i) => <ChampionCard key={i} champion={c} onClick={() => setSelected(c)} gold />)}
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
                  <h2 className="text-2xl font-black text-white">{tr.awards.nationalRegional}</h2>
                  <p className="text-text-secondary text-sm">{tr.awards.nationalRegionalDesc}</p>
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
                        {yearChamps.map((c, i) => <ChampionCard key={i} champion={c} onClick={() => setSelected(c)} />)}
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
                <span className="text-sm font-semibold text-primary-400 uppercase tracking-widest">{tr.awards.byTheNumbers}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '5', label: tr.awards.statEditions },
                  { value: '28+', label: tr.awards.statCountries },
                  { value: '11K+', label: tr.hero.stat3Label },
                  { value: '270+', label: tr.hero.stat2Label },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">{stat.value}</div>
                    <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: Culture Awards 2026 ───────────────────────────── */}
        {tab === 'awards' && (
          <div className="space-y-12">

            {/* Ceremony banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/15 via-surface to-secondary-500/10 border border-white/10 p-8 md:p-12 text-center">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #FDCA00 0%, transparent 50%), radial-gradient(circle at 80% 50%, #0D3DC8 0%, transparent 50%)' }} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 border border-gold/30 mb-6">
                  <Trophy size={14} className="text-gold" />
                  <span className="text-sm font-semibold text-gold tracking-widest uppercase">Afrobreak Culture Festival 2026 Awards</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">27 Categories of Excellence</h2>
                <p className="text-text-secondary text-lg max-w-3xl mx-auto mb-8">
                  The Afrobreak Culture Festival 2026 Awards celebrate the individuals, crews, educators and industry professionals who have shaped, elevated and advanced street dance culture across the African continent and within the African diaspora.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-5 py-3">
                    <Calendar size={16} className="text-primary-500" />
                    <span className="text-white font-semibold">20th November 2026</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-5 py-3">
                    <MapPin size={16} className="text-primary-500" />
                    <span className="text-white font-semibold">Accra, Ghana</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-5 py-3">
                    <Globe size={16} className="text-primary-500" />
                    <span className="text-white font-semibold">AfroBreak International Festival 2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nomination Form */}
            <div ref={formRef} className="bg-surface border border-white/10 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/5 border-b border-white/10 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Send size={18} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Submit Your Nomination</h3>
                </div>
                <p className="text-text-secondary">Nominate an individual, crew or industry professional for the Afrobreak Culture Festival 2026 Awards.</p>
              </div>

              {submitted ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                    <Check size={36} className="text-emerald-400" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-3">{tr.awards.nominations.successTitle}</h4>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">{tr.awards.nominations.successDesc}</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all"
                  >
                    {tr.awards.nominations.submitAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                  {/* Section 1: Nominator */}
                  <div>
                    <h4 className="text-sm font-black text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary-500/20 text-xs flex items-center justify-center text-primary-400">1</span>
                      {tr.awards.nominations.sectionNominator}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.fullName} <span className="text-red-400">*</span></label>
                        <input value={form.nominatorName} onChange={e => setField('nominatorName', e.target.value)} className="input-base" placeholder={tr.awards.nominations.yourFullName} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.emailAddress} <span className="text-red-400">*</span></label>
                        <input type="email" value={form.nominatorEmail} onChange={e => setField('nominatorEmail', e.target.value)} className="input-base" placeholder="you@example.com" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.phoneWhatsapp}</label>
                        <input value={form.nominatorPhone} onChange={e => setField('nominatorPhone', e.target.value)} className="input-base" placeholder="+1 234 567 8900" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.country}</label>
                        <input value={form.nominatorCountry} onChange={e => setField('nominatorCountry', e.target.value)} className="input-base" placeholder={tr.awards.nominations.yourCountry} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.relationship}</label>
                        <select value={form.relationshipToNominee} onChange={e => setField('relationshipToNominee', e.target.value)} className="input-base">
                          <option value="">{tr.awards.nominations.selectRelationship}</option>
                          <option>{tr.awards.nominations.self}</option><option>Friend</option><option>Manager / Agent</option>
                          <option>Fellow dancer</option><option>{tr.awards.nominations.fan}</option><option>Organisation</option><option>{tr.awards.nominations.other}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Award Category */}
                  <div>
                    <h4 className="text-sm font-black text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary-500/20 text-xs flex items-center justify-center text-primary-400">2</span>
                      {tr.awards.nominations.sectionCategory}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.categorySelected} <span className="text-red-400">*</span></label>
                        <select
                          value={form.categoryName}
                          onChange={e => {
                            const cat = allCategories.find(c => c.name === e.target.value)
                            setForm(f => ({ ...f, categoryName: e.target.value, categoryNum: cat ? String(cat.num) : '', section: cat?.section || '' }))
                          }}
                          className="input-base"
                          required
                        >
                          <option value="">{tr.awards.nominations.selectCategory}</option>
                          {liveSections.map(s => (
                            <optgroup key={s.title} label={s.title}>
                              {s.categories.map(c => <option key={c.num} value={c.name}>#{c.num} — {c.name}</option>)}
                            </optgroup>
                          ))}
                        </select>
                        {form.section && (
                          <p className="text-xs text-text-muted mt-1.5">Section: {form.section}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Nominee Details */}
                  <div>
                    <h4 className="text-sm font-black text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary-500/20 text-xs flex items-center justify-center text-primary-400">3</span>
                      {tr.awards.nominations.sectionNominee}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.nomineeFullName} <span className="text-red-400">*</span></label>
                        <input value={form.nomineeName} onChange={e => setField('nomineeName', e.target.value)} className="input-base" placeholder={tr.awards.nominations.fullLegalName} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.stageName}</label>
                        <input value={form.nomineeStage} onChange={e => setField('nomineeStage', e.target.value)} className="input-base" placeholder="e.g. Bboy Lyricx" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.gender}</label>
                        <select value={form.nomineeGender} onChange={e => setField('nomineeGender', e.target.value)} className="input-base">
                          <option value="">{tr.awards.nominations.selectRelationship}</option>
                          <option>{tr.awards.nominations.male}</option><option>{tr.awards.nominations.female}</option><option>{tr.awards.nominations.nonBinary}</option><option>{tr.awards.nominations.preferNotToSay}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.country}</label>
                        <input value={form.nomineeCountry} onChange={e => setField('nomineeCountry', e.target.value)} className="input-base" placeholder={tr.awards.nominations.nomineeCountry} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.city}</label>
                        <input value={form.nomineeCity} onChange={e => setField('nomineeCity', e.target.value)} className="input-base" placeholder={tr.awards.nominations.nomineeCity} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.africanRegion}</label>
                        <select value={form.nomineeRegion} onChange={e => setField('nomineeRegion', e.target.value)} className="input-base">
                          <option value="">{tr.awards.nominations.selectRegion}</option>
                          {africanRegions.map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.nomineeEmail}</label>
                        <input type="email" value={form.nomineeEmail} onChange={e => setField('nomineeEmail', e.target.value)} className="input-base" placeholder="nominee@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.nomineePhone}</label>
                        <input value={form.nomineePhone} onChange={e => setField('nomineePhone', e.target.value)} className="input-base" placeholder="+233 00 000 0000" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.socialLinks}</label>
                        <textarea value={form.nomineeSocial} onChange={e => setField('nomineeSocial', e.target.value)} className="input-base resize-none" rows={2} placeholder={tr.awards.nominations.socialLinksPlaceholder} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-white mb-1.5">{tr.awards.nominations.supportLinks}</label>
                        <textarea value={form.supportLinks} onChange={e => setField('supportLinks', e.target.value)} className="input-base resize-none" rows={2} placeholder={tr.awards.nominations.supportLinksPlaceholder} />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Confirmation */}
                  <div>
                    <h4 className="text-sm font-black text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary-500/20 text-xs flex items-center justify-center text-primary-400">4</span>
                      {tr.awards.nominations.sectionConfirmation}
                    </h4>
                    <div className="space-y-3">
                      {[
                        { key: 'confirmAccurate', label: tr.awards.nominations.confirmAccurate },
                        { key: 'confirmContact', label: tr.awards.nominations.confirmContact },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-start gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${form[key as keyof typeof form] ? 'bg-primary-500 border-primary-500' : 'border-white/20 group-hover:border-primary-500/50'}`}
                            onClick={() => setField(key, !form[key as keyof typeof form])}>
                            {form[key as keyof typeof form] && <Check size={12} className="text-white" />}
                          </div>
                          <span className="text-sm text-text-secondary leading-relaxed">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{submitError}</div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-background bg-primary-500 hover:bg-primary-600 disabled:opacity-60 transition-all text-base"
                  >
                    {submitting ? <><Loader2 size={18} className="animate-spin" /> {tr.awards.nominations.submitting}</> : <><Send size={18} /> {tr.awards.nominations.submit}</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Champion modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} style={{ animation: 'fadeIn 0.2s ease' }}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md bg-surface border border-white/10 rounded-3xl overflow-hidden" style={{ animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className="relative h-52 bg-gradient-to-br from-primary-500/20 via-surface to-secondary-500/10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
              <div className="absolute inset-0 opacity-20" style={{ background: selected.category === 'Boys' ? 'radial-gradient(circle at 50% 50%, #f97316 0%, transparent 70%)' : selected.category === 'Girls' ? 'radial-gradient(circle at 50% 50%, #a855f7 0%, transparent 70%)' : 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 70%)' }} />
              {selected.photo ? (
                <img src={selected.photo} alt={selected.name} className="w-36 h-36 rounded-full object-cover ring-4 ring-white/20 z-20 relative shadow-2xl" />
              ) : (
                <div className="w-36 h-36 rounded-full flex items-center justify-center z-20 relative shadow-2xl ring-4 ring-white/20 text-5xl font-black text-white" style={{ background: selected.category === 'Boys' ? 'linear-gradient(135deg, #f97316, #ea580c)' : selected.category === 'Girls' ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  {selected.name[0]}
                </div>
              )}
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all"><X size={16} /></button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{selected.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={12} className="text-text-muted" />
                    <span className="text-text-secondary text-sm">{selected.flag} {selected.country}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selected.category === 'Boys' ? 'bg-primary-500/20 text-primary-400' : selected.category === 'Girls' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {selected.category === 'Regional' ? tr.awards.regionalChampion : `${selected.category} Champion`}
                  </span>
                  <div className="flex items-center gap-1 text-gold text-xs font-bold"><Calendar size={11} />{selected.year}</div>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{selected.desc || selected.description}</p>
              <div className="p-3 bg-background rounded-xl border border-white/5">
                <p className="text-xs text-text-muted mb-0.5 uppercase tracking-wider">Event</p>
                <p className="text-white text-sm font-semibold">{selected.event}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px) scale(0.95) } to { opacity:1; transform:translateY(0) scale(1) } }
      `}</style>
    </div>
  )
}

function ChampionCard({ champion, onClick, gold = false }: { champion: Champion; onClick: () => void; gold?: boolean }) {
  return (
    <button onClick={onClick} className={`group w-full bg-surface border rounded-2xl p-4 text-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${gold ? 'border-gold/20 hover:border-gold/50 hover:bg-gold/5' : 'border-white/5 hover:border-primary-500/30 hover:bg-primary-500/5'}`}>
      <div className="relative mx-auto mb-3 w-16 h-16">
        {champion.photo ? (
          <img src={champion.photo} alt={champion.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-primary-500/40 transition-all" />
        ) : (
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white ring-2 ring-white/10 group-hover:ring-primary-500/40 transition-all ${champion.category === 'Boys' ? 'bg-gradient-to-br from-primary-500 to-primary-700' : champion.category === 'Girls' ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-primary-500/30 to-secondary-500/20'}`}>
            {champion.name[0]}
          </div>
        )}
        {gold && <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center shadow-lg"><Crown size={10} className="text-white" /></div>}
      </div>
      <p className="font-bold text-white text-sm leading-tight">{champion.name}</p>
      <p className="text-text-secondary text-xs mt-0.5">{champion.flag} {champion.country}</p>
      {champion.category !== 'Regional' && (
        <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-bold ${champion.category === 'Boys' ? 'bg-primary-500/15 text-primary-400' : 'bg-purple-500/15 text-purple-400'}`}>
          {champion.category}
        </span>
      )}
    </button>
  )
}
