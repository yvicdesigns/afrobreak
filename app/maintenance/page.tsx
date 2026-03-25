import { Wrench } from 'lucide-react'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-orange-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wrench size={36} className="text-orange-400" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl font-black text-primary-500">AFRO</span>
          <span className="text-3xl font-black text-white">BREAK</span>
        </div>
        <h1 className="text-2xl font-black text-white mb-3">We'll be right back</h1>
        <p className="text-text-secondary leading-relaxed mb-8">
          AfroBreak is undergoing scheduled maintenance. We're working hard to bring you an even better experience. Please check back soon!
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          Maintenance in progress
        </div>
      </div>
    </div>
  )
}
