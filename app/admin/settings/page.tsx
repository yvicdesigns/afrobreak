'use client'

import { useState } from 'react'
import { Check, Globe, Bell, Shield, Palette } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    siteName: 'AfroBreak',
    siteUrl: 'https://www.afrobreak.com',
    contactEmail: 'contact@afrobreak.com',
    maintenanceMode: false,
    newUserNotif: true,
    newSubscriberNotif: true,
    allowSignup: true,
    premiumPrice: '9.99',
    currency: 'EUR',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-text-secondary text-sm">Configure your AfroBreak platform</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-4">
          <Check size={16} /> Settings saved!
        </div>
      )}

      {/* General */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-primary-500" />
          <h2 className="font-bold text-white">General</h2>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Site Name</label>
          <input type="text" value={form.siteName} onChange={e => setForm(f => ({...f, siteName: e.target.value}))} className="input-base" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Site URL</label>
          <input type="text" value={form.siteUrl} onChange={e => setForm(f => ({...f, siteUrl: e.target.value}))} className="input-base" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Contact Email</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({...f, contactEmail: e.target.value}))} className="input-base" />
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-white/5">
          <div>
            <p className="text-sm font-medium text-white">Maintenance Mode</p>
            <p className="text-xs text-text-secondary">Show a maintenance page to visitors</p>
          </div>
          <button
            onClick={() => setForm(f => ({...f, maintenanceMode: !f.maintenanceMode}))}
            className={`w-11 h-6 rounded-full transition-colors ${form.maintenanceMode ? 'bg-primary-500' : 'bg-white/20'}`}
          >
            <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Palette size={16} className="text-gold-DEFAULT" />
          <h2 className="font-bold text-white">Subscriptions</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Premium Price</label>
            <input type="number" value={form.premiumPrice} onChange={e => setForm(f => ({...f, premiumPrice: e.target.value}))} min={0} step={0.99} className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Currency</label>
            <select value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))} className="input-base">
              <option value="EUR" className="bg-surface">EUR €</option>
              <option value="USD" className="bg-surface">USD $</option>
              <option value="GBP" className="bg-surface">GBP £</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-white/5">
          <div>
            <p className="text-sm font-medium text-white">Allow New Signups</p>
            <p className="text-xs text-text-secondary">Let new users create accounts</p>
          </div>
          <button
            onClick={() => setForm(f => ({...f, allowSignup: !f.allowSignup}))}
            className={`w-11 h-6 rounded-full transition-colors ${form.allowSignup ? 'bg-primary-500' : 'bg-white/20'}`}
          >
            <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.allowSignup ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={16} className="text-secondary-400" />
          <h2 className="font-bold text-white">Notifications</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-white/5">
          <div>
            <p className="text-sm font-medium text-white">New User Alert</p>
            <p className="text-xs text-text-secondary">Get notified when someone signs up</p>
          </div>
          <button
            onClick={() => setForm(f => ({...f, newUserNotif: !f.newUserNotif}))}
            className={`w-11 h-6 rounded-full transition-colors ${form.newUserNotif ? 'bg-primary-500' : 'bg-white/20'}`}
          >
            <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.newUserNotif ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-white/5">
          <div>
            <p className="text-sm font-medium text-white">New Subscriber Alert</p>
            <p className="text-xs text-text-secondary">Get notified when someone goes Premium</p>
          </div>
          <button
            onClick={() => setForm(f => ({...f, newSubscriberNotif: !f.newSubscriberNotif}))}
            className={`w-11 h-6 rounded-full transition-colors ${form.newSubscriberNotif ? 'bg-primary-500' : 'bg-white/20'}`}
          >
            <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.newSubscriberNotif ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-emerald-400" />
          <h2 className="font-bold text-white">Security</h2>
        </div>
        <div className="p-4 bg-surface-2 rounded-xl border border-white/5">
          <p className="text-sm font-medium text-white mb-1">Authentication</p>
          <p className="text-xs text-text-secondary">Powered by Supabase Auth — email/password + Google OAuth</p>
        </div>
        <div className="p-4 bg-surface-2 rounded-xl border border-white/5">
          <p className="text-sm font-medium text-white mb-1">Database</p>
          <p className="text-xs text-text-secondary">Supabase PostgreSQL with Row Level Security enabled</p>
        </div>
      </div>

      <Button variant="primary" size="lg" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  )
}
