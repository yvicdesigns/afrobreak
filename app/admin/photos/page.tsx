'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Check, Image } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'

const categories = ['Events', 'Classes', 'Battles', 'Backstage', 'Community']

const emptyForm = { src: '', title: '', category: 'Events', photographer: '', location: '' }
type FormState = typeof emptyForm
type PhotoRow = { id: string; src: string; title: string; category: string; photographer: string; location: string; [key: string]: string }

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<PhotoRow[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    supabase.from('photos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPhotos(data as PhotoRow[])
    })
  }, [])

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.src || !form.title) return
    setSaving(true)
    const { data, error } = await supabase.from('photos')
      .insert({ id: `ph${Date.now()}`, ...form })
      .select().single()
    if (!error && data) {
      setPhotos(prev => [data, ...prev])
      flash('Photo added!')
      setForm(emptyForm)
      setShowForm(false)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return
    await supabase.from('photos').delete().eq('id', id)
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Photos</h1>
          <p className="text-text-secondary text-sm">{photos.length} photos</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}
          onClick={() => { setForm(emptyForm); setShowForm(!showForm) }}>
          {showForm ? 'Cancel' : 'Add Photo'}
        </Button>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-4">
          <Check size={16} /> {success}
        </div>
      )}

      {showForm && (
        <div className="bg-surface border border-white/10 rounded-2xl p-6 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Add New Photo</h2>
            <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"><X size={18} /></button>
          </div>

          {/* Preview */}
          {form.src && (
            <div className="mb-5 w-40 h-28 rounded-xl overflow-hidden border border-white/10">
              <img src={form.src} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <ImageUpload label="Photo *" value={form.src} onChange={v => setForm(f => ({ ...f, src: v }))} folder="photos" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Title <span className="text-red-400">*</span></label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Photo title" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-base">
                  {categories.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Photographer</label>
                <input type="text" value={form.photographer} onChange={e => setForm(f => ({ ...f, photographer: e.target.value }))} placeholder="AfroBreak Media" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Location</label>
                <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Paris" className="input-base" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <Button type="submit" variant="primary" loading={saving}>Save Photo</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-16 text-center">
          <Image size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">No photos yet. Add your first photo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all aspect-square">
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button onClick={() => handleDelete(photo.id)} className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold truncate">{photo.title}</p>
                  <p className="text-white/50 text-[10px]">{photo.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
