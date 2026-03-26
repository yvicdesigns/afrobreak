'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, Search, ChevronDown, LogOut, User, Settings,
  Heart, Clock, Crown, Play, Trophy, Mail, Users, Newspaper,
  Briefcase, Handshake, History, FolderOpen, Star, MapPin,
  Video, Music, BookOpen, Camera
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import { supabase } from '@/lib/supabase'

const aboutLinks = [
  { label: 'About Us', href: '/about', icon: Users },
  { label: 'Instructors', href: '/instructors', icon: Star },
  { label: 'Press', href: '/press', icon: Newspaper },
  { label: 'Careers', href: '/careers', icon: Briefcase },
  { label: 'Partners', href: '/partners', icon: Handshake },
]

const eventsLinks = [
  { label: 'History', href: '/events?tab=history', icon: History },
  { label: 'Projects', href: '/events?tab=projects', icon: FolderOpen },
  { label: 'Qualifiers', href: '/events?tab=qualifiers', icon: MapPin },
  { label: 'Africa Final', href: '/events?tab=africa-final', icon: Trophy },
]

const platformLinks = [
  { label: 'Videos', href: '/videos', icon: Video },
  { label: 'Music', href: '/music', icon: Music },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Gallery', href: '/photos', icon: Camera },
]

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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    { label: 'Home', href: '/' },
    { label: 'Awards', href: '/awards' },
    { label: 'Gallery', href: '/photos' },
    { label: 'Shop', href: '/store' },
    { label: 'Contact', href: '/contact' },
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
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-glow-orange group-hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-shadow">
                <Play size={14} className="text-white fill-white ml-0.5" />
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-primary-500">AFRO</span>
                <span className="text-white">BREAK</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              <Link href="/" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Home</Link>
              <NavDropdown label="About" links={aboutLinks} pathname={pathname} />
              <NavDropdown label="Events" links={eventsLinks} pathname={pathname} />
              <Link href="/awards" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/awards' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Awards</Link>
              <Link href="/photos" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/photos' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Gallery</Link>
              <NavDropdown label="Platform" links={platformLinks} pathname={pathname} />
              <Link href="/store" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/store' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Shop</Link>
              <Link href="/contact" className={clsx('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', pathname === '/contact' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Contact</Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200">
                <Search size={18} />
              </button>

              {currentUser ? (
                <div ref={dropdownRef} className="relative hidden lg:block">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 group">
                    <div className="relative">
                      <img src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/40 group-hover:ring-primary-500/70 transition-all" />
                      {currentUser.isPremium && <Crown size={10} className="absolute -top-1 -right-1 text-gold-DEFAULT" />}
                    </div>
                    <span className="text-sm font-medium text-white max-w-[80px] truncate">{currentUser.name}</span>
                    <ChevronDown size={14} className={clsx('text-text-secondary transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-slide-down overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-text-secondary truncate">{currentUser.email}</p>
                        {currentUser.isPremium && <span className="inline-flex items-center gap-1 mt-1 text-xs text-gold-DEFAULT"><Crown size={10} /> Premium</span>}
                      </div>
                      <div className="p-2">
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"><User size={15} /> Profile</Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"><Heart size={15} /> Favorites</Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"><Clock size={15} /> Watch Later</Link>
                        {!currentUser.isPremium && <Link href="/subscribe" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gold-DEFAULT hover:bg-gold-DEFAULT/10 transition-all"><Crown size={15} /> Go Premium</Link>}
                        {isAdmin && <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"><Settings size={15} /> Admin</Link>}
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <button onClick={() => { logout(); setDropdownOpen(false) }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={15} /> Sign Out</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/auth/login"><Button variant="ghost" size="sm">Login</Button></Link>
                  <Link href="/auth/signup"><Button variant="primary" size="sm">Get Started</Button></Link>
                </div>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="pb-4 animate-slide-down">
              <SearchBar placeholder="Search videos, events, blog posts..." autoFocus className="w-full"
                onSubmit={(val) => { if (val.trim()) window.location.href = `/videos?search=${encodeURIComponent(val)}`; setSearchOpen(false) }} />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-background/98 backdrop-blur-xl border-t border-white/10 animate-slide-down max-h-[80vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link href="/" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Home</Link>

              {/* About accordion */}
              <button onClick={() => setMobileSection(mobileSection === 'about' ? null : 'about')} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                About <ChevronDown size={16} className={clsx('transition-transform', mobileSection === 'about' && 'rotate-180')} />
              </button>
              {mobileSection === 'about' && aboutLinks.map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 px-8 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                  <l.icon size={14} className="text-primary-500" />{l.label}
                </Link>
              ))}

              {/* Events accordion */}
              <button onClick={() => setMobileSection(mobileSection === 'events' ? null : 'events')} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                Events <ChevronDown size={16} className={clsx('transition-transform', mobileSection === 'events' && 'rotate-180')} />
              </button>
              {mobileSection === 'events' && eventsLinks.map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 px-8 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                  <l.icon size={14} className="text-primary-500" />{l.label}
                </Link>
              ))}

              <Link href="/awards" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/awards' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Awards</Link>
              <Link href="/photos" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/photos' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Gallery</Link>

              {/* Platform accordion */}
              <button onClick={() => setMobileSection(mobileSection === 'platform' ? null : 'platform')} className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                Platform <ChevronDown size={16} className={clsx('transition-transform', mobileSection === 'platform' && 'rotate-180')} />
              </button>
              {mobileSection === 'platform' && platformLinks.map(l => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 px-8 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                  <l.icon size={14} className="text-primary-500" />{l.label}
                </Link>
              ))}

              <Link href="/store" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/store' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Shop</Link>
              <Link href="/contact" className={clsx('block px-4 py-3 rounded-xl text-base font-medium transition-all', pathname === '/contact' ? 'text-primary-500 bg-primary-500/10' : 'text-text-secondary hover:text-white hover:bg-white/5')}>Contact</Link>

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
                    <Link href="/profile" className="block px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all">Profile</Link>
                    {isAdmin && <Link href="/admin" className="block px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all">Admin</Link>}
                    <button onClick={logout} className="block w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">Sign Out</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-4">
                    <Link href="/auth/login"><Button variant="secondary" fullWidth>Login</Button></Link>
                    <Link href="/auth/signup"><Button variant="primary" fullWidth>Get Started Free</Button></Link>
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
