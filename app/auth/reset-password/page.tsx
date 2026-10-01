'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'

function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase puts the session in the URL hash after clicking the reset link
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="block mb-6">
            <img src="/logo-auth.png" alt="AfroBreak" className="h-20 w-auto object-contain mx-auto" style={{ display: 'block' }} />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">New password</h1>
          <p className="text-text-secondary text-sm">Choose a new password for your account.</p>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Password updated!</h2>
              <p className="text-text-secondary text-sm">Redirecting you to sign in...</p>
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
                  <label className="text-sm font-medium text-white block">New password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input-base pl-10 pr-10"
                      autoComplete="new-password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex gap-1 mt-1.5">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= i * 2
                            ? password.length >= 8 ? 'bg-emerald-500' : 'bg-amber-500'
                            : 'bg-white/10'
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white block">Confirm password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Same password again"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      className="input-base pl-10"
                      autoComplete="new-password"
                    />
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                  )}
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={!ready && password.length < 6}>
                  Update password
                </Button>
              </form>

              <p className="text-center text-sm text-text-secondary mt-6">
                <Link href="/auth/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
