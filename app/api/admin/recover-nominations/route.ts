import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface ResendEmail {
  id: string
  to: string[]
  subject: string
  created_at: string
  html?: string
  reply_to?: string[]
}

function parseNomination(email: ResendEmail, html: string) {
  const subjectMatch = email.subject.match(/\[Nomination\] #(\d+) (.+?) — (.+)/)
  if (!subjectMatch) return null

  const categoryNum = subjectMatch[1]
  const categoryName = subjectMatch[2].trim()
  const nomineeName = subjectMatch[3].trim()

  // Extract section from the category block in HTML
  const sectionMatch = html.match(/color:#FDCA00[^>]*>#\d+[^<]*<\/div>\s*<div[^>]*color:#888[^>]*>([^<]{1,120})<\/div>/)
  const section = sectionMatch ? sectionMatch[1].trim() : ''

  // Split HTML on "Submitted By" to separate nominee vs nominator rows
  const splitIdx = html.indexOf('Submitted By')
  const nomineeHtml = splitIdx > 0 ? html.slice(0, splitIdx) : html
  const submitterHtml = splitIdx > 0 ? html.slice(splitIdx) : ''

  function extractRows(src: string): Record<string, string> {
    const rows: Record<string, string> = {}
    const re = /<td[^>]*color:#888[^>]*>([^<]{1,60})<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/g
    let m
    while ((m = re.exec(src)) !== null) {
      const label = m[1].trim()
      const raw = m[2]
      const mailto = raw.match(/href="mailto:([^"]+)"/)
      rows[label] = mailto ? mailto[1] : raw.replace(/<[^>]+>/g, '').trim()
    }
    return rows
  }

  const nr = extractRows(nomineeHtml)
  const sr = extractRows(submitterHtml)

  const id = `nom_${new Date(email.created_at).getTime()}`

  return {
    id,
    status: 'pending',
    created_at: email.created_at,
    category_num: categoryNum,
    category: categoryName,
    section,
    nominee_name: nomineeName,
    nominee_stage_name: nr['Stage Name'] || '',
    nominee_country: nr['Country'] || '',
    nominee_city: nr['City'] || '',
    nominator_name: sr['Name'] || '',
    nominator_email: sr['Email'] || (email.reply_to?.[0] ?? ''),
    nominator_phone: sr['Phone'] || '',
    nominator_country: sr['Country'] || '',
    _recovered: true,
  }
}

export async function POST() {
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SERVCE_ROLE!
  )

  // Requires a full-access Resend key (not a send-only key)
  const RESEND_KEY = process.env.RESEND_FULL_KEY || process.env.RESEND_API_KEY
  if (!RESEND_KEY) {
    return NextResponse.json({ error: 'No Resend API key configured' }, { status: 500 })
  }

  // Collect all sent emails from Resend (paginate)
  const allEmails: ResendEmail[] = []
  let offset = 0
  while (true) {
    const res = await fetch(`https://api.resend.com/emails?limit=100&offset=${offset}`, {
      headers: { Authorization: `Bearer ${RESEND_KEY}` },
    })
    if (!res.ok) {
      return NextResponse.json({ error: `Resend API error: ${res.status} ${await res.text()}` }, { status: 500 })
    }
    const json = await res.json()
    const batch: ResendEmail[] = json.data || []
    allEmails.push(...batch)
    if (batch.length < 100) break
    offset += 100
  }

  // Keep only admin nomination emails
  const nominationEmails = allEmails.filter(e =>
    e.subject?.includes('[Nomination]') &&
    (e.to ?? []).some(t => t.includes('afrobreakconcepts'))
  )

  const results: { id: string; nominee: string; status: 'saved' | 'skipped' | 'error'; msg?: string }[] = []

  for (const email of nominationEmails) {
    // Fetch full HTML body
    const fullRes = await fetch(`https://api.resend.com/emails/${email.id}`, {
      headers: { Authorization: `Bearer ${RESEND_KEY}` },
    })
    const full: ResendEmail = await fullRes.json()
    const html = full.html ?? ''

    const nomination = parseNomination(email, html)
    if (!nomination) {
      results.push({ id: email.id, nominee: email.subject, status: 'skipped', msg: 'parse failed' })
      continue
    }

    // Skip if already in DB
    const { data: existing } = await adminSupabase
      .from('settings')
      .select('key')
      .eq('key', nomination.id)
      .maybeSingle()

    if (existing) {
      results.push({ id: nomination.id, nominee: nomination.nominee_name, status: 'skipped', msg: 'already exists' })
      continue
    }

    const { error } = await adminSupabase
      .from('settings')
      .insert({ key: nomination.id, value: JSON.stringify(nomination) })

    results.push(error
      ? { id: nomination.id, nominee: nomination.nominee_name, status: 'error', msg: error.message }
      : { id: nomination.id, nominee: nomination.nominee_name, status: 'saved' }
    )
  }

  const saved = results.filter(r => r.status === 'saved').length
  return NextResponse.json({ total: nominationEmails.length, saved, results })
}
