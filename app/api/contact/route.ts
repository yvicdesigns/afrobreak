import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SERVCE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ContactTpl {
  primaryColor: string
  bgColor: string
  footerText: string
}

const defaults: ContactTpl = {
  primaryColor: '#FDCA00',
  bgColor: '#0D0A1A',
  footerText: 'Reply directly to this email to respond to the sender.',
}

async function getTemplate(): Promise<ContactTpl> {
  const { data } = await supabase.from('settings').select('value').eq('key', 'email_contact_template').single()
  if (data?.value) try { return { ...defaults, ...JSON.parse(data.value) } } catch {}
  return defaults
}

async function getLogoUrl(): Promise<string> {
  const { data } = await supabase.from('settings').select('value').eq('key', 'site_logo').single()
  return data?.value || ''
}

function buildHtml(tpl: ContactTpl, logoUrl: string, name: string, email: string, subject: string | null, message: string): string {
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
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;width:80px;border-bottom:1px solid #1f1c38;vertical-align:top;">From</td>
          <td style="padding:10px 0;color:#fff;font-size:14px;font-weight:600;border-bottom:1px solid #1f1c38;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;border-bottom:1px solid #1f1c38;vertical-align:top;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #1f1c38;">
            <a href="mailto:${email}" style="color:${tpl.primaryColor};font-size:14px;text-decoration:none;">${email}</a>
          </td>
        </tr>
        ${subject ? `
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;border-bottom:1px solid #1f1c38;vertical-align:top;">Subject</td>
          <td style="padding:10px 0;color:#fff;font-size:14px;border-bottom:1px solid #1f1c38;">${subject}</td>
        </tr>` : ''}
      </table>

      <div style="background:#0d0a1a;border-radius:10px;padding:24px;border-left:4px solid ${tpl.primaryColor};">
        <p style="margin:0;color:#ccc;font-size:14px;line-height:1.8;white-space:pre-wrap;">${message}</p>
      </div>
    </div>

    <div style="background:#0d0a1a;padding:20px 36px;border-top:1px solid #1f1c38;text-align:center;">
      <p style="margin:0;color:#555;font-size:12px;line-height:1.6;">${tpl.footerText}</p>
    </div>
  </div>
</div>
</body></html>`
}

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await supabase.from('contact_messages').insert({ name, email, subject: subject || null, message })

  const [tpl, logoUrl] = await Promise.all([getTemplate(), getLogoUrl()])

  const { error } = await resend.emails.send({
    from: 'AfroBreak <onboarding@resend.dev>',
    to: 'contact@afrobreak.com',
    replyTo: email,
    subject: subject ? `[Contact] ${subject}` : `[Contact] Message from ${name}`,
    html: buildHtml(tpl, logoUrl, name, email, subject, message),
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
