'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Heart, Globe, Users, Zap, ArrowRight,
  Film, Music2, Camera, CalendarDays, Image, Megaphone, Dumbbell, Quote
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { getTeamMembers } from '@/lib/db'

const values = [
  { icon: Zap, title: 'Inspiration', desc: 'We ignite passion and creativity in every young talent we work with, using the power of Hip Hop and breakdance as a catalyst.' },
  { icon: Globe, title: 'Opportunities', desc: 'We open doors — from local stages in Ghana to international competitions in Europe, creating real pathways for African youth.' },
  { icon: Heart, title: 'Empowerment', desc: 'We build resilience, confidence, and leadership in young people through sport, culture, and community programs.' },
  { icon: Users, title: 'Community', desc: 'We connect over 21 African countries through our flagship Afrobreak initiative, fostering unity across the continent.' },
]

const timeline = [
  { year: '2021', title: 'AfroBreak International Championship', desc: 'Launched the biggest platform for Ghanaian and African talents to learn, contest and compete at an international level, leveraging the momentum of breaking entering the Olympics.' },
  { year: '2022', title: 'Continental Expansion', desc: 'Grew to 17+ African country collaborators. Dancers from DR Congo, Ivory Coast, Nigeria, Togo, Senegal, Kenya, Uganda, South Africa and more joined the AfroBreak family.' },
  { year: '2023', title: 'Africa Final & Champions', desc: 'Hosted the most prestigious break dance event on the continent. Lil Vic became AfroBreak African Champion. Tris Naomi dominated at national and international level.' },
  { year: '2024', title: 'Paris Olympics Recognition', desc: 'Bboy Lyricx was inducted into the Hall of Fame at the Paris 2024 Olympic and Paralympic Games through the Future Leaders Invitation Program (PIPA) on Sports and Diplomacy.' },
  { year: '2026', title: 'Dakar Youth Olympics', desc: 'Preparing Africa\'s finest breakers for the Dakar 2026 Youth Olympics Games as breaking cements its place as one of the most youthful sports in the world.' },
]

const countries = [
  'DR Congo', 'Ivory Coast', 'Guinea Conakry', 'Nigeria', 'Togo', 'Benin',
  'Uganda', 'Kenya', 'Zimbabwe', 'South Africa', 'Senegal', 'Sierra Leone',
  'Tanzania', 'Rwanda', 'Niger', 'Burkina Faso', 'Angola', 'Ghana',
]

const services = [
  { icon: Film, title: 'Documentary Production', desc: 'High-quality documentaries capturing cultural movements, artistic journeys, and social impact projects — from concept to final edit.' },
  { icon: Music2, title: 'DJ Services & Equipment Rental', desc: 'Professional DJ services for all scales of events, plus sound systems, turntables, mixers and accessories for rental.' },
  { icon: Camera, title: 'Camera & Media Equipment', desc: 'Access high-quality video and photography gear. Ideal for content creators, production teams, and live events.' },
  { icon: CalendarDays, title: 'Event Planning & Management', desc: 'Full-service planning for cultural festivals, dance competitions, workshops, and corporate gatherings from concept to execution.' },
  { icon: Image, title: 'Photography & Videography', desc: 'Professional photo and video services for performances, campaigns, interviews, and branded content.' },
  { icon: Megaphone, title: 'Marketing & Creative Branding', desc: 'Branding, content creation, and social media strategy for artists, startups, and organizations building their identity.' },
  { icon: Dumbbell, title: 'Dance Training & Workshops', desc: 'One-on-one training, group classes, and team-building workshops for schools, communities, and corporate organizations.' },
]

const testimonials = [
  {
    quote: "Winning AfroBreak wasn't just about the title — it was about proving to myself and my community that African breakers have a global voice. What I love about AfroBreak is it's not just about battling. It's about community building. The workshops, the organizers are very receptive, good floor, ambulance to take care of dancers, the energy — they invest in you beyond the stage. I left with new skills, friends across the continent, and big dreams.",
    name: 'Lil Vic',
    title: 'AfroBreak African Champion 2023',
  },
  {
    quote: "Before AfroBreak, I was only dancing in crews. The training camp and workshops by Africa Breaking Academy changed my whole mindset and perspective. I got mentored by Bboy Lyricx, learned new styles, and even gained educational scholarships to complete my education. I'm not just a dancer now.",
    name: 'Tris Naomi',
    title: 'AfroBreak Ghana National & Ivorie Breaking Competition African Champion 2023',
  },
  {
    quote: "AfroBreak changed everything for me. I was lucky enough to represent Benin three consecutive years at the event. After winning, I received international exposure, mentorship, and even a chance to travel for a cultural exchange program. It was more than a competition — it was a life-changer.",
    name: 'Bboy Smith',
    title: 'AfroBreak African and France Champion 2024',
  },
]

