'use client'

import { useState, useEffect } from 'react'
import { Users, Crown, Search, Mail, X, Check, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  name: string
  avatar: string | null
  is_premium: boolean
  subscription_end: string | null
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState<UserProfile | null>(null)
  const [editPremium, setEditPremium] = useState(false)
  const [editEndDate, setEditEndDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setUsers(data)
        setLoading(false)
      })
  }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  )

  const premiumCount = users.filter(u => u.is_premium).length

  const openEdit = (user: UserProfile) => {
    setEditUser(user)
    setEditPremium(user.is_premium)
    // Default end date: 1 year from now if enabling, or existing date
    if (user.subscription_end) {
      setEditEndDate(user.subscription_end.slice(0, 10))
    } else {
      const d = new Date()
      d.setFullYear(d.getFullYear() + 1)
      setEditEndDate(d.toISOString().slice(0, 10))
    }
  }

  const handleSave = async () => {
    if (!editUser) return
    setSaving(true)
    const updates = {
      is_premium: editPremium,
      subscription_end: editPremium && editEndDate ? new Date(editEndDate).toISOString() : null,
    }
    await supabase.from('profiles').update(updates).eq('id', editUser.id)
    setUsers(prev => prev.map(u =>
      u.id === editUser.id
        ? { ...u, is_premium: editPremium, subscription_end: updates.subscription_end }
        : u
    ))
    setSaving(false)
    setEditUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-text-secondary text-sm">{users.length} total · {premiumCount} premium</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <Users size={18} className="text-primary-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{users.length}</p>
            <p className="text-xs text-text-secondary">Total Users</p>
          </div>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/10 flex items-center justify-center">
            <Crown size={18} className="text-gold-DEFAULT" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{premiumCount}</p>
            <p className="text-xs text-text-secondary">Premium Members</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-base pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">User</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Joined</th>
                <th className="text-center p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Plan</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Expires</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary text-sm">Loading users...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary text-sm">No users found.</td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {user.avatar
                            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            : <span className="text-sm font-bold text-primary-400">{user.name?.[0]?.toUpperCase()}</span>
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-text-muted flex items-center gap-1">
                            <Mail size={10} /> {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-xs text-text-secondary">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {user.is_premium
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-DEFAULT/15 text-gold-DEFAULT text-[10px] font-bold"><Crown size={9} /> PREMIUM</span>
                        : <span className="px-2 py-0.5 rounded-full bg-white/5 text-text-secondary text-[10px] font-bold">FREE</span>
                      }
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-xs text-text-secondary">
                        {user.subscription_end
                          ? new Date(user.subscription_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openEdit(user)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Premium Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h2 className="font-bold text-white">Edit Membership</h2>
                <p className="text-xs text-text-muted">{editUser.name}</p>
              </div>
              <button onClick={() => setEditUser(null)} className="p-2 rounded-xl hover:bg-white/10 text-text-muted transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Premium Access</p>
                  <p className="text-xs text-text-muted">Unlock all premium content</p>
                </div>
                <button
                  onClick={() => setEditPremium(!editPremium)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${editPremium ? 'bg-gold-DEFAULT' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${editPremium ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Subscription end date */}
              {editPremium && (
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Access Until</label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={e => setEditEndDate(e.target.value)}
                    className="input-base"
                    min={new Date().toISOString().slice(0, 10)}
                  />
                  <p className="text-xs text-text-muted mt-1">User loses premium access after this date.</p>
                </div>
              )}

              {!editPremium && editUser.is_premium && (
                <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  This will remove premium access immediately.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setEditUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-text-secondary hover:text-white hover:border-white/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold-DEFAULT hover:bg-gold-dark text-background font-bold text-sm transition-colors disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Check size={15} /> Save</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
