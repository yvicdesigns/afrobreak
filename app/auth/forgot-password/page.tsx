'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'

function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (err) {
      setError('Something went wrong. Please try again.')
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="block mb-6">
            <img src="/logo-auth.png" alt="AfroBreak" className="h-20 w-auto object-contain mx-auto" style={{ display: 'block' }} />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-text-secondary text-sm">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-text-secondary text-sm mb-6">
                We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span>.
                Check your spam folder if you don&apos;t see it.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 text-sm font-semibold transition-colors"
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-sm rounded-xl p-4 mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-base pl-10"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                  Send reset link
                </Button>
              </form>
              <p className="text-center text-sm text-text-secondary mt-6">
                <Link href="/auth/login" className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                  <ArrowLeft size={13} /> Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  )
}
