'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Script from 'next/script'
import { Heart, X, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void }
    }
  }
}

const currencies = [
  { code: 'GHS', symbol: 'GH₵', label: 'GHS — Cedi' },
  { code: 'USD', symbol: '$', label: 'USD — Dollar' },
  { code: 'NGN', symbol: '₦', label: 'NGN — Naira' },
]

interface DonateButtonProps {
  variant?: 'hero' | 'footer'
}

export default function DonateButton({ variant = 'hero' }: DonateButtonProps) {
  const { tr } = useLanguage()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('GHS')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [mounted, setMounted] = useState(false)
  const [paystackReady, setPaystackReady] = useState(false)
  useEffect(() => setMounted(true), [])

  const selectedCurrency = currencies.find(c => c.code === currency)!

  const handleDonate = () => {
    setError('')
    const num = parseFloat(amount)
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return }
    if (!num || num < 1) { setError('Minimum donation is 1 ' + currency); return }

    const key = process.env.NEXT_PUBLIC_PAYSTACK_KEY
    if (!key) { setError('Payment not configured yet.'); return }
    if (!window.PaystackPop) { setError('Payment script still loading, please try again.'); return }

    setOpen(false)
    setTimeout(() => {
      const handler = window.PaystackPop.setup({
        key,
        email,
        amount: Math.round(num * 100),
        currency,
        ref: `afrobreak-donate-${Date.now()}`,
        metadata: { custom_fields: [{ display_name: 'Platform', variable_name: 'platform', value: 'AfroBreak' }] },
        callback: () => {
          setEmail('')
          setAmount('')
          alert('Thank you for your donation! 🙏')
        },
        onClose: () => {},
      })
      handler.openIframe()
    }, 150)
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v2/inline.js"
        strategy="afterInteractive"
        onLoad={() => setPaystackReady(true)}
      />

      {/* Trigger button */}
      {variant === 'hero' ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-100"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
        >
          <Heart size={18} className="fill-white" />
          {tr.donate.button}
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
        >
          <Heart size={14} className="fill-white" />
          {tr.donate.button}
        </button>
      )}

      {/* Modal — rendu via portal à la racine du document pour éviter tout conflit de stacking context */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white">{tr.donate.title}</h2>
                <p className="text-text-secondary text-sm mt-0.5">{tr.donate.desc}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/10 text-text-muted transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">{tr.donate.currency}</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="input-base"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code} className="bg-surface">{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">{tr.donate.amount}</label>
                <div className="flex items-center bg-background border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/60 transition-colors">
                  <span className="px-3 text-text-secondary font-semibold text-sm border-r border-white/10 py-2.5">
                    {selectedCurrency.symbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder={tr.donate.amountPlaceholder}
                    className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-text-muted focus:outline-none text-sm"
                  />
                </div>
                {/* Quick amounts */}
                <div className="flex gap-2 mt-2">
                  {(currency === 'NGN' ? [1000, 2500, 5000] : currency === 'GHS' ? [10, 25, 50] : [5, 10, 25]).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${amount === String(v) ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-text-secondary'}`}
                    >
                      {selectedCurrency.symbol}{v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">{tr.donate.yourEmail}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-base"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              {/* Submit */}
              <button
                onClick={handleDonate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-60 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} className="fill-white" />}
                {loading ? tr.donate.opening : `${tr.donate.donateBtn} ${selectedCurrency.symbol}${amount || '...'}`}
              </button>

              <p className="text-center text-xs text-text-muted">{tr.donate.secured}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
