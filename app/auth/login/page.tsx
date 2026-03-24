'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Play, Chrome } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const signedUp = searchParams.get('signup') === 'success'
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    const ok = await login(form.email, form.password)
    if (ok) {
      router.push('/')
    } else {
      setError('Invalid email or password. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-text-secondary">Sign in to continue your dance journey</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          {signedUp && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl p-4 mb-6">
              Account created! Check your email to confirm, then sign in.
            </div>
          )}
          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-sm rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary-500 hover:text-primary-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-base pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-text-muted">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google button */}
          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200">
            <Chrome size={18} className="text-blue-400" />
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
