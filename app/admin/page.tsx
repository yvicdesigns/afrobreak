'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Video, Calendar, BookOpen, Users, TrendingUp,
  Eye, Heart, Plus, ArrowUpRight, BarChart2
} from 'lucide-react'
import { getVideos, getEvents, getBlogPosts } from '@/lib/db'
import type { Video as VideoType } from '@/lib/types'
import Button from '@/components/ui/Button'

const barData = [
  { month: 'Nov', value: 65 },
  { month: 'Dec', value: 80 },
  { month: 'Jan', value: 72 },
  { month: 'Feb', value: 88 },
  { month: 'Mar', value: 95 },
]

const quickActions = [
  { label: 'Upload Video', href: '/admin/videos', icon: Video, color: 'text-primary-500' },
  { label: 'Add Event', href: '/admin/events', icon: Calendar, color: 'text-secondary-400' },
  { label: 'Write Post', href: '/admin/blog', icon: BookOpen, color: 'text-gold-DEFAULT' },
]

function formatViews(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export default function AdminDashboard() {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [eventCount, setEventCount] = useState(0)
  const [postCount, setPostCount] = useState(0)

  useEffect(() => {
    getVideos().then(setVideos)
    getEvents().then(all => setEventCount(all.length))
    getBlogPosts().then(all => setPostCount(all.length))
  }, [])

  const stats = [
    { label: 'Total Videos', value: videos.length, icon: Video, color: 'text-primary-500', bg: 'bg-primary-500/10', change: 'Live from database', positive: true },
    { label: 'Total Events', value: eventCount, icon: Calendar, color: 'text-secondary-400', bg: 'bg-secondary-500/10', change: 'Live from database', positive: true },
    { label: 'Blog Posts', value: postCount, icon: BookOpen, color: 'text-gold-DEFAULT', bg: 'bg-gold-DEFAULT/10', change: 'Live from database', positive: true },
    { label: 'Active Users', value: '—', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: 'Connect analytics', positive: true },
    { label: 'Monthly Revenue', value: '—', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', change: 'Connect Stripe', positive: true },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-text-secondary">Welcome back! Here&apos;s what&apos;s happening on AfroBreak.</p>
        </div>
        <div className="flex items-center gap-3">
          {quickActions.map(action => (
            <Link key={action.href} href={action.href}>
              <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />}>
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-surface border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <ArrowUpRight size={14} className="text-text-muted" />
            </div>
            <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
            <p className="text-xs text-text-secondary mb-2">{stat.label}</p>
            <p className={`text-xs font-medium ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart: Revenue */}
        <div className="lg:col-span-2 bg-surface border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-white">Monthly Revenue</h2>
              <p className="text-xs text-text-secondary">Last 5 months</p>
            </div>
            <BarChart2 size={18} className="text-text-muted" />
          </div>

          <div className="flex items-end gap-3 h-40">
            {barData.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-text-secondary">€{(bar.value * 100).toLocaleString()}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-500 hover:from-primary-500 hover:to-primary-300"
                  style={{ height: `${bar.value}%` }}
                />
                <span className="text-xs text-text-muted">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-6">Videos by Category</h2>
          <div className="space-y-3">
            {[
              { cat: 'Afro', count: 3, color: 'bg-orange-500' },
              { cat: 'Hip-Hop', count: 3, color: 'bg-purple-500' },
              { cat: 'Tutorial', count: 2, color: 'bg-blue-500' },
              { cat: 'Dancehall', count: 2, color: 'bg-green-500' },
              { cat: 'Contemporary', count: 2, color: 'bg-pink-500' },
            ].map(item => (
              <div key={item.cat} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-24 flex-shrink-0">{item.cat}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.count / 12) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted w-4">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent uploads */}
      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-white">Recent Video Uploads</h2>
          <Link href="/admin/videos" className="text-xs text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1">
            View all <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Video</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Instructor</th>
                <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Views</th>
                <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Likes</th>
                <th className="text-center p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Premium</th>
              </tr>
            </thead>
            <tbody>
              {videos.slice(0, 6).map((video: VideoType) => (
                <tr key={video.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-white font-medium line-clamp-1 max-w-[200px]">{video.title}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-xs text-text-secondary">{video.category}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-xs text-text-secondary">{video.instructor}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm text-white flex items-center justify-end gap-1">
                      <Eye size={12} className="text-text-muted" />
                      {formatViews(video.views)}
                    </span>
                  </td>
                  <td className="p-4 text-right hidden sm:table-cell">
                    <span className="text-sm text-white flex items-center justify-end gap-1">
                      <Heart size={12} className="text-text-muted" />
                      {formatViews(video.likes)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {video.isPremium ? (
                      <span className="px-2 py-0.5 rounded-full bg-gold-DEFAULT/15 text-gold-DEFAULT text-[10px] font-bold">YES</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">FREE</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
