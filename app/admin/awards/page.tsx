'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, Trophy } from 'lucide-react'
import ImageUpload from '@/components/ui/ImageUpload'
import { getChampions, createChampion, updateChampion, deleteChampion } from '@/lib/db'

type Category = 'Boys' | 'Girls' | 'Regional' | 'Open'

type Champion = {
  id: string
  name: string
  country: string
  flag: string
  year: string
  category: Category
  photo: string
  description: string
  event: string
}

const empty: Omit<Champion, 'id'> = {
  name: '',
  country: '',
  flag: '',
  year: new Date().getFullYear().toString(),
  category: 'Boys',
  photo: '',
  description: '',
  event: '',
}

const categories: Category[] = ['Boys', 'Girls', 'Regional', 'Open']

const categoryColors: Record<Category, string> = {
  Boys: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Girls: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  Regional: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Open: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
}

export default function AdminAwardsPage() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'create' | Champion>(null)
  const [form, setForm] = useState<Omit<Champion, 'id'>>(empty)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('All')
  const [filterCat, setFilterCat] = useState<'All' | Category>('All')
  const [dbError, setDbError] = useState(false)

  useEffect(() => {
    getChampions()
      .then(data => { setChampions(data as Champion[]); setLoading(false) })
      .catch(() => { setDbError(true); setLoading(false) })
  }, [])

  const years = ['All', ...Array.from(new Set(champions.map(c => c.year))).sort((a, b) => Number(b) - Number(a))]

  const filtered = champions.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase())
    const matchYear = filterYear === 'All' || c.year === filterYear
    const matchCat = filterCat === 'All' || c.category === filterCat
    return matchSearch && matchYear && matchCat
  })

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit = (c: Champion) => {
    setForm({ name: c.name, country: c.country, flag: c.flag, year: c.year, category: c.category, photo: c.photo, description: c.description, event: c.event })
    setModal(c)
  }

  const handleSave = async () => {
    if (!form.name || !form.country || !form.year) return
    setSaving(true)
    if (modal === 'create') {
      const created = await createChampion(form as Record<string, unknown>)
      if (created) setChampions(prev => [created as Champion, ...prev])
    } else if (modal && typeof modal === 'object') {
      await updateChampion(modal.id, form as Record<string, unknown>)
      setChampions(prev => prev.map(c => c.id === (modal as Champion).id ? { ...c, ...form } : c))
    }
    setSaving(false)
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this champion?')) return
    await deleteChampion(id)
    setChampions(prev => prev.filter(c => c.id !== id))
  }

  const f = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy size={22} className="text-amber-400" /> Awards & Champions
          </h1>
          <p className="text-text-secondary text-sm mt-1">Manage the champions shown on the Awards page</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-400 transition-colors text-sm font-semibold"
        >
          <Plus size={16} /> Add Champion
        </button>
      </div>

      {dbError && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300">
          <p className="font-semibold mb-1">Champions table not found in database.</p>
          <p className="text-amber-400/70">Run this SQL in Supabase → SQL Editor:</p>
          <pre className="mt-2 text-xs bg-black/30 p-3 rounded-lg overflow-auto whitespace-pre-wrap">{`create table if not exists champions (
  id text primary key,
  name text not null,
  country text,
  flag text,
  year text,
  category text,
  photo text,
  desc text,
  event text
);
alter table champions enable row level security;
create policy "Public read champions" on champions for select using (true);
create policy "Auth write champions" on champions for all to authenticated using (true) with check (true);`}</pre>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search champion or country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500"
        />
        <select
          value={filterYear}
          onChange={e => setFilterYear(e.target.value)}
          className="px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
        >
          {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All years' : y}</option>)}
        </select>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value as typeof filterCat)}
          className="px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
        >
          <option value="All">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="flex items-center text-sm text-text-muted">{filtered.length} champion{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          {champions.length === 0 ? 'No champions yet. Add the first one!' : 'No results match your filters.'}
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider">Champion</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden sm:table-cell">Country</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden md:table-cell">Year</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden lg:table-cell">Category</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider hidden xl:table-cell">Event</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.photo ? (
                        <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary-400">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-white font-semibold text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-sm hidden sm:table-cell">
                    {c.flag} {c.country}
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-sm hidden md:table-cell">{c.year}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${categoryColors[c.category as Category] || 'bg-white/10 text-white/60 border-white/10'}`}>
                      {c.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs hidden xl:table-cell max-w-xs truncate">{c.event}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-xl bg-surface border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{modal === 'create' ? 'Add Champion' : 'Edit Champion'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Name *</label>
                  <input value={form.name} onChange={f('name')} placeholder="e.g. Kwame Asante" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Country *</label>
                  <input value={form.country} onChange={f('country')} placeholder="e.g. Ghana" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Flag emoji</label>
                  <input value={form.flag} onChange={f('flag')} placeholder="🇬🇭" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Year *</label>
                  <input type="number" value={form.year} onChange={f('year')} placeholder="2024" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Category</label>
                  <select value={form.category} onChange={f('category')} className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted mb-1.5">Event name</label>
                <input value={form.event} onChange={f('event')} placeholder="e.g. ABA Africa Finals 2024" className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500" />
              </div>

              <div>
                <label className="block text-xs text-text-muted mb-1.5">Description</label>
                <textarea value={form.description} onChange={f('description')} rows={3} placeholder="Short description about the champion..." className="w-full px-3 py-2 bg-background border border-white/10 rounded-xl text-sm text-white resize-none focus:outline-none focus:border-primary-500" />
              </div>

              <div>
                <label className="block text-xs text-text-muted mb-1.5">Photo</label>
                <ImageUpload
                  value={form.photo}
                  onChange={url => setForm(prev => ({ ...prev, photo: url }))}
                  folder="champions"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 bg-white/5 text-text-secondary rounded-xl hover:bg-white/10 transition-colors text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.country}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                {saving ? 'Saving...' : 'Save Champion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
