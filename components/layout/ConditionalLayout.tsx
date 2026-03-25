'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import MaintenanceCheck from './MaintenanceCheck'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <MaintenanceCheck>
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </MaintenanceCheck>
  )
}
