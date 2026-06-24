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
]

const timeline = [
  { year: '2021', title: 'AfroBreak International Championship', desc: 'Launched the biggest platform for Ghanaian and African talents to learn, contest and compete at an international level, leveraging the momentum of breaking entering the Olympics.' },
  { year: '2022', title: 'Continental Expansion', desc: 'Grew to 17+ African country collaborators. Dancers from DR Congo, Ivory Coast, Nigeria, Togo, Senegal, Kenya, Uganda, South Africa and more joined the AfroBreak family.' },
  { year: '2023', title: 'Africa Final & Champions', desc: 'Hosted the most prestigious break dance event on the continent. Lil Vic became AfroBreak African Champion. Tris Naomi dominated at national and international level.' },
  { year: '2024', title: 'Paris Olympics Recognition', desc: 'Bboy Lyricx was inducted into the Hall of Fame at the Paris 2024 Olympic and Paralympic Games through the Future Leaders Invitation Program (PIPA) on Sports and Diplomacy.' },
  { year: '2026', title: 'Dakar Youth Olympics', desc: 'Preparing Africa\'s finest breakers for the Dakar 2026 Youth Olympics Games as breaking cements its place as one of the most youthful sports in the world.' },
]

const countries = [
  { name: 'Ghana', flag: '🇬🇭', desc: 'Home of Bboy Lyricx and Africa Breaking Academy. Ghana\'s breaking scene is one of the most vibrant on the continent, producing champions like Blesso, Tris Naomi, Nagi, Viks, and Roxy. Accra and Tamale are major hotbeds of hiphop culture and breaking.' },
  { name: 'Nigeria', flag: '🇳🇬', desc: 'Africa\'s most populous nation has produced elite breakers including Lil Vic (AfroBreak African Champion 2023) and Kris (Girls Champion 2025). Nigeria\'s Afrobeats and hiphop scene is globally influential, fueling a powerhouse breaking community.' },
  { name: 'Benin', flag: '🇧🇯', desc: 'A rising powerhouse in African breaking. Smith (AfroBreak African Champion 2024), Sandrine (Girls Champion 2023), ZH, and Ola represent Benin\'s growing and talented hiphop movement on the continental stage.' },
  { name: 'Togo', flag: '🇹🇬', desc: 'Home of Chris Paul and Zira, two standout regional champions. Togo\'s urban youth culture and breaking community have grown rapidly, producing dancers with raw energy and technical brilliance.' },
  { name: 'Ivory Coast', flag: '🇨🇮', desc: 'Blanchard is one of Ivory Coast\'s finest breakers. The country\'s deep musical roots in Coupé-Décalé and Afrobeats fuel a rich urban dance scene connecting street culture with artistic expression.' },
  { name: 'Senegal', flag: '🇸🇳', desc: 'Pape from Senegal was the AfroBreak African Champion 2022. Dakar\'s thriving hiphop scene — one of Africa\'s oldest and most respected — continues to inspire breakers across the continent.' },
  { name: 'Guinea Conakry', flag: '🇬🇳', desc: 'Guinea\'s vibrant musical heritage in traditional djembe rhythms and instruments has produced passionate hiphop practitioners who bridge deep cultural roots with the global language of breaking.' },
  { name: 'DR Congo', flag: '🇨🇩', desc: 'Kinshasa\'s legendary Rumba and Ndombolo tradition meets contemporary hiphop, producing dancers with extraordinary musicality and rhythm. The Congo\'s creative energy is unmatched across the continent.' },
  { name: 'Uganda', flag: '🇺🇬', desc: 'Pencil is one of Uganda\'s finest ambassadors on the AfroBreak stage. Kampala hosts the East Africa Qualifier and a rapidly growing breaking scene driven by passionate youth communities.' },
  { name: 'Kenya', flag: '🇰🇪', desc: 'Lil Dan represents Kenya\'s growing breaking movement. Nairobi\'s thriving youth culture and Gengetone urban music scene continue to produce talented breakers pushing East African hiphop forward.' },
  { name: 'Tanzania', flag: '🇹🇿', desc: 'East Africa\'s hiphop scene, known locally as Bongo Flava, blends Swahili lyricism with global influences, creating a unique and powerful foundation for breaking culture across the region.' },
  { name: 'Rwanda', flag: '🇷🇼', desc: 'Rwanda\'s youth-driven cultural renaissance includes a growing hiphop and breaking movement, particularly in Kigali, reflecting the country\'s forward-looking spirit and investment in young people.' },
  { name: 'Zimbabwe', flag: '🇿🇼', desc: 'Zimbabwe\'s deep roots in music and rhythm — from mbira to contemporary Zimdancehall — fuel a passionate breaking and hiphop community with its own distinctive flavor and identity.' },
  { name: 'South Africa', flag: '🇿🇦', desc: 'Courtnea Paul (Girls Champion 2024), The Curse, and Elvina Vee (WDSF judge) represent South Africa\'s rich breaking scene. Cape Town, Johannesburg, and Durban have produced world-class talent.' },
  { name: 'Burkina Faso', flag: '🇧🇫', desc: 'Dansi from Burkina Faso is a standout regional champion. Ouagadougou\'s cultural scene has long been a beacon for African arts, now fully embracing hiphop and breaking as youth expressions.' },
  { name: 'Niger', flag: '🇳🇪', desc: 'Niger\'s youth are increasingly connecting with hiphop culture as a vehicle for expression, resilience, and community. Breaking offers a powerful stage for a generation ready to show their voice.' },
  { name: 'Sierra Leone', flag: '🇸🇱', desc: 'Freetown\'s vibrant street culture has embraced breaking and hiphop as powerful tools for youth empowerment, creative expression, and community building in West Africa.' },
  { name: 'Angola', flag: '🇦🇴', desc: 'Luanda\'s legendary Kuduro dance tradition shares deep DNA with breaking — energy, creativity, and street origins. Angola\'s hiphop scene is one of Southern Africa\'s most distinctive.' },
  { name: 'Mauritius', flag: '🇲🇺', desc: 'David represents Mauritius on the AfroBreak stage. This island nation\'s diverse cultural mix — African, Indian, and French — creates a unique and colorful hiphop flavor unlike anywhere else.' },
  { name: 'Algeria', flag: '🇩🇿', desc: 'Zinji from Algeria is the AfroBreak African Champion 2025, putting North Africa firmly on the continental breaking map. Algeria\'s urban youth culture and breaking scene are thriving.' },
  { name: 'Morocco', flag: '🇲🇦', desc: 'Morocco\'s cosmopolitan cities — Casablanca and Rabat — have a growing breaking scene, connecting North African urban culture with the pan-African and global hiphop movement.' },
  { name: 'Cameroon', flag: '🇨🇲', desc: 'Cameroon\'s rich musical tradition — from Bikutsi to Makossa — creates a vibrant foundation for hiphop and breaking culture across this culturally diverse and creatively explosive nation.' },
]

