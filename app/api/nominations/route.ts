import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'afrobreakconcepts@gmail.com'
const FROM = process.env.EMAIL_FROM ? process.env.EMAIL_FROM.replace('AfroBreak <', 'AfroBreak Awards <') : 'AfroBreak Awards <onboarding@resend.dev>'

type NominationData = {
  nominatorName: string
  nominatorEmail: string
  nominatorPhone?: string
  nominatorCountry?: string
  categoryNum: string
  categoryName: string
  section: string
  nomineeName: string
  nomineeStage?: string
  nomineeCountry?: string
  nomineeCity?: string
}

function buildAdminHtml(data: NominationData) {
  const row = (label: string, value: string) => value ? `
    <tr>
      <td style="padding:10px 0;color:#888;font-size:13px;width:130px;border-bottom:1px solid #1f1c38;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;color:#fff;font-size:14px;border-bottom:1px solid #1f1c38;">${value}</td>
    </tr>` : ''

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0D0A1A;">
<div style="background:#0D0A1A;font-family:'Helvetica Neue',Arial,sans-serif;padding:32px 16px;">
  <div style="max-width:580px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">

    <div style="background:#FDCA00;padding:24px 32px;">
      <div style="color:#0D0A1A;font-size:20px;font-weight:900;">🏆 New Nomination Received</div>
      <div style="color:#0D0A1A;font-size:13px;opacity:0.7;margin-top:4px;">AfroBreak Culture Awards 2026</div>
    </div>

    <div style="background:#161230;padding:36px;">

      <div style="margin-bottom:28px;">
        <div style="color:#FDCA00;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">Award Category</div>
        <div style="background:#0d0a1a;border-radius:10px;padding:16px 20px;border-left:4px solid #FDCA00;">
          <div style="color:#FDCA00;font-size:13px;font-weight:700;">#${data.categoryNum} — ${data.categoryName}</div>
          <div style="color:#888;font-size:12px;margin-top:4px;">${data.section}</div>
        </div>
      </div>

      <div style="margin-bottom:28px;">
        <div style="color:#FDCA00;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">Nominee</div>
        <table style="width:100%;border-collapse:collapse;">
          ${row('Full Name', data.nomineeName)}
          ${row('Stage Name', data.nomineeStage || '')}
          ${row('Country', data.nomineeCountry || '')}
          ${row('City', data.nomineeCity || '')}
        </table>
      </div>

      <div style="margin-bottom:28px;">
        <div style="color:#FDCA00;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;">Submitted By</div>
        <table style="width:100%;border-collapse:collapse;">
          ${row('Name', data.nominatorName)}
          ${row('Email', `<a href="mailto:${data.nominatorEmail}" style="color:#FDCA00;text-decoration:none;">${data.nominatorEmail}</a>`)}
          ${row('Phone', data.nominatorPhone || '')}
          ${row('Country', data.nominatorCountry || '')}
        </table>
      </div>

      <a href="https://www.afrobreak.com/admin/nominations" style="display:inline-block;background:#FDCA00;color:#0D0A1A;font-weight:900;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        View in Admin →
      </a>
    </div>

    <div style="background:#0d0a1a;padding:20px 36px;border-top:1px solid #1f1c38;text-align:center;">
      <p style="margin:0;color:#555;font-size:12px;">AfroBreak Culture Festival · afrobreak.com</p>
    </div>
  </div>
</div>
</body></html>`
}

function buildConfirmationHtml(data: NominationData) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0D0A1A;">
<div style="background:#0D0A1A;font-family:'Helvetica Neue',Arial,sans-serif;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">

    <!-- Header -->
    <div style="background:#FDCA00;padding:28px 32px;">
      <div style="color:#0D0A1A;font-size:22px;font-weight:900;letter-spacing:-0.5px;">🏆 Nomination Received!</div>
      <div style="color:#0D0A1A;font-size:13px;opacity:0.7;margin-top:4px;">AfroBreak Culture Awards 2026</div>
    </div>

    <div style="background:#161230;padding:36px;">
      <p style="color:#fff;font-size:15px;font-weight:600;margin:0 0 8px;">Hi ${data.nominatorName},</p>
      <p style="color:#aaa;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Thank you for your nomination! We have successfully received your submission for the <strong style="color:#FDCA00;">AfroBreak Culture Awards 2026</strong>. Our team will review it carefully.
      </p>

      <!-- Category -->
      <div style="background:#0d0a1a;border-radius:10px;padding:16px 20px;border-left:4px solid #FDCA00;margin-bottom:24px;">
        <div style="color:#FDCA00;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Award Category</div>
        <div style="color:#FDCA00;font-size:14px;font-weight:700;">#${data.categoryNum} — ${data.categoryName}</div>
        <div style="color:#888;font-size:12px;margin-top:4px;">${data.section}</div>
      </div>

      <!-- Nominee -->
      <div style="background:#0d0a1a;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
        <div style="color:#FDCA00;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Nominated</div>
        <div style="color:#fff;font-size:15px;font-weight:700;">${data.nomineeName}${data.nomineeStage ? ` <span style="color:#888;font-size:13px;font-weight:400;">(${data.nomineeStage})</span>` : ''}</div>
        ${data.nomineeCountry ? `<div style="color:#888;font-size:13px;margin-top:4px;">📍 ${data.nomineeCountry}${data.nomineeCity ? `, ${data.nomineeCity}` : ''}</div>` : ''}
      </div>

      <p style="color:#aaa;font-size:13px;line-height:1.7;margin:0 0 24px;">
        You will be notified once the review process is complete. In the meantime, keep supporting the culture! 🕺
      </p>

      <a href="https://www.afrobreak.com/awards" style="display:inline-block;background:#FDCA00;color:#0D0A1A;font-weight:900;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
        View Awards Page →
      </a>
    </div>

    <div style="background:#0d0a1a;padding:20px 36px;border-top:1px solid #1f1c38;text-align:center;">
      <p style="margin:0;color:#555;font-size:12px;">AfroBreak Culture Festival · <a href="https://www.afrobreak.com" style="color:#555;">afrobreak.com</a></p>
    </div>
  </div>
</div>
</body></html>`
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  // Service role client created at request time (not module level) so build succeeds
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SERVCE_ROLE!
  )

  // Normalize to snake_case so the admin page can read the fields
  const id = `nom_${Date.now()}`
  const payload = {
    id,
    status: 'pending',
    created_at: new Date().toISOString(),
    nominator_name: data.nominatorName,
    nominator_email: data.nominatorEmail,
    nominator_phone: data.nominatorPhone,
    nominator_country: data.nominatorCountry,
    relationship_to_nominee: data.relationshipToNominee,
    category_num: data.categoryNum,
    category: data.categoryName,
    section: data.section,
    nominee_name: data.nomineeName,
    nominee_stage_name: data.nomineeStage,
    nominee_gender: data.nomineeGender,
    nominee_country: data.nomineeCountry,
    nominee_city: data.nomineeCity,
    nominee_region: data.nomineeRegion,
    nominee_email: data.nomineeEmail,
    nominee_phone: data.nomineePhone,
    nominee_social_links: data.nomineeSocial,
    support_links: data.supportLinks,
  }
  const { error: saveError } = await adminSupabase
    .from('settings')
    .upsert({ key: id, value: JSON.stringify(payload) })

  if (saveError) {
    console.error('Nomination save error:', saveError)
    return NextResponse.json({ error: 'Failed to save nomination' }, { status: 500 })
  }

  // Auto-subscribe nominator to newsletter
  if (data.nominatorEmail) {
    const email = data.nominatorEmail.toLowerCase().trim()
    // Add to subscribers table
    void adminSupabase.from('newsletter_subscribers').insert({ email })
    // Track as nominator in settings (for grouping — no source column needed)
    adminSupabase.from('settings').select('value').eq('key', 'nominator_emails').single()
      .then(({ data: row }) => {
        let list: string[] = []
        if (row?.value) { try { list = JSON.parse(row.value) } catch {} }
        if (!list.includes(email)) {
          list.push(email)
          void adminSupabase.from('settings').upsert({ key: 'nominator_emails', value: JSON.stringify(list) })
        }
      })
  }

  // Send emails non-blocking — don't fail the request if email fails
  // 1) Admin notification
  resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: data.nominatorEmail,
    subject: `[Nomination] #${data.categoryNum} ${data.categoryName} — ${data.nomineeName}`,
    html: buildAdminHtml(data),
  }).catch(e => console.error('Nomination admin email error:', e))

  // 2) Confirmation to nominator
  if (data.nominatorEmail) {
    resend.emails.send({
      from: FROM,
      to: data.nominatorEmail,
      subject: `✅ Nomination Received — #${data.categoryNum} ${data.categoryName}`,
      html: buildConfirmationHtml(data),
    }).catch(e => console.error('Nomination confirmation email error:', e))
  }

  return NextResponse.json({ success: true, id })
}
