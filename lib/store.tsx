'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '@/lib/types'

interface AuthState {
  currentUser: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<boolean>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthState | null>(null)

function toUser(sbUser: SupabaseUser, profile?: Record<string, unknown> | null): User {
  return {
    id: sbUser.id,
    name: (profile?.name as string) || (sbUser.user_metadata?.name as string) || sbUser.email?.split('@')[0] || 'User',
    email: sbUser.email || '',
    avatar: (profile?.avatar as string) || '',
    isPremium: (profile?.is_premium as boolean) || false,
    subscriptionEnd: (profile?.subscription_end as string) || undefined,
    favorites: (profile?.favorites as string[]) || [],
    watchLater: (profile?.watch_later as string[]) || [],
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = async (sbUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .single()
    setCurrentUser(toUser(sbUser, profile))
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user).finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user)
      } else {
        setCurrentUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return !error
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    return !error
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return
    const profileUpdates: Record<string, unknown> = {}
    if (updates.name !== undefined) profileUpdates.name = updates.name
    if (updates.avatar !== undefined) profileUpdates.avatar = updates.avatar
    if (updates.isPremium !== undefined) profileUpdates.is_premium = updates.isPremium
    if (updates.favorites !== undefined) profileUpdates.favorites = updates.favorites
    if (updates.watchLater !== undefined) profileUpdates.watch_later = updates.watchLater

    await supabase.from('profiles').update(profileUpdates).eq('id', currentUser.id)
    setCurrentUser({ ...currentUser, ...updates })
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthStore(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthStore must be used within AuthProvider')
  return ctx
}
