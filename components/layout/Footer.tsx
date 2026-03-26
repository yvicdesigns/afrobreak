import Link from 'next/link'
import { Play, Instagram, Twitter, Youtube, Facebook, Mail, ArrowRight } from 'lucide-react'
import DonateButton from '@/components/ui/DonateButton'

const platformLinks = [
  { label: 'Gallery', href: '/photos' },
  { label: 'Music', href: '/music' },
  { label: 'Videos', href: '/videos' },
  { label: 'Blog', href: '/blog' },
]

const eventsLinks = [
  { label: 'History', href: '/events?tab=history' },
  { label: 'Projects', href: '/events?tab=projects' },
  { label: 'Qualifiers', href: '/events?tab=qualifiers' },
  { label: 'Africa Final', href: '/events?tab=africa-final' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Press', href: '/press' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact Us', href: '/contact' },
]

const moreLinks = [
  { label: 'Awards', href: '/awards' },
  { label: 'Shop', href: '/store' },
  { label: 'Instructors', href: '/instructors' },
  { label: 'Careers', href: '/careers' },
]

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-6">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow-orange">
                <Play size={16} className="text-white fill-white ml-0.5" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                <span className="text-primary-500">AFRO</span>
                <span className="text-white">BREAK</span>
              </span>
            </Link>

            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              The premier platform for Afro and urban dance. Learn from world-class instructors, attend live events, and connect with a global community of dancers.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-primary-500 hover:bg-primary-500/10 hover:border-primary-500/30 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Donate */}
            <div>
              <p className="text-sm font-semibold text-white mb-2">Support the culture</p>
              <DonateButton variant="footer" />
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Stay in the loop</p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-background border border-white/10 rounded-xl overflow-hidden focus-within:border-primary-500/60 transition-colors">
                  <Mail size={15} className="ml-3 text-text-secondary flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-text-muted focus:outline-none"
                  />
                </div>
                <button className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-400 hover:to-primary-500 transition-all duration-200 flex-shrink-0">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-primary-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Events</h3>
            <ul className="space-y-3">
              {eventsLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-primary-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-primary-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">More</h3>
            <ul className="space-y-3">
              {moreLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-primary-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted text-center sm:text-left">
            &copy; {new Date().getFullYear()} AfroBreak. All rights reserved. Built with passion for the culture.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Terms</Link>
            <Link href="/cookies" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
