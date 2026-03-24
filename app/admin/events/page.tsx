'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, Check, Euro } from 'lucide-react'
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/lib/db'
import type { Event, EventType } from '@/lib/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const eventTypes: EventType[] = ['Workshop', 'Class', 'Show', 'Battle']

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  city: '',
  type: 'Workshop' as EventType,
  price: 0,
  image: '',
  instructor: '',
  capacity: 30,
  tags: '',
}

type FormState = typeof emptyForm

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminEventsPage() {
  const [eventList, setEventList] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getEvents().then(setEventList)
  }, [])

  const validate = () => {
    const errs: Partial<FormState> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.date) errs.date = 'Date is required'
    if (!form.time) errs.time = 'Time is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.instructor.trim()) errs.instructor = 'Instructor is required'
    if (!form.image.trim()) errs.image = 'Image URL is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)

    if (editId) {
      const ok = await updateEvent(editId, {
        title: form.title, description: form.description, date: form.date,
        time: form.time, location: form.location, city: form.city,
        type: form.type, price: form.price, image: form.image,
        instructor: form.instructor, capacity: form.capacity, tags,
      })
      if (ok) {
        setEventList(prev => prev.map(ev =>
          ev.id === editId
            ? { ...ev, title: form.title, description: form.description, date: form.date, time: form.time, location: form.location, city: form.city, type: form.type, price: form.price, image: form.image, instructor: form.instructor, capacity: form.capacity, tags }
            : ev
        ))
        setSuccess('Event updated!')
      }
    } else {
      const created = await createEvent({
        title: form.title, description: form.description, date: form.date,
        time: form.time, location: form.location, city: form.city,
        type: form.type, price: form.price, image: form.image,
        instructor: form.instructor, capacity: form.capacity, tags,
      })
      if (created) {
        setEventList(prev => [created, ...prev])
        setSuccess('Event created!')
      }
    }

    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    setEditId(null)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleEdit = (event: Event) => {
    setForm({
      title: event.title, description: event.description, date: event.date,
      time: event.time, location: event.location, city: event.city,
      type: event.type, price: event.price, image: event.image,
      instructor: event.instructor, capacity: event.capacity,
      tags: event.tags.join(', '),
    })
    setEditId(event.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return
    const ok = await deleteEvent(id)
    if (ok) setEventList(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-text-secondary text-sm">{eventList.length} total events</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm) }}>
          {showForm ? 'Cancel' : 'Add Event'}
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
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit Event' : 'Create Event'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}
              className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                  placeholder="Event title" className={`input-base ${errors.title ? 'border-red-500/60' : ''}`} />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  placeholder="Describe the event..." rows={3} className="input-base resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                  className={`input-base ${errors.date ? 'border-red-500/60' : ''}`} />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Time *</label>
                <input type="time" value={form.time} onChange={e => setForm(f => ({...f, time: e.target.value}))}
                  className={`input-base ${errors.time ? 'border-red-500/60' : ''}`} />
                {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Venue *</label>
                <input type="text" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))}
                  placeholder="Studio/venue name" className={`input-base ${errors.location ? 'border-red-500/60' : ''}`} />
                {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">City *</label>
                <input type="text" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
                  placeholder="Paris, Lyon..." className={`input-base ${errors.city ? 'border-red-500/60' : ''}`} />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Event Type *</label>
                <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value as EventType}))} className="input-base">
                  {eventTypes.map(t => <option key={t} value={t} className="bg-surface">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Instructor *</label>
                <input type="text" value={form.instructor} onChange={e => setForm(f => ({...f, instructor: e.target.value}))}
                  placeholder="Instructor name" className={`input-base ${errors.instructor ? 'border-red-500/60' : ''}`} />
                {errors.instructor && <p className="text-red-400 text-xs mt-1">{errors.instructor}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5 flex items-center gap-1"><Euro size={13} /> Price (0 = Free)</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: parseFloat(e.target.value)}))} min={0} step={1} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Capacity</label>
                <input type="number" value={form.capacity} onChange={e => setForm(f => ({...f, capacity: parseInt(e.target.value)}))} min={1} className="input-base" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1.5">Image URL *</label>
                <input type="url" value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))}
                  placeholder="https://images.unsplash.com/..." className={`input-base ${errors.image ? 'border-red-500/60' : ''}`} />
                {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1.5">Tags (comma-separated)</label>
                <input type="text" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))}
                  placeholder="workshop, paris, afro" className="input-base" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <Button type="submit" variant="primary" loading={saving}>{editId ? 'Update Event' : 'Create Event'}</Button>
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
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Event</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">City</th>
                <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                <th className="text-center p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Spots</th>
                <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventList.map(event => (
                <tr key={event.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">{event.title}</p>
                        <p className="text-xs text-text-secondary">{event.instructor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell"><Badge label={event.type} variant={event.type} /></td>
                  <td className="p-4 hidden md:table-cell text-sm text-text-secondary">{formatDate(event.date)} at {event.time}</td>
                  <td className="p-4 hidden lg:table-cell text-sm text-text-secondary">{event.city}</td>
                  <td className="p-4 text-right text-sm text-white">
                    {event.price === 0 ? <span className="text-emerald-400">Free</span> : `€${event.price}`}
                  </td>
                  <td className="p-4 text-center text-xs text-text-secondary">{event.registered}/{event.capacity}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(event)} className="p-2 rounded-lg text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
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
