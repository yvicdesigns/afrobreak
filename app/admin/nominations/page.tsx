'use client'

import { useState, useEffect } from 'react'
import { Trophy, Search, Trash2, X, ChevronDown, Mail, Phone, Loader2, Download, UserPlus, CheckCircle } from 'lucide-react'
import { getNominations, updateNominationStatus, deleteNomination } from '@/lib/db'

type Nomination = {
  id: string
  created_at: string
  status: string
  nominator_name: string
  nominator_email: string
  nominator_phone?: string
  nominator_country?: string
  relationship_to_nominee?: string
  category: string
  category_num?: string
  section?: string
  nominee_name: string
  nominee_stage_name?: string
  nominee_gender?: string
  nominee_country?: string
  nominee_city?: string
  nominee_region?: string
  nominee_email?: string
  nominee_phone?: string
  nominee_social_links?: string
  support_links?: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  reviewed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
}

export default function AdminNominationsPage() {
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number } | null>(null)
  const [recovering, setRecovering] = useState(false)
  const [recoverResult, setRecoverResult] = useState<{ total: number; saved: number } | null>(null)

  useEffect(() => {
    getNominations().then(data => { setNominations(data as Nomination[]); setLoading(false) })
  }, [])

  const filtered = nominations.filter(n => {
    if (statusFilter !== 'all' && n.status !== statusFilter) return false
    if (sectionFilter !== 'all' && n.section !== sectionFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!n.nominee_name.toLowerCase().includes(q) && !n.nominator_name.toLowerCase().includes(q) && !n.category.toLowerCase().includes(q)) return false
    }
    return true
  })

  const sections = Array.from(new Set(nominations.map(n => n.section).filter(Boolean)))

  const changeStatus = async (id: string, status: string) => {
    setUpdating(id)
    const ok = await updateNominationStatus(id, status)
    if (ok) setNominations(prev => prev.map(n => n.id === id ? { ...n, status } : n))
    setUpdating(null)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const ok = await deleteNomination(id)
    if (ok) setNominations(prev => prev.filter(n => n.id !== id))
    setDeleting(null)
    setConfirmDelete(null)
  }

  const recoverFromResend = async () => {
    setRecovering(true)
    setRecoverResult(null)
    try {
      const res = await fetch('/api/admin/recover-nominations', { method: 'POST' })
      const json = await res.json()
      if (json.error) { alert(json.error); return }
      setRecoverResult({ total: json.total, saved: json.saved })
      if (json.saved > 0) {
        const data = await getNominations()
        setNominations(data as Nomination[])
      }
    } catch (e) { alert('Recovery failed') }
    setRecovering(false)
  }

  const importToNewsletter = async () => {
    setImporting(true)
    setImportResult(null)
    try {
      const res = await fetch('/api/import-nominators', { method: 'POST' })
      const json = await res.json()
      setImportResult({ imported: json.imported || 0 })
    } catch {}
    setImporting(false)
  }

  const exportCSV = () => {
    const headers = [
      'Submission ID', 'Date Submitted', 'Status',
      'Category #', 'Category Name', 'Section',
      'Nominee Full Name', 'Nominee Stage Name', 'Nominee Gender',
      'Nominee Country', 'Nominee City', 'Nominee Region',
      'Nominee Email', 'Nominee Phone', 'Nominee Social Links', 'Support / Performance Links',
      'Nominator Full Name', 'Nominator Email', 'Nominator Phone',
      'Nominator Country', 'Relationship to Nominee',
    ]
    const escape = (v?: string) => v ? `"${v.replace(/"/g, '""')}"` : ''
    const rows = nominations.map(n => [
      escape(n.id),
      escape(new Date(n.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })),
      escape(n.status),
      escape(n.category_num),
      escape(n.category),
      escape(n.section),
      escape(n.nominee_name),
      escape(n.nominee_stage_name),
      escape(n.nominee_gender),
      escape(n.nominee_country),
      escape(n.nominee_city),
      escape(n.nominee_region),
      escape(n.nominee_email),
      escape(n.nominee_phone),
      escape(n.nominee_social_links),
      escape(n.support_links),
      escape(n.nominator_name),
      escape(n.nominator_email),
      escape(n.nominator_phone),
      escape(n.nominator_country),
      escape(n.relationship_to_nominee),
    ].join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `afrobreak-nominations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = {
    total: nominations.length,
    pending: nominations.filter(n => n.status === 'pending').length,
    approved: nominations.filter(n => n.status === 'approved').length,
    rejected: nominations.filter(n => n.status === 'rejected').length,
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Nominations</h1>
          <p className="text-text-secondary text-sm mt-0.5">AfroBreak Culture Awards 2026 — {nominations.length} submission{nominations.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Recover from Resend emails */}
          {recoverResult ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
              <CheckCircle size={14} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-semibold">{recoverResult.saved} recovered from {recoverResult.total} emails</span>
              <button onClick={() => setRecoverResult(null)} className="text-text-muted hover:text-white ml-1 text-xs">×</button>
            </div>
          ) : (
            <button
              onClick={recoverFromResend}
              disabled={recovering}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20 transition-all disabled:opacity-60"
            >
              {recovering ? <Loader2 size={14} className="animate-spin" /> : <Trophy size={14} />}
              Recover from Emails
            </button>
          )}

          {nominations.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
            {importResult ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-semibold">{importResult.imported} emails added to newsletter</span>
                <button onClick={() => setImportResult(null)} className="text-text-muted hover:text-white ml-1 text-xs">×</button>
              </div>
            ) : (
              <button
                onClick={importToNewsletter}
                disabled={importing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500/20 transition-all disabled:opacity-60"
              >
                {importing ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                Import to Newsletter
              </button>
            )}
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/30 text-gold text-sm font-bold hover:bg-gold/20 transition-all"
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
          { label: 'Approved', value: stats.approved, color: 'text-emerald-400' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface border border-white/5 rounded-xl p-4">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 w-full text-sm"
            placeholder="Search nominee, nominator, category..."
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-base text-sm">
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} className="input-base text-sm">
          <option value="all">All sections</option>
          {sections.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-white/5 rounded-2xl">
          <Trophy size={40} className="text-text-muted mx-auto mb-4" />
          <p className="text-white font-bold mb-1">No nominations yet</p>
          <p className="text-text-muted text-sm">Submissions will appear here once users submit the form.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id} className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-all"
                onClick={() => setExpanded(expanded === n.id ? null : n.id)}
              >
                {/* Category num badge */}
                <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-primary-400">#{n.category_num || '?'}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-white text-sm truncate">{n.nominee_name}</p>
                    {n.nominee_stage_name && <span className="text-xs text-text-muted">({n.nominee_stage_name})</span>}
                    {n.nominee_country && <span className="text-xs text-text-secondary">{n.nominee_country}</span>}
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-0.5">{n.category}</p>
                  <p className="text-xs text-text-muted mt-0.5">Nominated by {n.nominator_name} · {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[n.status] || STATUS_COLORS.pending}`}>
                    {n.status}
                  </span>
                  <ChevronDown size={16} className={`text-text-muted transition-transform ${expanded === n.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expanded === n.id && (
                <div className="border-t border-white/5 p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nominee */}
                    <div className="bg-background rounded-xl p-4 border border-white/5">
                      <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-3">Nominee</p>
                      <div className="space-y-2">
                        <Row label="Name" value={n.nominee_name} />
                        {n.nominee_stage_name && <Row label="Stage name" value={n.nominee_stage_name} />}
                        {n.nominee_gender && <Row label="Gender" value={n.nominee_gender} />}
                        {n.nominee_country && <Row label="Country" value={n.nominee_country} />}
                        {n.nominee_city && <Row label="City" value={n.nominee_city} />}
                        {n.nominee_region && <Row label="Region" value={n.nominee_region} />}
                        {n.nominee_email && (
                          <div className="flex items-center gap-2">
                            <Mail size={12} className="text-text-muted" />
                            <a href={`mailto:${n.nominee_email}`} className="text-xs text-primary-400 hover:underline">{n.nominee_email}</a>
                          </div>
                        )}
                        {n.nominee_phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="text-text-muted" />
                            <span className="text-xs text-white">{n.nominee_phone}</span>
                          </div>
                        )}
                        {n.nominee_social_links && (
                          <div>
                            <p className="text-xs text-text-muted mb-1">Social links</p>
                            <p className="text-xs text-white whitespace-pre-line">{n.nominee_social_links}</p>
                          </div>
                        )}
                        {n.support_links && (
                          <div>
                            <p className="text-xs text-text-muted mb-1">Support links</p>
                            <p className="text-xs text-white whitespace-pre-line">{n.support_links}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Nominator */}
                    <div className="bg-background rounded-xl p-4 border border-white/5">
                      <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-3">Nominator</p>
                      <div className="space-y-2">
                        <Row label="Name" value={n.nominator_name} />
                        {n.nominator_email && (
                          <div className="flex items-center gap-2">
                            <Mail size={12} className="text-text-muted" />
                            <a href={`mailto:${n.nominator_email}`} className="text-xs text-primary-400 hover:underline">{n.nominator_email}</a>
                          </div>
                        )}
                        {n.nominator_phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="text-text-muted" />
                            <span className="text-xs text-white">{n.nominator_phone}</span>
                          </div>
                        )}
                        {n.nominator_country && <Row label="Country" value={n.nominator_country} />}
                        {n.relationship_to_nominee && <Row label="Relationship" value={n.relationship_to_nominee} />}
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-3">Award Category</p>
                        <Row label="Category" value={`#${n.category_num} — ${n.category}`} />
                        {n.section && <Row label="Section" value={n.section} />}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <p className="text-xs text-text-muted mr-2">Update status:</p>
                    {['pending', 'reviewed', 'approved', 'rejected'].map(s => (
                      <button
                        key={s}
                        onClick={() => changeStatus(n.id, s)}
                        disabled={n.status === s || updating === n.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-40 ${n.status === s ? STATUS_COLORS[s] : 'border-white/10 text-text-secondary hover:text-white hover:border-white/30'}`}
                      >
                        {updating === n.id && n.status !== s ? <Loader2 size={12} className="animate-spin" /> : s}
                      </button>
                    ))}
                    <div className="ml-auto">
                      {confirmDelete === n.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-400">Delete?</span>
                          <button
                            onClick={() => handleDelete(n.id)}
                            disabled={deleting === n.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                          >
                            {deleting === n.id ? <Loader2 size={12} className="animate-spin" /> : 'Yes, delete'}
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all">
                            <X size={14} className="text-text-muted" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(n.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-text-muted w-20 flex-shrink-0">{label}</span>
      <span className="text-xs text-white">{value}</span>
    </div>
  )
}
