import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'AfroBreak <onboarding@resend.dev>'

type Tpl = {
  subject: string; issueLabel: string; issueNumber: string
  featuredImageUrl: string; featuredTitle: string; featuredAuthor: string; featuredText: string
  event1Date: string; event1Title: string; event1Desc: string
  event2Date: string; event2Title: string; event2Desc: string
  event3Date: string; event3Title: string; event3Desc: string
  insideTitle: string; bulletPoints: string
  recapTitle: string; recapAuthor: string; recapText: string
  bottomImageUrl: string; bottomText: string; buttonText: string; buttonUrl: string
  galleryImages: string[]; galleryTitle: string; galleryColumns: 2 | 3
  showFeatured: boolean; showEvents: boolean; showInsideRecap: boolean
  showGallery: boolean; showBottom: boolean
  primaryColor: string; accentColor: string; bgColor: string; footerText: string; showLogo: boolean
}

const DEFAULTS: Tpl = {
  subject: '🎶 AfroBreak Newsletter', issueLabel: 'NEWSLETTER', issueNumber: 'Issue 01',
  featuredImageUrl: '', featuredTitle: 'A MESSAGE FROM OUR FOUNDER', featuredAuthor: 'AfroBreak Team',
  featuredText: 'We are thrilled to have you as part of our growing community.',
  event1Date: '', event1Title: '', event1Desc: '',
  event2Date: '', event2Title: '', event2Desc: '',
  event3Date: '', event3Title: '', event3Desc: '',
  insideTitle: 'INSIDE THIS ISSUE', bulletPoints: '',
  recapTitle: 'WEEKLY RECAP', recapAuthor: 'AfroBreak Editorial', recapText: '',
  bottomImageUrl: '', bottomText: '', buttonText: 'Visit AfroBreak', buttonUrl: 'https://afrobreak.com',
  galleryImages: [], galleryTitle: 'PHOTO GALLERY', galleryColumns: 2,
  showFeatured: true, showEvents: true, showInsideRecap: true, showGallery: false, showBottom: true,
  primaryColor: '#FDCA00', accentColor: '#0D3DC8', bgColor: '#f5f5f5',
  footerText: "You're receiving this because you subscribed at afrobreak.com.", showLogo: true,
}

