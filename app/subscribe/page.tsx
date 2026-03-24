'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Crown, Check, X, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
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
    price: 9.99,
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
    price: 79.99,
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
    a: 'Yes! You can cancel your subscription at any time from your profile settings. You\'ll retain access until the end of your current billing period.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Our Free plan gives you permanent access to 200+ free videos with no credit card required. Premium trials are available for new subscribers on request.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay via our secure payment provider.',
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
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
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
              {/* Badge */}
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
                  {plan.price === 0 ? (
                    <span className="text-4xl font-black text-white">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-black text-white">€{plan.price}</span>
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

              <Link href={plan.price === 0 ? '/auth/signup' : '/auth/signup'}>
                <Button
                  variant={plan.highlight ? 'primary' : plan.id === 'annual' ? 'gold' : 'secondary'}
                  size="lg"
                  fullWidth
                  leftIcon={plan.price > 0 ? <Zap size={16} /> : undefined}
                  className={plan.highlight ? 'btn-glow' : ''}
                >
                  {plan.price === 0 ? 'Get Started Free' : `Start ${plan.id === 'annual' ? 'Annual' : 'Monthly'}`}
                </Button>
              </Link>
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
  )
}
