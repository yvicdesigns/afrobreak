'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/db'

type Member = {
  id: string
  name: string
  role: string
  avatar: string
  bio: string
  display_order: number
}

const empty: Omit<Member, 'id'> = { name: '', role: '', avatar: '', bio: '', display_order: 0 }

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<null | 'create' | Member>(null)
  const [form, setForm] = useState<Omit<Member, 'id'>>(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getTeamMembers().then(data => { setMembers(data as Member[]); setLoading(false) })
  }, [])

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit = (m: Member) => { setForm({ name: m.name, role: m.role, avatar: m.avatar, bio: m.bio, display_order: m.display_order }); setModal(m) }

  const handleSave = async () => {
    setSaving(true)
    if (modal === 'create') {
      const created = await createTeamMember(form as Record<string, unknown>)
      if (created) setMembers(prev => [...prev, created as Member])
    } else if (modal && typeof modal === 'object') {
      await updateTeamMember(modal.id, form as Record<string, unknown>)
      setMembers(prev => prev.map(m => m.id === (modal as Member).id ? { ...m, ...form } : m))
    }
    setSaving(false)
    setModal(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    await deleteTeamMember(id)
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Team Members</h1>
          <p className="text-text-secondary text-sm mt-1">Manage the team shown on the About page</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-400 transition-colors text-sm font-semibold">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="text-text-secondary text-center py-20">Loading...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">No team members yet. Add your first one!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(m => (
            <div key={m.id} className="bg-surface border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                {m.avatar ? (
                  <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-lg flex-shrink-0">
                    {m.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{m.name}</p>
                  <p className="text-primary-400 text-xs truncate">{m.role}</p>
                </div>
              </div>
              <p className="text-text-secondary text-xs line-clamp-2 mb-4">{m.bio}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(m)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs transition-colors">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(m.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modal === 'create' ? 'Add Team Member' : 'Edit Team Member'}</h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-base" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white mb-1">Role *</label>
                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="input-base" placeholder="e.g. Founder & CEO" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Avatar URL</label>
              <input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="input-base" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Bio</label>
              <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="input-base resize-none" placeholder="Short bio..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Display Order</label>
              <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))} className="input-base" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
                <Save size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
