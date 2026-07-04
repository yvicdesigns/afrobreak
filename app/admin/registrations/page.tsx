'use client'

import { useState, useEffect } from 'react'
import { Users, Download, Search, Mail, Phone, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Registration = {
  id: string
  event_id: string
  event_title: string
  name: string
  email: string
  phone?: string
  amount_paid: number
  status: string
  created_at: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterEvent, setFilterEvent] = useState('All')
  const [dbError, setDbError] = useState(false)

  useEffect(() => {
    supabase
      .from('event_registrations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { setDbError(true); setLoading(false); return }
        setRegistrations(data || [])
        setLoading(false)
      })
  }, [])

  const events = ['All', ...Array.from(new Set(registrations.map(r => r.event_title))).sort()]

  const filtered = registrations.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    const matchEvent = filterEvent === 'All' || r.event_title === filterEvent
    return matchSearch && matchEvent
  })

  const exportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Phone', 'Event', 'Amount Paid', 'Status', 'Date'],
      ...filtered.map(r => [r.name, r.email, r.phone || '', r.event_title, r.amount_paid, r.status, formatDate(r.created_at)])
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'registrations.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users size={22} className="text-primary-500" /> Event Registrations
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            All people who registered for AfroBreak events — your contact database
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/25 transition-colors text-sm font-semibold"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {dbError && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300">
          <p className="font-semibold mb-2">Table <code>event_registrations</code> not found. Run this SQL in Supabase:</p>
          <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto whitespace-pre-wrap">{`create table if not exists event_registrations (
  id uuid default gen_random_uuid() primary key,
  event_id text,
  event_title text,
  name text not null,
  email text not null,
  phone text,
  amount_paid numeric default 0,
  paystack_ref text,
  status text default 'confirmed',
  created_at timestamp with time zone default now()
);
alter table event_registrations enable row level security;
create policy "Anon insert registrations" on event_registrations for insert with check (true);
create policy "Auth read registrations" on event_registrations for select to authenticated using (true);`}</pre>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface border border-white/5 rounded-2xl p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-black text-white">{registrations.length}</p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Free</p>
          <p className="text-2xl font-black text-emerald-400">{registrations.filter(r => r.amount_paid === 0).length}</p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Paid</p>
          <p className="text-2xl font-black text-primary-500">{registrations.filter(r => r.amount_paid > 0).length}</p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Events</p>
          <p className="text-2xl font-black text-white">{events.length - 1}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={filterEvent}
          onChange={e => setFilterEvent(e.target.value)}
          className="px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
        >
          {events.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <span className="flex items-center text-sm text-text-muted">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">
            {registrations.length === 0 ? 'No registrations yet. Share your event links to start collecting data!' : 'No results match your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider text-left">Person</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider text-left hidden md:table-cell">Event</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider text-left hidden sm:table-cell">Amount</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider text-left hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-xs text-text-muted uppercase tracking-wider text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-400">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{r.name}</p>
                        <a href={`mailto:${r.email}`} className="text-xs text-text-muted hover:text-primary-400 transition-colors flex items-center gap-1">
                          <Mail size={10} /> {r.email}
                        </a>
                        {r.phone && (
                          <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                            <Phone size={10} /> {r.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-white truncate max-w-[200px]">{r.event_title}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={r.amount_paid === 0 ? 'text-emerald-400 text-sm font-semibold' : 'text-white text-sm font-semibold'}>
                      {r.amount_paid === 0 ? 'Free' : `₵${r.amount_paid}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-text-secondary flex items-center gap-1">
                      <Calendar size={11} /> {formatDate(r.created_at)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
