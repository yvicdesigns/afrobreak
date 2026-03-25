'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, ExternalLink } from 'lucide-react'
import { getPresscoverage, createPressCoverage, updatePressCoverage, deletePressCoverage } from '@/lib/db'

type PressItem = {
  id: string
  outlet: string
  title: string
  date: string
  type: string
  logo: string
  url: string
}

const empty: Omit<PressItem, 'id'> = { outlet: '', title: '', date: '', type: 'Feature', logo: '📰', url: '' }

export default function AdminPressPage() {
  const [items, setItems] = useState<PressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'create' | PressItem>(null)
  const [form, setForm] = useState<Omit<PressItem, 'id'>>(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getPresscoverage().then(data => { setItems(data as PressItem[]); setLoading(false) })
  }, [])

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit = (p: PressItem) => {
    setForm({ outlet: p.outlet, title: p.title, date: p.date, type: p.type, logo: p.logo, url: p.url })
    setModal(p)
  }

  const handleSave = async () => {
    setSaving(true)
    if (modal === 'create') {
      const created = await createPressCoverage(form as Record<string, unknown>)
      if (created) setItems(prev => [created as PressItem, ...prev])
    } else if (modal && typeof modal === 'object') {
      await updatePressCoverage(modal.id, form as Record<string, unknown>)
      setItems(prev => prev.map(p => p.id === (modal as PressItem).id ? { ...p, ...form } : p))
    }
    setSaving(false)
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this press item?')) return
    await deletePressCoverage(id)
    setItems(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Press Coverage</h1>
          <p className="text-text-secondary text-sm mt-1">Manage press coverage shown on the Press page</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-400 transition-colors text-sm font-semibold">
          <Plus size={16} /> Add Coverage
        </button>
      </div>

      {loading ? (
        <div className="text-text-secondary text-center py-20">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">No press coverage yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-surface border border-white/5 rounded-2xl hover:border-white/15 transition-all">
              <span className="text-2xl flex-shrink-0">{item.logo}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-white text-sm">{item.outlet}</span>
                  <span className="px-2 py-0.5 bg-primary-500/15 text-primary-400 text-[10px] font-bold rounded-full">{item.type}</span>
                </div>
                <p className="text-text-secondary text-sm truncate">{item.title}</p>
                <p className="text-text-muted text-xs mt-0.5">{item.date}</p>
              </div>
              {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary-400 transition-colors"><ExternalLink size={14} /></a>}
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modal === 'create' ? 'Add Press Coverage' : 'Edit Press Coverage'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1">Outlet *</label>
                <input value={form.outlet} onChange={e => setForm(f => ({ ...f, outlet: e.target.value }))} className="input-base" placeholder="e.g. Le Monde" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-base">
                  {['Feature', 'News', 'Interview', 'List', 'Review'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Headline *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-base" placeholder="Article headline..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1">Date</label>
                <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="input-base" placeholder="e.g. March 2025" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white mb-1">Logo Emoji</label>
                <input value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} className="input-base" placeholder="📰" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Article URL</label>
              <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className="input-base" placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.outlet || !form.title} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
