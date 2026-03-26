'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, ShoppingBag, ArrowRight, Mail } from 'lucide-react'

function ThankYouContent() {
  const params = useSearchParams()
  const type = params.get('type') || 'shop'
  const email = params.get('email') || ''

  const isMusic = type === 'music'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="w-24 h-24 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={44} className="text-emerald-400" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-white mb-3">
          Thank You! 🙏
        </h1>
        <p className="text-text-secondary text-lg mb-2">
          Your payment was successful.
        </p>
        {email && (
          <p className="text-text-muted text-sm mb-8 flex items-center justify-center gap-2">
            <Mail size={14} />
            Confirmation sent to <span className="text-white font-medium">{email}</span>
          </p>
        )}

        {/* Message */}
        <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-3">
          {isMusic ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center">
                  <Download size={18} className="text-primary-500" />
                </div>
                <div>
                  <p className="font-bold text-white">Your music is ready</p>
                  <p className="text-xs text-text-muted">Digital download</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Your download links have been sent to your email. Check your inbox (and spam folder just in case).
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Files are DRM-free in <span className="text-white font-medium">MP3 + WAV</span> format — yours to keep forever.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={18} className="text-primary-500" />
                </div>
                <div>
                  <p className="font-bold text-white">Your order is confirmed</p>
                  <p className="text-xs text-text-muted">Physical shipping</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                We&apos;ve received your order and are preparing it for shipment. You&apos;ll receive a tracking link by email once your package is on its way.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Estimated delivery: <span className="text-white font-medium">5–10 business days</span> depending on your location.
              </p>
            </>
          )}
        </div>

        {/* Thank you note */}
        <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl p-5 mb-8">
          <p className="text-sm text-text-secondary leading-relaxed italic">
            &ldquo;Your support means the world to us. Every purchase helps Africa Breaking Academy continue empowering young dancers across Africa and beyond. <span className="text-white font-semibold">Thank you for being part of the movement.</span>&rdquo;
          </p>
          <p className="text-primary-500 text-xs font-bold mt-2">— The AfroBreak Team</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={isMusic ? '/music' : '/store'}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-white/10 rounded-xl text-sm font-semibold text-text-secondary hover:text-white hover:border-white/20 transition-all"
          >
            {isMusic ? 'Browse More Music' : 'Continue Shopping'}
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-xl text-sm font-semibold text-white hover:bg-primary-600 transition-all"
          >
            Back to Home <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ThankYouContent />
    </Suspense>
  )
}
