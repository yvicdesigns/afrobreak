'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Check, Image, Edit3, ExternalLink } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'

const categories = ['Events', 'Workshops', 'Battles', 'Schools Outreach', 'Community']

const emptyForm = { src: '', title: '', category: 'Events', photographer: '', location: '' }
type FormState = typeof emptyForm
type PhotoRow = { id: string; src: string; title: string; category: string; photographer: string; location: string }

const SQL = `create table if not exists photos (
  id text primary key,
  src text not null,
  title text,
  category text default 'Events',
  photographer text,
  location text,
  created_at timestamp with time zone default now()
);
alter table photos enable row level security;
create policy "Public read photos" on photos for select using (true);
create policy "Auth manage photos" on photos for all to authenticated using (true) with check (true);`

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<PhotoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [dbError, setDbError] = useState(false)

  useEffect(() => {
    supabase.from('photos').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) { setDbError(true); setLoading(false); return }
      setPhotos((data || []) as PhotoRow[])
      setLoading(false)
    })
  }, [])

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (p: PhotoRow) => {
    setForm({ src: p.src, title: p.title, category: p.category, photographer: p.photographer || '', location: p.location || '' })
    setEditId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.src || !form.title) return
    setSaving(true)

    if (editId) {
      const { error } = await supabase.from('photos').update(form).eq('id', editId)
      if (!error) {
        setPhotos(prev => prev.map(p => p.id === editId ? { ...p, ...form } : p))
        flash('Photo updated!')
      }
    } else {
      const { data, error } = await supabase.from('photos')
        .insert({ id: `ph${Date.now()}`, ...form })
        .select().single()
      if (!error && data) {
        setPhotos(prev => [data as PhotoRow, ...prev])
        flash('Photo added!')
      }
    }

    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    setEditId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return
    await supabase.from('photos').delete().eq('id', id)
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Image size={22} className="text-primary-500" /> Gallery Photos
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {photos.length} photos — these appear on the <a href="/photos" target="_blank" className="text-primary-400 hover:underline inline-flex items-center gap-1">public gallery <ExternalLink size={11} /></a>
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={openAdd}>
          Add Photo
        </Button>
      </div>

      {dbError && (
        <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-sm text-amber-300">
          <p className="font-semibold mb-2">Table <code>photos</code> not found. Run this SQL in your Supabase dashboard:</p>
          <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto whitespace-pre-wrap">{SQL}</pre>
          <p className="text-xs mt-2 text-amber-400/70">After running it, refresh this page.</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-4">
          <Check size={16} /> {success}
        </div>
      )}

      {showForm && (
        <div className="bg-surface border border-white/10 rounded-2xl p-6 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit Photo' : 'Add New Photo'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}
              className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <ImageUpload label="Photo *" value={form.src} onChange={v => setForm(f => ({ ...f, src: v }))} folder="photos" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="AfroBreak Africa Final 2025" className="input-base" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-base">
                  {categories.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Photographer</label>
                <input type="text" value={form.photographer} onChange={e => setForm(f => ({ ...f, photographer: e.target.value }))}
                  placeholder="AfroBreak Media" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Location</label>
                <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Accra, Ghana" className="input-base" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <Button type="submit" variant="primary" loading={saving}>{editId ? 'Update Photo' : 'Add to Gallery'}</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {!dbError && photos.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-16 text-center">
          <Image size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-white font-semibold mb-1">No photos yet</p>
          <p className="text-text-secondary text-sm mb-6">Upload your first photo — it will appear immediately on the public gallery.</p>
          <Button variant="primary" leftIcon={<Plus size={14} />} onClick={openAdd}>Add First Photo</Button>
        </div>
      ) : !dbError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all aspect-square bg-surface">
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-1">
                  <button onClick={() => openEdit(photo)}
                    className="p-1.5 rounded-lg bg-blue-500/80 text-white hover:bg-blue-500 transition-all">
                    <Edit3 size={12} />
                  </button>
                  <button onClick={() => handleDelete(photo.id)}
                    className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold truncate">{photo.title}</p>
                  <p className="text-white/60 text-[10px]">{photo.category}{photo.location ? ` · ${photo.location}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
