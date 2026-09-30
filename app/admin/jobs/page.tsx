'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, MapPin, Clock, Briefcase } from 'lucide-react'
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/db'
import { supabase } from '@/lib/supabase'

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

const empty: Omit<Job, 'id'> = {
  title: '', department: '', location: '', type: 'Full-time',
  description: '', requirements: [], active: true
}

const SQL = `create table if not exists jobs (
  id text primary key,
  title text not null,
  department text,
  location text,
  type text default 'Full-time',
  description text,
  requirements jsonb default '[]',
  active boolean default true,
  created_at timestamptz default now()
);
alter table jobs add column if not exists active boolean default true;
alter table jobs enable row level security;
create policy "Public read jobs" on jobs for select using (true);
create policy "Auth write jobs" on jobs for all to authenticated using (true) with check (true);`

const defaultJobs: Omit<Job, 'id'>[] = [
  { title: 'Photographer', department: 'Creative', location: 'Accra / Remote', type: 'Full-time', active: true, description: "Capture the energy, culture, and emotion of AfroBreak events, workshops, and artists. Your images will tell the story of Africa's breaking movement to the world.", requirements: ['3+ years professional photography experience', 'Strong portfolio in events, dance, or sports photography', 'Proficiency in Adobe Lightroom / Photoshop', 'Based in or near Accra, Ghana'] },
  { title: 'Editorial Director', department: 'Editorial', location: 'Accra / Remote', type: 'Full-time', active: true, description: "Lead AfroBreak's editorial vision across digital content, blog, press releases, and brand communications. Shape how we tell the story of breaking and hiphop culture in Africa.", requirements: ['5+ years editorial or content leadership experience', 'Deep knowledge of African music and dance culture', 'Fluent in English', 'Experience managing writers and creative contributors'] },
  { title: 'Content & Video Producer', department: 'Content', location: 'Accra', type: 'Full-time', active: true, description: 'Lead the production of dance tutorials, event recaps, and documentary content. Work directly with our instructor team and Global Ambassadors to create world-class video content.', requirements: ['3+ years video production experience', 'Experience with dance or sports content', 'Proficiency in Adobe Premiere or Final Cut Pro', 'Strong eye for cultural authenticity'] },
  { title: 'Creative Writer', department: 'Editorial', location: 'Accra / Remote', type: 'Part-time', active: true, description: 'Write compelling articles, artist profiles, event coverage, and cultural pieces for the AfroBreak platform and blog. Bring breaking culture to life through words.', requirements: ['Strong writing and storytelling skills', 'Passion for Afro and urban dance culture', 'Experience writing for digital media or blogs', 'Ability to deliver quality work on deadline'] },
  { title: 'Marketing Manager', department: 'Marketing', location: 'Accra / Remote', type: 'Full-time', active: true, description: "Drive growth through digital marketing, event promotion, partnerships, and community campaigns. Own AfroBreak's acquisition and retention strategy across Africa and the diaspora.", requirements: ['4+ years digital marketing experience', 'Experience with cultural or community-led brands', 'Strong understanding of social media (Instagram, TikTok, YouTube)', 'Data-driven approach with creative sensibility'] },
  { title: 'Community Manager', department: 'Community', location: 'Accra / Remote', type: 'Full-time', active: true, description: 'Build and manage the AfroBreak community across online platforms and in-person events. Engage members, onboard new participants, and create a welcoming space for dancers, artists, and hiphop practitioners across Africa.', requirements: ['2+ years community management experience', 'Deep passion for hiphop and dance culture', 'Excellent communication skills in English', 'Experience managing social media communities and events'] },
  { title: 'Coach', department: 'Training', location: 'Accra', type: 'Full-time', active: true, description: 'Lead training sessions and camps for dancers at all levels — from youth beginners to competitive athletes. Work alongside our instructors and Global Ambassadors to develop talent and prepare participants for local and international competitions.', requirements: ['Proven coaching experience in dance or sports', 'Knowledge of breaking, hiphop, and Afro dance disciplines', 'Ability to motivate and develop young athletes', 'Experience with competition preparation and performance training'] },
  { title: 'Instructor', department: 'Training', location: 'Accra / Remote', type: 'Part-time', active: true, description: "Teach dance classes and workshops in person and online. Deliver high-quality instruction in breaking, hiphop, Afro dance, or related styles to students of all ages and skill levels, representing AfroBreak's values of culture, excellence, and empowerment.", requirements: ['Proficiency in at least one hiphop/breaking/Afro dance style', 'Experience teaching or facilitating dance workshops', 'Ability to engage and inspire diverse groups', 'Passion for cultural education and youth development'] },
]

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)
  const [sqlCopied, setSqlCopied] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [seedError, setSeedError] = useState<string | null>(null)
  const [modal, setModal] = useState<null | 'create' | Job>(null)
  const [form, setForm] = useState<Omit<Job, 'id'>>(empty)
  const [reqInput, setReqInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Use direct supabase to properly detect table-not-found (42P01)
    supabase.from('jobs').select('*').order('title').then(({ data, error }) => {
      if (error?.code === '42P01') setDbError(true)
      else setJobs((data || []) as Job[])
      setLoading(false)
    })
  }, [])

  const seedDefaults = async () => {
    setSeeding(true)
    setSeedError(null)
    for (const { active: _ignored, ...rest } of defaultJobs) {
      const { error } = await supabase.from('jobs').insert({
        id: crypto.randomUUID(),
        ...rest,
      })
      if (error) {
        setSeedError(error.message)
        setSeeding(false)
        return
      }
    }
    const { data } = await supabase.from('jobs').select('*').order('title')
    setJobs((data || []) as Job[])
    setSeeding(false)
  }

  const openCreate = () => { setForm(empty); setReqInput(''); setModal('create') }
  const openEdit = (j: Job) => {
    setForm({ title: j.title, department: j.department, location: j.location, type: j.type, description: j.description, requirements: j.requirements || [], active: j.active })
    setReqInput('')
    setModal(j)
  }

  const addRequirement = () => {
    if (!reqInput.trim()) return
    setForm(f => ({ ...f, requirements: [...f.requirements, reqInput.trim()] }))
    setReqInput('')
  }
  const removeReq = (i: number) => setForm(f => ({ ...f, requirements: f.requirements.filter((_, idx) => idx !== i) }))

  const handleSave = async () => {
    setSaving(true)
    if (modal === 'create') {
      const created = await createJob(form as Record<string, unknown>)
      if (created) setJobs(prev => [...prev, created as Job])
    } else if (modal && typeof modal === 'object') {
      await updateJob(modal.id, form as Record<string, unknown>)
      setJobs(prev => prev.map(j => j.id === (modal as Job).id ? { ...j, ...form } : j))
    }
    setSaving(false)
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job?')) return
    await deleteJob(id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const toggleActive = async (job: Job) => {
    await updateJob(job.id, { active: !job.active })
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, active: !j.active } : j))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2"><Briefcase size={22} className="text-primary-500" /> Job Listings</h1>
          <p className="text-text-secondary text-sm mt-1">Manage open positions shown on the Careers page · {jobs.length} postes</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-[#0D0A1A] rounded-xl hover:bg-primary-400 transition-colors text-sm font-semibold">
          <Plus size={16} /> Add Job
        </button>
      </div>

      {dbError && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Table not found. Run this SQL in Supabase:</p>
            <button onClick={() => { navigator.clipboard.writeText(SQL); setSqlCopied(true); setTimeout(() => setSqlCopied(false), 2000) }}
              className="text-xs px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors">
              {sqlCopied ? '✓ Copied' : 'Copy SQL'}
            </button>
          </div>
          <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto max-h-40 whitespace-pre-wrap">{SQL}</pre>
        </div>
      )}

      {!dbError && jobs.length === 0 && !loading && (
        <div className="mb-6 p-5 bg-primary-500/10 border border-primary-500/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold text-sm">Aucun poste dans la base de données</p>
              <p className="text-text-secondary text-xs mt-0.5">Importer les {defaultJobs.length} postes actuels du site en un clic</p>
            </div>
            <button
              onClick={seedDefaults}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-[#0D0A1A] rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-60 flex-shrink-0"
            >
              {seeding ? <><div className="w-3.5 h-3.5 border-2 border-[#0D0A1A] border-t-transparent rounded-full animate-spin" /> Importation...</> : '⬆ Charger les données du site'}
            </button>
          </div>
          {seedError && <p className="text-red-400 text-xs">Erreur lors de l'import : {seedError}</p>}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : jobs.length === 0 && !dbError ? (
        <div className="text-center py-20 text-text-secondary">No job listings yet.</div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className={`p-5 bg-surface border rounded-2xl transition-all ${job.active ? 'border-white/5 hover:border-white/15' : 'border-white/5 opacity-60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-white">{job.title}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${job.type === 'Full-time' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>{job.type}</span>
                    {!job.active && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/5 text-text-muted">Inactive</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {job.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(job)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${job.active ? 'bg-white/5 hover:bg-white/10 text-text-secondary' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'}`}>
                    {job.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => openEdit(job)} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(job.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modal === 'create' ? 'Add Job' : 'Edit Job'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Job Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-base" placeholder="e.g. Senior Developer" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1">Department</label>
                <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="input-base" placeholder="Engineering" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-base">
                  {['Full-time', 'Part-time', 'Internship', 'Freelance'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Location</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="input-base" placeholder="Paris / Remote" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-base resize-none" placeholder="What this role involves..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Requirements</label>
              <div className="flex gap-2 mb-2">
                <input value={reqInput} onChange={e => setReqInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRequirement())} className="input-base flex-1" placeholder="Add a requirement then press Enter" />
                <button onClick={addRequirement} className="px-3 py-2 bg-primary-500/20 text-primary-400 rounded-xl text-sm hover:bg-primary-500/30 transition-colors">Add</button>
              </div>
              <div className="space-y-1">
                {form.requirements.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg text-sm text-text-secondary">
                    <span className="flex-1">{r}</span>
                    <button onClick={() => removeReq(i)} className="text-text-muted hover:text-red-400 transition-colors"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-primary-500" />
                <span className="text-sm text-white">Active (visible on careers page)</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-[#0D0A1A] rounded-xl text-sm font-semibold transition-colors">
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
