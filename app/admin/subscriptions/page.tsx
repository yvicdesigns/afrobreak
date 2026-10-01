'use client'

import { useState, useEffect } from 'react'
import { CreditCard, TrendingUp, Users, Clock, Download, Search, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Sub = {
  id: string
  user_id: string
  plan: string
  amount: number
  currency: string
  status: string
  paystack_ref: string
  started_at: string
  ends_at: string
  profiles?: { name: string; email: string } | null
}

const CURRENCY_SYMBOLS: Record<string, string> = { GHS: 'GH₵', USD: '$', EUR: '€', GBP: '£', NGN: '₦' }

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isActive(sub: Sub) {
  return sub.status === 'active' && new Date(sub.ends_at) > new Date()
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'monthly' | 'annual'>('all')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('subscriptions')
      .select('*, profiles(name, email)')
      .order('started_at', { ascending: false })
    setSubs((data as Sub[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = subs.filter(s => {
    const name = s.profiles?.name?.toLowerCase() || ''
    const email = s.profiles?.email?.toLowerCase() || ''
    const q = search.toLowerCase()
    if (q && !name.includes(q) && !email.includes(q) && !s.paystack_ref?.includes(q)) return false
    if (filter === 'active') return isActive(s)
    if (filter === 'expired') return !isActive(s)
    if (filter === 'monthly') return s.plan === 'monthly'
    if (filter === 'annual') return s.plan === 'annual'
    return true
  })

  // Stats
  const totalRevenue = subs.reduce((acc, s) => acc + (s.amount || 0), 0)
  const activeCount = subs.filter(isActive).length
  const expiredCount = subs.filter(s => !isActive(s)).length
  const monthlyRevenue = subs
    .filter(s => isActive(s))
    .reduce((acc, s) => acc + (s.plan === 'monthly' ? s.amount : s.amount / 12), 0)

  // CSV export
  const exportCSV = () => {
    const rows = [
      ['Nom', 'Email', 'Plan', 'Montant', 'Devise', 'Statut', 'Début', 'Expiration', 'Réf. Paystack'],
      ...filtered.map(s => [
        s.profiles?.name || '',
        s.profiles?.email || '',
        s.plan,
        s.amount,
        s.currency,
        isActive(s) ? 'Actif' : 'Expiré',
        fmt(s.started_at),
        s.ends_at ? fmt(s.ends_at) : '',
        s.paystack_ref || '',
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'subscriptions.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Subscriptions</h1>
          <p className="text-text-secondary text-sm mt-1">Abonnements premium et revenus</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-xl text-sm font-semibold transition-colors">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary-400" />
            <p className="text-xs text-text-muted uppercase tracking-wider">Revenus totaux</p>
          </div>
          <p className="text-2xl font-black text-white">GH₵{totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-text-muted mt-1">{subs.length} paiement{subs.length > 1 ? 's' : ''}</p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={16} className="text-emerald-400" />
            <p className="text-xs text-text-muted uppercase tracking-wider">Rev. mensuel (MRR)</p>
          </div>
          <p className="text-2xl font-black text-white">GH₵{monthlyRevenue.toFixed(2)}</p>
          <p className="text-xs text-text-muted mt-1">actifs uniquement</p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-emerald-400" />
            <p className="text-xs text-text-muted uppercase tracking-wider">Actifs</p>
          </div>
          <p className="text-2xl font-black text-white">{activeCount}</p>
          <p className="text-xs text-text-muted mt-1">abonnements en cours</p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-text-muted" />
            <p className="text-xs text-text-muted uppercase tracking-wider">Expirés</p>
          </div>
          <p className="text-2xl font-black text-white">{expiredCount}</p>
          <p className="text-xs text-text-muted mt-1">abonnements terminés</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou réf..."
            className="input-base pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'expired', 'monthly', 'annual'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${filter === f ? 'bg-primary-500 text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white'}`}
            >
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : f === 'expired' ? 'Expirés' : f === 'monthly' ? 'Mensuel' : 'Annuel'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-text-secondary">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-white/5 rounded-2xl">
          <CreditCard size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-white font-semibold">Aucun abonnement trouvé</p>
          <p className="text-text-muted text-sm mt-1">Les paiements Paystack apparaîtront ici automatiquement.</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-xs text-text-muted uppercase tracking-wider">Abonné</th>
                  <th className="px-5 py-3 text-left text-xs text-text-muted uppercase tracking-wider">Plan</th>
                  <th className="px-5 py-3 text-left text-xs text-text-muted uppercase tracking-wider">Montant</th>
                  <th className="px-5 py-3 text-left text-xs text-text-muted uppercase tracking-wider hidden md:table-cell">Début</th>
                  <th className="px-5 py-3 text-left text-xs text-text-muted uppercase tracking-wider hidden md:table-cell">Expiration</th>
                  <th className="px-5 py-3 text-left text-xs text-text-muted uppercase tracking-wider">Statut</th>
                  <th className="px-5 py-3 text-left text-xs text-text-muted uppercase tracking-wider hidden lg:table-cell">Réf. Paystack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(s => {
                  const active = isActive(s)
                  const sym = CURRENCY_SYMBOLS[s.currency] || s.currency
                  return (
                    <tr key={s.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">{s.profiles?.name || '—'}</p>
                        <p className="text-xs text-text-muted">{s.profiles?.email || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${s.plan === 'annual' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-primary-500/15 text-primary-400'}`}>
                          {s.plan === 'annual' ? '⭐ Annuel' : '📅 Mensuel'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-white">{sym}{s.amount?.toFixed(2)}</p>
                        <p className="text-xs text-text-muted">{s.currency}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-white">{s.started_at ? fmt(s.started_at) : '—'}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-white">{s.ends_at ? fmt(s.ends_at) : '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        {active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400">
                            <CheckCircle size={11} /> Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-text-muted">
                            <XCircle size={11} /> Expiré
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <p className="text-xs text-text-muted font-mono truncate max-w-[140px]">{s.paystack_ref || '—'}</p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/5 text-xs text-text-muted">
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''} · {activeCount} actif{activeCount > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}
