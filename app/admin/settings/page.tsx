'use client'

import { useState, useEffect } from 'react'
import { Check, Globe, Bell, Shield, Palette, Loader2, Image, Share2, Save } from 'lucide-react'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'
import { getSetting } from '@/lib/db'
import { saveSettingAction } from '@/app/admin/settings-actions'

type SocialLinks = {
  instagram: string
  youtube: string
  twitter: string
  facebook: string
}

const defaultSocial: SocialLinks = {
  instagram: '',
  youtube: '',
  twitter: '',
  facebook: '',
}

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    siteName: 'AfroBreak',
    siteUrl: 'https://www.afrobreak.com',
    contactEmail: 'contact@afrobreak.com',
    maintenanceMode: false,
    newUserNotif: true,
    newSubscriberNotif: true,
    allowSignup: true,
    premiumPrice: '9.99',
    annualPrice: '500',
    currency: 'GHS',
  })

  // Logo
  const [logoUrl, setLogoUrl] = useState('')
  const [logoSaving, setLogoSaving] = useState(false)
  const [logoSaved, setLogoSaved] = useState(false)

  // Login logo
  const [loginLogo, setLoginLogo] = useState('')
  const [loginLogoSize, setLoginLogoSize] = useState(96)
  const [loginLogoGap, setLoginLogoGap] = useState(8)
  const [loginLogoSaving, setLoginLogoSaving] = useState(false)
  const [loginLogoSaved, setLoginLogoSaved] = useState(false)

  // Logo background circle
  const [logoBg, setLogoBg] = useState({ color: '#ffffff', opacity: 0, shape: 'circle' as 'circle' | 'rounded' | 'square', padding: 8, size: 40 })
  const [logoBgSaving, setLogoBgSaving] = useState(false)
  const [logoBgSaved, setLogoBgSaved] = useState(false)

  // Social links
  const [social, setSocial] = useState<SocialLinks>(defaultSocial)
  const [socialSaving, setSocialSaving] = useState(false)
  const [socialSaved, setSocialSaved] = useState(false)

  useEffect(() => {
    Promise.all([
      getSetting('maintenance_mode'),
      getSetting('site_logo'),
      getSetting('logo_bg'),
      getSetting('social_links'),
      getSetting('login_logo'),
      getSetting('premium_price'),
      getSetting('currency_default'),
      getSetting('allow_signup'),
    ]).then(([maintenance, logo, logoBgRaw, socialRaw, loginLogoVal, price, cur, signup]) => {
      if (maintenance !== null) setForm(f => ({ ...f, maintenanceMode: maintenance === 'true' }))
      if (logo) setLogoUrl(logo)
      if (logoBgRaw) try { setLogoBg(prev => ({ ...prev, ...JSON.parse(logoBgRaw) })) } catch {}
      if (socialRaw) try { setSocial(JSON.parse(socialRaw)) } catch {}
      if (loginLogoVal) setLoginLogo(loginLogoVal)
      if (price) setForm(f => ({ ...f, premiumPrice: price }))
      getSetting('annual_price').then(v => { if (v) setForm(f => ({ ...f, annualPrice: v })) })
      if (cur) setForm(f => ({ ...f, currency: cur }))
      if (signup !== null) setForm(f => ({ ...f, allowSignup: signup !== 'false' }))
      getSetting('login_logo_size').then(v => { if (v) setLoginLogoSize(Number(v)) })
      getSetting('login_logo_gap').then(v => { if (v) setLoginLogoGap(Number(v)) })
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await Promise.all([
      saveSettingAction('maintenance_mode', form.maintenanceMode ? 'true' : 'false'),
      saveSettingAction('premium_price', form.premiumPrice),
      saveSettingAction('annual_price', form.annualPrice),
      saveSettingAction('currency_default', form.currency),
      saveSettingAction('allow_signup', form.allowSignup ? 'true' : 'false'),
      saveSettingAction('site_name', form.siteName),
      saveSettingAction('site_url', form.siteUrl),
      saveSettingAction('contact_email', form.contactEmail),
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const saveLogo = async () => {
    setLogoSaving(true)
    await saveSettingAction('site_logo', logoUrl)
    setLogoSaving(false)
    setLogoSaved(true)
    setTimeout(() => setLogoSaved(false), 3000)
  }

  const saveLoginLogo = async () => {
    setLoginLogoSaving(true)
    await Promise.all([
      saveSettingAction('login_logo', loginLogo),
      saveSettingAction('login_logo_size', String(loginLogoSize)),
      saveSettingAction('login_logo_gap', String(loginLogoGap)),
    ])
    setLoginLogoSaving(false)
    setLoginLogoSaved(true)
    setTimeout(() => setLoginLogoSaved(false), 3000)
  }

  const saveLogoBg = async () => {
    setLogoBgSaving(true)
    await saveSettingAction('logo_bg', JSON.stringify(logoBg))
    setLogoBgSaving(false)
    setLogoBgSaved(true)
    setTimeout(() => setLogoBgSaved(false), 3000)
  }

  function hexToRgba(hex: string, opacity: number) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${opacity / 100})`
  }

  const saveSocial = async () => {
    setSocialSaving(true)
    await saveSettingAction('social_links', JSON.stringify(social))
    setSocialSaving(false)
    setSocialSaved(true)
    setTimeout(() => setSocialSaved(false), 3000)
  }

  if (loading) return <div className="p-6 text-text-secondary">Loading settings...</div>

  return (
    <div className="space-y-6 max-w-2xl p-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-text-secondary text-sm">Configure your AfroBreak platform</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-4">
          <Check size={16} /> Settings saved!
        </div>
      )}

      {/* ── LOGO ── */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Image size={16} className="text-primary-500" />
          <h2 className="font-bold text-white">Logo & Branding</h2>
        </div>
        <p className="text-xs text-text-muted -mt-2">Upload your logo — it will appear in the navbar and footer. Transparent PNG or SVG recommended.</p>
        <ImageUpload label="Site Logo" value={logoUrl} onChange={setLogoUrl} folder="branding" />
        {logoUrl && (
          <div className="p-4 bg-background rounded-xl border border-white/5 flex items-center gap-4">
            <p className="text-xs text-text-muted">Preview:</p>
            <img src={logoUrl} alt="Logo preview" className="h-10 w-auto object-contain" />
          </div>
        )}
        <button
          onClick={saveLogo}
          disabled={logoSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-400 disabled:opacity-60 transition-colors text-sm font-semibold"
        >
          {logoSaving ? <Loader2 size={14} className="animate-spin" /> : logoSaved ? <Check size={14} /> : <Save size={14} />}
          {logoSaving ? 'Saving…' : logoSaved ? 'Saved!' : 'Save Logo'}
        </button>
        {logoSaved && <p className="text-xs text-emerald-400">Logo updated on the site.</p>}
      </div>

      {/* ── LOGIN LOGO ── */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Image size={16} className="text-secondary-400" />
          <h2 className="font-bold text-white">Login Page Logo</h2>
        </div>
        <p className="text-xs text-text-muted -mt-2">Logo affiché sur la page de connexion. Tu peux ajuster la taille et voir un aperçu en temps réel.</p>

        <ImageUpload label="Login Logo" value={loginLogo} onChange={setLoginLogo} folder="branding" />

        {/* Size slider */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Taille du logo — <span className="text-primary-400">{loginLogoSize}px</span>
          </label>
          <input
            type="range"
            min={48}
            max={200}
            step={4}
            value={loginLogoSize}
            onChange={e => setLoginLogoSize(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-[10px] text-text-muted mt-1">
            <span>Petit (48px)</span>
            <span>Grand (200px)</span>
          </div>
        </div>

        {/* Gap slider */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Espace logo → titre — <span className="text-primary-400">{loginLogoGap}px</span>
          </label>
          <input
            type="range"
            min={-40}
            max={48}
            step={2}
            value={loginLogoGap}
            onChange={e => setLoginLogoGap(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-[10px] text-text-muted mt-1">
            <span>Très proche (-40px)</span>
            <span>Espacé (48px)</span>
          </div>
        </div>

        {/* Live preview of the login page */}
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Aperçu de la page login</p>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]" style={{ minHeight: 320 }}>
            {/* Blurred background blobs */}
            <div className="relative flex items-center justify-center py-10 px-6 overflow-hidden" style={{ minHeight: 320 }}>
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="w-full max-w-xs relative z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-5">
                  {loginLogo ? (
                    <img
                      src={loginLogo}
                      alt="Login logo"
                      style={{ height: loginLogoSize, width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-xl bg-white/5 text-text-muted text-xs"
                      style={{ height: loginLogoSize, width: loginLogoSize }}
                    >
                      Logo
                    </div>
                  )}
                  <p className="text-white font-bold text-lg" style={{ marginTop: loginLogoGap }}>Welcome back</p>
                  <p className="text-white/40 text-xs">Sign in to continue your dance journey</p>
                </div>
                {/* Fake form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="h-9 bg-white/5 border border-white/10 rounded-xl" />
                  <div className="h-9 bg-white/5 border border-white/10 rounded-xl" />
                  <div className="h-9 bg-yellow-500/80 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={saveLoginLogo}
          disabled={loginLogoSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-400 disabled:opacity-60 transition-colors text-sm font-semibold"
        >
          {loginLogoSaving ? <Loader2 size={14} className="animate-spin" /> : loginLogoSaved ? <Check size={14} /> : <Save size={14} />}
          {loginLogoSaving ? 'Saving…' : loginLogoSaved ? 'Saved!' : 'Save Login Logo'}
        </button>
        {loginLogoSaved && <p className="text-xs text-emerald-400">Logo de connexion mis à jour.</p>}
      </div>

      {/* ── LOGO BG CIRCLE ── */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary-500" />
            <h2 className="font-bold text-white">Logo Background Circle</h2>
          </div>
          <button
            type="button"
            onClick={() => setLogoBg(b => ({ ...b, opacity: 0 }))}
            className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors"
          >
            Supprimer le fond
          </button>
        </div>
        <p className="text-xs text-text-muted">Une forme colorée derrière le logo dans la navbar et le footer. Mets Opacity à 0 pour désactiver.</p>

        {/* Live preview */}
        <div className="p-5 bg-background rounded-xl border border-white/5">
          <p className="text-xs text-text-muted mb-4">Aperçu — fond sombre (gauche) et fond clair (droite) :</p>
          <div className="flex items-center gap-8">
            {/* Dark bg preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-16 bg-[#0f0f0f] rounded-xl flex items-center justify-center">
                <div
                  className={`flex items-center justify-center overflow-hidden flex-shrink-0 ${logoBg.shape === 'circle' ? 'rounded-full' : logoBg.shape === 'rounded' ? 'rounded-xl' : 'rounded-none'}`}
                  style={{ width: logoBg.size + logoBg.padding, height: logoBg.size + logoBg.padding, backgroundColor: hexToRgba(logoBg.color, logoBg.opacity) }}
                >
                  {logoUrl
                    ? <img src={logoUrl} alt="logo" className="object-contain" style={{ width: logoBg.size, height: logoBg.size }} />
                    : <span className="text-xs font-black text-white/40">LOGO</span>
                  }
                </div>
              </div>
              <span className="text-[10px] text-text-muted">Navbar (dark)</span>
            </div>
            {/* Light bg preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-16 bg-white rounded-xl flex items-center justify-center">
                <div
                  className={`flex items-center justify-center overflow-hidden flex-shrink-0 ${logoBg.shape === 'circle' ? 'rounded-full' : logoBg.shape === 'rounded' ? 'rounded-xl' : 'rounded-none'}`}
                  style={{ width: logoBg.size + logoBg.padding, height: logoBg.size + logoBg.padding, backgroundColor: hexToRgba(logoBg.color, logoBg.opacity) }}
                >
                  {logoUrl
                    ? <img src={logoUrl} alt="logo" className="object-contain" style={{ width: logoBg.size, height: logoBg.size }} />
                    : <span className="text-xs font-black text-black/40">LOGO</span>
                  }
                </div>
              </div>
              <span className="text-[10px] text-text-muted">Footer (light)</span>
            </div>
            <div className="text-xs text-text-muted">
              <p>Taille : <span className="text-white">{logoBg.size}px</span></p>
              <p>Total : <span className="text-white">{logoBg.size + logoBg.padding}px</span></p>
              <p>Opacité fond : <span className={logoBg.opacity === 0 ? 'text-emerald-400' : 'text-white'}>{logoBg.opacity === 0 ? 'Désactivé' : `${logoBg.opacity}%`}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Size */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-white mb-2">Logo Size — <span className="text-primary-400">{logoBg.size}px</span></label>
            <input
              type="range"
              min={24}
              max={120}
              step={2}
              value={logoBg.size}
              onChange={e => setLogoBg(b => ({ ...b, size: Number(e.target.value) }))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1">
              <span>Small (24px)</span><span>Large (120px)</span>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={logoBg.color}
                onChange={e => setLogoBg(b => ({ ...b, color: e.target.value }))}
                className="w-12 h-10 rounded-lg border border-white/10 bg-surface cursor-pointer p-1"
              />
              <input
                type="text"
                value={logoBg.color}
                onChange={e => setLogoBg(b => ({ ...b, color: e.target.value }))}
                placeholder="#ffffff"
                className="input-base flex-1 font-mono text-sm"
              />
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Opacity — <span className="text-primary-400">{logoBg.opacity}%</span></label>
            <input
              type="range"
              min={0}
              max={100}
              value={logoBg.opacity}
              onChange={e => setLogoBg(b => ({ ...b, opacity: Number(e.target.value) }))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1">
              <span>Transparent</span><span>Opaque</span>
            </div>
          </div>

          {/* Shape */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Shape</label>
            <div className="flex gap-2">
              {(['circle', 'rounded', 'square'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setLogoBg(b => ({ ...b, shape: s }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${logoBg.shape === s ? 'bg-primary-500 text-white border-primary-500' : 'bg-surface-2 text-text-secondary border-white/10 hover:border-white/30'}`}
                >
                  {s === 'circle' ? '⬤ Circle' : s === 'rounded' ? '▣ Rounded' : '■ Square'}
                </button>
              ))}
            </div>
          </div>

          {/* Padding */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Padding — <span className="text-primary-400">{logoBg.padding}px</span></label>
            <input
              type="range"
              min={0}
              max={32}
              value={logoBg.padding}
              onChange={e => setLogoBg(b => ({ ...b, padding: Number(e.target.value) }))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1">
              <span>Tight</span><span>Spacious</span>
            </div>
          </div>
        </div>

        <button
          onClick={saveLogoBg}
          disabled={logoBgSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-400 disabled:opacity-60 transition-colors text-sm font-semibold"
        >
          {logoBgSaving ? <Loader2 size={14} className="animate-spin" /> : logoBgSaved ? <Check size={14} /> : <Save size={14} />}
          {logoBgSaving ? 'Saving…' : logoBgSaved ? 'Saved!' : 'Sauvegarder'}
        </button>
        {logoBgSaved && <p className="text-xs text-emerald-400">Mis à jour dans la navbar et le footer.</p>}
      </div>

      {/* ── SOCIAL MEDIA ── */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Share2 size={16} className="text-secondary-400" />
          <h2 className="font-bold text-white">Social Media Links</h2>
        </div>
        <p className="text-xs text-text-muted -mt-2">These links appear in the footer. Paste the full URL of your page.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5 flex items-center gap-2">
              <span className="text-pink-400">Instagram</span>
            </label>
            <input
              type="url"
              value={social.instagram}
              onChange={e => setSocial(s => ({ ...s, instagram: e.target.value }))}
              placeholder="https://instagram.com/afrobreakconcepts"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              <span className="text-red-400">YouTube</span>
            </label>
            <input
              type="url"
              value={social.youtube}
              onChange={e => setSocial(s => ({ ...s, youtube: e.target.value }))}
              placeholder="https://youtube.com/@afrobreak"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              <span className="text-sky-400">Twitter / X</span>
            </label>
            <input
              type="url"
              value={social.twitter}
              onChange={e => setSocial(s => ({ ...s, twitter: e.target.value }))}
              placeholder="https://twitter.com/afrobreak"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              <span className="text-blue-400">Facebook</span>
            </label>
            <input
              type="url"
              value={social.facebook}
              onChange={e => setSocial(s => ({ ...s, facebook: e.target.value }))}
              placeholder="https://facebook.com/afrobreakconcepts"
              className="input-base"
            />
          </div>
        </div>
        <button
          onClick={saveSocial}
          disabled={socialSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-400 disabled:opacity-60 transition-colors text-sm font-semibold"
        >
          {socialSaving ? <Loader2 size={14} className="animate-spin" /> : socialSaved ? <Check size={14} /> : <Save size={14} />}
          {socialSaving ? 'Saving…' : socialSaved ? 'Saved!' : 'Save Social Links'}
        </button>
        {socialSaved && <p className="text-xs text-emerald-400">Social links updated in the footer.</p>}
      </div>

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

        {/* Maintenance Mode */}
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${form.maintenanceMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-surface-2 border-white/5'}`}>
          <div>
            <p className="text-sm font-medium text-white">Maintenance Mode</p>
            <p className="text-xs text-text-secondary">Show a maintenance page to all visitors. Admins can still access the site.</p>
            {form.maintenanceMode && (
              <p className="text-xs text-orange-400 font-semibold mt-1">⚠ Site is currently in maintenance mode</p>
            )}
          </div>
          <button
            onClick={() => setForm(f => ({...f, maintenanceMode: !f.maintenanceMode}))}
            className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${form.maintenanceMode ? 'bg-orange-500' : 'bg-white/20'}`}
          >
            <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Palette size={16} className="text-gold" />
          <h2 className="font-bold text-white">Subscriptions</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Monthly price</label>
            <input type="number" value={form.premiumPrice} onChange={e => setForm(f => ({...f, premiumPrice: e.target.value}))} min={0} step={0.01} className="input-base" />
            <p className="text-[10px] text-text-muted mt-1">e.g. 9.99 → GH₵9.99/month</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Annual price</label>
            <input type="number" value={form.annualPrice} onChange={e => setForm(f => ({...f, annualPrice: e.target.value}))} min={0} step={1} className="input-base" />
            <p className="text-[10px] text-text-muted mt-1">e.g. 500 → GH₵500/year</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1.5">Default currency</label>
          <select value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))} className="input-base">
              <option value="GHS" className="bg-surface">GHS ₵</option>
              <option value="EUR" className="bg-surface">EUR €</option>
              <option value="USD" className="bg-surface">USD $</option>
              <option value="GBP" className="bg-surface">GBP £</option>
            </select>
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

      <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
        {saving ? <><Loader2 size={16} className="animate-spin mr-2" />Saving...</> : 'Save Settings'}
      </Button>
    </div>
  )
}
