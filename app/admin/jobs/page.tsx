'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, MapPin, Clock } from 'lucide-react'
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/db'

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

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'create' | Job>(null)
  const [form, setForm] = useState<Omit<Job, 'id'>>(empty)
  const [reqInput, setReqInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getJobs().then(data => { setJobs(data as Job[]); setLoading(false) })
  }, [])

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
          <h1 className="text-2xl font-black text-white">Job Listings</h1>
          <p className="text-text-secondary text-sm mt-1">Manage open positions shown on the Careers page</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-400 transition-colors text-sm font-semibold">
          <Plus size={16} /> Add Job
        </button>
      </div>

      {loading ? (
        <div className="text-text-secondary text-center py-20">Loading...</div>
      ) : jobs.length === 0 ? (
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
              <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
