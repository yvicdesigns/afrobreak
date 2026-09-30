'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, Search, ChevronDown, LogOut, User, Settings,
  Heart, Clock, Crown, Play, Trophy, Mail, Users, Newspaper,
  Briefcase, Handshake, History, Star, Calendar, Globe,
  Video, Music, BookOpen, Camera
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { supabase } from '@/lib/supabase'
import { getSetting } from '@/lib/db'
import { useLanguage } from '@/lib/LanguageContext'

function NavDropdown({ label, links, pathname }: {
  label: string
  links: { label: string; href: string; icon: React.ElementType }[]
  pathname: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = links.some(l => pathname === l.href || pathname.startsWith(l.href.split('?')[0]))

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          isActive ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5'
        )}
      >
        {label}
        <ChevronDown size={13} className={clsx('transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-slide-down">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
              >
                <Icon size={14} className="text-primary-500 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const { currentUser, logout } = useAuthStore()
  const { tr, lang, toggle: toggleLang } = useLanguage()

  const aboutLinks = [
    { label: tr.nav.aboutUs, href: '/about', icon: Users },
    { label: tr.nav.instructors, href: '/instructors', icon: Star },
    { label: tr.nav.press, href: '/press', icon: Newspaper },
    { label: tr.nav.careers, href: '/careers', icon: Briefcase },
    { label: tr.nav.partners, href: '/partners', icon: Handshake },
  ]

  const eventsLinks = [
    { label: tr.nav.upcoming, href: '/events?tab=upcoming', icon: Calendar },
    { label: tr.nav.international, href: '/events?tab=international', icon: Globe },
    { label: tr.nav.history, href: '/events?tab=history', icon: History },
  ]

  const platformLinks = [
    { label: tr.nav.gallery, href: '/photos', icon: Camera },
    { label: tr.nav.music, href: '/music', icon: Music },
    { label: tr.nav.videos, href: '/videos', icon: Video },
    { label: tr.nav.blog, href: '/blog', icon: BookOpen },
  ]

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoBg, setLogoBg] = useState<{ color: string; opacity: number; shape: string; padding: number; size: number } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([getSetting('site_logo'), getSetting('logo_bg')]).then(([logo, bg]) => {
      setLogoUrl(logo || '')
      if (bg) try { setLogoBg(JSON.parse(bg)) } catch {}
    })
  }, [])

  useEffect(() => {
    if (!currentUser) { setIsAdmin(false); return }
    supabase.from('profiles').select('is_admin').eq('id', currentUser.id).single()
      .then(({ data }) => setIsAdmin(data?.is_admin ?? false))
  }, [currentUser])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const flatLinks = [
    { label: tr.nav.home, href: '/' },
    { label: tr.nav.awards, href: '/awards' },
    { label: tr.nav.gallery, href: '/photos' },
    { label: tr.nav.store, href: '/store' },
    { label: tr.nav.contact, href: '/contact' },
  ]

  return (
    <>
      <nav className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled || mobileOpen
          ? 'bg-background/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              {logoUrl === null ? (
                <div style={{ width: 32, height: 32 }} />
              ) : logoUrl ? (
                <div
                  className={`flex items-center justify-center overflow-hidden flex-shrink-0 transition-shadow group-hover:shadow-lg ${!logoBg ? '' : logoBg.shape === 'circle' ? 'rounded-full' : logoBg.shape === 'rounded' ? 'rounded-xl' : 'rounded-none'}`}
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
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-glow-blue group-hover:shadow-[0_0_30px_rgba(13,61,200,0.6)] transition-shadow">
                    <Play size={14} className="text-white fill-white ml-0.5" />
                  </div>
                  <span className="text-xl font-black tracking-tight">
                    <span className="text-primary-500">AFRO</span>
                    <span className="text-white">BREAK</span>
                  </span>
                </>
              )}
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              <Link href="/" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>{tr.nav.home}</Link>
              <NavDropdown label={tr.nav.about} links={aboutLinks} pathname={pathname} />
              <NavDropdown label={tr.nav.events} links={eventsLinks} pathname={pathname} />
              <Link href="/awards" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/awards' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>{tr.nav.awards}</Link>
              <NavDropdown label={tr.nav.platform} links={platformLinks} pathname={pathname} />
              <Link href="/store" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/store' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>{tr.nav.store}</Link>
              <Link href="/contact" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/contact' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>{tr.nav.contact}</Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all duration-200"
                aria-label="Toggle language"
              >
                <span className={lang === 'en' ? 'text-primary-400' : 'text-text-muted'}>EN</span>
                <span className="text-white/20">|</span>
                <span className={lang === 'fr' ? 'text-primary-400' : 'text-text-muted'}>FR</span>
              </button>
              <ThemeToggle />
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200">
                <Search size={18} />
              </button>

              {currentUser ? (
                <div ref={dropdownRef} className="relative hidden lg:block">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 group">
                    <div className="relative">
                      <img src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/40 group-hover:ring-primary-500/70 transition-all" />
                      {currentUser.isPremium && <Crown size={10} className="absolute -top-1 -right-1 text-gold" />}
                    </div>
                    <span className="text-sm font-medium text-white max-w-[80px] truncate">{currentUser.name}</span>
                    <ChevronDown size={14} className={clsx('text-text-secondary transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-slide-down overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-text-secondary truncate">{currentUser.email}</p>
                        {currentUser.isPremium && <span className="inline-flex items-center gap-1 mt-1 text-xs text-gold"><Crown size={10} /> Premium</span>}
                      </div>
                      <div className="p-2">
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"><User size={15} /> {tr.nav.profile}</Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"><Heart size={15} /> {tr.nav.favorites}</Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"><Clock size={15} /> {tr.nav.watchLater}</Link>
                        {!currentUser.isPremium && <Link href="/subscribe" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gold hover:bg-gold/10 transition-all"><Crown size={15} /> {tr.nav.goPremium}</Link>}
                        {isAdmin && <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"><Settings size={15} /> {tr.nav.admin}</Link>}
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <button onClick={() => { logout(); setDropdownOpen(false) }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={15} /> {tr.nav.signOut}</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/auth/login"><Button variant="ghost" size="sm">{tr.nav.signIn}</Button></Link>
                  <Link href="/auth/signup"><Button variant="primary" size="sm">{tr.nav.signUp}</Button></Link>
                </div>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="pb-4 animate-slide-down">
              <SearchBar placeholder={tr.nav.searchPlaceholder} autoFocus className="w-full"
                onSubmit={(val) => { if (val.trim()) window.location.href = `/videos?search=${encodeURIComponent(val)}`; setSearchOpen(false) }} />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-background/98 backdrop-blur-xl border-t border-white/10 animate-slide-down max-h-[80vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link href="/" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>{tr.nav.home}</Link>

              {/* About accordion */}
              <button onClick={() => setMobileSection(mobileSection === 'about' ? null : 'about')} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                {tr.nav.about} <ChevronDown size={16} className={clsx('transition-transform', mobileSection === 'about' && 'rotate-180')} />
              </button>
              {mobileSection === 'about' && aboutLinks.map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 px-8 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                  <l.icon size={14} className="text-primary-500" />{l.label}
                </Link>
              ))}

              {/* Events accordion */}
              <button onClick={() => setMobileSection(mobileSection === 'events' ? null : 'events')} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                {tr.nav.events} <ChevronDown size={16} className={clsx('transition-transform', mobileSection === 'events' && 'rotate-180')} />
              </button>
              {mobileSection === 'events' && eventsLinks.map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 px-8 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                  <l.icon size={14} className="text-primary-500" />{l.label}
                </Link>
              ))}

              <Link href="/awards" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/awards' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>{tr.nav.awards}</Link>

              {/* Platform accordion */}
              <button onClick={() => setMobileSection(mobileSection === 'platform' ? null : 'platform')} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                {tr.nav.platform} <ChevronDown size={16} className={clsx('transition-transform', mobileSection === 'platform' && 'rotate-180')} />
              </button>
              {mobileSection === 'platform' && platformLinks.map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 px-8 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                  <l.icon size={14} className="text-primary-500" />{l.label}
                </Link>
              ))}

              <Link href="/store" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/store' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>{tr.nav.store}</Link>
              <Link href="/contact" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/contact' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>{tr.nav.contact}</Link>

              {/* Language toggle mobile */}
              <div className="flex items-center px-4 py-3">
                <button onClick={toggleLang} className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-white transition-colors">
                  <span className={lang === 'en' ? 'text-primary-400' : ''}>EN</span>
                  <span className="text-white/20">|</span>
                  <span className={lang === 'fr' ? 'text-primary-400' : ''}>FR</span>
                </button>
              </div>

              <div className="pt-4 border-t border-white/10">
                {currentUser ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <img src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/40" />
                      <div>
                        <p className="font-semibold text-white">{currentUser.name}</p>
                        <p className="text-xs text-text-secondary">{currentUser.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" className="block px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all">{tr.nav.profile}</Link>
                    {isAdmin && <Link href="/admin" className="block px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all">{tr.nav.admin}</Link>}
                    <button onClick={logout} className="block w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">{tr.nav.signOut}</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-4">
                    <Link href="/auth/login"><Button variant="secondary" fullWidth>{tr.nav.signIn}</Button></Link>
                    <Link href="/auth/signup"><Button variant="primary" fullWidth>{tr.nav.signUp}</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