const defaultTeam = [
  { id: 'd1', name: 'Bboy Lyricx', role: 'Founder & Pioneer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Nana Tuffour Okai, professionally known as Bboy Lyricx — pioneer of Afrobreak, co-founder of ABA, WDSF licensed athlete, Hall of Fame inductee at Paris 2024 Olympics.', display_order: 0 },
]

export default function AboutPage() {
  const [team, setTeam] = useState(defaultTeam)

  useEffect(() => {
    getTeamMembers().then(data => { if (data.length > 0) setTeam(data as typeof defaultTeam) })
  }, [])

  return (
    <div className="min-h-screen pt-20 bg-background">

      {/* Hero */}
      <div className="relative overflow-hidden bg-surface border-b border-white/5 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-4">Africa Breaking Academy</p>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6">
            Teach. Inspire.<br />
            <span className="gradient-text-orange">Empower.</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            ABA is an independent Creative Youth-Led Collective that utilizes Breakdance and Hip Hop culture as a learning tool to teach, inspire, empower and build young talents to effect positive social change in Ghana and Africa as a whole.
          </p>
        </div>
      </div>

      {/* About ABA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-secondary-400 text-sm font-semibold uppercase tracking-widest mb-3">Who We Are</p>
            <h2 className="text-3xl font-black text-white mb-6">The Only African Breakdance Organization With 21+ Country Reach</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>Africa Breaking Academy (ABA) is specialized in dance sports events, Hip Hop, educational workshops, dance and media commercials, dance activations, and productions.</p>
              <p>With the track record of the only African Break Dance organization with over 21 African countries plugs and collaborators through the flagship initiative Afrobreak Concepts.</p>
              <p>We are duly registered as a limited liability company under Ghanaian business laws with the Registrar General Department — Registration Number <span className="text-white font-medium">CG207570821</span>, TIN <span className="text-white font-medium">C0061161519</span>.</p>
            </div>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link href="/events"><Button variant="primary" rightIcon={<ArrowRight size={16} />}>See Our Events</Button></Link>
              <Link href="/contact"><Button variant="secondary">Contact Us</Button></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '21+', label: 'African Countries' },
              { value: '2021', label: 'Championship Founded' },
              { value: '38+', label: 'Countries Represented' },
              { value: '10K+', label: 'Community Members' },
            ].map(stat => (
              <div key={stat.label} className="bg-surface border border-white/5 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black gradient-text-orange mb-1">{stat.value}</p>
                <p className="text-text-secondary text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-surface border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-3xl font-black text-white">Our Vision, Mission & Values</h2>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-background border border-primary-500/20">
              <p className="text-primary-500 text-xs font-bold uppercase tracking-widest mb-3">Vision</p>
              <p className="text-text-secondary leading-relaxed">To become a global leader in empowering youth through breakdancing as a dance sport and Hip-Hop culture, fostering creativity, resilience, and social transformation in African communities and beyond.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-secondary-500/20">
              <p className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-3">Mission</p>
              <p className="text-text-secondary leading-relaxed">To inspire and empower individuals through innovative sports and Hip-Hop programs, creating inclusive opportunities for education, cultural exchange, and social impact across Africa — nurturing talent, promoting gender equity, and building sustainable partnerships.</p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-background border border-white/5 hover:border-primary-500/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-primary-500" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AfroBreak Championship */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">The Championship</p>
          <h2 className="text-3xl font-black text-white mb-4">AfroBreak International Championship</h2>
          <p className="text-text-secondary max-w-3xl mx-auto leading-relaxed">
            A high-level community development concept for building a sustainable dance sport, art, and Hip Hop industry in Ghana — leveraging the huge success of breakdancing at Paris 2024 Olympics and the upcoming Dakar 2026 Youth Olympics. Afrobreak, a fusion of Afro and breaking, blends the mesmerizing rhythms of Afro-music with the acrobatic artistry of breakdancing. It is more than a competition — it&apos;s a celebration of diversity, a collision of traditions, and a stage where talent knows no boundaries.
          </p>
        </div>

        {/* Countries */}
        <div className="bg-surface border border-white/5 rounded-2xl p-8">
          <p className="text-center text-sm font-semibold text-primary-500 uppercase tracking-widest mb-6">Represented Countries</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {countries.map(country => (
              <span key={country} className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-all">
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Founder */}
      <div className="bg-surface border-y border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">The Pioneer</p>
            <h2 className="text-3xl font-black text-white">About The Founder</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="text-center">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 text-4xl font-black text-white shadow-glow-orange">BL</div>
              <h3 className="text-xl font-black text-white">Bboy Lyricx</h3>
              <p className="text-primary-500 text-sm font-semibold mt-1">Nana Tuffour Okai</p>
              <p className="text-text-secondary text-xs mt-1">Co-Founder, Africa Breaking Academy</p>
              <div className="mt-4 space-y-1">
                <span className="block text-xs px-3 py-1 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 text-gold-DEFAULT">Paris 2024 Olympics Hall of Fame</span>
                <span className="block text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary">WDSF Licensed Athlete</span>
                <span className="block text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-text-secondary">36+ Countries</span>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4 text-text-secondary leading-relaxed text-sm">
              <p>Nana Tuffour Okai, professionally known as <span className="text-white font-semibold">Bboy Lyricx</span>, is an influential indigenous hip-hop practitioner, cultural architect, and dancer from Accra, Ghana. He is widely recognized as a pioneer of Afrobreak — an innovative concept that fuses traditional African movement philosophies with the global language of breaking.</p>
              <p>As the co-founder of Africa Breaking Academy (ABA), Lyricx has played a transformative role in the growth and sustainability of breaking and Hip-Hop culture across Ghana and the African continent. Through the Academy, he has created impactful, grassroots platforms that nurture young talent, promote creative excellence, and provide access to professional pathways.</p>
              <p>His work earned international recognition through the <span className="text-white font-semibold">Future Leaders Invitation Program (PIPA) on Sports and Diplomacy</span>, culminating in his induction into the Hall of Fame at the Paris 2024 Olympic and Paralympic Games.</p>
              <p>A global ambassador for African dance, Bboy Lyricx has competed in over <span className="text-white font-semibold">36 countries</span> as a battle competitor, judge, and workshop facilitator. He has organized, instructed, and judged dance workshops and events in over <span className="text-white font-semibold">25 countries across Africa and Europe</span>. A multiple award-winning dancer recognized at the Ghana Dance Awards, he aspires to be a positive role model for youth from underserved communities.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">Since 2021</p>
          <h2 className="text-3xl font-black text-white">Our Journey</h2>
        </div>
        <div className="relative">
          <div className="absolute left-16 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-8">
            {timeline.map(item => (
              <div key={item.year} className="flex gap-6 items-start">
                <div className="w-14 text-right flex-shrink-0">
                  <span className="text-primary-500 font-black text-sm">{item.year}</span>
                </div>
                <div className="w-3 h-3 rounded-full bg-primary-500 mt-1 flex-shrink-0 z-10 relative" />
                <div className="flex-1 pb-2">
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-surface border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-3xl font-black text-white">Our Services</h2>
            <p className="text-text-secondary mt-3 max-w-xl mx-auto">Creative and technical services designed to support individuals, organizations, and brands in the arts, culture, and entertainment sectors.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {services.slice(0, 6).map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-background border border-white/5 hover:border-primary-500/20 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center mb-4 group-hover:bg-primary-500/25 transition-colors">
                  <Icon size={22} className="text-primary-500" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          {/* Dance Training — full width */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <Dumbbell size={22} className="text-primary-500" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Dance Training & Workshops</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Personalized one-on-one training, group classes, and team-building dance workshops for schools, communities, and corporate organizations. Our fitness-focused workshops promote health and creativity in an engaging and inclusive environment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      {team.length > 0 && (
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">The People</p>
              <h2 className="text-3xl font-black text-white">Meet the Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(member => (
                <div key={member.id} className="bg-surface border border-white/5 rounded-2xl p-6 text-center hover:border-primary-500/20 transition-all">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 ring-2 ring-primary-500/20">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-primary-500 text-xs font-semibold mb-3">{member.role}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Beneficiary Testimonials */}
      <div className="bg-surface border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">Real Stories</p>
            <h2 className="text-3xl font-black text-white">From Our Champions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-background border border-white/5 rounded-2xl p-6 flex flex-col">
                <Quote size={24} className="text-primary-500/40 mb-4 flex-shrink-0" />
                <p className="text-text-secondary text-sm leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-primary-500 text-xs mt-0.5">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Ready to join the movement?</h2>
        <p className="text-text-secondary mb-8">Join thousands of dancers already learning, connecting, and growing with AfroBreak.</p>
        <Link href="/auth/signup">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>Get Started Free</Button>
        </Link>
      </div>
    </div>
  )
}
