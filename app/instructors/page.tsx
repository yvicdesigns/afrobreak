'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Users, Video, ArrowRight, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getInstructors } from '@/lib/db'

const defaultInstructors = [
  {
    id: 'i1', name: 'Bboy Lyricx', role: 'Founder & Pioneer — ABA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1508700929628-c3d7819c1498?w=800&q=80',
    bio: 'Nana Tuffour Okai — pioneer of Afrobreak, co-founder of Africa Breaking Academy. Hall of Fame inductee at Paris 2024 Olympics through the PIPA program. WDSF licensed athlete and judge who has competed and taught in 36+ countries.',
    specialties: ['Breaking', 'Hiphop Culture', 'Choreography', 'Judging'],
    videos: 30, followers: 32000, rating: 5.0,
    location: 'Accra, Ghana',
  },
  {
    id: 'i2', name: 'Matt', role: 'Global Ambassador — Breaking',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    bio: 'ABA Global Ambassador and elite breaker bringing world-class breaking and freestyle education to Africa and the diaspora through AfroBreak workshops and events.',
    specialties: ['Breaking', 'Freestyle', 'Footwork'],
    videos: 18, followers: 15200, rating: 4.9,
    location: 'Africa / Global',
  },
  {
    id: 'i3', name: 'Jovarni', role: 'Global Ambassador — Hiphop',
    avatar: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80',
    bio: 'ABA Global Ambassador specializing in Hiphop, Krump, and Afrodance. Jovarni brings raw energy and cultural depth to every workshop, inspiring youth to express themselves through movement.',
    specialties: ['Hiphop', 'Krump', 'Afrodance'],
    videos: 15, followers: 12400, rating: 4.8,
    location: 'Africa / Global',
  },
  {
    id: 'i4', name: 'Mickie Flex', role: 'Global Ambassador — Afro Dance',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1483362271674-7461064d5e66?w=800&q=80',
    bio: 'ABA Global Ambassador and choreographer with expertise in Afro dance and performance. Mickie Flex bridges traditional African movement with contemporary choreography for stage and screen.',
    specialties: ['Afro Dance', 'Choreography', 'Performance'],
    videos: 14, followers: 11600, rating: 4.8,
    location: 'Africa / Global',
  },
  {
    id: 'i5', name: 'Appa', role: 'Global Ambassador — Afro House',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1535525153412-5a42439a210e?w=800&q=80',
    bio: 'ABA Global Ambassador specializing in Afro house and contemporary choreography. Appa brings a unique blend of rhythm, precision, and storytelling to his classes and performances.',
    specialties: ['Afro House', 'Choreography', 'Contemporary'],
    videos: 12, followers: 9800, rating: 4.7,
    location: 'Africa / Global',
  },
  {
    id: 'i6', name: 'Smith', role: 'Global Ambassador — Breaking',
    avatar: 'https://images.unsplash.com/photo-1526483291330-fe44429f3e0d?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1504680177321-2e6a879d4e8f?w=800&q=80',
    bio: 'AfroBreak African Champion 2024 from Benin. Smith is an elite breaker and ABA Global Ambassador known for his power, creativity, and consistency on the international stage.',
    specialties: ['Breaking', 'Freestyle', 'Battle Strategy'],
    videos: 16, followers: 18700, rating: 4.9,
    location: 'Benin / Global',
  },
  {
    id: 'i7', name: 'Delkrim', role: 'Global Ambassador — Breaking & Hiphop',
    avatar: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80',
    bio: 'ABA Global Ambassador combining breaking and hiphop culture with a passion for education and community. Delkrim has led workshops and judged battles across Africa and Europe.',
    specialties: ['Breaking', 'Hiphop', 'Workshop Facilitation'],
    videos: 11, followers: 9200, rating: 4.8,
    location: 'Africa / Global',
  },
]

type PageInstructor = typeof defaultInstructors[0]

function formatNumber(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString()
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<PageInstructor[]>(defaultInstructors)
  const [selected, setSelected] = useState<PageInstructor | null>(null)

  useEffect(() => {
    getInstructors().then(data => {
      if (data.length === 0) return
      setInstructors(prev => prev.map(d => {
        const db = data.find(i => i.id === d.id)
        if (!db) return d
        return { ...d, bio: db.bio, specialties: db.specialties, followers: db.followers, videos: db.videoCount }
      }))
    })
  }, [])

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <div className="bg-surface border-b border-white/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">World-Class Instructors</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Learn from the <span className="gradient-text-orange">Best</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Our instructors are masters of their craft — professional dancers, choreographers, and champions who bring decades of experience to every lesson.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map(instructor => (
            <div
              key={instructor.id}
              onClick={() => setSelected(instructor)}
              className="group bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 cursor-pointer"
            >
              {/* Cover */}
              <div className="relative h-40 overflow-hidden">
                <img src={instructor.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 flex items-end gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-primary-500/40 flex-shrink-0">
                    <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{instructor.name}</h3>
                    <p className="text-primary-400 text-xs">{instructor.role}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm text-text-secondary line-clamp-2 mb-4">{instructor.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {instructor.specialties.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-1 bg-primary-500/10 text-primary-400 text-[10px] font-semibold rounded-lg">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary border-t border-white/5 pt-3">
                  <span className="flex items-center gap-1"><Video size={11} /> {instructor.videos} videos</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {formatNumber(instructor.followers)}</span>
                  <span className="flex items-center gap-1 text-gold-DEFAULT"><Star size={11} className="fill-gold-DEFAULT" /> {instructor.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become an instructor CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-500/15 to-secondary-500/10 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Are you a dance instructor?</h3>
            <p className="text-text-secondary text-sm">Join the AfroBreak instructor team and reach thousands of students across the world.</p>
          </div>
          <Link href="/partners"><Button variant="primary" rightIcon={<ArrowRight size={16} />}>Apply to Teach</Button></Link>
        </div>
      </div>

      {/* Instructor Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl overflow-hidden animate-slide-down">
            <div className="relative h-48">
              <img src={selected.cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-black/40 rounded-xl text-white hover:bg-black/60 transition-all">✕</button>
              <div className="absolute bottom-0 left-0 p-5 flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-primary-500/40">
                  <img src={selected.avatar} alt={selected.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                  <p className="text-primary-400 text-sm">{selected.role} · {selected.location}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{selected.bio}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {selected.specialties.map(s => (
                  <span key={s} className="flex items-center gap-1 px-2 py-1 bg-primary-500/10 text-primary-400 text-xs font-semibold rounded-lg">
                    <CheckCircle size={10} /> {s}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-background rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-white">{selected.videos}</p>
                  <p className="text-xs text-text-secondary">Videos</p>
                </div>
                <div className="bg-background rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-white">{formatNumber(selected.followers)}</p>
                  <p className="text-xs text-text-secondary">Followers</p>
                </div>
                <div className="bg-background rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gold-DEFAULT">{selected.rating}★</p>
                  <p className="text-xs text-text-secondary">Rating</p>
                </div>
              </div>
              <Link href="/videos" onClick={() => setSelected(null)}>
                <Button variant="primary" fullWidth rightIcon={<ArrowRight size={16} />}>View Videos</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
