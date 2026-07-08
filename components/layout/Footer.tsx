'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, Instagram, Twitter, Youtube, Facebook, Mail, ArrowRight } from 'lucide-react'
import DonateButton from '@/components/ui/DonateButton'
import { getSetting } from '@/lib/db'

const platformLinks = [
  { label: 'Gallery', href: '/photos' },
  { label: 'Music', href: '/music' },
  { label: 'Videos', href: '/videos' },
  { label: 'Blog', href: '/blog' },
]

const eventsLinks = [
  { label: 'Upcoming', href: '/events?tab=upcoming' },
  { label: 'International', href: '/events?tab=international' },
  { label: 'History', href: '/events?tab=history' },
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
  { label: 'Ambassadors', href: '/instructors' },
  { label: 'Careers', href: '/careers' },
]

type SocialLinks = { instagram: string; youtube: string; twitter: string; facebook: string }

const defaultSocial: SocialLinks = {
  instagram: '',
  youtube: '',
  twitter: '',
  facebook: '',
}

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoBg, setLogoBg] = useState<{ color: string; opacity: number; shape: string; padding: number; size: number } | null>(null)
  const [social, setSocial] = useState<SocialLinks>(defaultSocial)

  useEffect(() => {
    Promise.all([getSetting('site_logo'), getSetting('logo_bg'), getSetting('social_links')]).then(([logo, bg, socialRaw]) => {
      setLogoUrl(logo || '')
      if (bg) try { setLogoBg(JSON.parse(bg)) } catch {}
      if (socialRaw) try { setSocial(JSON.parse(socialRaw)) } catch {}
    })
  }, [])

  const socialLinks = [
    { icon: Instagram, href: social.instagram, label: 'Instagram', show: !!social.instagram },
    { icon: Youtube, href: social.youtube, label: 'YouTube', show: !!social.youtube },
    { icon: Twitter, href: social.twitter, label: 'Twitter', show: !!social.twitter },
    { icon: Facebook, href: social.facebook, label: 'Facebook', show: !!social.facebook },
  ].filter(s => s.show)

  return (
    <footer className="bg-surface border-t border-white/5 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-6">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              {logoUrl === null ? (
                <div style={{ width: 40, height: 40 }} />
              ) : logoUrl ? (
                <div
                  className={`flex items-center justify-center overflow-hidden flex-shrink-0 ${!logoBg ? '' : logoBg.shape === 'circle' ? 'rounded-full' : logoBg.shape === 'rounded' ? 'rounded-xl' : 'rounded-none'}`}
                  style={logoBg ? {
                    width: (logoBg.size ?? 40) + logoBg.padding,
                    height: (logoBg.size ?? 40) + logoBg.padding,
                    backgroundColor: (() => {
                      const r = parseInt(logoBg.color.slice(1,3), 16)
                      const g = parseInt(logoBg.color.slice(3,5), 16)
                      const b = parseInt(logoBg.color.slice(5,7), 16)
                      return `rgba(${r},${g},${b},${logoBg.opacity/100})`
                    })(),
                  } : {}}
                >
                  <img src={logoUrl} alt="AfroBreak" className="object-contain" style={{ width: logoBg?.size ?? 40, height: logoBg?.size ?? 40 }} />
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow-blue">
                    <Play size={16} className="text-white fill-white ml-0.5" />
                  </div>
                  <span className="text-2xl font-black tracking-tight">
                    <span className="text-primary-500">AFRO</span>
                    <span className="text-white">BREAK</span>
                  </span>
                </>
              )}
            </Link>

            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              The premier platform for african dance Community . Learn from our well versed ambassadors , attend live events and connect with a global community of dancers.
            </p>

            {/* Social */}
            {socialLinks.length > 0 && (
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
            )}

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
