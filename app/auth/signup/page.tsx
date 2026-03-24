'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, Play, Chrome, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import Button from '@/components/ui/Button'

const perks = [
  'Access 200+ free dance tutorials',
  'Attend community events',
  'Track your progress',
  'Connect with instructors',
]

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', terms: false })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (!form.terms) {
      setError('Please accept the terms and conditions.')
      return
    }
    setLoading(true)
    setError('')
    const ok = await signup(form.name, form.email, form.password)
    if (ok) {
      router.push('/auth/login?signup=success')
    } else {
      setError('Something went wrong. This email may already be in use.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow-orange">
              <Play size={16} className="text-white fill-white ml-0.5" />
            </div>
            <span className="text-2xl font-black">
              <span className="text-primary-500">AFRO</span>
              <span className="text-white">BREAK</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Join the community</h1>
          <p className="text-text-secondary">Start your dance journey today — it&apos;s free</p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {perks.map(perk => (
            <div key={perk} className="flex items-center gap-2 bg-surface/50 border border-white/5 rounded-xl px-3 py-2">
              <CheckCircle size={14} className="text-primary-500 flex-shrink-0" />
              <span className="text-xs text-text-secondary">{perk}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-sm rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-base pl-10"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-base pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-base pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        form.password.length >= i * 2
                          ? form.password.length >= 8 ? 'bg-emerald-500' : 'bg-amber-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <div className="relative mt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={e => setForm({ ...form, terms: e.target.checked })}
                  className="sr-only peer"
                />
                <div
                  onClick={() => setForm({ ...form, terms: !form.terms })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                    form.terms
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-transparent border-white/30 hover:border-white/50'
                  }`}
                >
                  {form.terms && <CheckCircle size={12} className="text-white" />}
                </div>
              </div>
              <label htmlFor="terms" className="text-sm text-text-secondary cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-500 hover:text-primary-400">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary-500 hover:text-primary-400">Privacy Policy</Link>
              </label>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Create My Account
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200">
            <Chrome size={18} className="text-blue-400" />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
