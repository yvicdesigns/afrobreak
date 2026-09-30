'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, Trophy, Image, Loader2, Crown, BookOpen, Search, Check } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import { getChampions, createChampion, updateChampion, deleteChampion, getSetting, saveSetting, getAwardCategories, updateAwardCategory, seedAwardCategories } from '@/lib/db'

// ── Static seed data for categories ──────────────────────────────
const SEED_CATEGORIES = [
  { num: 1, name: 'African Breaker of the Year (Male)', description: 'Presented to the most outstanding male B-Boy on the African continent. Recognises technical mastery of Breaking fundamentals — power moves, freezes, footwork and toprock — combined with personal style, musicality and competitive impact over the award year.', section: 'Individual Excellence Awards', section_order: 1 },
  { num: 2, name: 'African Breaker of the Year (Female)', description: 'Presented to the most outstanding female B-Girl on the African continent. Recognises technical excellence, creativity and competitive achievement in Breaking, celebrating the strength and representation of women in African Breaking culture.', section: 'Individual Excellence Awards', section_order: 1 },
  { num: 3, name: 'Breakout African Dancer of the Year', description: 'Awarded to the most exciting emerging street dancer of any discipline who has made a significant breakthrough during the award year. Open to any gender and any street dance style — recognising raw talent, rapid growth and fresh impact on the African or international scene.', section: 'Individual Excellence Awards', section_order: 1 },
  { num: 4, name: 'Best AfroDancer of the Year (Male)', description: 'Recognises the male dancer who has most powerfully embodied and advanced Afrodance — the family of movement styles rooted in African rhythm and culture, including Afrobeats dance, Afro-fusion and contemporary African popular dance forms.', section: 'Individual Excellence Awards', section_order: 1 },
  { num: 5, name: 'Best AfroDancer of the Year (Female)', description: 'Recognises the female dancer who has most powerfully embodied and advanced Afrodance. Celebrates artistic excellence, cultural authenticity and the role women play in leading, innovating and preserving African dance movement culture.', section: 'Individual Excellence Awards', section_order: 1 },
  { num: 6, name: 'Best Breaker – Diaspora', description: 'Awarded to the most outstanding B-Boy or B-Girl of African origin or heritage who is based outside the African continent. Recognises their excellence in Breaking and their role as a representative of African identity and culture on the global stage.', section: 'Individual Excellence Awards', section_order: 1 },
  { num: 7, name: 'Best AfroDancer – Diaspora', description: 'Awarded to the most outstanding Afrodancer of African origin or heritage who is based outside the African continent. Celebrates their artistic contribution to Afrodance globally and their role as a cultural bridge between the African diaspora and the continent.', section: 'Individual Excellence Awards', section_order: 1 },
  { num: 8, name: 'Best African Choreographer', description: 'Recognises the choreographer who has demonstrated the highest level of artistic vision, technical craft and cultural relevance in their work over the award year. Eligible works include stage productions, music videos, live performances and HipHop theatre — open to all street and urban dance styles rooted in African culture.', section: 'Choreography & Creativity Awards', section_order: 2 },
  { num: 9, name: 'Best Creation / HipHop Theatre Performance', description: 'Awarded to the most outstanding original theatre or stage dance production created within the HipHop and street dance tradition during the award year. Honours artistic ambition, storytelling, production quality and cultural depth — work that elevates street dance into a theatrical performance art form.', section: 'Choreography & Creativity Awards', section_order: 2 },
  { num: 10, name: 'Best Dance Video / Documentary (Africa)', description: 'Awarded to the best filmed work celebrating African street dance culture — whether a dance performance video, short film or documentary. Judged on creative direction, cinematography, cultural storytelling and the ability to capture the essence and energy of African street dance for a wider audience.', section: 'Choreography & Creativity Awards', section_order: 2 },
  { num: 11, name: 'Best Breaking / HipHop Crew', description: 'Presented to the most outstanding Breaking or HipHop dance crew on the African continent. Evaluated on collective skill, crew chemistry, competitive achievements, community contribution and overall impact on African Breaking and HipHop culture during the award year.', section: 'Group & Crew Awards', section_order: 3 },
  { num: 12, name: 'Best Afrodance Crew', description: "Awarded to the most impressive group or crew performing in Afrodance and African urban dance styles. Recognises synchronisation, creativity, cultural expression and the crew's ability to bring African rhythm and movement to life as a collective.", section: 'Group & Crew Awards', section_order: 3 },
  { num: 13, name: 'Best Traditional Dance Group', description: 'Recognises the group that has most powerfully preserved, presented and celebrated traditional African dance forms during the award year. Honours the role of traditional dance in maintaining cultural heritage, community identity and intergenerational knowledge.', section: 'Group & Crew Awards', section_order: 3 },
  { num: 14, name: 'Best Female Dance Crew', description: 'Dedicated to gender empowerment in African street dance culture. Presented to the most outstanding all-female or female-led dance crew — celebrating talent, discipline and the cultural impact of women who drive forward street dance culture across the continent as performers, leaders and role models.', section: 'Group & Crew Awards', section_order: 3 },
  { num: 15, name: 'Best Breaker – West Africa', description: "Awarded to the most outstanding B-Boy or B-Girl from West Africa, including Ghana, Nigeria, Senegal, Côte d'Ivoire, Mali, Guinea, Burkina Faso and surrounding nations. Judged on technical skill, competitive results, style and contribution to regional Breaking culture.", section: 'Regional Recognition Awards', section_order: 4 },
  { num: 16, name: 'Best Breaker – East Africa', description: 'Awarded to the most outstanding B-Boy or B-Girl from East Africa, including Kenya, Tanzania, Uganda, Ethiopia, Rwanda and surrounding nations. Recognises excellence, competitive achievement and the growing strength of Breaking culture across East Africa.', section: 'Regional Recognition Awards', section_order: 4 },
  { num: 17, name: 'Best Breaker – Central Africa', description: 'Awarded to the most outstanding B-Boy or B-Girl from Central Africa, including the Democratic Republic of Congo, Cameroon, Republic of Congo, Gabon and surrounding nations. Celebrates the distinctive energy and style of Central African Breaking culture.', section: 'Regional Recognition Awards', section_order: 4 },
  { num: 18, name: 'Best Breaker – Southern Africa', description: 'Awarded to the most outstanding B-Boy or B-Girl from Southern Africa, including South Africa, Zimbabwe, Mozambique, Zambia, Botswana and surrounding nations. Recognises technical mastery and the vibrant Breaking scenes of Southern Africa.', section: 'Regional Recognition Awards', section_order: 4 },
  { num: 19, name: 'Best Breaker – North Africa', description: 'Awarded to the most outstanding B-Boy or B-Girl from North Africa, including Egypt, Morocco, Algeria, Tunisia, Libya and surrounding nations. Celebrates the dynamic Breaking culture and distinctive movement language of North African breakers.', section: 'Regional Recognition Awards', section_order: 4 },
  { num: 20, name: 'Dance DJ of the Year', description: "Presented to the DJ who has made the most significant contribution to African street dance culture through music selections, event performances and cultural curation. Recognises the DJ's ability to move bodies, serve the culture and elevate the energy of Breaking, HipHop and Afrodance events across the continent and beyond.", section: 'Industry & Impact Awards', section_order: 5 },
  { num: 21, name: 'Dance Photographer of the Year', description: 'Awarded to the photographer who has most powerfully captured and communicated African street dance culture through their lens. Judged on technical excellence, artistic composition and the ability to freeze the power, emotion and storytelling of dance in a single image.', section: 'Industry & Impact Awards', section_order: 5 },
  { num: 22, name: 'Dance Videographer / Director of the Year', description: 'Recognises the videographer or director who has produced the most outstanding filmed content in service of African street dance culture. Celebrates technical skill, creative vision and the ability to grow the reach and visibility of the culture through moving image.', section: 'Industry & Impact Awards', section_order: 5 },
  { num: 23, name: 'Dance Educator of the Year', description: 'Awarded to the individual who has made the most outstanding contribution to dance education within African street dance culture — through teaching, mentoring, workshops, curriculum development or community outreach. Recognises those who sustain and grow the culture for the next generation.', section: 'Industry & Impact Awards', section_order: 5 },
  { num: 24, name: 'Dance Event / Competition of the Year', description: 'Presented to the event, festival or competition that made the greatest impact on African street dance culture during the award year. Judged on organisation, level of participation, cultural contribution, audience reach and lasting legacy for dancers and communities.', section: 'Industry & Impact Awards', section_order: 5 },
  { num: 25, name: 'Lifetime Achievement Award (African Dance)', description: 'The highest individual honour of the Afrobreak Culture Festival Awards. Presented to a figure who has dedicated their life to advancing African dance culture — as a dancer, choreographer, educator, organiser or leader. Recognises a career of sustained excellence, cultural contribution and lasting impact.', section: 'Industry & Impact Awards', section_order: 5 },
  { num: 26, name: 'African Dance Ambassador Award', description: "Awarded to the individual who has most effectively carried African dance culture to a global audience — promoting, representing and advocating for the continent's street and urban dance traditions on international stages, through media, partnerships and cultural exchange.", section: 'Industry & Impact Awards', section_order: 5 },
  { num: 27, name: 'The Great 8 — Pioneers of Breaking & HipHop in Africa', description: 'A unique and historic honour presented not as a competitive award but as a formal act of recognition and gratitude. The Great 8 acknowledges eight key personalities — B-Boys, B-Girls, organisers, educators, promoters or cultural leaders — whose vision, sacrifice and dedication were foundational to the establishment and growth of Breaking and HipHop culture on the African continent and in the global arena. The Great 8 are not nominees — they are legends, and this honour exists to ensure that the architects of African street dance culture are never forgotten.', section: 'The Great 8 · Special Honour', section_order: 6 },
]

