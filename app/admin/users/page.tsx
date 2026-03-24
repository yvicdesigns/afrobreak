'use client'

import { useState, useEffect } from 'react'
import { Users, Crown, Search, Mail } from 'lucide-react'
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
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  const premiumCount = users.filter(u => u.is_premium).length

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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-text-secondary text-sm">Loading users...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-text-secondary text-sm">No users found.</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