function buildHtml(tpl: Tpl, logoUrl: string): string {
  const logo = tpl.showLogo && logoUrl
    ? `<img src="${logoUrl}" alt="AfroBreak" style="height:44px;width:auto;object-fit:contain;" />`
    : `<span style="font-size:24px;font-weight:900;color:${tpl.accentColor};">AFRO<span style="color:${tpl.primaryColor};">BREAK</span></span>`

  const bullets = tpl.bulletPoints.split('\n').filter(Boolean)
    .map(b => `<li style="margin-bottom:8px;font-size:13px;font-weight:700;color:#fff;">${b.toUpperCase()}</li>`).join('')

  const featuredImg = tpl.featuredImageUrl
    ? `<img src="${tpl.featuredImageUrl}" alt="" style="width:100%;height:180px;object-fit:cover;border-radius:6px;" />`
    : `<div style="width:100%;height:180px;background:${tpl.accentColor};border-radius:6px;text-align:center;padding-top:60px;box-sizing:border-box;"><span style="color:${tpl.primaryColor};font-size:48px;">🎶</span></div>`

  const galleryRows = (() => {
    if (!tpl.showGallery || !tpl.galleryImages.length) return ''
    const cols = tpl.galleryColumns
    const rows: string[] = []
    for (let i = 0; i < tpl.galleryImages.length; i += cols) {
      const cells = tpl.galleryImages.slice(i, i + cols).map(url =>
        `<td style="width:${Math.floor(100/cols)}%;padding:4px;">
          <img src="${url}" alt="" style="width:100%;height:150px;object-fit:cover;border-radius:8px;display:block;" />
        </td>`
      ).join('')
      rows.push(`<tr>${cells}</tr>`)
    }
    return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;">
      <tr><td style="padding:24px 28px 8px;">
        <div style="font-size:13px;font-weight:900;color:${tpl.accentColor};text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">${tpl.galleryTitle}</div>
        <table width="100%" cellpadding="0" cellspacing="0">${rows.join('')}</table>
      </td></tr></table>`
  })()

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${tpl.bgColor};font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="background:${tpl.bgColor};padding:24px 12px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;"><tr><td>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px 12px 0 0;border-bottom:3px solid ${tpl.primaryColor};">
    <tr><td style="padding:20px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td>${logo}</td>
        <td style="text-align:right;font-size:11px;color:${tpl.accentColor};font-weight:700;">${tpl.issueNumber}</td>
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
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;"><tr>
    <td style="padding:24px 16px 24px 28px;vertical-align:top;width:38%;">${featuredImg}</td>
    <td style="padding:24px 28px 24px 16px;vertical-align:top;">
      <div style="color:${tpl.primaryColor};font-size:28px;font-weight:900;line-height:1;">"</div>
      <div style="font-size:13px;font-weight:900;color:${tpl.accentColor};text-transform:uppercase;">${tpl.featuredTitle}</div>
      <div style="font-size:11px;color:#888;margin-bottom:10px;font-style:italic;">By ${tpl.featuredAuthor}</div>
      <div style="font-size:13px;color:#444;line-height:1.75;">${tpl.featuredText}</div>
      <div style="color:${tpl.primaryColor};font-size:28px;font-weight:900;text-align:right;line-height:1;">"</div>
    </td>
  </tr></table>` : ''}

  ${tpl.showEvents && (tpl.event1Title || tpl.event2Title || tpl.event3Title) ? `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${tpl.accentColor};margin-top:2px;">
    <tr><td style="padding:16px 28px 8px;">
      <div style="font-size:13px;font-weight:900;color:${tpl.primaryColor};letter-spacing:1px;text-transform:uppercase;">📅 UPCOMING EVENTS ›››</div>
    </td></tr>
    <tr><td style="padding:0 16px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
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
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;"><tr>
    <td style="background:${tpl.primaryColor};padding:22px 20px;vertical-align:top;width:38%;">
      <div style="font-size:12px;font-weight:900;color:#0D0A1A;text-transform:uppercase;margin-bottom:12px;">${tpl.insideTitle}</div>
      <ul style="margin:0;padding-left:18px;">${bullets}</ul>
    </td>
    <td style="padding:22px 24px;vertical-align:top;border-left:4px solid ${tpl.primaryColor};">
      <div style="font-size:12px;font-weight:900;color:${tpl.accentColor};text-transform:uppercase;">${tpl.recapTitle}</div>
      <div style="font-size:11px;color:#999;font-style:italic;margin:3px 0 10px;">By ${tpl.recapAuthor}</div>
      <div style="font-size:13px;color:#555;line-height:1.75;">${tpl.recapText}</div>
    </td>
  </tr></table>` : ''}

  ${galleryRows}

  ${tpl.showBottom ? `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;"><tr>
    <td style="padding:24px 28px;">
      ${tpl.bottomImageUrl ? `<img src="${tpl.bottomImageUrl}" alt="" style="width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:16px;" />` : ''}
      <div style="font-size:13px;color:#555;line-height:1.8;font-style:italic;margin-bottom:20px;">"${tpl.bottomText}"</div>
      ${tpl.buttonText ? `<a href="${tpl.buttonUrl}" style="display:inline-block;background:${tpl.accentColor};color:#fff;font-weight:900;font-size:13px;padding:12px 28px;border-radius:8px;text-decoration:none;">${tpl.buttonText}</a>` : ''}
    </td>
  </tr></table>` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:2px;">
    <tr><td style="padding:16px 28px;text-align:center;background:${tpl.accentColor};border-radius:0 0 12px 12px;">
      <div style="font-size:11px;color:rgba(255,255,255,0.45);line-height:1.6;">${tpl.footerText}</div>
    </td></tr>
  </table>

</td></tr></table>
</div>
</body></html>`
}

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SERVCE_ROLE!
  )
}

async function getNominatorEmails(adminSupabase: ReturnType<typeof getAdminSupabase>): Promise<Set<string>> {
  const { data } = await adminSupabase.from('settings').select('value').eq('key', 'nominator_emails').single()
  if (!data?.value) return new Set()
  try { return new Set(JSON.parse(data.value) as string[]) } catch { return new Set() }
}

// GET — return subscriber counts per group + already-sent info for current issue
export async function GET(req: NextRequest) {
  const adminSupabase = getAdminSupabase()
  const issueNumber = req.nextUrl.searchParams.get('issue') || ''

  const [subsResult, nominatorEmails] = await Promise.all([
    adminSupabase.from('newsletter_subscribers').select('email'),
    getNominatorEmails(adminSupabase),
  ])

  const allEmails = (subsResult.data || []).map((s: { email: string }) => s.email)

  const counts = {
    total: allEmails.length,
    nominators: allEmails.filter(e => nominatorEmails.has(e)).length,
    subscribers: allEmails.filter(e => !nominatorEmails.has(e)).length,
  }

  // Check which emails already received this issue
  let alreadySent: string[] = []
  if (issueNumber) {
    const key = `newsletter_sent_${issueNumber.replace(/\s+/g, '_').toLowerCase()}`
    const { data: sentRow } = await adminSupabase.from('settings').select('value').eq('key', key).single()
    if (sentRow?.value) { try { alreadySent = JSON.parse(sentRow.value) } catch {} }
  }

  return NextResponse.json({ counts, alreadySent: alreadySent.length })
}

// POST — send newsletter to selected groups
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const group: string = body.group || 'all'

  const adminSupabase = getAdminSupabase()

  const [subsResult, nominatorEmails] = await Promise.all([
    adminSupabase.from('newsletter_subscribers').select('email'),
    getNominatorEmails(adminSupabase),
  ])

  const allEmails = (subsResult.data || []).map((s: { email: string }) => s.email)

  let filtered = allEmails
  if (group === 'nominators') filtered = allEmails.filter(e => nominatorEmails.has(e))
  if (group === 'subscribers') filtered = allEmails.filter(e => !nominatorEmails.has(e))

  const [tplRow, logoRow] = await Promise.all([
    adminSupabase.from('settings').select('value').eq('key', 'email_newsletter_template').single(),
    adminSupabase.from('settings').select('value').eq('key', 'site_logo').single(),
  ])

  const tpl: Tpl = tplRow.data?.value
    ? { ...DEFAULTS, ...JSON.parse(tplRow.data.value) }
    : DEFAULTS
  const logoUrl = logoRow.data?.value || ''

  // Load already-sent list for this issue to avoid duplicates
  const issueKey = `newsletter_sent_${tpl.issueNumber.replace(/\s+/g, '_').toLowerCase()}`
  let alreadySent: string[] = []
  const { data: sentRow } = await adminSupabase
    .from('settings').select('value').eq('key', issueKey).single()
  if (sentRow?.value) {
    try { alreadySent = JSON.parse(sentRow.value) } catch {}
  }

  const alreadySentSet = new Set(alreadySent)
  const toSend = filtered.filter(e => e && !alreadySentSet.has(e))
  const uniqueToSend = Array.from(new Set(toSend))

  if (uniqueToSend.length === 0) {
    return NextResponse.json({ sent: 0, skipped: alreadySent.length, message: 'All selected subscribers already received this issue.' })
  }

  const html = buildHtml(tpl, logoUrl)
  let sent = 0
  const newlySent: string[] = []
  const BATCH = 50

  for (let i = 0; i < uniqueToSend.length; i += BATCH) {
    const batch = uniqueToSend.slice(i, i + BATCH).map(to => ({
      from: FROM,
      to,
      subject: tpl.subject,
      html,
    }))
    try {
      await resend.batch.send(batch)
      sent += batch.length
      newlySent.push(...uniqueToSend.slice(i, i + BATCH))
    } catch (e) {
      console.error(`Newsletter batch error (batch ${Math.floor(i / BATCH) + 1}):`, e)
    }
  }

  // Record who received this issue (merge with existing)
  const updatedSent = Array.from(new Set([...alreadySent, ...newlySent]))
  await adminSupabase.from('settings').upsert({
    key: issueKey,
    value: JSON.stringify(updatedSent),
  })

  return NextResponse.json({
    sent,
    skipped: alreadySentSet.size,
    total: uniqueToSend.length + alreadySentSet.size,
  })
}
