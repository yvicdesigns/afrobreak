'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Eye, ArrowUpRight, ArrowDownRight, Minus, BarChart2, Globe } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type DayStat = { date: string; views: number; visitors: number }
type PageStat = { path: string; views: number }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function Trend({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return <span className="text-text-muted text-xs">—</span>
  const pct = Math.round(((current - previous) / previous) * 100)
  if (pct === 0) return <span className="flex items-center gap-0.5 text-text-muted text-xs"><Minus size={11} /> 0%</span>
  const up = pct > 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(pct)}%
    </span>
  )
}

export default function AnalyticsPage() {
  const [days, setDays] = useState<DayStat[]>([])
  const [pages, setPages] = useState<PageStat[]>([])
  const [range, setRange] = useState<7 | 14 | 30>(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const from = new Date()
    from.setDate(from.getDate() - range)

    supabase
      .from('page_views')
      .select('path, session_id, created_at')
      .gte('created_at', from.toISOString())
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (!data) { setLoading(false); return }

        // Build daily stats
        const byDay = new Map<string, { views: number; sessions: Set<string> }>()
        const byPage = new Map<string, number>()

        for (const row of data) {
          const day = row.created_at.slice(0, 10)
          if (!byDay.has(day)) byDay.set(day, { views: 0, sessions: new Set() })
          const d = byDay.get(day)!
          d.views++
          if (row.session_id) d.sessions.add(row.session_id)
          byPage.set(row.path, (byPage.get(row.path) || 0) + 1)
        }

        // Fill missing days
        const result: DayStat[] = []
        for (let i = range - 1; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const iso = d.toISOString().slice(0, 10)
          const entry = byDay.get(iso)
          result.push({ date: iso, views: entry?.views || 0, visitors: entry?.sessions.size || 0 })
        }

        setDays(result)
        setPages(
          Array.from(byPage.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([path, views]) => ({ path, views }))
        )
        setLoading(false)
      })
  }, [range])

  const totalViews = days.reduce((s, d) => s + d.views, 0)
  const totalVisitors = days.reduce((s, d) => s + d.visitors, 0)
  const avgDaily = days.length ? Math.round(totalViews / days.length) : 0

  const half = Math.floor(days.length / 2)
  const firstHalf = days.slice(0, half)
  const secondHalf = days.slice(half)
  const prevViews = firstHalf.reduce((s, d) => s + d.views, 0)
  const currViews = secondHalf.reduce((s, d) => s + d.views, 0)
  const prevVisitors = firstHalf.reduce((s, d) => s + d.visitors, 0)
  const currVisitors = secondHalf.reduce((s, d) => s + d.visitors, 0)

  const maxViews = Math.max(...days.map(d => d.views), 1)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BarChart2 size={22} className="text-primary-500" /> Analytics
          </h1>
          <p className="text-text-secondary text-sm mt-1">Trafic du site en temps réel</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-xl border border-white/5">
          {([7, 14, 30] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${range === r ? 'bg-primary-500 text-[#0D0A1A]' : 'text-text-secondary hover:text-white'}`}
            >
              {r}j
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <Eye size={16} className="text-primary-400" />
            </div>
            <Trend current={currViews} previous={prevViews} />
          </div>
          <p className="text-2xl font-black text-white">{loading ? '—' : totalViews.toLocaleString()}</p>
          <p className="text-text-secondary text-sm mt-0.5">Pages vues ({range}j)</p>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Users size={16} className="text-emerald-400" />
            </div>
            <Trend current={currVisitors} previous={prevVisitors} />
          </div>
          <p className="text-2xl font-black text-white">{loading ? '—' : totalVisitors.toLocaleString()}</p>
          <p className="text-text-secondary text-sm mt-0.5">Visiteurs uniques ({range}j)</p>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{loading ? '—' : avgDaily.toLocaleString()}</p>
          <p className="text-text-secondary text-sm mt-0.5">Moyenne / jour</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-5">Pages vues par jour</h2>
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {days.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group" title={`${formatDate(d.date)}: ${d.views} vues, ${d.visitors} visiteurs`}>
                <div className="relative w-full flex items-end justify-center" style={{ height: '128px' }}>
                  {/* Visitors bar (behind) */}
                  <div
                    className="absolute bottom-0 w-full rounded-t-sm bg-emerald-500/25 transition-all duration-500"
                    style={{ height: `${Math.round((d.visitors / maxViews) * 128)}px` }}
                  />
                  {/* Views bar (front) */}
                  <div
                    className="absolute bottom-0 w-3/5 rounded-t-sm bg-primary-500/70 group-hover:bg-primary-500 transition-all duration-500"
                    style={{ height: `${Math.round((d.views / maxViews) * 128)}px` }}
                  />
                </div>
                {days.length <= 14 && (
                  <span className="text-[9px] text-text-muted rotate-45 origin-left whitespace-nowrap" style={{ fontSize: '8px' }}>
                    {formatDate(d.date)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary-500/70" />
            <span className="text-xs text-text-secondary">Pages vues</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-500/25" />
            <span className="text-xs text-text-secondary">Visiteurs uniques</span>
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Globe size={15} className="text-primary-400" /> Pages les plus visitées
        </h2>
        {loading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pages.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-8">Aucune donnée pour cette période.</p>
        ) : (
          <div className="space-y-2">
            {pages.map(({ path, views }, i) => {
              const pct = Math.round((views / (pages[0]?.views || 1)) * 100)
              return (
                <div key={path} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-4 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white font-medium truncate">{path || '/'}</span>
                      <span className="text-xs text-text-secondary ml-2 flex-shrink-0">{views.toLocaleString()} vues</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500/60 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Daily table */}
      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Détail par jour</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-text-muted">Pages vues</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-text-muted">Visiteurs uniques</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-text-muted">Chargement…</td></tr>
              ) : [...days].reverse().map((d) => (
                <tr key={d.date} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3 text-text-secondary">{formatDate(d.date)}</td>
                  <td className="px-6 py-3 text-right text-white font-medium">{d.views.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-emerald-400 font-medium">{d.visitors.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
