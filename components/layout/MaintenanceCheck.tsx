'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MaintenancePage from '@/app/maintenance/page'

export default function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [maintenance, setMaintenance] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)

  // Admin routes and auth routes always bypass maintenance
  const bypassRoutes = pathname.startsWith('/admin') || pathname.startsWith('/auth') || pathname === '/maintenance'

  useEffect(() => {
    if (bypassRoutes) { setChecked(true); return }

    async function check() {
      // Check maintenance mode setting
      const { data: setting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single()

      const maintenanceOn = setting?.value === 'true'

      if (!maintenanceOn) {
        setMaintenance(false)
        setChecked(true)
        return
      }

      // Check if current user is admin
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
        if (profile?.is_admin) {
          setIsAdmin(true)
          setMaintenance(false)
          setChecked(true)
          return
        }
      }

      setMaintenance(true)
      setChecked(true)
    }

    check()
  }, [pathname, bypassRoutes])

  if (!checked) return null // brief flash prevention
  if (maintenance && !isAdmin) return <MaintenancePage />
  return <>{children}</>
}