const services = [
  { icon: Film, title: 'Documentary Production', desc: 'We specialize in producing high-quality documentaries that capture compelling stories, cultural movements, artistic journeys, and social impact projects. From concept development to final editing, our team handles the full production process.' },
  { icon: Music2, title: 'DJ Services & Equipment Rental', desc: 'We provide professional DJ services for events of all scales—from dance battles to corporate functions. Our DJ equipment rental service includes sound systems, turntables, mixers, and accessories to meet your audio needs.' },
  { icon: Camera, title: 'Camera & Media Equipment Rentals', desc: 'Access high-quality video and photography gear through our rental service. Ideal for content creators, production teams, and freelancers working on short-term projects, workshops, or live events.' },
  { icon: CalendarDays, title: 'Event Planning & Management', desc: 'From concept to execution, we offer comprehensive event planning services for cultural festivals, dance competitions, educational workshops, and corporate gatherings. Our team ensures smooth coordination and impactful experiences.' },
  { icon: Image, title: 'Photography & Videography Services', desc: 'We offer professional photography and videography services for performances, campaigns, interviews, and branded content. Whether for social media, marketing, or archival purposes, we capture moments that matter.' },
  { icon: Megaphone, title: 'Marketing & Creative Branding', desc: 'Our creative team supports artists, startups, and organizations with branding, content creation, and social media strategy. We help you communicate your message effectively and build a memorable visual identity.' },
  { icon: Dumbbell, title: 'Dance Training & Workshops', desc: 'We offer personalized one-on-one training, group classes, and team-building dance workshops for schools, communities, and corporate organizations. Our fitness-focused workshops promote health and creativity in an engaging and inclusive environment.' },
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
  { id: 'd1', name: 'Nana Tuffour Okai', role: 'Founder & Creative Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Professionally known as Bboy Lyricx — pioneer of Afrobreak, co-founder of ABA, WDSF licensed athlete, Paris 2024 Olympics Hall of Fame inductee.', display_order: 0 },
  { id: 'd2', name: 'Francis Feby', role: 'Finance & Administration', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', bio: 'Oversees the financial management and administrative operations of Africa Breaking Academy, ensuring sustainable growth and transparency.', display_order: 1 },
  { id: 'd3', name: 'Christable Okai', role: 'Communication & Relationship Manager', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80', bio: 'Leads communications, media relations, and community partnerships for ABA and AfroBreak across Africa and the global diaspora.', display_order: 2 },
  { id: 'd4', name: 'Maxwell Tetteh Neur', role: 'Project Coordinator & Advisory Board', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80', bio: 'Project Coordinator and Advisory Board Member, supporting program delivery, stakeholder engagement, and strategic planning.', display_order: 3 },
]

export default function AboutPage() {
  const [team, setTeam] = useState(defaultTeam)
  const [selectedCountry, setSelectedCountry] = useState<typeof countries[0] | null>(null)
  const [bioExpanded, setBioExpanded] = useState(false)
  const [champExpanded, setChampExpanded] = useState(false)

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
            Inspire. Empower<br />
            <span className="gradient-text-orange">Breakthrough.</span>
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
            <h2 className="text-3xl font-black text-white mb-6">The African Dance Organization with 21+ Country Reach</h2>
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
              { value: '28+', label: 'African Countries' },
              { value: '2021', label: 'Championship Founded' },
              { value: '270+', label: 'Events Organized' },
              { value: '11K+', label: 'Beneficiaries' },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {champExpanded && (
            <div className="space-y-4 mt-4">
              <p className="text-text-secondary max-w-3xl mx-auto leading-relaxed">
                The Afrobreak Concepts by Africa Breaking Academy is a Leading Community Event hub that celebrates Dance culture through high-level competition, cultural exchange, and creative expression. The Africa Final Bringing together top dancers from Africa and International Guests around the world. Alongside the competition, the championship offers rich cultural programming, including documentary screenings, educational workshops, and live street culture showcases. Afrobreak is more than a battle—it&apos;s a global platform amplifying African Talents Breakthroughs, empowering young talent, and uniting communities through dance.
              </p>
              <p className="text-text-secondary max-w-3xl mx-auto leading-relaxed">
                From 2021 Afrobreak International Championship has provided the biggest platform and infrastructure for Ghanaian and African talents to learn, contest and compete to earn a good status and opportunities to take their talent to the next level. Dancers across the Globe gather to showcase their powers and creative expression.
              </p>
              <p className="text-text-secondary max-w-3xl mx-auto leading-relaxed">
                AfroBreak has gained recognition across the African continent as the most prestigious break dance event celebrating Hip Hop Culture, fostering cultural exchange and youth empowerment providing spotlight for African&apos;s talents as they showcase their talents and skills to an attracted audience. Winners get the chance to represent the African continent in France, Netherlands and Europe.
              </p>
            </div>
          )}

          <button
            onClick={() => setChampExpanded(v => !v)}
            className="mt-5 inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 font-semibold transition-colors text-xs uppercase tracking-widest"
          >
            {champExpanded ? '↑ Show less' : '↓ Read more'}
          </button>
        </div>

        {/* Countries */}
        <div className="bg-surface border border-white/5 rounded-2xl p-8">
          <p className="text-center text-sm font-semibold text-primary-500 uppercase tracking-widest mb-6">Represented Countries</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {countries.map(country => (
              <button
                key={country.name}
                onClick={() => setSelectedCountry(country)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:border-primary-500/40 hover:bg-primary-500/10 transition-all duration-200 group"
              >
                <span className="text-xl leading-none">{country.flag}</span>
                <span className="text-sm font-medium">{country.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Country Modal */}
        {selectedCountry && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedCountry(null)}
          >
            <div
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-primary-500/20 to-secondary-500/10 p-8 text-center border-b border-white/10">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-black/30 text-white/60 hover:text-white hover:bg-black/50 transition-all text-lg"
                >
                  ✕
                </button>
                <div className="text-7xl mb-3 leading-none">{selectedCountry.flag}</div>
                <h3 className="text-2xl font-black text-white">{selectedCountry.name}</h3>
                <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-400 font-semibold uppercase tracking-widest">
                  Hiphop Culture
                </span>
              </div>
              {/* Body */}
              <div className="p-6">
                <p className="text-text-secondary text-sm leading-relaxed">{selectedCountry.desc}</p>
              </div>
            </div>
          </div>
        )}
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
              <p>Nana Tuffour Okai, professionally known as <span className="text-white font-semibold">Bboy Lyricx</span>, is an influential indigenous hip-hop practitioner, cultural architect, and dancer from Accra, Ghana. He is widely recognized as a pioneer of Afrobreak, an innovative concept that fuses traditional African movement philosophies with the global language of breaking.</p>
              <p>As the co-founder of Africa Breaking Academy (ABA), Lyricx has played a transformative role in the growth and sustainability of breaking and hip-hop culture across Ghana and the African continent. Through the Academy, he has created impactful, grassroots platforms that nurture young talent, promote creative excellence, and provide access to professional pathways within hip-hop and sports culture.</p>

              {bioExpanded && (
                <div className="space-y-4">
                  <p>Lyricx&apos;s long-standing commitment to cultural development and youth empowerment has significantly contributed to the expansion of grassroots hip-hop and breaking in Africa. His work earned international recognition through the <span className="text-white font-semibold">Future Leaders Invitation Program (PIPA) on Sports and Diplomacy</span>, culminating in his induction into the Hall of Fame at the Paris 2024 Olympic and Paralympic Games.</p>
                  <p>A global ambassador for African dance, Bboy Lyricx is among Ghana&apos;s leading forerunners in breaking, with over <span className="text-white font-semibold">36 countries</span> to his credit as a battle competitor, judge, and workshop facilitator. His influence spans continents, bridging African heritage with contemporary global dance culture.</p>
                  <p>Rooted in his own journey from underserved communities, Lyricx is deeply committed to being a positive role model for young people. Through Africa Breaking Academy, he continues to empower the next generation by offering inclusive platforms that foster personal development, cultural identity, and sustainable career growth within hip-hop and sport.</p>
                  <p>He is a professional License Athlete by <span className="text-white font-semibold">World Dance Sports Federation (WDSF)</span> and throughout his career, he has organized, instructed, and judged numerous dance workshops and events in over <span className="text-white font-semibold">25 countries across Africa and Europe</span>. A multiple award-winning dancer recognized at the Ghana Dance Awards, Bboy Lyricx aspires to be a positive role model, especially for youth from underserved communities where he first discovered his creative potential.</p>
                </div>
              )}

              <button
                onClick={() => setBioExpanded(v => !v)}
                className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 font-semibold transition-colors text-xs uppercase tracking-widest"
              >
                {bioExpanded ? '↑ Show less' : '↓ Read more'}
              </button>
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
            <p className="text-text-secondary mt-3 max-w-xl mx-auto">At Afro Break Concepts, we offer a range of creative and technical services designed to support individuals, organizations, and brands in the arts, culture, and entertainment sectors.</p>
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
              <h3 className="font-bold text-white mb-1">Africa Breaking Academy Dance Training & Workshops</h3>
              <p className="text-sm text-text-secondary leading-relaxed">We offer personalized one-on-one training, group classes, and team-building dance workshops for schools, communities, and corporate organizations. Our fitness-focused workshops promote health and creativity in an engaging and inclusive environment.</p>
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
