'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Crown, Check, X, ChevronDown, ChevronUp, Zap, Loader2, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void }
    }
  }
}

const currencies = [
  { code: 'GHS', symbol: 'GH₵', rate: 15.5 },
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'NGN', symbol: '₦', rate: 1600 },
]


const plans = [
  {
    id: 'free',
    name: 'Free',
    priceUSD: 0,
    period: 'forever',
    description: 'Perfect to get started',
    highlight: false,
    badge: null,
    features: [
      { label: 'Access to free videos', included: true },
      { label: 'Browse events', included: true },
      { label: 'Community blog', included: true },
      { label: 'Basic profile', included: true },
      { label: 'Premium video library', included: false },
      { label: 'Download for offline', included: false },
      { label: 'HD/4K quality', included: false },
      { label: 'Priority support', included: false },
      { label: 'Exclusive masterclasses', included: false },
    ],
  },
  {
    id: 'monthly',
    name: 'Premium Monthly',
    priceUSD: 9.99,
    period: 'month',
    description: 'Full access, cancel anytime',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { label: 'Access to free videos', included: true },
      { label: 'Browse events', included: true },
      { label: 'Community blog', included: true },
      { label: 'Basic profile', included: true },
      { label: 'Premium video library', included: true },
      { label: 'Download for offline', included: true },
      { label: 'HD/4K quality', included: true },
      { label: 'Priority support', included: true },
      { label: 'Exclusive masterclasses', included: true },
    ],
  },
  {
    id: 'annual',
    name: 'Premium Annual',
    priceUSD: 79.99,
    period: 'year',
    description: 'Best value — save 33%',
    highlight: false,
    badge: 'Best Value',
    features: [
      { label: 'Access to free videos', included: true },
      { label: 'Browse events', included: true },
      { label: 'Community blog', included: true },
      { label: 'Basic profile', included: true },
      { label: 'Premium video library', included: true },
      { label: 'Download for offline', included: true },
      { label: 'HD/4K quality', included: true },
      { label: 'Priority support', included: true },
      { label: 'Exclusive masterclasses', included: true },
    ],
  },
]

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: "Yes! You can cancel your subscription at any time from your profile settings. You'll retain access until the end of your current billing period.",
  },
  {
    q: 'Is there a free trial?',
    a: 'Our Free plan gives you permanent access to 200+ free videos with no credit card required. Premium trials are available for new subscribers on request.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard), mobile money (MTN, Vodafone, AirtelTigo), and bank transfers via Paystack.',
  },
  {
    q: 'Can I share my account?',
    a: 'Each subscription is for individual use only. We offer family plans for households — contact us for details.',
  },
  {
    q: 'How often is new content added?',
    a: 'We add new videos every week, with special masterclasses and event recordings added monthly.',
  },
]

