'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Video, Calendar, BookOpen, Users,
  Settings, Menu, X, Play, ChevronRight, Bell
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/blog', label: 'Blog Posts', icon: BookOpen },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

const notifications = [
  { id: 1, text: 'New user signed up', time: '2 min ago', unread: true },
  { id: 2, text: 'New premium subscriber', time: '1 hour ago', unread: true },
  { id: 3, text: 'Video upload complete', time: '3 hours ago', unread: false },
]

function Sidebar({
  sidebarOpen, mobile = false, pathname, setMobileSidebarOpen
}: {
  sidebarOpen: boolean
  mobile?: boolean
  pathname: string
  setMobileSidebarOpen: (v: boolean) => void
}) {
  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <div className={clsx(
      'flex flex-col h-full',
      mobile ? 'w-64' : (sidebarOpen ? 'w-64' : 'w-16'),
      'bg-surface border-r border-white/5 transition-all duration-300'
    )}>
      <div className={clsx(
        'flex items-center border-b border-white/5 h-16 flex-shrink-0',
        (sidebarOpen || mobile) ? 'px-5 gap-3' : 'px-3 justify-center'
      )}>
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow-orange">
          <Play size={12} className="text-white fill-white ml-0.5" />
        </div>
        {(sidebarOpen || mobile) && (
          <div>
            <span className="text-sm font-black">
              <span className="text-primary-500">AFRO</span>
              <span className="text-white">BREAK</span>
            </span>
            <p className="text-[10px] text-text-muted leading-none">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              title={!sidebarOpen && !mobile ? item.label : undefined}
              className={clsx(
                'flex items-center rounded-xl transition-all duration-200 group',
                (sidebarOpen || mobile) ? 'px-3 py-2.5 gap-3' : 'p-2.5 justify-center',
                active
                  ? 'bg-primary-500/15 text-primary-400'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {(sidebarOpen || mobile) && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {active && <ChevronRight size={14} />}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {(sidebarOpen || mobile) && (
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
              <Users size={14} className="text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-text-muted truncate">admin@afrobreak.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(2)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0 fixed left-0 top-0 h-screen z-30">
        <Sidebar sidebarOpen={sidebarOpen} pathname={pathname} setMobileSidebarOpen={setMobileSidebarOpen} />
      </div>

      {/* Mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative flex-shrink-0 animate-slide-down">
            <Sidebar sidebarOpen={true} mobile pathname={pathname} setMobileSidebarOpen={setMobileSidebarOpen} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={clsx(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        'lg:ml-64'
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 sm:px-6 gap-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"
          >
            <Menu size={20} />
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center gap-2 text-sm text-text-secondary flex-1">
            <span>Admin</span>
            {pathname !== '/admin' && (
              <>
                <ChevronRight size={13} />
                <span className="text-white capitalize">
                  {pathname.split('/').pop()?.replace('-', ' ')}
                </span>
              </>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setNotifOpen(o => !o); setUnreadCount(0) }}
                className="relative p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-11 w-72 bg-surface border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-bold text-white">Notifications</p>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className={clsx('px-4 py-3 border-b border-white/5 transition-colors', n.unread ? 'bg-primary-500/5' : 'hover:bg-white/5')}>
                        <p className="text-sm text-white">{n.text}</p>
                        <p className="text-xs text-text-muted mt-0.5">{n.time}</p>
                      </div>
                    ))}
                    <div className="px-4 py-3 text-center">
                      <span className="text-xs text-text-muted">No more notifications</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link href="/" className="text-xs text-primary-500 hover:text-primary-400 font-medium transition-colors">
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
