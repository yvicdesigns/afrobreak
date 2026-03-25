'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, Check, Lock, Unlock } from 'lucide-react'
import clsx from 'clsx'
import { getVideos, createVideo, updateVideo, deleteVideo } from '@/lib/db'
import type { Video, VideoCategory, VideoLevel } from '@/lib/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ImageUpload from '@/components/ui/ImageUpload'

const categories: VideoCategory[] = ['Afro', 'Hip-Hop', 'Tutorial', 'Dancehall', 'Contemporary', 'Kids']
const levels: VideoLevel[] = ['Beginner', 'Intermediate', 'Advanced']

const emptyForm = {
  title: '',
  description: '',
  videoUrl: '',
  thumbnail: '',
  category: 'Afro' as VideoCategory,
  level: 'Beginner' as VideoLevel,
  instructor: '',
  duration: '',
  isPremium: false,
  price: 0,
  tags: '',
}

type FormState = typeof emptyForm

export default function AdminVideosPage() {
  const [videoList, setVideoList] = useState<Video[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getVideos().then(setVideoList)
  }, [])

  const validate = (): boolean => {
    const errs: Partial<FormState> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.instructor.trim()) errs.instructor = 'Instructor is required'
    if (!form.videoUrl.trim()) errs.videoUrl = 'Video URL is required'
    if (!form.thumbnail.trim()) errs.thumbnail = 'Thumbnail URL is required'
    if (!form.duration.trim()) errs.duration = 'Duration is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)

    if (editId) {
      const ok = await updateVideo(editId, {
        title: form.title,
        description: form.description,
        videoUrl: form.videoUrl,
        thumbnail: form.thumbnail,
        category: form.category,
        level: form.level,
        instructor: form.instructor,
        duration: form.duration,
        isPremium: form.isPremium,
        price: form.isPremium ? form.price : undefined,
        tags,
      })
      if (ok) {
        setVideoList(prev => prev.map(v =>
          v.id === editId
            ? { ...v, title: form.title, description: form.description, videoUrl: form.videoUrl, thumbnail: form.thumbnail, category: form.category, level: form.level, instructor: form.instructor, duration: form.duration, isPremium: form.isPremium, price: form.isPremium ? form.price : undefined, tags }
            : v
        ))
        setSuccess('Video updated!')
      }
    } else {
      const created = await createVideo({
        title: form.title,
        description: form.description,
        videoUrl: form.videoUrl,
        thumbnail: form.thumbnail,
        category: form.category,
        level: form.level,
        instructor: form.instructor,
        duration: form.duration,
        isPremium: form.isPremium,
        price: form.isPremium ? form.price : undefined,
        tags,
      })
      if (created) {
        setVideoList(prev => [created, ...prev])
        setSuccess('Video added!')
      }
    }

    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    setEditId(null)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleEdit = (video: Video) => {
    setForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail,
      category: video.category,
      level: video.level,
      instructor: video.instructor,
      duration: video.duration,
      isPremium: video.isPremium,
      price: video.price ?? 0,
      tags: video.tags.join(', '),
    })
    setEditId(video.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this video?')) return
    const ok = await deleteVideo(id)
    if (ok) setVideoList(prev => prev.filter(v => v.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Videos</h1>
          <p className="text-text-secondary text-sm">{videoList.length} total videos</p>
        </div>
        <Button
          variant="primary" size="sm" leftIcon={<Plus size={14} />}
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm) }}
        >
          {showForm ? 'Cancel' : 'Add Video'}
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
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit Video' : 'Add New Video'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}
              className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Title" required value={form.title} onChange={v => setForm(f => ({...f, title: v}))} error={errors.title} placeholder="Enter video title" />
              <Field label="Instructor" required value={form.instructor} onChange={v => setForm(f => ({...f, instructor: v}))} error={errors.instructor} placeholder="Instructor name" />
              <div className="md:col-span-2">
                <Field label="Description" value={form.description} onChange={v => setForm(f => ({...f, description: v}))} placeholder="Describe the video..." textarea />
              </div>
              <Field label="Video URL" required value={form.videoUrl} onChange={v => setForm(f => ({...f, videoUrl: v}))} error={errors.videoUrl} placeholder="https://www.youtube.com/embed/..." />
              <ImageUpload label="Thumbnail *" value={form.thumbnail} onChange={v => setForm(f => ({...f, thumbnail: v}))} folder="thumbnails" />
              {errors.thumbnail && <p className="text-red-400 text-xs -mt-2">{errors.thumbnail}</p>}

              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as VideoCategory}))} className="input-base">
                  {categories.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Level *</label>
                <select value={form.level} onChange={e => setForm(f => ({...f, level: e.target.value as VideoLevel}))} className="input-base">
                  {levels.map(l => <option key={l} value={l} className="bg-surface">{l}</option>)}
                </select>
              </div>

              <Field label="Duration" required value={form.duration} onChange={v => setForm(f => ({...f, duration: v}))} error={errors.duration} placeholder="e.g. 24:30" />
              <Field label="Tags (comma-separated)" value={form.tags} onChange={v => setForm(f => ({...f, tags: v}))} placeholder="afrobeat, beginner, tutorial" />

              <div className="md:col-span-2 flex items-center gap-4">
                <button type="button" onClick={() => setForm(f => ({...f, isPremium: !f.isPremium}))}
                  className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                    form.isPremium ? 'bg-gold-DEFAULT/15 text-gold-DEFAULT border-gold-DEFAULT/40' : 'bg-surface-2 text-text-secondary border-white/10')}>
                  {form.isPremium ? <Lock size={15} /> : <Unlock size={15} />}
                  {form.isPremium ? 'Premium' : 'Free'}
                </button>
                {form.isPremium && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-text-secondary">Price (€)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: parseFloat(e.target.value)}))} min={0} step={0.99} className="input-base w-28" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <Button type="submit" variant="primary" loading={saving}>
                {editId ? 'Update Video' : 'Save Video'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Video</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Level</th>
                <th className="text-center p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</th>
                <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videoList.map(video => (
                <tr key={video.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-9 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">{video.title}</p>
                        <p className="text-xs text-text-secondary">{video.instructor} · {video.duration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell"><Badge label={video.category} variant={video.category} /></td>
                  <td className="p-4 hidden md:table-cell"><Badge label={video.level} variant={video.level} /></td>
                  <td className="p-4 text-center">
                    {video.isPremium
                      ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-DEFAULT/15 text-gold-DEFAULT text-[10px] font-bold"><Lock size={9} /> PREMIUM</span>
                      : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold"><Unlock size={9} /> FREE</span>
                    }
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(video)} className="p-2 rounded-lg text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(video.id)} className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, error, placeholder, required, textarea }: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; required?: boolean; textarea?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1.5">{label} {required && <span className="text-red-400">*</span>}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} className={`input-base resize-none ${error ? 'border-red-500/60' : ''}`} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`input-base ${error ? 'border-red-500/60' : ''}`} />
      }
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