export default function SubscribePage() {
  const router = useRouter()
  const { currentUser, updateUser } = useAuthStore()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Checkout modal
  const [checkoutPlan, setCheckoutPlan] = useState<typeof plans[number] | null>(null)
  const [currency, setCurrency] = useState('GHS')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name)
      setEmail(currentUser.email)
    }
  }, [currentUser])

  const selectedCurrency = currencies.find(c => c.code === currency)!

  const handleSelectPlan = (plan: typeof plans[number]) => {
    if (plan.priceUSD === 0) {
      router.push('/auth/signup')
      return
    }
    if (!currentUser) {
      router.push('/auth/login?redirect=/subscribe')
      return
    }
    setCheckoutPlan(plan)
    setError('')
  }

  const handlePay = () => {
    setError('')
    if (!name) { setError('Please enter your name.'); return }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return }

    const key = process.env.NEXT_PUBLIC_PAYSTACK_KEY
    if (!key) { setError('Payment not configured.'); return }
    if (!checkoutPlan) return

    setLoading(true)

    const convertedTotal = checkoutPlan.priceUSD * selectedCurrency.rate
    const amountInSmallestUnit = Math.round(convertedTotal * 100)
    const ref = `afrobreak-sub-${checkoutPlan.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`

    const subscriptionEnd = new Date()
    if (checkoutPlan.id === 'annual') {
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
    }

    const handler = window.PaystackPop.setup({
      key,
      email,
      amount: amountInSmallestUnit,
      currency,
      ref,
      metadata: {
        custom_fields: [
          { display_name: 'Name', variable_name: 'name', value: name },
          { display_name: 'Plan', variable_name: 'plan', value: checkoutPlan.id },
        ],
      },
      onClose: () => setLoading(false),
      callback: (response: { reference: string }) => {
        const endDate = subscriptionEnd.toISOString()
        // Save subscription record
        supabase.from('subscriptions').insert({
          user_id: currentUser?.id,
          plan: checkoutPlan.id,
          amount: convertedTotal,
          currency,
          paystack_ref: response.reference || ref,
          status: 'active',
          started_at: new Date().toISOString(),
          ends_at: endDate,
        }).then(() => {
          // Update user profile
          return supabase.from('profiles').update({
            is_premium: true,
            subscription_end: endDate,
          }).eq('id', currentUser!.id)
        }).then(() => {
          updateUser({ isPremium: true, subscriptionEnd: endDate })
          setLoading(false)
          setCheckoutPlan(null)
          setSuccess(true)
        })
      },
    })

    handler.openIframe()
  }

  if (success) {
    return (
      <div className="min-h-screen pt-16 bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <Crown size={44} className="text-gold-DEFAULT" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Welcome to Premium!</h1>
          <p className="text-text-secondary text-lg mb-8">
            You now have full access to the entire AfroBreak library.
          </p>
          <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-3">
            {plans[1].features.filter(f => f.included).map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-gold-DEFAULT flex-shrink-0" />
                <span className="text-sm text-white">{f.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/videos">
              <Button variant="gold" size="lg" leftIcon={<Crown size={16} />}>
                Explore Premium Videos
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <div className="min-h-screen pt-16 bg-background">
        {/* Header */}
        <div className="relative py-16 lg:py-24 overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-radial from-secondary-500/10 via-transparent to-transparent" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 mb-6">
              <Crown size={14} className="text-gold-DEFAULT" />
              <span className="text-sm font-semibold text-gold-DEFAULT uppercase tracking-widest">
                Unlock Everything
              </span>
            </div>
            <h1 className="heading-lg text-white mb-4">
              Choose Your <span className="gradient-text-orange">Plan</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Join thousands of dancers learning with AfroBreak Premium. No ads. No limits. Cancel anytime.
            </p>
            {currentUser?.isPremium && (
              <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/40 text-gold-DEFAULT font-semibold">
                <Crown size={16} /> You&apos;re already Premium
                {currentUser.subscriptionEnd && (
                  <span className="text-xs text-gold-DEFAULT/70 ml-1">
                    · renews {new Date(currentUser.subscriptionEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-primary-500/15 to-surface border-primary-500/50 shadow-glow-orange scale-105'
                    : 'bg-surface border-white/10 hover:border-white/20'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    plan.highlight ? 'bg-primary-500 text-white' : 'bg-gold-DEFAULT text-background'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-text-secondary mb-4">{plan.description}</p>
                  <div className="flex items-end gap-2">
                    {plan.priceUSD === 0 ? (
                      <span className="text-4xl font-black text-white">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-black text-white">€{plan.priceUSD.toFixed(2)}</span>
                        <span className="text-text-secondary mb-1">/{plan.period}</span>
                      </>
                    )}
                  </div>
                  {plan.id === 'annual' && (
                    <p className="text-xs text-emerald-400 mt-1 font-medium">
                      Equivalent to €6.67/month — save €40
                    </p>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f.label} className="flex items-center gap-3">
                      {f.included ? (
                        <Check size={16} className={plan.highlight ? 'text-primary-400' : 'text-emerald-400'} />
                      ) : (
                        <X size={16} className="text-white/20" />
                      )}
                      <span className={`text-sm ${f.included ? 'text-white' : 'text-text-muted line-through'}`}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={currentUser?.isPremium && plan.priceUSD > 0}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.highlight
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : plan.id === 'annual'
                      ? 'bg-gold-DEFAULT hover:bg-gold-dark text-background'
                      : 'bg-surface-2 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10'
                  }`}
                >
                  {plan.priceUSD > 0 && <Zap size={15} />}
                  {currentUser?.isPremium && plan.priceUSD > 0
                    ? 'Current Plan'
                    : plan.priceUSD === 0
                    ? 'Get Started Free'
                    : `Subscribe — €${plan.priceUSD.toFixed(2)}/${plan.period}`}
                </button>
              </div>
            ))}
          </div>

          {/* Feature comparison table */}
          <div className="bg-surface rounded-2xl border border-white/10 overflow-hidden mb-20">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Full Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-text-secondary font-medium text-sm w-1/2">Feature</th>
                    {plans.map(p => (
                      <th key={p.id} className="text-center p-4 text-sm font-bold text-white">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans[0].features.map((feature, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="p-4 text-sm text-text-secondary">{feature.label}</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center p-4">
                          {plan.features[i].included ? (
                            <Check size={18} className="text-emerald-400 mx-auto" />
                          ) : (
                            <X size={18} className="text-white/20 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-surface border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                  >
                    <span className="font-semibold text-white">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp size={18} className="text-primary-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-text-secondary flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t border-white/5">
                      <p className="text-text-secondary text-sm leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-gold-DEFAULT" />
                <div>
                  <h2 className="font-bold text-white">{checkoutPlan.name}</h2>
                  <p className="text-xs text-text-muted">${checkoutPlan.priceUSD}/{checkoutPlan.period}</p>
                </div>
              </div>
              <button onClick={() => setCheckoutPlan(null)} className="p-2 rounded-xl hover:bg-white/10 text-text-muted transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="input-base">
                  {currencies.map(c => (
                    <option key={c.code} value={c.code} className="bg-surface">
                      {c.code} — {c.code === 'USD' ? 'Dollar' : c.code === 'GHS' ? 'Cedi' : 'Naira'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-text-muted mt-1">
                  Total: <span className="text-white font-bold">
                    {selectedCurrency.symbol}{(checkoutPlan.priceUSD * selectedCurrency.rate).toFixed(2)}
                  </span>
                  {currency !== 'USD' && <span className="ml-1">(≈ ${checkoutPlan.priceUSD} USD)</span>}
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="input-base"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`input-base ${currentUser ? 'opacity-60' : ''}`}
                  readOnly={!!currentUser}
                />
              </div>

              {/* What you get */}
              <div className="bg-gold-DEFAULT/5 border border-gold-DEFAULT/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-gold-DEFAULT uppercase tracking-wider mb-2">What you unlock</p>
                <div className="space-y-1.5">
                  {checkoutPlan.features.filter(f => f.included && f.label !== 'Access to free videos' && f.label !== 'Browse events' && f.label !== 'Community blog' && f.label !== 'Basic profile').map(f => (
                    <div key={f.label} className="flex items-center gap-2">
                      <Check size={12} className="text-gold-DEFAULT flex-shrink-0" />
                      <span className="text-xs text-text-secondary">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-background bg-gold-DEFAULT hover:bg-gold-dark disabled:opacity-60 transition-all duration-200"
              >
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /> Processing…</>
                  : <><Crown size={18} /> Pay {selectedCurrency.symbol}{(checkoutPlan.priceUSD * selectedCurrency.rate).toFixed(2)}</>
                }
              </button>

              <p className="text-center text-xs text-text-muted">Secured by Paystack · SSL encrypted · Cancel anytime</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
