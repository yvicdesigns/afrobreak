'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Mail, Handshake, Star, Search, Trash2, Check, X, Eye, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type ContactMsg = {
  id: string; name: string; email: string; subject: string | null; message: string;
  read: boolean; created_at: string;
}
type PartnerInquiry = {
  id: string; name: string; email: string; org: string | null; message: string;
  partner_type: string | null; read: boolean; created_at: string;
}
type PartnerFeedback = {
  id: string; name: string; org: string | null; rating: number; message: string;
  created_at: string;
}

type Tab = 'contact' | 'inquiries' | 'feedback'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const SQL_MIGRATION = `-- Run once in Supabase SQL editor
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);
alter table contact_messages enable row level security;
create policy "Anon insert contact_messages" on contact_messages for insert with check (true);
create policy "Auth read contact_messages" on contact_messages for select to authenticated using (true);
create policy "Auth update contact_messages" on contact_messages for update to authenticated using (true);
create policy "Auth delete contact_messages" on contact_messages for delete to authenticated using (true);

create table if not exists partner_inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  org text,
  message text not null,
  partner_type text,
  read boolean default false,
  created_at timestamptz default now()
);
alter table partner_inquiries enable row level security;
create policy "Anon insert partner_inquiries" on partner_inquiries for insert with check (true);
create policy "Auth read partner_inquiries" on partner_inquiries for select to authenticated using (true);
create policy "Auth update partner_inquiries" on partner_inquiries for update to authenticated using (true);
create policy "Auth delete partner_inquiries" on partner_inquiries for delete to authenticated using (true);

create table if not exists partner_feedback (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  org text,
  rating integer not null check (rating between 1 and 5),
  message text not null,
  created_at timestamptz default now()
);
alter table partner_feedback enable row level security;
create policy "Anon insert partner_feedback" on partner_feedback for insert with check (true);
create policy "Auth read partner_feedback" on partner_feedback for select to authenticated using (true);
create policy "Auth delete partner_feedback" on partner_feedback for delete to authenticated using (true);`

