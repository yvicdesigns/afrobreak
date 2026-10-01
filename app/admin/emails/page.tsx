'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Mail, Save, Loader2,
  Type, MousePointer, FileText, Eye, CheckCircle,
  Link as LinkIcon, AlignLeft, Smartphone, List, Plus, Trash2, Send, Users
} from 'lucide-react'
import { getSetting } from '@/lib/db'
import { saveSettingAction } from '@/app/admin/settings-actions'
import ImageUpload from '@/components/ui/ImageUpload'

type Tab = 'newsletter' | 'contact'

interface NewsletterTpl {
  subject: string
  issueLabel: string
  issueNumber: string
  // Featured
  featuredImageUrl: string
  featuredTitle: string
  featuredAuthor: string
  featuredText: string
  // Events (3)
  event1Date: string; event1Title: string; event1Desc: string
  event2Date: string; event2Title: string; event2Desc: string
  event3Date: string; event3Title: string; event3Desc: string
  // Inside / Recap
  insideTitle: string
  bulletPoints: string
  recapTitle: string
  recapAuthor: string
  recapText: string
  // Bottom
  bottomImageUrl: string
  bottomText: string
  // CTA
  buttonText: string
  buttonUrl: string
  // Gallery
  galleryImages: string[]
  galleryTitle: string
  galleryColumns: 2 | 3
  // Section visibility
  showFeatured: boolean
  showEvents: boolean
  showInsideRecap: boolean
  showGallery: boolean
  showBottom: boolean
  // Design
  primaryColor: string
  accentColor: string
  bgColor: string
  footerText: string
  showLogo: boolean
}

interface ContactTpl {
  primaryColor: string
  bgColor: string
  footerText: string
}

const defaultNewsletter: NewsletterTpl = {
  subject: '🎶 AfroBreak Newsletter — Stay in the loop!',
  issueLabel: 'WEEKLY NEWSLETTER',
  issueNumber: 'Issue 01',
  featuredImageUrl: '',
  featuredTitle: 'A MESSAGE FROM OUR FOUNDER',
  featuredAuthor: 'AfroBreak Team',
  featuredText: 'We are thrilled to have you as part of our growing community. AfroBreak is more than a platform — it is a movement that celebrates African dance culture across the globe. Stay connected, keep dancing, and let the culture speak.',
  event1Date: 'MONDAY, 14 JULY', event1Title: 'Open Cypher Night', event1Desc: 'Join us for an open session of freestyle battles and community vibes.',
  event2Date: 'THURSDAY, 17 JULY', event2Title: 'Afrobeats Workshop', event2Desc: 'Learn the fundamentals of Afrobeats with our top ambassador instructors.',
  event3Date: 'FRIDAY, 18 JULY', event3Title: 'AfroBreak Live', event3Desc: 'Live performances, demos, and the best of the AfroBreak community.',
  insideTitle: 'INSIDE THIS ISSUE',
  bulletPoints: "Community Spotlight\nUpcoming Events\nNew Tutorials\nArtist Feature\nShop New Drops",
  recapTitle: 'WEEKLY RECAP',
  recapAuthor: 'AfroBreak Editorial',
  recapText: 'This week we saw incredible energy from our community. From viral videos to packed workshops, the culture is alive and growing stronger every day. Thank you for being part of this journey.',
  bottomImageUrl: '',
  bottomText: 'The AfroBreak community is global. Whether you\'re in Accra, London, Paris, or New York — we are one family united by dance.',
  buttonText: 'Visit AfroBreak',
  buttonUrl: 'https://afrobreak.com',
  galleryImages: [],
  galleryTitle: 'PHOTO GALLERY',
  galleryColumns: 2,
  showFeatured: true,
  showEvents: true,
  showInsideRecap: true,
  showGallery: false,
  showBottom: true,
  primaryColor: '#FDCA00',
  accentColor: '#0D3DC8',
  bgColor: '#f5f5f5',
  footerText: "You're receiving this because you subscribed at afrobreak.com. To unsubscribe, reply to this email.",
  showLogo: true,
}

