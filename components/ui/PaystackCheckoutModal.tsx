'use client'

import { useState } from 'react'
import Script from 'next/script'
import { X, Loader2, ShoppingCart, Download, MapPin, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void }
    }
  }
}

const currencies = [
  { code: 'GHS', symbol: 'GH₵', label: 'GHS — Cedi', rate: 15.5 },
  { code: 'USD', symbol: '$', label: 'USD — Dollar', rate: 1 },
  { code: 'NGN', symbol: '₦', label: 'NGN — Naira', rate: 1600 },
]

interface OrderItem {
  id: string
  name: string
  price: number
  quantity?: number
  size?: string
  color?: string
  cover?: string
  image?: string
}

interface Props {
  type: 'shop' | 'music' | 'event'
  items: OrderItem[]
  totalUSD: number
  onClose: () => void
  onSuccess?: (ref: string, email: string, name: string) => void
}

export default function PaystackCheckoutModal({ type, items, totalUSD, onClose, onSuccess }: Props) {
  const router = useRouter()
  const [currency, setCurrency] = useState('GHS')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Shipping fields (shop only)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')

  const selectedCurrency = currencies.find(c => c.code === currency)!
  const convertedTotal = totalUSD * selectedCurrency.rate
  const amountInSmallestUnit = Math.round(convertedTotal * 100)

  const handlePay = () => {
    setError('')

    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return }
    if (!name) { setError('Please enter your name.'); return }
    if (type === 'shop' && (!address || !city || !country)) { setError('Please complete your shipping address.'); return }

    const key = process.env.NEXT_PUBLIC_PAYSTACK_KEY
    if (!key) { setError('Payment not configured.'); return }

    setLoading(true)

    const ref = `afrobreak-${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`

    const handler = window.PaystackPop.setup({
      key,
      email,
      amount: amountInSmallestUnit,
      currency,
      ref,
      metadata: {
        custom_fields: [
          { display_name: 'Name', variable_name: 'name', value: name },
          { display_name: 'Order Type', variable_name: 'type', value: type },
        ],
      },
      onClose: () => setLoading(false),
      callback: (response: { reference: string }) => {
        // Save order to Supabase (fire and forget)
        supabase.from('orders').insert({
          type,
          email,
          items: items.map(i => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity || 1,
            size: i.size,
            color: i.color,
          })),
          total: convertedTotal,
          currency,
          paystack_ref: response.reference || ref,
          shipping: type === 'shop' ? { name, address, city, country, phone } : null,
          status: 'paid',
        }).then(() => {
          setLoading(false)
          onClose()
          if (onSuccess) {
            onSuccess(ref, email, name)
          } else {
            router.push(`/thank-you?type=${type}&ref=${ref}&email=${encodeURIComponent(email)}`)
          }
        })
      },
    })

    handler.openIframe()
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-surface z-10">
            <div className="flex items-center gap-2">
              {type === 'shop' ? <ShoppingCart size={18} className="text-primary-500" /> : type === 'music' ? <Download size={18} className="text-primary-500" /> : <Calendar size={18} className="text-primary-500" />}
              <h2 className="font-bold text-white">{type === 'shop' ? 'Checkout' : type === 'music' ? 'Buy & Download' : 'Event Registration'}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-text-muted transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Order summary */}
            <div className="bg-background rounded-xl border border-white/5 p-4 space-y-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Order Summary</p>
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary truncate flex-1 mr-4">
                    {item.name}{item.size ? ` (${item.size}` : ''}{item.color ? ` · ${item.color})` : item.size ? ')' : ''}
                    {(item.quantity || 1) > 1 ? ` ×${item.quantity}` : ''}
                  </span>
                  <span className="text-white font-semibold flex-shrink-0">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="input-base">
                {currencies.map(c => (
                  <option key={c.code} value={c.code} className="bg-surface">{c.label}</option>
                ))}
              </select>
              <p className="text-xs text-text-muted mt-1">
                Total: <span className="text-white font-bold">{selectedCurrency.symbol}{convertedTotal.toFixed(2)}</span>
                {currency !== 'USD' && <span className="ml-1">(≈ ${totalUSD.toFixed(2)} USD)</span>}
              </p>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Email <span className="text-red-400">*</span></label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input-base" />
              </div>
            </div>

            {/* Shipping address (shop only) */}
            {type === 'shop' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <MapPin size={14} className="text-primary-500" /> Shipping Address
                </div>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address *" className="input-base" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City *" className="input-base" />
                  <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="Country *" className="input-base" />
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number (optional)" className="input-base" />
              </div>
            )}

            {type === 'music' && (
              <p className="text-xs text-text-muted bg-background rounded-xl p-3 border border-white/5">
                Download links will be sent to your email immediately after payment. Files are DRM-free MP3 + WAV.
              </p>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-60 transition-all duration-200"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Processing…</>
                : <>{type === 'shop' ? <ShoppingCart size={18} /> : type === 'music' ? <Download size={18} /> : <Calendar size={18} />} Pay {selectedCurrency.symbol}{convertedTotal.toFixed(2)}</>
              }
            </button>

            <p className="text-center text-xs text-text-muted">Secured by Paystack · SSL encrypted</p>
          </div>
        </div>
      </div>
    </>
  )
}
