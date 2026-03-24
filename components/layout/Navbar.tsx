'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, Search, ChevronDown, LogOut, User, Settings,
  Heart, Clock, Crown, Play
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/lib/store'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Videos', href: '/videos' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { currentUser, logout } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-40',
          'transition-all duration-300',
          scrolled || mobileOpen
            ? 'bg-background/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
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

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Search size={18} />
              </button>

              {currentUser ? (
                <div ref={dropdownRef} className="relative hidden lg:block">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/40 group-hover:ring-primary-500/70 transition-all"
                      />
                      {currentUser.isPremium && (
                        <Crown size={10} className="absolute -top-1 -right-1 text-gold-DEFAULT" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-white max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                    <ChevronDown
                      size={14}
                      className={clsx(
                        'text-text-secondary transition-transform duration-200',
                        dropdownOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-slide-down overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-text-secondary truncate">{currentUser.email}</p>
                        {currentUser.isPremium && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs text-gold-DEFAULT">
                            <Crown size={10} /> Premium Member
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                        >
                          <User size={15} /> Profile
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Heart size={15} /> Favorites
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Clock size={15} /> Watch Later
                        </Link>
                        {!currentUser.isPremium && (
                          <Link
                            href="/subscribe"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gold-DEFAULT hover:bg-gold-DEFAULT/10 transition-all"
                          >
                            <Crown size={15} /> Upgrade to Premium
                          </Link>
                        )}
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Settings size={15} /> Admin
                        </Link>
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <button
                            onClick={() => { logout(); setDropdownOpen(false) }}
                            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="primary" size="sm">Get Started</Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          {searchOpen && (
            <div className="pb-4 animate-slide-down">
              <SearchBar
                placeholder="Search videos, events, blog posts..."
                autoFocus
                className="w-full"
                onSubmit={(val) => {
                  if (val.trim()) window.location.href = `/videos?search=${encodeURIComponent(val)}`
                  setSearchOpen(false)
                }}
              />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-background/98 backdrop-blur-xl border-t border-white/10 animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'text-primary-500 bg-primary-500/10'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/40"
                      />
                      <div>
                        <p className="font-semibold text-white">{currentUser.name}</p>
                        <p className="text-xs text-text-secondary">{currentUser.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" className="block px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all">Profile</Link>
                    <Link href="/subscribe" className="block px-4 py-3 rounded-xl text-gold-DEFAULT hover:bg-gold-DEFAULT/10 transition-all">Upgrade to Premium</Link>
                    <Link href="/admin" className="block px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all">Admin</Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-4">
                    <Link href="/auth/login">
                      <Button variant="secondary" fullWidth>Login</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button variant="primary" fullWidth>Get Started Free</Button>
                    </Link>
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