const defaultContact: ContactTpl = {
  primaryColor: '#FDCA00',
  bgColor: '#0D0A1A',
  footerText: 'Reply directly to this email to respond to the sender.',
}

function SectionToggle({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
        enabled
          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
          : 'bg-white/5 border-white/10 text-text-muted line-through'
      }`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${enabled ? 'bg-emerald-400' : 'bg-white/20'}`} />
      {label}
    </button>
  )
}

function buildNewsletterHtml(tpl: NewsletterTpl, logoUrl: string): string {
  const logoBlock = tpl.showLogo && logoUrl
    ? `<img src="${logoUrl}" alt="AfroBreak" style="height:44px;width:auto;object-fit:contain;" />`
    : `<span style="font-size:24px;font-weight:900;letter-spacing:-1px;color:${tpl.accentColor};">AFRO<span style="color:${tpl.primaryColor};">BREAK</span></span>`

  const bullets = tpl.bulletPoints.split('\n').filter(Boolean)
    .map(b => `<li style="margin-bottom:8px;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.3px;">${b.toUpperCase()}</li>`)
    .join('')

  const featuredImg = tpl.featuredImageUrl
    ? `<img src="${tpl.featuredImageUrl}" alt="Featured" style="width:100%;height:180px;object-fit:cover;object-position:center top;display:block;border-radius:6px;" />`
    : `<div style="width:100%;height:180px;background:${tpl.accentColor};border-radius:6px;display:flex;align-items:center;justify-content:center;"><span style="color:#fff;font-size:36px;">🎶</span></div>`

  const bottomImg = tpl.bottomImageUrl
    ? `<img src="${tpl.bottomImageUrl}" alt="Community" style="width:48%;object-fit:cover;border-radius:8px;display:block;" />`
    : `<div style="width:48%;background:${tpl.accentColor};border-radius:8px;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;"><span style="font-size:48px;">🕺</span></div>`

  const lastSectionRadius = !tpl.showBottom ? '12px' : '0'

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  @media only screen and (max-width:600px){
    .two-col td{display:block!important;width:100%!important;}
    .three-col td{display:block!important;width:100%!important;border-right:none!important;border-bottom:1px solid rgba(255,255,255,0.15)!important;padding-bottom:16px!important;margin-bottom:16px!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${tpl.bgColor};font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="background:${tpl.bgColor};padding:24px 12px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;">
<tr><td>

  <!-- HEADER -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px 12px 0 0;border-bottom:3px solid ${tpl.primaryColor};">
    <tr><td style="padding:20px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;">${logoBlock}</td>
        <td style="text-align:right;vertical-align:middle;font-size:11px;color:${tpl.accentColor};font-weight:700;letter-spacing:1px;">${tpl.issueNumber}</td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:10px 28px;background:${tpl.accentColor};">
      <span style="font-size:11px;color:rgba(255,255,255,0.7);font-weight:700;letter-spacing:2px;">${tpl.issueLabel}</span>
    </td></tr>
    <tr><td style="padding:20px 28px 0;background:#fff;">
      <div style="font-size:48px;font-weight:900;color:${tpl.accentColor};letter-spacing:-2px;line-height:1;text-transform:uppercase;">NEWSLETTER</div>
      <div style="height:3px;background:${tpl.primaryColor};margin:10px 0 0;border-radius:2px;"></div>
    </td></tr>
  </table>

  ${tpl.showFeatured ? `
  <!-- FEATURED -->
  <table width="100%" cellpadding="0" cellspacing="0" class="two-col" style="background:#fff;margin-top:2px;">
    <tr>
      <td style="padding:24px 16px 24px 28px;vertical-align:top;width:38%;">${featuredImg}</td>
      <td style="padding:24px 28px 24px 16px;vertical-align:top;">
        <div style="color:${tpl.primaryColor};font-size:28px;font-weight:900;line-height:1;">"</div>
        <div style="font-size:13px;font-weight:900;color:${tpl.accentColor};text-transform:uppercase;letter-spacing:0.5px;margin:4px 0;">${tpl.featuredTitle}</div>
        <div style="font-size:11px;color:#888;margin-bottom:10px;font-style:italic;">By ${tpl.featuredAuthor}</div>
        <div style="font-size:13px;color:#444;line-height:1.75;">${tpl.featuredText}</div>
        <div style="color:${tpl.primaryColor};font-size:28px;font-weight:900;text-align:right;margin-top:6px;line-height:1;">"</div>
      </td>
    </tr>
  </table>` : ''}

  ${tpl.showEvents ? `
  <!-- EVENTS -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${tpl.accentColor};margin-top:2px;">
    <tr><td style="padding:16px 28px 8px;">
      <div style="font-size:13px;font-weight:900;color:${tpl.primaryColor};letter-spacing:1px;text-transform:uppercase;">📅 UPCOMING EVENTS &nbsp;›››</div>
    </td></tr>
    <tr><td style="padding:0 16px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" class="three-col"><tr>
        <td style="padding:10px 12px;vertical-align:top;width:33%;border-right:1px solid rgba(255,255,255,0.2);">
          <div style="font-size:11px;font-weight:900;color:${tpl.primaryColor};margin-bottom:5px;">${tpl.event1Date}</div>
          <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:4px;">${tpl.event1Title}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.5;">${tpl.event1Desc}</div>
        </td>
        <td style="padding:10px 12px;vertical-align:top;width:33%;border-right:1px solid rgba(255,255,255,0.2);">
          <div style="font-size:11px;font-weight:900;color:${tpl.primaryColor};margin-bottom:5px;">${tpl.event2Date}</div>
          <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:4px;">${tpl.event2Title}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.5;">${tpl.event2Desc}</div>
        </td>
        <td style="padding:10px 12px;vertical-align:top;width:33%;">
          <div style="font-size:11px;font-weight:900;color:${tpl.primaryColor};margin-bottom:5px;">${tpl.event3Date}</div>
          <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:4px;">${tpl.event3Title}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.5;">${tpl.event3Desc}</div>
        </td>
      </tr></table>
    </td></tr>
  </table>` : ''}

  ${tpl.showInsideRecap ? `
  <!-- INSIDE + RECAP -->
  <table width="100%" cellpadding="0" cellspacing="0" class="two-col" style="background:#fff;margin-top:2px;${!tpl.showBottom ? `border-radius:0 0 12px 12px;` : ''}">
    <tr>
      <td style="background:${tpl.primaryColor};padding:22px 20px;vertical-align:top;width:38%;">
        <div style="font-size:12px;font-weight:900;color:#0D0A1A;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">${tpl.insideTitle}</div>
        <ul style="margin:0;padding-left:18px;">${bullets}</ul>
      </td>
      <td style="padding:22px 24px;vertical-align:top;border-left:4px solid ${tpl.primaryColor};">
        <div style="font-size:12px;font-weight:900;color:${tpl.accentColor};text-transform:uppercase;letter-spacing:0.5px;">${tpl.recapTitle}</div>
        <div style="font-size:11px;color:#999;font-style:italic;margin:3px 0 10px;">By ${tpl.recapAuthor}</div>
        <div style="font-size:13px;color:#555;line-height:1.75;">${tpl.recapText}</div>
      </td>
    </tr>
  </table>` : ''}

  ${tpl.showGallery && tpl.galleryImages.length > 0 ? `
  <!-- GALLERY -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;">
    <tr><td style="padding:24px 28px 8px;">
      <div style="font-size:13px;font-weight:900;color:${tpl.accentColor};text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">${tpl.galleryTitle}</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${(() => {
          const cols = tpl.galleryColumns
          const rows: string[] = []
          for (let i = 0; i < tpl.galleryImages.length; i += cols) {
            const cells = tpl.galleryImages.slice(i, i + cols).map(url =>
              `<td style="width:${Math.floor(100/cols)}%;padding:4px;vertical-align:top;">
                <img src="${url}" alt="Gallery photo" style="width:100%;height:160px;object-fit:cover;border-radius:8px;display:block;" />
              </td>`
            ).join('')
            const empty = cols - (tpl.galleryImages.length - i < cols ? tpl.galleryImages.length - i : 0)
            const filler = empty > 0 && i + cols > tpl.galleryImages.length
              ? Array(cols - (tpl.galleryImages.length - i)).fill(`<td style="width:${Math.floor(100/cols)}%;padding:4px;"></td>`).join('')
              : ''
            rows.push(`<tr>${cells}${filler}</tr>`)
          }
          return rows.join('')
        })()}
      </table>
    </td></tr>
  </table>` : ''}

  ${tpl.showBottom ? `
  <!-- BOTTOM -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;">
    <tr><td style="padding:24px 28px;">
      ${bottomImg}
      <div style="font-size:13px;color:#555;line-height:1.8;font-style:italic;margin-bottom:20px;">"${tpl.bottomText}"</div>
      ${tpl.buttonText ? `<a href="${tpl.buttonUrl}" style="display:inline-block;background:${tpl.accentColor};color:#fff;font-weight:900;font-size:13px;padding:12px 28px;border-radius:8px;text-decoration:none;">${tpl.buttonText}</a>` : ''}
    </td></tr>
  </table>` : ''}

  <!-- FOOTER -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:2px;">
    <tr><td style="padding:16px 28px;text-align:center;background:${tpl.accentColor};border-radius:0 0 12px 12px;">
      <div style="font-size:11px;color:rgba(255,255,255,0.45);line-height:1.6;">${tpl.footerText}</div>
    </td></tr>
  </table>

</td></tr></table>
</div>
</body></html>`
}

function buildContactHtml(tpl: ContactTpl, logoUrl: string): string {
  const logoBlock = logoUrl
    ? `<img src="${logoUrl}" alt="AfroBreak" style="height:40px;width:auto;object-fit:contain;display:block;" />`
    : `<span style="font-size:22px;font-weight:900;color:#0D0A1A;">AFROBREAK</span>`

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${tpl.bgColor};">
<div style="background:${tpl.bgColor};font-family:'Helvetica Neue',Arial,sans-serif;padding:32px 16px;">
  <div style="max-width:580px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
    <div style="background:${tpl.primaryColor};padding:24px 32px;display:flex;align-items:center;gap:16px;">
      ${logoBlock}
      <div style="margin-left:16px;">
        <div style="color:#0D0A1A;font-size:18px;font-weight:900;">New Contact Message</div>
        <div style="color:#0D0A1A;font-size:13px;opacity:0.7;margin-top:2px;">from the AfroBreak website</div>
      </div>
    </div>
    <div style="background:#161230;padding:36px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:10px 0;color:#888;font-size:13px;width:80px;border-bottom:1px solid #1f1c38;">From</td><td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;border-bottom:1px solid #1f1c38;">John Doe</td></tr>
        <tr><td style="padding:10px 0;color:#888;font-size:13px;border-bottom:1px solid #1f1c38;">Email</td><td style="padding:10px 0;border-bottom:1px solid #1f1c38;"><a href="mailto:john@example.com" style="color:${tpl.primaryColor};font-size:14px;">john@example.com</a></td></tr>
        <tr><td style="padding:10px 0;color:#888;font-size:13px;">Subject</td><td style="padding:10px 0;color:#fff;font-size:14px;">Partnership inquiry</td></tr>
      </table>
      <div style="background:#0d0a1a;border-radius:10px;padding:24px;border-left:4px solid ${tpl.primaryColor};">
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.8;">Hello, I'm interested in discussing a potential partnership with AfroBreak. We are a dance studio based in London and would love to collaborate on upcoming events...</p>
      </div>
    </div>
    <div style="background:#0d0a1a;padding:20px 36px;border-top:1px solid #1f1c38;text-align:center;">
      <p style="margin:0;color:#555;font-size:12px;">${tpl.footerText}</p>
    </div>
  </div>
</div>
</body></html>`
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0.5" />
      <div>
        <p className="text-xs text-text-muted mb-0.5">{label}</p>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="text-sm text-white bg-background border border-white/10 rounded-lg px-2 py-1 w-28 font-mono" />
      </div>
    </div>
  )
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
        <Icon size={12} />{label}
      </label>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-primary-400 uppercase tracking-widest pt-4 border-t border-white/5 mt-2">{children}</p>
  )
}