export default function AdminMessagesPage() {
  const [tab, setTab] = useState<Tab>('contact')
  const [contact, setContact] = useState<ContactMsg[]>([])
  const [inquiries, setInquiries] = useState<PartnerInquiry[]>([])
  const [feedback, setFeedback] = useState<PartnerFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ContactMsg | PartnerInquiry | null>(null)
  const [sqlCopied, setSqlCopied] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('partner_inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('partner_feedback').select('*').order('created_at', { ascending: false }),
    ]).then(([c, i, f]) => {
      if (c.error && c.error.code === '42P01') { setDbError(true); setLoading(false); return }
      setContact(c.data || [])
      setInquiries(i.data || [])
      setFeedback(f.data || [])
      setLoading(false)
    })
  }, [])

  const markRead = async (table: string, id: string) => {
    await supabase.from(table).update({ read: true }).eq('id', id)
    if (table === 'contact_messages') setContact(p => p.map(m => m.id === id ? { ...m, read: true } : m))
    if (table === 'partner_inquiries') setInquiries(p => p.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const deleteMsg = async (table: string, id: string) => {
    await supabase.from(table).delete().eq('id', id)
    if (table === 'contact_messages') { setContact(p => p.filter(m => m.id !== id)); if ((selected as ContactMsg)?.id === id) setSelected(null) }
    if (table === 'partner_inquiries') { setInquiries(p => p.filter(m => m.id !== id)); if ((selected as PartnerInquiry)?.id === id) setSelected(null) }
    if (table === 'partner_feedback') setFeedback(p => p.filter(m => m.id !== id))
  }

  const exportCSV = () => {
    let rows: string[][]
    let filename: string
    if (tab === 'contact') {
      rows = [['Name','Email','Subject','Message','Read','Date'], ...filteredContact.map(m => [m.name, m.email, m.subject||'', m.message, m.read?'Yes':'No', formatDate(m.created_at)])]
      filename = 'contact_messages.csv'
    } else if (tab === 'inquiries') {
      rows = [['Name','Email','Org','Type','Message','Date'], ...filteredInquiries.map(m => [m.name, m.email, m.org||'', m.partner_type||'', m.message, formatDate(m.created_at)])]
      filename = 'partner_inquiries.csv'
    } else {
      rows = [['Name','Org','Rating','Message','Date'], ...filteredFeedback.map(m => [m.name, m.org||'', String(m.rating), m.message, formatDate(m.created_at)])]
      filename = 'partner_feedback.csv'
    }
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const q = search.toLowerCase()
  const filteredContact = contact.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.subject||'').toLowerCase().includes(q))
  const filteredInquiries = inquiries.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.org||'').toLowerCase().includes(q))
  const filteredFeedback = feedback.filter(m => m.name.toLowerCase().includes(q) || m.message.toLowerCase().includes(q))

  const unreadContact = contact.filter(m => !m.read).length
  const unreadInquiries = inquiries.filter(m => !m.read).length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MessageSquare size={22} className="text-primary-500" /> Messages & Inbox
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Contact messages, partner inquiries, and partner feedback
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
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Tables not found. Run this SQL in Supabase:</p>
            <button
              onClick={() => { navigator.clipboard.writeText(SQL_MIGRATION); setSqlCopied(true); setTimeout(() => setSqlCopied(false), 2000) }}
              className="text-xs px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
            >
              {sqlCopied ? '✓ Copied' : 'Copy SQL'}
            </button>
          </div>
          <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto max-h-48 whitespace-pre-wrap">{SQL_MIGRATION}</pre>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-white/5 rounded-2xl p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Mail size={11} /> Contact</p>
          <p className="text-2xl font-black text-white">{contact.length}</p>
          {unreadContact > 0 && <p className="text-xs text-primary-400 mt-0.5">{unreadContact} unread</p>}
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Handshake size={11} /> Partner Inquiries</p>
          <p className="text-2xl font-black text-white">{inquiries.length}</p>
          {unreadInquiries > 0 && <p className="text-xs text-primary-400 mt-0.5">{unreadInquiries} unread</p>}
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Star size={11} /> Feedback</p>
          <p className="text-2xl font-black text-white">{feedback.length}</p>
          {feedback.length > 0 && (
            <p className="text-xs text-gold mt-0.5">
              avg {(feedback.reduce((s,f) => s + f.rating, 0) / feedback.length).toFixed(1)} ★
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-white/5 rounded-xl p-1 w-fit">
        {([
          { id: 'contact', label: 'Contact Messages', icon: Mail, count: unreadContact },
          { id: 'inquiries', label: 'Partner Inquiries', icon: Handshake, count: unreadInquiries },
          { id: 'feedback', label: 'Feedback', icon: Star, count: 0 },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSearch(''); setSelected(null) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-primary-500/15 text-primary-400' : 'text-text-secondary hover:text-white'}`}
          >
            <t.icon size={14} />
            {t.label}
            {t.count > 0 && <span className="w-4 h-4 bg-primary-500 text-[#0D0A1A] text-[10px] font-black rounded-full flex items-center justify-center">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {tab === 'contact' && (
            filteredContact.length === 0
              ? <p className="text-text-muted text-sm py-10 text-center">No messages yet</p>
              : filteredContact.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelected(m); markRead('contact_messages', m.id) }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${(selected as ContactMsg)?.id === m.id ? 'border-primary-500/50 bg-primary-500/10' : 'border-white/5 bg-surface hover:border-white/10'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!m.read && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                        <p className={`text-sm font-semibold truncate ${!m.read ? 'text-white' : 'text-text-secondary'}`}>{m.name}</p>
                      </div>
                      <p className="text-xs text-text-muted truncate mt-0.5">{m.email}</p>
                      {m.subject && <p className="text-xs text-primary-400 truncate mt-0.5">{m.subject}</p>}
                      <p className="text-xs text-text-muted mt-1 line-clamp-2">{m.message}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteMsg('contact_messages', m.id) }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-[10px] text-text-muted mt-2">{formatDate(m.created_at)}</p>
                </button>
              ))
          )}
          {tab === 'inquiries' && (
            filteredInquiries.length === 0
              ? <p className="text-text-muted text-sm py-10 text-center">No partner inquiries yet</p>
              : filteredInquiries.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelected(m); markRead('partner_inquiries', m.id) }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${(selected as PartnerInquiry)?.id === m.id ? 'border-primary-500/50 bg-primary-500/10' : 'border-white/5 bg-surface hover:border-white/10'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!m.read && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                        <p className={`text-sm font-semibold truncate ${!m.read ? 'text-white' : 'text-text-secondary'}`}>{m.name}</p>
                      </div>
                      <p className="text-xs text-text-muted truncate mt-0.5">{m.email}</p>
                      {m.org && <p className="text-xs text-text-secondary truncate mt-0.5">{m.org}</p>}
                      {m.partner_type && <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-400 mt-1">{m.partner_type}</span>}
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteMsg('partner_inquiries', m.id) }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-[10px] text-text-muted mt-2">{formatDate(m.created_at)}</p>
                </button>
              ))
          )}
          {tab === 'feedback' && (
            filteredFeedback.length === 0
              ? <p className="text-text-muted text-sm py-10 text-center">No feedback yet</p>
              : filteredFeedback.map(m => (
                <div key={m.id} className="p-4 rounded-xl border border-white/5 bg-surface space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{m.name}</p>
                      {m.org && <p className="text-xs text-text-muted">{m.org}</p>}
                      <div className="flex gap-0.5 mt-1">
                        {[1,2,3,4,5].map(n => (
                          <Star key={n} size={13} className={n <= m.rating ? 'text-gold fill-gold' : 'text-white/20'} />
                        ))}
                      </div>
                    </div>
                    <button onClick={() => deleteMsg('partner_feedback', m.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{m.message}</p>
                  <p className="text-[10px] text-text-muted">{formatDate(m.created_at)}</p>
                </div>
              ))
          )}
        </div>

        {/* Detail pane — contact & inquiries only */}
        <div className="lg:col-span-3">
          {selected && tab !== 'feedback' ? (
            <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-sm text-primary-400 hover:text-primary-300 transition-colors">{selected.email}</a>
                  {'org' in selected && selected.org && <p className="text-sm text-text-secondary mt-0.5">{selected.org}</p>}
                  {'partner_type' in selected && selected.partner_type && (
                    <span className="inline-block text-xs px-3 py-0.5 rounded-full bg-primary-500/15 text-primary-400 mt-2">{selected.partner_type}</span>
                  )}
                  {'subject' in selected && selected.subject && (
                    <p className="text-sm font-semibold text-white mt-2">Re: {selected.subject}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`mailto:${selected.email}?subject=Re: AfroBreak`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded-lg text-xs font-semibold hover:bg-primary-500/25 transition-colors"
                  >
                    <Mail size={12} /> Reply
                  </a>
                  <button
                    onClick={() => deleteMsg(tab === 'contact' ? 'contact_messages' : 'partner_inquiries', selected.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="gradient-divider" />
              <div className="bg-background rounded-xl p-5">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <p className="text-xs text-text-muted">{formatDate(selected.created_at)}</p>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <Eye size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a message to read it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
