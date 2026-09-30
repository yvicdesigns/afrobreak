'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, Instagram, Twitter, Youtube, Facebook, Mail, ArrowRight } from 'lucide-react'
import DonateButton from '@/components/ui/DonateButton'
import { getSetting } from '@/lib/db'
import { useLanguage } from '@/lib/LanguageContext'

type SocialLinks = { instagram: string; youtube: string; twitter: string; facebook: string }

const defaultSocial: SocialLinks = {
  instagram: '',
  youtube: '',
  twitter: '',
  facebook: '',
}

export default function Footer() {
  const { tr } = useLanguage()
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoBg, setLogoBg] = useState<{ color: string; opacity: number; shape: string; padding: number; size: number } | null>(null)
  const [social, setSocial] = useState<SocialLinks>(defaultSocial)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleNewsletter = async () => {
    if (!newsletterEmail || !/\S+@\S+\.\S+/.test(newsletterEmail)) return
    setNewsletterState('loading')
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsletterEmail }),
    })
    setNewsletterState(res.ok ? 'done' : 'error')
    if (res.ok) setNewsletterEmail('')
  }

  const platformLinks = [
    { label: tr.footer.gallery, href: '/photos' },
    { label: tr.footer.music, href: '/music' },
    { label: tr.footer.videos, href: '/videos' },
    { label: tr.footer.blog, href: '/blog' },
  ]

  const eventsLinks = [
    { label: tr.footer.upcoming, href: '/events?tab=upcoming' },
    { label: tr.footer.international, href: '/events?tab=international' },
    { label: tr.footer.historyFooter, href: '/events?tab=history' },
  ]

  const companyLinks = [
    { label: tr.footer.aboutUs, href: '/about' },
    { label: tr.footer.press, href: '/press' },
    { label: tr.footer.partners, href: '/partners' },
    { label: tr.footer.contact, href: '/contact' },
  ]

  const moreLinks = [
    { label: tr.footer.awards, href: '/awards' },
    { label: tr.footer.shop, href: '/store' },
    { label: tr.footer.ambassadors, href: '/instructors' },
    { label: tr.footer.jobs, href: '/careers' },
  ]

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
              <p className="text-sm font-semibold text-white mb-2">{tr.footer.support}</p>
              <DonateButton variant="footer" />
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">{tr.footer.newsletter}</p>
              {newsletterState === 'done' ? (
                <p className="text-sm text-emerald-400 font-medium">{tr.footer.newsletterSuccess}</p>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center bg-background border border-white/10 rounded-xl overflow-hidden focus-within:border-primary-500/60 transition-colors">
                      <Mail size={15} className="ml-3 text-text-secondary flex-shrink-0" />
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={e => setNewsletterEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleNewsletter()}
                        placeholder={tr.footer.emailPlaceholder}
                        className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-text-muted focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleNewsletter}
                      disabled={newsletterState === 'loading'}
                      className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-[#0D0A1A] rounded-xl hover:from-primary-400 hover:to-primary-500 transition-all duration-200 flex-shrink-0 disabled:opacity-60"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  {newsletterState === 'error' && (
                    <p className="text-xs text-red-400">{tr.footer.newsletterError}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{tr.footer.platform}</h3>
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
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{tr.footer.events}</h3>
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
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{tr.footer.company}</h3>
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
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{tr.footer.more}</h3>
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
            &copy; {new Date().getFullYear()} AfroBreak. {tr.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-text-muted hover:text-text-secondary transition-colors">{tr.footer.privacy}</Link>
            <Link href="/terms" className="text-xs text-text-muted hover:text-text-secondary transition-colors">{tr.footer.terms}</Link>
            <Link href="/cookies" className="text-xs text-text-muted hover:text-text-secondary transition-colors">{tr.footer.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
