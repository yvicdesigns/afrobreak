'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, Loader2, Users, GripVertical, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/ui/ImageUpload'

type Instructor = {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  cover: string
  specialties: string[]
  location: string
  rating: number
  video_count: number
  followers: number
  display_order: number
}

const empty: Omit<Instructor, 'id'> = {
  name: '', role: '', bio: '', avatar: '', cover: '',
  specialties: [], location: '', rating: 5.0,
  video_count: 0, followers: 0, display_order: 0,
}

const SQL = `-- Run once in Supabase SQL editor
alter table instructors
  add column if not exists role text default '',
  add column if not exists cover text default '',
  add column if not exists location text default '',
  add column if not exists rating numeric default 5.0,
  add column if not exists display_order integer default 0;

-- If the table doesn't exist yet, create it:
create table if not exists instructors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text default '',
  bio text default '',
  avatar text default '',
  cover text default '',
  specialties jsonb default '[]',
  location text default '',
  rating numeric default 5.0,
  video_count integer default 0,
  followers integer default 0,
  display_order integer default 0,
  created_at timestamptz default now()
);
alter table instructors enable row level security;
create policy "Auth all instructors" on instructors for all to authenticated using (true) with check (true);
create policy "Anon read instructors" on instructors for select using (true);`

function SpecialtiesInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed])
    setInput('')
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="Add specialty (press Enter)"
          className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500"
        />
        <button type="button" onClick={add} className="px-3 py-2 bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded-lg text-sm hover:bg-primary-500/25 transition-colors">
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map(s => (
          <span key={s} className="flex items-center gap-1 px-2 py-1 bg-primary-500/10 text-primary-400 rounded-lg text-xs font-semibold">
            {s}
            <button type="button" onClick={() => onChange(value.filter(x => x !== s))} className="hover:text-red-400 transition-colors"><X size={11} /></button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)
  const [sqlCopied, setSqlCopied] = useState(false)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<Instructor, 'id'>>(empty)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () => {
    supabase.from('instructors').select('*').order('display_order', { ascending: true }).then(({ data, error }) => {
      if (error?.code === '42P01') { setDbError(true); setLoading(false); return }
      setInstructors(data || [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm({ ...empty, display_order: instructors.length })
    setEditId(null)
    setModal('add')
  }

  const openEdit = (inst: Instructor) => {
    setForm({
      name: inst.name, role: inst.role, bio: inst.bio,
      avatar: inst.avatar, cover: inst.cover,
      specialties: inst.specialties || [],
      location: inst.location, rating: inst.rating,
      video_count: inst.video_count, followers: inst.followers,
      display_order: inst.display_order,
    })
    setEditId(inst.id)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = {
      ...form,
      specialties: form.specialties,
      rating: Number(form.rating),
      video_count: Number(form.video_count),
      followers: Number(form.followers),
      display_order: Number(form.display_order),
    }
    if (modal === 'add') {
      const { data } = await supabase.from('instructors').insert(payload).select().single()
      if (data) setInstructors(prev => [...prev, data])
    } else if (editId) {
      await supabase.from('instructors').update(payload).eq('id', editId)
      setInstructors(prev => prev.map(i => i.id === editId ? { ...i, ...payload, id: editId } : i))
    }
    setSaving(false)
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this ambassador?')) return
    setDeleting(id)
    await supabase.from('instructors').delete().eq('id', id)
    setInstructors(prev => prev.filter(i => i.id !== id))
    setDeleting(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users size={22} className="text-primary-500" /> Instructors & Global Ambassadors
          </h1>
          <p className="text-text-secondary text-sm mt-1">{instructors.length} profiles · shown on /instructors</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-[#0D0A1A] rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors"
        >
          <Plus size={16} /> Add Ambassador
        </button>
      </div>

      {dbError && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Table needs migration. Run this SQL in Supabase:</p>
            <button
              onClick={() => { navigator.clipboard.writeText(SQL); setSqlCopied(true); setTimeout(() => setSqlCopied(false), 2000) }}
              className="text-xs px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
            >
              {sqlCopied ? '✓ Copied' : 'Copy SQL'}
            </button>
          </div>
          <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto max-h-40 whitespace-pre-wrap">{SQL}</pre>
        </div>
      )}

      {instructors.length === 0 && !dbError ? (
        <div className="text-center py-20">
          <Users size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-muted mb-4">No ambassadors yet. Add your first one!</p>
          <button onClick={openAdd} className="px-6 py-2.5 bg-primary-500 text-[#0D0A1A] rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors">
            Add Ambassador
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map(inst => (
            <div key={inst.id} className="bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
              {/* Cover */}
              <div className="relative h-32 bg-surface-2 overflow-hidden">
                {inst.cover && <img src={inst.cover} alt="" className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3 flex items-end gap-2.5">
                  {inst.avatar ? (
                    <img src={inst.avatar} alt={inst.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary-500/40 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center ring-2 ring-primary-500/40 flex-shrink-0 text-primary-400 font-bold">
                      {inst.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{inst.name}</p>
                    <p className="text-xs text-primary-400 leading-tight">{inst.role || 'Global Ambassador'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-text-secondary line-clamp-2">{inst.bio}</p>

                <div className="flex flex-wrap gap-1.5">
                  {(inst.specialties || []).slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-[10px] font-semibold rounded-lg">{s}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-gold-DEFAULT fill-gold-DEFAULT" />
                    <span>{inst.rating?.toFixed(1)}</span>
                  </div>
                  {inst.location && <span>{inst.location}</span>}
                  <span>#{inst.display_order + 1}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => openEdit(inst)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors text-xs font-semibold"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(inst.id)}
                    disabled={deleting === inst.id}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-xs font-semibold disabled:opacity-50"
                  >
                    {deleting === inst.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
              <h2 className="font-bold text-white text-lg">{modal === 'add' ? 'Add Ambassador' : 'Edit Ambassador'}</h2>
              <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-white/10 text-text-muted transition-colors"><X size={18} /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Name & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Bboy Lyricx" className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Role / Title</label>
                  <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="Global Ambassador — Breaking" className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3} placeholder="Short biography..." className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500 resize-none" />
              </div>

              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Avatar Photo</label>
                  <ImageUpload value={form.avatar} onChange={url => setForm(f => ({ ...f, avatar: url }))} label="Avatar" folder="avatars" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Cover / Banner</label>
                  <ImageUpload value={form.cover} onChange={url => setForm(f => ({ ...f, cover: url }))} label="Cover" folder="covers" />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Specialties</label>
                <SpecialtiesInput value={form.specialties} onChange={v => setForm(f => ({ ...f, specialties: v }))} />
              </div>

              {/* Location & Rating */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white mb-1.5">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Accra, Ghana" className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Rating (1–5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Videos</label>
                  <input type="number" min="0" value={form.video_count} onChange={e => setForm(f => ({ ...f, video_count: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Followers</label>
                  <input type="number" min="0" value={form.followers} onChange={e => setForm(f => ({ ...f, followers: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Display Order</label>
                  <input type="number" min="0" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-white/10 flex-shrink-0">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-text-secondary hover:text-white hover:border-white/30 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-500 text-[#0D0A1A] font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-60">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
