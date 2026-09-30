export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0D0A1A] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="text-4xl font-black text-[#FDCA00] tracking-tight">AFRO</span>
          <span className="text-4xl font-black text-white tracking-tight">BREAK</span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ background: 'rgba(253,202,0,0.1)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FDCA00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-4 leading-tight">
          We&apos;ll be back in<br />
          <span className="text-[#FDCA00]">48 hours</span>
        </h1>

        <p className="text-[#888] leading-relaxed mb-10 text-base">
          AfroBreak is currently undergoing important maintenance and upgrades.
          We&apos;re working hard to bring you an even better experience —
          thank you for your patience and support.
        </p>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#FDCA00]/20 bg-[#FDCA00]/5">
          <span className="w-2 h-2 rounded-full bg-[#FDCA00] animate-pulse" />
          <span className="text-sm font-semibold text-[#FDCA00]">Maintenance in progress</span>
        </div>

        {/* Social links */}
        <p className="text-[#555] text-sm mt-10">
          Follow us on social media for updates
        </p>
      </div>
    </div>
  )
}
