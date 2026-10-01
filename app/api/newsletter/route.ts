import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SERVCE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface NewsletterTpl {
  subject: string
  issueLabel: string
  issueNumber: string
  featuredImageUrl: string
  featuredTitle: string
  featuredAuthor: string
  featuredText: string
  event1Date: string; event1Title: string; event1Desc: string
  event2Date: string; event2Title: string; event2Desc: string
  event3Date: string; event3Title: string; event3Desc: string
  insideTitle: string
  bulletPoints: string
  recapTitle: string
  recapAuthor: string
  recapText: string
  bottomImageUrl: string
  bottomText: string
  buttonText: string
  buttonUrl: string
  primaryColor: string
  accentColor: string
  bgColor: string
  footerText: string
  showLogo: boolean
}

const defaults: NewsletterTpl = {
  subject: '🎶 AfroBreak Newsletter — Stay in the loop!',
  issueLabel: 'WEEKLY NEWSLETTER',
  issueNumber: 'Issue 01',
  featuredImageUrl: '',
  featuredTitle: 'A MESSAGE FROM OUR FOUNDER',
  featuredAuthor: 'AfroBreak Team',
  featuredText: 'We are thrilled to have you as part of our growing community. AfroBreak is more than a platform — it is a movement that celebrates African dance culture across the globe.',
  event1Date: 'MONDAY, 14 JULY', event1Title: 'Open Cypher Night', event1Desc: 'Join us for an open session of freestyle battles and community vibes.',
  event2Date: 'THURSDAY, 17 JULY', event2Title: 'Afrobeats Workshop', event2Desc: 'Learn the fundamentals of Afrobeats with our top ambassador instructors.',
  event3Date: 'FRIDAY, 18 JULY', event3Title: 'AfroBreak Live', event3Desc: 'Live performances, demos, and the best of the AfroBreak community.',
  insideTitle: 'INSIDE THIS ISSUE',
  bulletPoints: "Community Spotlight\nUpcoming Events\nNew Tutorials\nArtist Feature\nShop New Drops",
  recapTitle: 'WEEKLY RECAP',
  recapAuthor: 'AfroBreak Editorial',
  recapText: 'This week we saw incredible energy from our community. From viral videos to packed workshops, the culture is alive and growing stronger every day.',
  bottomImageUrl: '',
  bottomText: "The AfroBreak community is global. Whether you're in Accra, London, Paris, or New York — we are one family united by dance.",
  buttonText: 'Visit AfroBreak',
  buttonUrl: 'https://afrobreak.com',
  primaryColor: '#FDCA00',
  accentColor: '#0D3DC8',
  bgColor: '#f5f5f5',
  footerText: "You're receiving this because you subscribed at afrobreak.com.",
  showLogo: true,
}

async function getTemplate(): Promise<NewsletterTpl> {
  const { data } = await supabase.from('settings').select('value').eq('key', 'email_newsletter_template').single()
  if (data?.value) try { return { ...defaults, ...JSON.parse(data.value) } } catch {}
  return defaults
}

async function getLogoUrl(): Promise<string> {
  const { data } = await supabase.from('settings').select('value').eq('key', 'site_logo').single()
  return data?.value || ''
}

function buildHtml(tpl: NewsletterTpl, logoUrl: string): string {
  const logoBlock = tpl.showLogo && logoUrl
    ? `<img src="${logoUrl}" alt="AfroBreak" style="height:44px;width:auto;object-fit:contain;" />`
    : `<span style="font-size:24px;font-weight:900;letter-spacing:-1px;color:${tpl.accentColor};">AFRO<span style="color:${tpl.primaryColor};">BREAK</span></span>`

  const bullets = tpl.bulletPoints.split('\n').filter(Boolean)
    .map(b => `<li style="margin-bottom:8px;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.3px;">${b.toUpperCase()}</li>`)
    .join('')

  const featuredImg = tpl.featuredImageUrl
    ? `<img src="${tpl.featuredImageUrl}" alt="Featured" style="width:100%;height:180px;object-fit:cover;object-position:center top;display:block;border-radius:6px;" />`
    : `<div style="width:100%;height:180px;background:${tpl.accentColor};border-radius:6px;display:flex;align-items:center;justify-content:center;"><span style="color:${tpl.primaryColor};font-size:48px;">🎶</span></div>`

  const bottomImg = tpl.bottomImageUrl
    ? `<img src="${tpl.bottomImageUrl}" alt="Community" style="width:100%;height:160px;object-fit:cover;border-radius:8px;display:block;margin-bottom:16px;" />`
    : ''

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
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

  <!-- FEATURED -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;">
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
  </table>

  <!-- EVENTS -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${tpl.accentColor};margin-top:2px;">
    <tr><td style="padding:16px 28px 8px;">
      <div style="font-size:13px;font-weight:900;color:${tpl.primaryColor};letter-spacing:1px;text-transform:uppercase;">📅 UPCOMING EVENTS &nbsp;›››</div>
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
  </table>

  <!-- INSIDE + RECAP -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;">
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
  </table>

  <!-- BOTTOM -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin-top:2px;border-radius:0 0 0 0;">
    <tr><td style="padding:24px 28px;">
      ${bottomImg}
      <div style="font-size:13px;color:#555;line-height:1.8;font-style:italic;margin-bottom:20px;">"${tpl.bottomText}"</div>
      ${tpl.buttonText ? `<a href="${tpl.buttonUrl}" style="display:inline-block;background:${tpl.accentColor};color:#fff;font-weight:900;font-size:13px;padding:12px 28px;border-radius:8px;text-decoration:none;">${tpl.buttonText}</a>` : ''}
    </td></tr>
  </table>

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

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { error: dbError } = await supabase.from('newsletter_subscribers').insert({ email })
  if (dbError && !dbError.message.includes('duplicate')) {
    return NextResponse.json({ error: 'Could not save subscriber' }, { status: 500 })
  }

  const [tpl, logoUrl] = await Promise.all([getTemplate(), getLogoUrl()])

  await resend.emails.send({
    from: 'AfroBreak <onboarding@resend.dev>',
    to: email,
    subject: tpl.subject,
    html: buildHtml(tpl, logoUrl),
  })

  return NextResponse.json({ success: true })
}
