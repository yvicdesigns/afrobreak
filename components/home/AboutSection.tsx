import Link from 'next/link'
import { CheckCircle, Users, Video, Globe, Star } from 'lucide-react'
import Button from '@/components/ui/Button'

const features = [
  {
    icon: Video,
    title: '500+ Premium Videos',
    desc: 'From beginner fundamentals to advanced masterclasses across all Afro and urban styles.',
  },
  {
    icon: Users,
    title: 'World-Class Instructors',
    desc: '50+ certified instructors from Nigeria, Jamaica, France, and beyond.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    desc: 'Connect with 10,000+ dancers from the African diaspora and allies worldwide.',
  },
  {
    icon: Star,
    title: 'Live Events',
    desc: 'Workshops, shows, and battles across major European cities every month.',
  },
]

const benefits = [
  'Learn at your own pace, anytime',
  'Mobile-optimized for dancing anywhere',
  'New content added every week',
  'Cultural context, not just steps',
  'Community forums and feedback',
  'Exclusive interviews with artists',
]

const imageGrid = [
  'https://uexidlplvbssarvuxfyn.supabase.co/storage/v1/object/public/media/thumbnails/1774423447004-p0joibckz7i.jpg',
  'https://uexidlplvbssarvuxfyn.supabase.co/storage/v1/object/public/media/thumbnails/1774423671621-mziusqbbe49.jpg',
  'https://uexidlplvbssarvuxfyn.supabase.co/storage/v1/object/public/media/thumbnails/1774424299617-st0ntdzolp9.jpg',
  'https://uexidlplvbssarvuxfyn.supabase.co/storage/v1/object/public/media/thumbnails/1774424413803-ph5i2ubqwgk.jpg',
]

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-surface/20 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Features grid */}
        <div className="text-center mb-16">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Why AfroBreak
          </p>
          <h2 className="heading-lg text-white mb-4">Built for the Culture</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We didn&apos;t just build a dance platform we built a home for the global Afro and urban dance community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary-500/20 hover:bg-surface-2 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/25 transition-colors">
                <Icon size={22} className="text-primary-500" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom: Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-3">
            {imageGrid.map((src, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'row-span-2' : ''}`}
                style={{ aspectRatio: i === 0 ? '3/4' : '4/3' }}
              >
                <img
                  src={src}
                  alt="Dance"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              </div>
            ))}
            {/* Stats overlay */}
            <div className="col-span-2 -mt-16 mx-4 relative z-10">
              <div className="glass rounded-2xl p-4 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-2xl font-black gradient-text-orange">98%</div>
                  <div className="text-xs text-text-secondary">Satisfaction</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-black gradient-text-purple">4.9★</div>
                  <div className="text-xs text-text-secondary">Avg Rating</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-gold-DEFAULT">24/7</div>
                  <div className="text-xs text-text-secondary">Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-8">
            <div>
              <p className="text-secondary-400 text-sm font-semibold uppercase tracking-widest mb-3">
                Our Story
              </p>
              <h2 className="heading-md text-white mb-4">
                Rooted in Culture,<br />
                <span className="gradient-text-orange">Built for You</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                AfroBreak was born from a simple idea: that Afro and urban dance is more than movement—it&apos;s culture, history, and community. We built this platform because we wanted a space that treats dancers with the respect and depth they deserve.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Whether you&apos;re learning your first Afrobeat move or preparing for a European battle championship, AfroBreak has the content, community, and context you need.
              </p>
            </div>

            <ul className="space-y-3">
              {benefits.map(benefit => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-primary-500 flex-shrink-0" />
                  <span className="text-sm text-white">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">Join for Free</Button>
              </Link>
              <Link href="/subscribe">
                <Button variant="gold" size="lg">Go Premium</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
