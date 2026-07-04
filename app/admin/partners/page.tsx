'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, X, Check, Handshake, GripVertical } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import Button from '@/components/ui/Button'
import { getPartners, createPartner, updatePartner, deletePartner } from '@/lib/db'

type Partner = {
  id: string
  name: string
  type: string
  logo_url: string
  website: string
  display_order: number
}

const emptyForm = { name: '', type: '', logo_url: '', website: '', display_order: 0 }

const SQL = `create table if not exists partners (
  id text primary key,
  name text not null,
  type text,
  logo_url text,
  website text,
  display_order integer default 0,
  created_at timestamp with time zone default now()
);
alter table partners enable row level security;
create policy "Public read partners" on partners for select using (true);
create policy "Auth manage partners" on partners for all to authenticated using (true) with check (true);`

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [dbError, setDbError] = useState(false)

  useEffect(() => {
    getPartners().then(data => {
      if (data === null) setDbError(true)
      else setPartners(data as Partner[])
      setLoading(false)
    })
  }, [])

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    if (editId) {
      const ok = await updatePartner(editId, form)
      if (ok) {
        setPartners(prev => prev.map(p => p.id === editId ? { ...p, ...form } : p))
        flash('Partner updated!')
      }
    } else {
      const created = await createPartner({ ...form, display_order: partners.length })
      if (created) {
        setPartners(prev => [...prev, created as Partner])
        flash('Partner added!')
      }
    }
    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    setEditId(null)
  }

  const handleEdit = (p: Partner) => {
    setForm({ name: p.name, type: p.type || '', logo_url: p.logo_url || '', website: p.website || '', display_order: p.display_order || 0 })
    setEditId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return
    const ok = await deletePartner(id)
    if (ok) setPartners(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Handshake size={22} className="text-primary-500" /> Partners & Sponsors
          </h1>
          <p className="text-text-secondary text-sm mt-1">Manage partner logos shown on the Partners page</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm) }}>
          {showForm && !editId ? 'Cancel' : 'Add Partner'}
        </Button>
      </div>

      {dbError && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300">
          <p className="font-semibold mb-2">Table <code>partners</code> not found. Run this SQL in Supabase:</p>
          <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto whitespace-pre-wrap">{SQL}</pre>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-4 mb-6">
          <Check size={16} /> {success}
        </div>
      )}

      {showForm && (
        <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-6 animate-slide-down">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit Partner' : 'Add Partner'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}
              className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Partner Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="KGL Foundation" className="input-base" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Type / Category</label>
                <input type="text" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  placeholder="Foundation, Sports, Cultural..." className="input-base" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-white mb-1.5">Website URL</label>
                <input type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="https://..." className="input-base" />
              </div>
              <div className="sm:col-span-2">
                <ImageUpload label="Partner Logo" value={form.logo_url} onChange={v => setForm(f => ({ ...f, logo_url: v }))} folder="partners" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" loading={saving}>{editId ? 'Update Partner' : 'Add Partner'}</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm) }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {partners.length === 0 && !dbError ? (
        <div className="text-center py-20">
          <Handshake size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">No partners yet. Add your first partner above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map(p => (
            <div key={p.id} className="bg-surface border border-white/5 rounded-2xl p-5 flex items-center gap-4 group hover:border-white/15 transition-all">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                {p.logo_url
                  ? <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain p-1" />
                  : <span className="text-2xl font-black text-text-muted">{p.name.charAt(0)}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{p.name}</p>
                {p.type && <p className="text-xs text-text-muted">{p.type}</p>}
                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-400 hover:underline truncate block">{p.website.replace('https://', '')}</a>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => handleEdit(p)} className="p-2 rounded-lg text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
