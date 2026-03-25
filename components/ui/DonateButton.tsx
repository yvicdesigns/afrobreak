'use client'

import { useState } from 'react'
import Script from 'next/script'
import { Heart, X, Loader2 } from 'lucide-react'

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void }
    }
  }
}

const currencies = [
  { code: 'USD', symbol: '$', label: 'USD — Dollar' },
  { code: 'NGN', symbol: '₦', label: 'NGN — Naira' },
  { code: 'GHS', symbol: 'GH₵', label: 'GHS — Cedi' },
]

interface DonateButtonProps {
  variant?: 'hero' | 'footer'
}

export default function DonateButton({ variant = 'hero' }: DonateButtonProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedCurrency = currencies.find(c => c.code === currency)!

  const handleDonate = () => {
    setError('')
    const num = parseFloat(amount)
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return }
    if (!num || num < 1) { setError('Minimum donation is 1 ' + currency); return }

    const key = process.env.NEXT_PUBLIC_PAYSTACK_KEY
    if (!key) { setError('Payment not configured yet.'); return }

    setLoading(true)
    const handler = window.PaystackPop.setup({
      key,
      email,
      amount: Math.round(num * 100), // convert to smallest unit
      currency,
      ref: `afrobreak-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      metadata: { custom_fields: [{ display_name: 'Platform', variable_name: 'platform', value: 'AfroBreak' }] },
      onClose: () => setLoading(false),
      callback: () => {
        setLoading(false)
        setOpen(false)
        setEmail('')
        setAmount('')
        // Show success state briefly
        alert('Thank you for your donation! 🙏')
      },
    })
    handler.openIframe()
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* Trigger button */}
      {variant === 'hero' ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-100"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
        >
          <Heart size={18} className="fill-white" />
          Donate
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
        >
          <Heart size={14} className="fill-white" />
          Donate
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white">Support AfroBreak</h2>
                <p className="text-text-secondary text-sm mt-0.5">Your donation keeps the culture alive 🙏</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/10 text-text-muted transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Currency</label>
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
                <label className="block text-sm font-medium text-white mb-1.5">Amount</label>
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
                    placeholder="Enter amount"
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
                <label className="block text-sm font-medium text-white mb-1.5">Your Email</label>
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
                {loading ? 'Opening payment…' : `Donate ${selectedCurrency.symbol}${amount || '...'}`}
              </button>

              <p className="text-center text-xs text-text-muted">Secured by Paystack · SSL encrypted</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