export default function EmailTemplatesPage() {
  const [tab, setTab] = useState<Tab>('newsletter')
  const [nl, setNl] = useState<NewsletterTpl>(defaultNewsletter)
  const [contact, setContact] = useState<ContactTpl>(defaultContact)
  const [logoUrl, setLogoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [counts, setCounts] = useState<{ total: number; subscribers: number; nominators: number } | null>(null)
  const [alreadySent, setAlreadySent] = useState(0)
  const [sendGroup, setSendGroup] = useState<'all' | 'subscribers' | 'nominators'>('all')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; skipped: number } | null>(null)
  const [confirmSend, setConfirmSend] = useState(false)

  useEffect(() => {
    getSetting('site_logo').then(logo => { if (logo) setLogoUrl(logo) })
    getSetting('email_newsletter_template').then(raw => {
      if (raw) try { setNl(p => ({ ...p, ...JSON.parse(raw) })) } catch {}
    })
    getSetting('email_contact_template').then(raw => {
      if (raw) try { setContact(p => ({ ...p, ...JSON.parse(raw) })) } catch {}
    })
    fetch('/api/send-newsletter').then(r => r.json()).then(d => {
      if (d.counts) setCounts(d.counts)
      setAlreadySent(d.alreadySent ?? 0)
    }).catch(() => {})
  }, [])

  const refreshCounts = () => {
    fetch(`/api/send-newsletter?issue=${encodeURIComponent(nl.issueNumber)}`)
      .then(r => r.json()).then(d => {
        if (d.counts) setCounts(d.counts)
        setAlreadySent(d.alreadySent ?? 0)
      }).catch(() => {})
  }

  const handleSendNewsletter = async () => {
    setSending(true)
    setConfirmSend(false)
    setSendResult(null)
    try {
      const res = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: sendGroup }),
      })
      const json = await res.json()
      setSendResult({ sent: json.sent || 0, skipped: json.skipped || 0 })
      refreshCounts()
    } catch {
      setSendResult({ sent: 0, skipped: 0 })
    }
    setSending(false)
  }

  const handleSave = async () => {
    setSaving(true)
    if (tab === 'newsletter') await saveSettingAction('email_newsletter_template', JSON.stringify(nl))
    else await saveSettingAction('email_contact_template', JSON.stringify(contact))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const n = useCallback(<K extends keyof NewsletterTpl>(k: K, v: NewsletterTpl[K]) => {
    setNl(p => ({ ...p, [k]: v }))
  }, [])

  const c = useCallback(<K extends keyof ContactTpl>(k: K, v: ContactTpl[K]) => {
    setContact(p => ({ ...p, [k]: v }))
  }, [])

  const previewHtml = tab === 'newsletter'
    ? buildNewsletterHtml(nl, logoUrl)
    : buildContactHtml(contact, logoUrl)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Email Templates</h1>
          <p className="text-text-secondary text-sm mt-1">Design beautiful emails for your community</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {tab === 'newsletter' && (
            confirmSend ? (
              <div className="flex flex-wrap items-center gap-2 bg-surface border border-amber-500/30 rounded-xl px-4 py-2.5">
                <span className="text-sm text-amber-400 font-semibold">
                  Confirm: send {nl.issueNumber} to{' '}
                  {sendGroup === 'all' ? `all ${counts?.total ?? '…'}` :
                   sendGroup === 'nominators' ? `${counts?.nominators ?? '…'} nominators` :
                   `${counts?.subscribers ?? '…'} subscribers`}?
                  {alreadySent > 0 && <span className="text-text-muted"> ({alreadySent} already received it)</span>}
                </span>
                <button onClick={handleSendNewsletter} disabled={sending}
                  className="px-3 py-1 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-all disabled:opacity-60">
                  {sending ? <Loader2 size={13} className="animate-spin" /> : 'Yes, send now'}
                </button>
                <button onClick={() => setConfirmSend(false)} className="px-3 py-1 rounded-lg text-xs font-bold text-text-muted hover:text-white transition-all">Cancel</button>
              </div>
            ) : sendResult ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2">
                <CheckCircle size={15} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-semibold">
                  Sent to {sendResult.sent} people
                  {sendResult.skipped > 0 && <span className="text-text-muted"> · {sendResult.skipped} already received it</span>}
                </span>
                <button onClick={() => setSendResult(null)} className="text-xs text-text-muted hover:text-white ml-2">×</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={sendGroup}
                  onChange={e => setSendGroup(e.target.value as typeof sendGroup)}
                  className="text-sm bg-surface border border-white/10 text-white rounded-xl px-3 py-2 outline-none"
                >
                  <option value="all">All ({counts?.total ?? '…'})</option>
                  <option value="subscribers">Website subscribers ({counts?.subscribers ?? '…'})</option>
                  <option value="nominators">Nominators ({counts?.nominators ?? '…'})</option>
                </select>
                <button onClick={() => { refreshCounts(); setConfirmSend(true) }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all">
                  <Send size={15} />
                  Send
                </button>
              </div>
            )
          )}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60"
            style={{ background: saved ? '#10b981' : '#FDCA00', color: '#0D0A1A' }}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Template'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface border border-white/5 rounded-xl w-fit">
        {([['newsletter', 'Newsletter', Mail], ['contact', 'Contact Form', FileText]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-text-secondary hover:text-white'}`}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── EDITOR ── */}
        <div className="xl:col-span-2">
          <div className="bg-surface border border-white/5 rounded-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto">

            {tab === 'newsletter' ? (
              <>
                {/* Section visibility toggles */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Sections actives</p>
                  <div className="flex flex-wrap gap-2">
                    <SectionToggle label="Message vedette" enabled={nl.showFeatured} onChange={v => n('showFeatured', v)} />
                    <SectionToggle label="Événements" enabled={nl.showEvents} onChange={v => n('showEvents', v)} />
                    <SectionToggle label="Inside / Recap" enabled={nl.showInsideRecap} onChange={v => n('showInsideRecap', v)} />
                    <SectionToggle label="Galerie photos" enabled={nl.showGallery} onChange={v => n('showGallery', v)} />
                    <SectionToggle label="Section bas" enabled={nl.showBottom} onChange={v => n('showBottom', v)} />
                  </div>
                </div>

                <SectionTitle>Header</SectionTitle>
                <Field label="Email Subject" icon={Mail}>
                  <input type="text" value={nl.subject} onChange={e => n('subject', e.target.value)} className="input-base text-sm" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Label" icon={Type}>
                    <input type="text" value={nl.issueLabel} onChange={e => n('issueLabel', e.target.value)} className="input-base text-sm" placeholder="WEEKLY NEWSLETTER" />
                  </Field>
                  <Field label="Issue #" icon={Type}>
                    <input type="text" value={nl.issueNumber} onChange={e => n('issueNumber', e.target.value)} className="input-base text-sm" placeholder="Issue 01" />
                  </Field>
                </div>

                {nl.showFeatured && <><SectionTitle>Message vedette</SectionTitle>
                <ImageUpload
                  value={nl.featuredImageUrl}
                  onChange={v => n('featuredImageUrl', v)}
                  label="Photo (URL ou upload local)"
                  folder="email-templates"
                />
                <Field label="Title" icon={Type}>
                  <input type="text" value={nl.featuredTitle} onChange={e => n('featuredTitle', e.target.value)} className="input-base text-sm" />
                </Field>
                <Field label="Author" icon={Type}>
                  <input type="text" value={nl.featuredAuthor} onChange={e => n('featuredAuthor', e.target.value)} className="input-base text-sm" />
                </Field>
                <Field label="Message" icon={AlignLeft}>
                  <textarea value={nl.featuredText} onChange={e => n('featuredText', e.target.value)} rows={4} className="input-base text-sm resize-none" />
                </Field></>}

                {nl.showEvents && <><SectionTitle>Upcoming Events</SectionTitle>
                {([1, 2, 3] as const).map(i => (
                  <div key={i} className="space-y-2 bg-background rounded-xl p-3 border border-white/5">
                    <p className="text-xs font-bold text-text-muted">Event {i}</p>
                    <input type="text" value={nl[`event${i}Date` as keyof NewsletterTpl] as string}
                      onChange={e => n(`event${i}Date` as keyof NewsletterTpl, e.target.value)}
                      className="input-base text-xs" placeholder="MONDAY, 14 JULY" />
                    <input type="text" value={nl[`event${i}Title` as keyof NewsletterTpl] as string}
                      onChange={e => n(`event${i}Title` as keyof NewsletterTpl, e.target.value)}
                      className="input-base text-xs" placeholder="Event title" />
                    <input type="text" value={nl[`event${i}Desc` as keyof NewsletterTpl] as string}
                      onChange={e => n(`event${i}Desc` as keyof NewsletterTpl, e.target.value)}
                      className="input-base text-xs" placeholder="Short description" />
                  </div>
                ))}

                </>}

                {nl.showInsideRecap && <><SectionTitle>Inside This Issue</SectionTitle>
                <Field label="Section title" icon={List}>
                  <input type="text" value={nl.insideTitle} onChange={e => n('insideTitle', e.target.value)} className="input-base text-sm" />
                </Field>
                <Field label="Items (one per line)" icon={List}>
                  <textarea value={nl.bulletPoints} onChange={e => n('bulletPoints', e.target.value)}
                    rows={5} className="input-base text-sm resize-none font-mono" />
                </Field>

                <SectionTitle>Weekly Recap</SectionTitle>
                <Field label="Recap Title" icon={Type}>
                  <input type="text" value={nl.recapTitle} onChange={e => n('recapTitle', e.target.value)} className="input-base text-sm" />
                </Field>
                <Field label="Author" icon={Type}>
                  <input type="text" value={nl.recapAuthor} onChange={e => n('recapAuthor', e.target.value)} className="input-base text-sm" />
                </Field>
                <Field label="Text" icon={AlignLeft}>
                  <textarea value={nl.recapText} onChange={e => n('recapText', e.target.value)} rows={3} className="input-base text-sm resize-none" />
                </Field>

                </>}

                {nl.showGallery && <>
                  <SectionTitle>Galerie Photos</SectionTitle>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Titre section" icon={Type}>
                      <input type="text" value={nl.galleryTitle} onChange={e => n('galleryTitle', e.target.value)} className="input-base text-sm" />
                    </Field>
                    <Field label="Colonnes" icon={List}>
                      <select value={nl.galleryColumns} onChange={e => n('galleryColumns', Number(e.target.value) as 2 | 3)} className="input-base text-sm">
                        <option value={2}>2 colonnes</option>
                        <option value={3}>3 colonnes</option>
                      </select>
                    </Field>
                  </div>

                  <div className="space-y-3">
                    {nl.galleryImages.map((url, i) => (
                      <div key={i} className="bg-background rounded-xl p-3 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-text-muted">Photo {i + 1}</span>
                          <button type="button" onClick={() => n('galleryImages', nl.galleryImages.filter((_, j) => j !== i))}
                            className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                        {url && <img src={url} alt="" className="w-full h-24 object-cover rounded-lg opacity-80" />}
                        <ImageUpload
                          value={url}
                          onChange={v => {
                            const imgs = [...nl.galleryImages]
                            imgs[i] = v
                            n('galleryImages', imgs)
                          }}
                          label=""
                          folder="email-gallery"
                        />
                      </div>
                    ))}
                    <button type="button"
                      onClick={() => n('galleryImages', [...nl.galleryImages, ''])}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/20 text-text-muted hover:text-white hover:border-white/40 text-sm font-semibold transition-all">
                      <Plus size={14} /> Ajouter une photo
                    </button>
                  </div>
                </>}

                {nl.showBottom && <><SectionTitle>Bottom Section</SectionTitle>
                <ImageUpload
                  value={nl.bottomImageUrl}
                  onChange={v => n('bottomImageUrl', v)}
                  label="Photo communauté (URL ou upload local)"
                  folder="email-templates"
                />
                <Field label="Quote Text" icon={AlignLeft}>
                  <textarea value={nl.bottomText} onChange={e => n('bottomText', e.target.value)} rows={3} className="input-base text-sm resize-none" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Button Text" icon={MousePointer}>
                    <input type="text" value={nl.buttonText} onChange={e => n('buttonText', e.target.value)} className="input-base text-sm" />
                  </Field>
                  <Field label="Button URL" icon={LinkIcon}>
                    <input type="url" value={nl.buttonUrl} onChange={e => n('buttonUrl', e.target.value)} className="input-base text-sm" />
                  </Field>
                </div></>}

                <SectionTitle>Colors & Style</SectionTitle>
                <ColorInput label="Primary (yellow)" value={nl.primaryColor} onChange={v => n('primaryColor', v)} />
                <ColorInput label="Accent (blue)" value={nl.accentColor} onChange={v => n('accentColor', v)} />
                <ColorInput label="Background" value={nl.bgColor} onChange={v => n('bgColor', v)} />
                <Field label="Footer Note" icon={FileText}>
                  <input type="text" value={nl.footerText} onChange={e => n('footerText', e.target.value)} className="input-base text-sm" />
                </Field>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="showLogo" checked={nl.showLogo}
                    onChange={e => n('showLogo', e.target.checked)} className="w-4 h-4 accent-yellow-400" />
                  <label htmlFor="showLogo" className="text-sm text-text-secondary cursor-pointer">Show site logo</label>
                </div>
              </>
            ) : (
              <>
                <SectionTitle>Contact Email Style</SectionTitle>
                <p className="text-sm text-text-secondary">The contact email is generated dynamically with the sender's info. Customize the colors and footer.</p>
                <ColorInput label="Accent color" value={contact.primaryColor} onChange={v => c('primaryColor', v)} />
                <ColorInput label="Background" value={contact.bgColor} onChange={v => c('bgColor', v)} />
                <Field label="Footer note" icon={FileText}>
                  <input type="text" value={contact.footerText} onChange={e => c('footerText', e.target.value)} className="input-base text-sm" />
                </Field>
              </>
            )}
          </div>
        </div>

        {/* ── PREVIEW ── */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Eye size={12} /> Live Preview
            </p>
            <div className="flex gap-1 p-1 bg-surface border border-white/5 rounded-lg">
              {(['desktop', 'mobile'] as const).map(d => (
                <button key={d} onClick={() => setDevice(d)}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition-all ${device === d ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}>
                  {d === 'mobile' && <Smartphone size={11} />}
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {tab === 'newsletter' && (
            <div className="bg-surface border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-primary-400" />
              </div>
              <div>
                <p className="text-xs text-text-muted">Subject</p>
                <p className="text-sm text-white font-medium">{nl.subject}</p>
              </div>
            </div>
          )}

          <div className="bg-[#e8e8e8] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-[#d0d0d0] border-b border-black/10 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-gray-500 font-mono">email preview</span>
              </div>
            </div>
            <div className="overflow-auto" style={{ maxHeight: '680px' }}>
              <div style={{ maxWidth: device === 'mobile' ? '375px' : '100%', margin: '0 auto' }}
                dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
