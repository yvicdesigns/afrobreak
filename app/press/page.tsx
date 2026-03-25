'use client'

import { useState, useEffect } from 'react'
import { Download, ExternalLink, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getPresscoverage } from '@/lib/db'

const defaultCoverage = [
  { id: 'd1', outlet: 'Le Monde', title: 'AfroBreak: La plateforme qui démocratise la danse afro en Europe', date: 'March 2025', type: 'Feature', logo: '🗞️', url: '' },
  { id: 'd2', outlet: 'TechCrunch', title: 'AfroBreak raises €2M to bring African dance culture online', date: 'January 2025', type: 'News', logo: '💻', url: '' },
  { id: 'd3', outlet: 'BBC Culture', title: 'How AfroBreak is preserving African dance traditions for a new generation', date: 'November 2024', type: 'Feature', logo: '📺', url: '' },
  { id: 'd4', outlet: 'Forbes', title: '30 Under 30: The entrepreneurs building platforms for underrepresented cultures', date: 'October 2024', type: 'List', logo: '📊', url: '' },
  { id: 'd5', outlet: 'The Guardian', title: 'Afrobeats, Amapiano, Dancehall: The rise of African dance platforms', date: 'August 2024', type: 'Feature', logo: '📰', url: '' },
  { id: 'd6', outlet: 'Vogue France', title: 'AfroBreak: Quand la danse africaine conquiert l\'Europe', date: 'June 2024', type: 'Feature', logo: '✨', url: '' },
]

const assets = [
  { name: 'AfroBreak Logo Pack', desc: 'PNG, SVG in all color variants', size: '2.4 MB' },
  { name: 'Brand Guidelines', desc: 'Colors, typography, usage rules', size: '4.1 MB' },
  { name: 'Press Photos', desc: 'High-res team and platform screenshots', size: '18.7 MB' },
  { name: 'Fact Sheet 2025', desc: 'Key stats, milestones, and mission', size: '0.8 MB' },
]

const stats = [
  { value: '10,000+', label: 'Active Members' },
  { value: '40+', label: 'Countries' },
  { value: '500+', label: 'Video Lessons' },
  { value: '€2M', label: 'Raised' },
]

export default function PressPage() {
  const [coverage, setCoverage] = useState(defaultCoverage)

  useEffect(() => {
    getPresscoverage().then(data => { if (data.length > 0) setCoverage(data as typeof defaultCoverage) })
  }, [])

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <div className="bg-surface border-b border-white/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">Newsroom</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Press & <span className="gradient-text-orange">Media</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto mb-8">
            Resources for journalists, bloggers, and media professionals covering AfroBreak and the Afro dance community.
          </p>
          <a href="mailto:press@afrobreak.com">
            <Button variant="primary" leftIcon={<Mail size={16} />}>Contact Press Team</Button>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="bg-surface border border-white/5 rounded-2xl p-6 text-center">
              <p className="text-3xl font-black gradient-text-orange mb-1">{stat.value}</p>
              <p className="text-text-secondary text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Press Coverage */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Press Coverage</h2>
          <div className="space-y-3">
            {coverage.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-5 bg-surface border border-white/5 rounded-2xl hover:border-white/15 transition-all group">
                <span className="text-2xl flex-shrink-0">{item.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{item.outlet}</span>
                    <span className="px-2 py-0.5 bg-primary-500/15 text-primary-400 text-[10px] font-bold rounded-full">{item.type}</span>
                  </div>
                  <p className="text-text-secondary text-sm truncate">{item.title}</p>
                  <p className="text-text-muted text-xs mt-1">{item.date}</p>
                </div>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} className="text-text-muted group-hover:text-primary-500 transition-colors flex-shrink-0" /></a>
                ) : (
                  <ExternalLink size={16} className="text-text-muted/30 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Press Kit */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Press Kit</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assets.map(asset => (
              <div key={asset.name} className="flex items-center gap-4 p-5 bg-surface border border-white/5 rounded-2xl hover:border-primary-500/20 transition-all">
                <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Download size={18} className="text-primary-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{asset.name}</p>
                  <p className="text-text-secondary text-xs">{asset.desc} · {asset.size}</p>
                </div>
                <button className="px-3 py-1.5 bg-primary-500/15 text-primary-400 text-xs font-semibold rounded-lg hover:bg-primary-500 hover:text-white transition-all">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-primary-500/15 to-secondary-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Media Enquiries</h3>
          <p className="text-text-secondary mb-6">For interviews, fact-checking, or media requests, contact our press team directly.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:press@afrobreak.com" className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors">
              <Mail size={16} /> press@afrobreak.com
            </a>
            <span className="text-white/20 hidden sm:block">|</span>
            <p className="text-text-secondary text-sm">Response within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
