'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react'
import { getSetting, saveSetting } from '@/lib/db'
import ImageUpload from '@/components/ui/ImageUpload'

// ── Types ────────────────────────────────────────────────────────
type Stat = { value: string; label: string }
type Testimonial = { quote: string; name: string; title: string; avatar: string }
type TimelineItem = { year: string; title: string; desc: string }

// ── Defaults (mirrors about page) ────────────────────────────────
const defaultStats: Stat[] = [
  { value: '28+', label: 'African Countries' },
  { value: '2021', label: 'Championship Founded' },
  { value: '270+', label: 'Events Organized' },
  { value: '11K+', label: 'Beneficiaries' },
]

const defaultTestimonials: Testimonial[] = [
  { quote: "Winning AfroBreak wasn't just about the title — it was about proving to myself and my community that African breakers have a global voice. What I love about AfroBreak is it's not just about battling. It's about community building. The workshops, the organizers are very receptive, good floor, ambulance to take care of dancers, the energy — they invest in you beyond the stage. I left with new skills, friends across the continent, and big dreams.", name: 'Lil Vic', title: 'AfroBreak African Champion 2023', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
  { quote: "Before AfroBreak, I was only dancing in crews. The training camp and workshops by Africa Breaking Academy changed my whole mindset and perspective. I got mentored by Bboy Lyricx, learned new styles, and even gained educational scholarships to complete my education. I'm not just a dancer now.", name: 'Tris Naomi', title: 'AfroBreak Ghana National & Ivorie Breaking Competition African Champion 2023', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
  { quote: "AfroBreak changed everything for me. I was lucky enough to represent Benin three consecutive years at the event. After winning, I received international exposure, mentorship, and even a chance to travel for a cultural exchange program. It was more than a competition — it was a life-changer.", name: 'Bboy Smith', title: 'AfroBreak African and France Champion 2024', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
]

const defaultTimeline: TimelineItem[] = [
  { year: '2021', title: 'AfroBreak International Championship', desc: 'Launched the biggest platform for Ghanaian and African talents to learn, contest and compete at an international level, leveraging the momentum of breaking entering the Olympics.' },
  { year: '2022', title: 'Continental Expansion', desc: 'Grew to 17+ African country collaborators. Dancers from DR Congo, Ivory Coast, Nigeria, Togo, Senegal, Kenya, Uganda, South Africa and more joined the AfroBreak family.' },
  { year: '2023', title: 'Africa Final & Champions', desc: 'Hosted the most prestigious break dance event on the continent. Lil Vic became AfroBreak African Champion. Tris Naomi dominated at national and international level.' },
  { year: '2024', title: 'Paris Olympics Recognition', desc: 'Bboy Lyricx was inducted into the Hall of Fame at the Paris 2024 Olympic and Paralympic Games through the Future Leaders Invitation Program (PIPA) on Sports and Diplomacy.' },
  { year: '2025', title: 'AfroBreak 5th Edition', desc: 'Zinji (Algeria) and Kris (Nigeria) crowned AfroBreak African Champions at the 5th Africa Final. Algeria joins the continental map as a breaking powerhouse. 22+ nations represented.' },
  { year: '2026', title: 'Dakar Youth Olympics', desc: "Preparing Africa's finest breakers for the Dakar 2026 Youth Olympics Games as breaking cements its place as one of the most youthful sports in the world." },
]

// ── Section wrapper ───────────────────────────────────────────────
function Section({ title, subtitle, open, onToggle, children, onSave, saving, saved }: {
  title: string; subtitle: string; open: boolean; onToggle: () => void
  children: React.ReactNode; onSave: () => void; saving: boolean; saved: boolean
}) {
  return (
    <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors">
        <div className="text-left">
          <p className="font-bold text-white">{title}</p>
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        </div>
        {open ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-white/5">
          <div className="pt-5">{children}</div>
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/5">
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-400 disabled:opacity-60 transition-colors text-sm font-semibold"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
            </button>
            {saved && <p className="text-xs text-emerald-400">Changes will appear on the About page.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function AdminAboutPage() {
  const [openSection, setOpenSection] = useState<string | null>('stats')

  // Stats
  const [stats, setStats] = useState<Stat[]>(defaultStats)
  const [statsSaving, setStatsSaving] = useState(false)
  const [statsSaved, setStatsSaved] = useState(false)

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const [testSaving, setTestSaving] = useState(false)
  const [testSaved, setTestSaved] = useState(false)

  // Timeline
  const [timeline, setTimeline] = useState<TimelineItem[]>(defaultTimeline)
  const [tlSaving, setTlSaving] = useState(false)
  const [tlSaved, setTlSaved] = useState(false)

  // Pioneer photo
  const [pioneerPhoto, setPioneerPhoto] = useState('')
  const [pioneerSaving, setPioneerSaving] = useState(false)
  const [pioneerSaved, setPioneerSaved] = useState(false)

  useEffect(() => {
    getSetting('about_stats').then(v => { if (v) try { setStats(JSON.parse(v)) } catch {} })
    getSetting('about_testimonials').then(v => { if (v) try { setTestimonials(JSON.parse(v)) } catch {} })
    getSetting('about_timeline').then(v => { if (v) try { setTimeline(JSON.parse(v)) } catch {} })
    getSetting('pioneer_photo').then(v => { if (v) setPioneerPhoto(v) })
  }, [])

  const saveStats = async () => {
    setStatsSaving(true)
    await saveSetting('about_stats', JSON.stringify(stats))
    setStatsSaving(false); setStatsSaved(true)
    setTimeout(() => setStatsSaved(false), 3000)
  }

  const saveTestimonials = async () => {
    setTestSaving(true)
    await saveSetting('about_testimonials', JSON.stringify(testimonials))
    setTestSaving(false); setTestSaved(true)
    setTimeout(() => setTestSaved(false), 3000)
  }

  const saveTimeline = async () => {
    setTlSaving(true)
    await saveSetting('about_timeline', JSON.stringify(timeline))
    setTlSaving(false); setTlSaved(true)
    setTimeout(() => setTlSaved(false), 3000)
  }

  const savePioneerPhoto = async () => {
    setPioneerSaving(true)
    await saveSetting('pioneer_photo', pioneerPhoto)
    setPioneerSaving(false); setPioneerSaved(true)
    setTimeout(() => setPioneerSaved(false), 3000)
  }

  const toggle = (s: string) => setOpenSection(o => o === s ? null : s)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">About Page</h1>
        <p className="text-text-secondary text-sm mt-1">Edit the stats, testimonials, and timeline shown on the About page</p>
      </div>

      <div className="space-y-4">

        {/* ── STATS ── */}
        <Section title="Key Statistics" subtitle="The 4 numbers shown in the Who We Are section" open={openSection === 'stats'} onToggle={() => toggle('stats')} onSave={saveStats} saving={statsSaving} saved={statsSaved}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-background rounded-xl p-4 border border-white/5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-text-muted uppercase tracking-wider mb-1.5">Value</label>
                    <input
                      value={s.value}
                      onChange={e => setStats(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                      placeholder="28+"
                      className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-text-muted uppercase tracking-wider mb-1.5">Label</label>
                    <input
                      value={s.label}
                      onChange={e => setStats(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                      placeholder="African Countries"
                      className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── TESTIMONIALS ── */}
        <Section title="Testimonials" subtitle="Quotes from AfroBreak champions and participants" open={openSection === 'testimonials'} onToggle={() => toggle('testimonials')} onSave={saveTestimonials} saving={testSaving} saved={testSaved}>
          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-background rounded-xl p-4 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Testimonial #{i + 1}</p>
                  <button onClick={() => setTestimonials(prev => prev.filter((_, j) => j !== i))} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] text-text-muted mb-1">Quote</label>
                  <textarea
                    value={t.quote}
                    onChange={e => setTestimonials(prev => prev.map((x, j) => j === i ? { ...x, quote: e.target.value } : x))}
                    rows={3}
                    className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-white resize-none focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-text-muted mb-1">Name</label>
                    <input value={t.name} onChange={e => setTestimonials(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Bboy Name" className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-text-muted mb-1">Title</label>
                    <input value={t.title} onChange={e => setTestimonials(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} placeholder="AfroBreak Champion 2024" className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500" />
                  </div>
                </div>
                <div>
                  <ImageUpload label="Photo" value={t.avatar} onChange={v => setTestimonials(prev => prev.map((x, j) => j === i ? { ...x, avatar: v } : x))} folder="avatars" />
                </div>
              </div>
            ))}
            <button
              onClick={() => setTestimonials(prev => [...prev, { quote: '', name: '', title: '', avatar: '' }])}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/10 transition-colors w-full justify-center"
            >
              <Plus size={15} /> Add Testimonial
            </button>
          </div>
        </Section>

        {/* ── TIMELINE ── */}
        <Section title="Timeline (Our Journey)" subtitle="The year-by-year history shown on the About page" open={openSection === 'timeline'} onToggle={() => toggle('timeline')} onSave={saveTimeline} saving={tlSaving} saved={tlSaved}>
          <div className="space-y-3">
            {timeline.map((item, i) => (
              <div key={i} className="bg-background rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Entry #{i + 1}</p>
                  <button onClick={() => setTimeline(prev => prev.filter((_, j) => j !== i))} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-text-muted mb-1">Year</label>
                    <input value={item.year} onChange={e => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, year: e.target.value } : x))} placeholder="2024" className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-primary-500" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-text-muted mb-1">Title</label>
                    <input value={item.title} onChange={e => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} placeholder="Milestone title" className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-[11px] text-text-muted mb-1">Description</label>
                  <textarea value={item.desc} onChange={e => setTimeline(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} rows={2} className="w-full px-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-white resize-none focus:outline-none focus:border-primary-500" />
                </div>
              </div>
            ))}
            <button
              onClick={() => setTimeline(prev => [...prev, { year: '', title: '', desc: '' }])}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/10 transition-colors w-full justify-center"
            >
              <Plus size={15} /> Add Timeline Entry
            </button>
          </div>
        </Section>

        {/* ── PIONEER PHOTO ── */}
        <Section title="Pioneer Photo (Bboy Lyricx)" subtitle="Photo displayed in the Founder section on the About page" open={openSection === 'pioneer'} onToggle={() => toggle('pioneer')} onSave={savePioneerPhoto} saving={pioneerSaving} saved={pioneerSaved}>
          <div className="space-y-4">
            <p className="text-xs text-text-muted">Upload a photo of Bboy Lyricx. If empty, initials "BL" are shown instead.</p>
            <ImageUpload label="Bboy Lyricx Photo" value={pioneerPhoto} onChange={setPioneerPhoto} folder="team" />
            {pioneerPhoto && (
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl border border-white/5">
                <img src={pioneerPhoto} alt="Bboy Lyricx" className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-semibold text-white">Bboy Lyricx</p>
                  <p className="text-xs text-text-muted">Co-Founder, Africa Breaking Academy</p>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Team note */}
        <div className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-5">
          <p className="text-sm text-white font-semibold mb-1">Team Members</p>
          <p className="text-xs text-text-secondary">Team member photos, names, roles and bios are managed separately in the <a href="/admin/team" className="text-primary-400 hover:underline">Team section</a>.</p>
        </div>
      </div>
    </div>
  )
}
