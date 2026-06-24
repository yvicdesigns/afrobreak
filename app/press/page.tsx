'use client'

import { useState, useEffect } from 'react'
import { Download, ExternalLink, Mail, Mic2, Film } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getPresscoverage } from '@/lib/db'

const defaultCoverage = [
  { id: 'd1', outlet: 'MyJoyOnline', title: 'Afro Break championship set for October 27 in Accra', date: 'October 2024', type: 'News', logo: '🗞️', url: 'https://www.myjoyonline.com/afro-break-championship-set-for-october-27-in-accra/' },
  { id: 'd2', outlet: 'News Ghana', title: 'Ghana hosts fourth AfroBreak championship amid breaking\'s Olympic recognition', date: 'November 2024', type: 'Feature', logo: '📰', url: 'https://www.newsghana.com.gh/ghana-hosts-fourth-afrobreak-championship-amid-breakings-olympic-recognition/' },
  { id: 'd3', outlet: 'MyJoyOnline', title: 'South Africa, Benin claim top prizes at AfroBreak championships', date: 'November 2024', type: 'News', logo: '🗞️', url: 'https://www.myjoyonline.com/south-africa-benin-claim-top-prizes-at-afrobreak-championships/' },
  { id: 'd4', outlet: 'News Ghana', title: 'Ghana breakdance pioneer launches Cultural Journey exhibition', date: 'October 2024', type: 'Feature', logo: '📰', url: 'https://www.newsghana.com.gh/ghana-breakdance-pioneer-launches-cultural-journey-exhibition/' },
  { id: 'd5', outlet: 'AfroBreak', title: 'Root of the Culture — Premiere on July 19, 2025', date: 'July 2025', type: 'Event', logo: '🎬', url: 'https://afrobreak.com/root-of-the-culture-premiere-on-july-19-2025/' },
  { id: 'd6', outlet: 'AfroBreak', title: 'Akwaaba AfroBreak Music — Official Dance Video', date: 'June 2025', type: 'Release', logo: '🎵', url: 'https://afrobreak.com/akwaaba-afrobreak-music-official-dance-video/' },
  { id: 'd7', outlet: 'AfroBreak', title: 'Ghana breakdance pioneer Bboy Lyricx launches Cultural Journey exhibition', date: 'October 2024', type: 'Feature', logo: '🎨', url: 'https://afrobreak.com/ghana-breakdance-pioneer-bboy-lyricx-launches-cultural-journey-exhibition/' },
  { id: 'd8', outlet: 'Ghana Talk News', title: 'Breaking Federation of Ghana start preparations for 2026 Youth Olympics', date: 'January 2025', type: 'News', logo: '🏅', url: 'https://www.ghanatalknews.com/breaking-federation-of-ghana-start-preparations-for-2026-youth-olympics/' },
  { id: 'd9', outlet: 'AfroBreak', title: 'KGL Foundation and ABA partner to empower girls using break dance and hiphop culture in Tamale', date: 'February 2025', type: 'Impact', logo: '🌍', url: 'https://afrobreak.com/kgl-foundation-and-aba-partnered-to-empower-girls-using-break-dance-and-hiphop-culture-in-tamale-northern-ghana/' },
]

const assets = [
  { name: 'AfroBreak Logo Pack', desc: 'PNG, SVG in all color variants', size: '2.4 MB' },
  { name: 'Press Photos', desc: 'High-res event and team photography', size: '18.7 MB' },
  { name: 'Brand Guidelines', desc: 'Colors, typography, usage rules', size: '4.1 MB' },
  { name: 'Newsletters', desc: 'AfroBreak community newsletters archive', size: '1.2 MB' },
]

const interviews = [
  { title: 'Bboy Lyricx — Paris 2024 Olympics Hall of Fame inductee', outlet: 'AfroBreak TV', year: '2024', url: 'https://www.youtube.com/@afrobreakghana' },
  { title: 'Lil Vic — AfroBreak African Champion 2023', outlet: 'AfroBreak TV', year: '2023', url: 'https://www.youtube.com/@afrobreakghana' },
  { title: 'Bboy Smith — AfroBreak African & France Champion 2024', outlet: 'AfroBreak TV', year: '2024', url: 'https://www.youtube.com/@afrobreakghana' },
  { title: 'Zinji — AfroBreak African Champion 2025 (Algeria)', outlet: 'AfroBreak TV', year: '2025', url: 'https://www.youtube.com/@afrobreakghana' },
]

const documentaries = [
  { title: 'Root of the Culture', desc: 'Documentary premiere following the journey of African breakers on their path to the AfroBreak Africa Final. Premiered July 19, 2025.', year: '2025', url: 'https://afrobreak.com/root-of-the-culture-premiere-on-july-19-2025/', thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80' },
  { title: 'Akwaaba AfroBreak', desc: 'Official dance video celebrating the AfroBreak movement and its cultural roots across the African continent.', year: '2025', url: 'https://afrobreak.com/akwaaba-afrobreak-music-official-dance-video/', thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80' },
  { title: 'Cultural Journey Exhibition', desc: 'Bboy Lyricx chronicles his journey through 36+ countries as a cultural ambassador for African breaking and hiphop culture.', year: '2024', url: 'https://afrobreak.com/ghana-breakdance-pioneer-bboy-lyricx-launches-cultural-journey-exhibition/', thumbnail: 'https://images.unsplash.com/photo-1508700929628-c3d7819c1498?w=800&q=80' },
]

const stats = [
  { value: '11K+', label: 'Beneficiaries' },
  { value: '28+', label: 'Countries' },
  { value: '270+', label: 'Events Organized' },
  { value: '1000+', label: 'Workshops' },
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
            Resources for journalists, bloggers and media professionals covering Afrobreak dance community.
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

        {/* Interviews */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <Mic2 size={20} className="text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Interviews</h2>
          </div>
          <div className="space-y-3">
            {interviews.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-surface border border-white/5 rounded-2xl hover:border-primary-500/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/25 transition-colors">
                  <Mic2 size={16} className="text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-text-muted text-xs mt-0.5">{item.outlet} · {item.year}</p>
                </div>
                <ExternalLink size={15} className="text-text-muted group-hover:text-primary-500 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Dance and Culture Documentaries */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary-500/15 flex items-center justify-center">
              <Film size={20} className="text-secondary-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Dance and Culture Documentaries</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {documentaries.map((doc, i) => (
              <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                className="group bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-secondary-500/30 transition-all">
                <div className="relative h-40 overflow-hidden">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg">{doc.year}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1">{doc.title}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">{doc.desc}</p>
                </div>
              </a>
            ))}
          </div>
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