// ── Champion types ────────────────────────────────────────────────
type Category = 'Boys' | 'Girls' | 'Regional' | 'Open'
type Champion = { id: string; name: string; country: string; flag: string; year: string; category: Category; photo: string; description: string; event: string }
type AwardCategory = { num: number; name: string; description: string; section: string; section_order: number; updated_at?: string }

const emptyChampion: Omit<Champion, 'id'> = { name: '', country: '', flag: '', year: new Date().getFullYear().toString(), category: 'Boys', photo: '', description: '', event: '' }
const catColors: Record<Category, string> = { Boys: 'bg-blue-500/15 text-blue-400 border-blue-500/20', Girls: 'bg-pink-500/15 text-pink-400 border-pink-500/20', Regional: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', Open: 'bg-purple-500/15 text-purple-400 border-purple-500/20' }
const ALL_CATS: Category[] = ['Boys', 'Girls', 'Regional', 'Open']

const defaultChampions = [
  { name: 'Zinji', country: 'Algeria', flag: '🇩🇿', year: '2025', category: 'Boys', photo: '', description: 'Zinji from Algeria claimed the AfroBreak Africa Final 2025 Boys title in a historic night at the Accra Sports Complex, representing North Africa at the highest level of continental breaking.', event: 'AfroBreak Africa Final — Accra, Ghana' },
  { name: 'Kris', country: 'Nigeria', flag: '🇳🇬', year: '2025', category: 'Girls', photo: '', description: 'Kris from Nigeria was crowned AfroBreak African Girls Champion 2025, bringing power, precision and pure Nigerian breaking energy to claim her place in the Hall of Champions.', event: 'AfroBreak Africa Final — Accra, Ghana' },
  { name: 'Pencil', country: 'Uganda', flag: '🇺🇬', year: '2025', category: 'Regional', photo: '', description: 'East Africa qualifier champion representing Uganda — one of the fastest-rising breaking scenes on the continent.', event: 'AfroBreak East Africa Qualifier — Kampala' },
  { name: 'David', country: 'Mauritius', flag: '🇲🇺', year: '2025', category: 'Regional', photo: '', description: 'Island nation champion. David put Mauritius on the breaking map with his qualifier win, bringing Indian Ocean culture to the AfroBreak stage.', event: 'AfroBreak Mauritius Qualifier' },
  { name: 'Lil Dan', country: 'Kenya', flag: '🇰🇪', year: '2025', category: 'Regional', photo: '', description: 'East Africa representative from Kenya. Lil Dan is a rising force in the Nairobi breaking community and a key figure in growing the culture across East Africa.', event: 'AfroBreak East Africa Qualifier' },
  { name: 'Blesso', country: 'Ghana', flag: '🇬🇭', year: '2025', category: 'Regional', photo: '', description: 'Home country hero. Blesso has consistently represented Ghana with distinction across multiple AfroBreak editions, earning his place among the continental elite.', event: 'AfroBreak Ghana Qualifier — Accra' },
  { name: 'Tris Naomi', country: 'Ghana', flag: '🇬🇭', year: '2025', category: 'Regional', photo: '', description: 'One of the most dominant female breakers on the continent. Tris Naomi has been a fixture in AfroBreak since 2023, consistently pushing the level of girls breaking in Ghana and Africa.', event: 'AfroBreak Ghana Qualifier — Accra' },
  { name: 'Blanchard', country: 'Ivory Coast', flag: '🇨🇮', year: '2025', category: 'Regional', photo: '', description: 'Ivory Coast champion and one of the standout talents from Francophone West Africa. Blanchard brings technical breaking and cultural depth to every performance.', event: 'AfroBreak Ivory Coast Qualifier — Abidjan' },
  { name: 'Smith', country: 'Benin', flag: '🇧🇯', year: '2024', category: 'Boys', photo: '', description: "Smith from Benin became AfroBreak African Champion 2024 with an electrifying performance at the Accra Sports Complex. One of West Africa's most consistent elite breakers and an ABA Global Ambassador.", event: 'AfroBreak Africa Final — Accra, Ghana' },
  { name: 'Courtnea Paul', country: 'South Africa', flag: '🇿🇦', year: '2024', category: 'Girls', photo: '', description: 'Courtnea Paul claimed the Girls title at AfroBreak Africa Final 2024, representing South Africa with style and power. A landmark moment for Southern African breaking.', event: 'AfroBreak Africa Final — Accra, Ghana' },
  { name: 'Dansi', country: 'Burkina Faso', flag: '🇧🇫', year: '2024', category: 'Regional', photo: '', description: "Dansi represents one of West Africa's most vibrant breaking scenes. His qualifier win in Ouagadougou showcased the depth of talent coming from Burkina Faso.", event: 'AfroBreak Burkina Faso Qualifier — Ouagadougou' },
  { name: 'ZH', country: 'Benin', flag: '🇧🇯', year: '2024', category: 'Regional', photo: '', description: 'Benin qualifier champion. ZH follows in the footsteps of compatriot Smith, proving that Benin is one of the most consistent breaking nations on the continent.', event: 'AfroBreak Benin Qualifier — Cotonou' },
  { name: 'Nagi', country: 'Ghana', flag: '🇬🇭', year: '2024', category: 'Regional', photo: '', description: 'Ghana qualifier champion 2024. Nagi brings creativity and explosive footwork to the battle floor, a key player in the Accra breaking scene.', event: 'AfroBreak Ghana Qualifier — Accra' },
  { name: 'Viks', country: 'Ghana', flag: '🇬🇭', year: '2024', category: 'Regional', photo: '', description: 'Girls qualifier champion from Ghana 2024. Viks is one of the leading female breakers in West Africa and a role model for the next generation of girl breakers.', event: 'AfroBreak Ghana Qualifier — Accra' },
  { name: 'Lil Vic', country: 'Nigeria', flag: '🇳🇬', year: '2023', category: 'Boys', photo: '', description: "Lil Vic from Nigeria became AfroBreak African Champion 2023 in a brilliant performance that showcased Nigerian breaking at its finest. A cultural ambassador for the movement across West Africa.", event: 'AfroBreak Africa Final — Accra, Ghana' },
  { name: 'Sandrine', country: 'Benin', flag: '🇧🇯', year: '2023', category: 'Girls', photo: '', description: 'Sandrine from Benin was crowned Girls champion at the AfroBreak Africa Final 2023, the second edition of the Girls category. Her win cemented Benin as a powerhouse of continental breaking.', event: 'AfroBreak Africa Final — Accra, Ghana' },
  { name: 'Chris Paul', country: 'Togo', flag: '🇹🇬', year: '2023', category: 'Regional', photo: '', description: "Qualifier champion from Lomé. Chris Paul is one of the faces of Togo's breaking scene — technical, creative, and consistent on the AfroBreak stage across multiple editions.", event: 'AfroBreak Togo Qualifier — Lomé' },
  { name: 'Zira', country: 'Togo', flag: '🇹🇬', year: '2023', category: 'Regional', photo: '', description: 'Girls qualifier champion from Togo. Zira is a standout female breaker from Lomé, proving that Togo punches above its weight in both boys and girls categories.', event: 'AfroBreak Togo Qualifier — Lomé' },
  { name: 'Ola', country: 'Benin', flag: '🇧🇯', year: '2023', category: 'Regional', photo: '', description: 'Benin qualifier champion 2023. Ola brings raw power and West African breaking culture to the floor, a respected name in the Cotonou dance community.', event: 'AfroBreak Benin Qualifier — Cotonou' },
  { name: 'Vicky', country: 'Nigeria', flag: '🇳🇬', year: '2023', category: 'Regional', photo: '', description: "Nigeria qualifier champion in the Girls category 2023. Vicky is part of Nigeria's growing pool of elite female breakers, trained and battle-tested on the AfroBreak circuit.", event: 'AfroBreak Nigeria Qualifier — Lagos' },
  { name: 'The Curse', country: 'South Africa', flag: '🇿🇦', year: '2023', category: 'Regional', photo: '', description: 'Southern Africa qualifier champion. The Curse represents the strength of South African breaking, a scene known for its power moves and distinctive style.', event: 'AfroBreak Southern Africa Qualifier' },
  { name: 'Blesso', country: 'Ghana', flag: '🇬🇭', year: '2023', category: 'Regional', photo: '', description: 'Multi-year qualifier champion from Ghana. Blesso is one of the most decorated breakers on the AfroBreak circuit and a pillar of the Accra breaking community.', event: 'AfroBreak Ghana Qualifier — Accra' },
  { name: 'Tris Naomi', country: 'Ghana', flag: '🇬🇭', year: '2023', category: 'Regional', photo: '', description: "Girls qualifier champion from Ghana 2023. Tris Naomi's consistency across multiple editions of AfroBreak makes her one of the most respected female competitors on the continent.", event: 'AfroBreak Ghana Qualifier — Accra' },
  { name: 'Pape', country: 'Senegal', flag: '🇸🇳', year: '2022', category: 'Boys', photo: '', description: 'Pape from Senegal was the inaugural AfroBreak African Champion in 2022, setting the standard for what African breaking excellence looks like on the continental stage.', event: 'AfroBreak Africa Final — Accra Cultural Centre, Ghana' },
  { name: 'Roxy', country: 'Ghana', flag: '🇬🇭', year: '2022', category: 'Regional', photo: '', description: 'Ghana qualifier champion 2022. Roxy was part of the founding generation of AfroBreak competitors — helping establish the event as the premier breaking platform in Africa.', event: 'AfroBreak Ghana Qualifier — Accra' },
]

export default function AdminAwardsPage() {
  const [tab, setTab] = useState<'champions' | 'categories'>('champions')

  // ── Champions state ──
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'create' | Champion>(null)
  const [form, setForm] = useState<Omit<Champion, 'id'>>(emptyChampion)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('All')
  const [filterCat, setFilterCat] = useState<'All' | Category>('All')
  const [dbError, setDbError] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [awardsLogo, setAwardsLogo] = useState('')
  const [savingLogo, setSavingLogo] = useState(false)
  const [logoSaved, setLogoSaved] = useState(false)

  // ── Award categories state ──
  const [awardCats, setAwardCats] = useState<AwardCategory[]>([])
  const [catsLoading, setCatsLoading] = useState(true)
  const [catsSeeding, setCatsSeeding] = useState(false)
  const [seedError, setSeedError] = useState('')
  const [editingCat, setEditingCat] = useState<number | null>(null)
  const [catForm, setCatForm] = useState({ name: '', description: '' })
  const [savingCat, setSavingCat] = useState(false)
  const [savedCat, setSavedCat] = useState<number | null>(null)
  const [catSearch, setCatSearch] = useState('')

  useEffect(() => {
    Promise.all([getChampions(), getSetting('awards_logo'), getAwardCategories()])
      .then(([data, logo, cats]) => {
        setChampions(data as Champion[])
        if (logo) setAwardsLogo(logo)
        setAwardCats(cats as AwardCategory[])
      })
      .catch(() => setDbError(true))
      .finally(() => { setLoading(false); setCatsLoading(false) })
  }, [])

  // ── Champions handlers ──
  const seedChampions = async () => {
    setSeeding(true)
    for (let i = 0; i < defaultChampions.length; i++) {
      await createChampion({ ...defaultChampions[i], id: `ch${Date.now()}${i}` } as Record<string, unknown>)
    }
    const data = await getChampions()
    setChampions(data as Champion[])
    setSeeding(false)
  }

  const saveLogo = async () => {
    setSavingLogo(true)
    await saveSetting('awards_logo', awardsLogo)
    setSavingLogo(false)
    setLogoSaved(true)
    setTimeout(() => setLogoSaved(false), 2000)
  }

  const years = ['All', ...Array.from(new Set(champions.map(c => c.year))).sort((a, b) => Number(b) - Number(a))]
  const filtered = champions.filter(c => {
    const q = search.toLowerCase()
    return (c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
      && (filterYear === 'All' || c.year === filterYear)
      && (filterCat === 'All' || c.category === filterCat)
  })

  const openCreate = () => { setForm(emptyChampion); setModal('create') }
  const openEdit = (c: Champion) => { setForm({ name: c.name, country: c.country, flag: c.flag, year: c.year, category: c.category, photo: c.photo, description: c.description, event: c.event }); setModal(c) }

  const handleSave = async () => {
    if (!form.name || !form.country || !form.year) return
    setSaving(true)
    if (modal === 'create') {
      const created = await createChampion(form as Record<string, unknown>)
      if (created) setChampions(prev => [created as Champion, ...prev])
    } else if (modal && typeof modal === 'object') {
      await updateChampion(modal.id, form as Record<string, unknown>)
      setChampions(prev => prev.map(c => c.id === (modal as Champion).id ? { ...c, ...form } : c))
    }
    setSaving(false); setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this champion?')) return
    await deleteChampion(id)
    setChampions(prev => prev.filter(c => c.id !== id))
  }

  const f = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  // ── Award categories handlers ──
  const seedCategories = async () => {
    setCatsSeeding(true)
    setSeedError('')
    try {
      await seedAwardCategories(SEED_CATEGORIES as unknown as Record<string, unknown>[])
      const data = await getAwardCategories()
      setAwardCats(data as AwardCategory[])
    } catch (e) {
      setSeedError(e instanceof Error ? e.message : 'Unknown error — check Supabase RLS policies')
    } finally {
      setCatsSeeding(false)
    }
  }

  const startEditCat = (cat: AwardCategory) => {
    setEditingCat(cat.num)
    setCatForm({ name: cat.name, description: cat.description || '' })
  }

  const saveCat = async (num: number) => {
    setSavingCat(true)
    const ok = await updateAwardCategory(num, { name: catForm.name, description: catForm.description })
    if (ok) {
      setAwardCats(prev => prev.map(c => c.num === num ? { ...c, name: catForm.name, description: catForm.description } : c))
      setSavedCat(num)
      setTimeout(() => setSavedCat(null), 2000)
    }
    setSavingCat(false)
    setEditingCat(null)
  }

  const filteredCats = awardCats.filter(c =>
    !catSearch || c.name.toLowerCase().includes(catSearch.toLowerCase()) || c.section.toLowerCase().includes(catSearch.toLowerCase())
  )

  const sections = Array.from(new Set(awardCats.map(c => c.section)))

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy size={22} className="text-amber-400" /> Awards Management
          </h1>
          <p className="text-text-secondary text-sm mt-1">Manage champions, categories and awards content</p>
        </div>
        {tab === 'champions' && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-background rounded-xl hover:bg-primary-400 transition-colors text-sm font-semibold">
            <Plus size={16} /> Add Champion
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 pb-0">
        {[
          { key: 'champions', label: 'Hall of Champions', icon: Crown },
          { key: 'categories', label: 'Award Categories', icon: BookOpen },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-all ${tab === key ? 'text-primary-400 border-primary-500 bg-primary-500/5' : 'text-text-secondary border-transparent hover:text-white'}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Hall of Champions ── */}
      {tab === 'champions' && (
        <div className="space-y-6">
          {/* Awards Logo */}
          <div className="p-5 bg-surface border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Image size={16} className="text-primary-500" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">AfroBreak Culture Awards Logo</h2>
            </div>
            <div className="flex items-end gap-6">
              <div className="flex-1 max-w-xs">
                <ImageUpload value={awardsLogo} onChange={setAwardsLogo} label="Awards Logo" folder="awards" />
              </div>
              {awardsLogo && (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <img src={awardsLogo} alt="Awards logo" className="w-full h-full object-contain" />
                  </div>
                  <button onClick={saveLogo} disabled={savingLogo} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-background rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-60">
                    {savingLogo ? <Loader2 size={14} className="animate-spin" /> : logoSaved ? <Check size={14} /> : <Save size={14} />}
                    {logoSaved ? 'Saved!' : 'Save Logo'}
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-text-muted mt-3">This logo appears at the top of the Awards page.</p>
          </div>

          {dbError && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300">
              <p className="font-semibold mb-1">Champions table not found in database.</p>
              <p className="text-amber-400/70 mb-2">Run this SQL in Supabase → SQL Editor:</p>
              <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto whitespace-pre-wrap">{`create table if not exists champions (
  id text primary key,
  name text not null,
  country text, flag text, year text, category text,
  photo text, description text, event text
);
alter table champions enable row level security;
create policy "Public read" on champions for select using (true);
create policy "Auth write" on champions for all to authenticated using (true) with check (true);`}</pre>
            </div>
          )}

          {!dbError && champions.length === 0 && (
            <div className="p-5 bg-primary-500/10 border border-primary-500/30 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-sm">Aucun champion dans la base de données</p>
                <p className="text-text-secondary text-xs mt-0.5">Importer les {defaultChampions.length} champions en un clic</p>
              </div>
              <button onClick={seedChampions} disabled={seeding} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-background rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-60 flex-shrink-0">
                {seeding ? <><div className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin" /> Importation...</> : '⬆ Charger les données'}
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input type="text" placeholder="Search champion or country..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-48 px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500" />
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500">
              {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
            </select>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value as typeof filterCat)} className="px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500">
              <option value="All">All categories</option>
              {ALL_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="flex items-center text-sm text-text-muted">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-text-muted">
              {champions.length === 0 ? 'No champions yet. Add the first one!' : 'No results match your filters.'}
            </div>
          ) : (
            <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider">Champion</th>
                    <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden sm:table-cell">Country</th>
                    <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden md:table-cell">Year</th>
                    <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden lg:table-cell">Category</th>
                    <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden xl:table-cell">Event</th>
                    <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {c.photo ? <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            : <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary-400">{c.name.charAt(0)}</div>}
                          <span className="text-white font-semibold text-sm">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-sm hidden sm:table-cell">{c.flag} {c.country}</td>
                      <td className="px-4 py-3 text-text-secondary text-sm hidden md:table-cell">{c.year}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${catColors[c.category] || 'bg-white/10 text-white/60 border-white/10'}`}>{c.category}</span>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs hidden xl:table-cell max-w-xs truncate">{c.event}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(c)} className="p-1.5 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-all"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Award Categories ── */}
      {tab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-text-secondary text-sm">Edit the name and description of each award category. Changes are reflected immediately on the public Awards page.</p>
            </div>
            {awardCats.length === 0 && !catsLoading && (
              <button onClick={seedCategories} disabled={catsSeeding} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-background rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-60">
                {catsSeeding ? <><Loader2 size={14} className="animate-spin" /> Loading…</> : '⬆ Load 27 categories'}
              </button>
            )}
          </div>

          {seedError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
              <p className="font-bold mb-1">Seed failed</p>
              <p className="font-mono text-xs">{seedError}</p>
            </div>
          )}

          {catsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : awardCats.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-white/5 rounded-2xl">
              <BookOpen size={40} className="text-text-muted mx-auto mb-4" />
              <p className="text-white font-bold mb-1">No categories in database yet</p>
              <p className="text-text-muted text-sm mb-6">Click "Load 27 categories" above to seed from the official document.</p>
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={catSearch} onChange={e => setCatSearch(e.target.value)} className="input-base pl-9 w-full text-sm" placeholder="Search category or section…" />
              </div>

              {/* Categories grouped by section */}
              <div className="space-y-4">
                {sections.map(section => {
                  const cats = filteredCats.filter(c => c.section === section)
                  if (cats.length === 0) return null
                  return (
                    <div key={section} className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
                      <div className="px-5 py-3 border-b border-white/5 bg-white/2">
                        <p className="text-sm font-bold text-white">{section}</p>
                        <p className="text-xs text-text-muted">{cats.length} {cats.length === 1 ? 'category' : 'categories'}</p>
                      </div>
                      <div className="divide-y divide-white/5">
                        {cats.map(cat => (
                          <div key={cat.num} className="p-4">
                            {editingCat === cat.num ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-black text-primary-400 bg-primary-500/10 rounded-lg px-2 py-1">#{cat.num < 10 ? `0${cat.num}` : cat.num}</span>
                                </div>
                                <div>
                                  <label className="block text-xs text-text-muted mb-1">Category Name</label>
                                  <input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} className="input-base w-full text-sm font-semibold" />
                                </div>
                                <div>
                                  <label className="block text-xs text-text-muted mb-1">Description</label>
                                  <textarea value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} className="input-base w-full text-sm resize-none" rows={4} />
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => saveCat(cat.num)} disabled={savingCat} className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-background rounded-xl text-sm font-bold hover:bg-primary-400 disabled:opacity-60 transition-all">
                                    {savingCat ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
                                  </button>
                                  <button onClick={() => setEditingCat(null)} className="px-4 py-2 bg-white/5 text-text-secondary rounded-xl text-sm hover:bg-white/10 transition-all">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-3 group">
                                <span className="text-xs font-black text-primary-400 bg-primary-500/10 rounded-lg px-2 py-1 flex-shrink-0 mt-0.5">#{cat.num < 10 ? `0${cat.num}` : cat.num}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-white">{cat.name}</p>
                                    {savedCat === cat.num && <span className="text-xs text-emerald-400 flex items-center gap-1"><Check size={11} /> Saved</span>}
                                  </div>
                                  <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-2">{cat.description}</p>
                                </div>
                                <button onClick={() => startEditCat(cat)} className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                                  <Pencil size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

        </div>
      )}

      {/* Champion modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-xl bg-surface border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{modal === 'create' ? 'Add Champion' : 'Edit Champion'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-white transition-all"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-text-muted mb-1.5">Name *</label><input value={form.name} onChange={f('name')} placeholder="e.g. Kwame" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" /></div>
                <div><label className="block text-xs text-text-muted mb-1.5">Country *</label><input value={form.country} onChange={f('country')} placeholder="e.g. Ghana" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs text-text-muted mb-1.5">Flag</label><input value={form.flag} onChange={f('flag')} placeholder="🇬🇭" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" /></div>
                <div><label className="block text-xs text-text-muted mb-1.5">Year *</label><input type="number" value={form.year} onChange={f('year')} placeholder="2026" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" /></div>
                <div><label className="block text-xs text-text-muted mb-1.5">Category</label>
                  <select value={form.category} onChange={f('category')} className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500">
                    {ALL_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-xs text-text-muted mb-1.5">Event</label><input value={form.event} onChange={f('event')} placeholder="e.g. AfroBreak Africa Final 2026 — Accra" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" /></div>
              <div><label className="block text-xs text-text-muted mb-1.5">Description</label><textarea value={form.description} onChange={f('description')} rows={3} placeholder="Short bio about the champion…" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white resize-none focus:outline-none focus:border-primary-500" /></div>
              <div><label className="block text-xs text-text-muted mb-1.5">Photo</label><ImageUpload value={form.photo} onChange={url => setForm(prev => ({ ...prev, photo: url }))} folder="champions" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 bg-white/5 text-text-secondary rounded-xl hover:bg-white/10 transition-colors text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.country} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-background rounded-xl hover:bg-primary-400 disabled:opacity-50 transition-colors text-sm font-semibold">
                {saving ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                {saving ? 'Saving…' : 'Save Champion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
