import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SERVCE_ROLE!
  )

  // Fetch all nominations from settings
  const { data: rows } = await adminSupabase
    .from('settings')
    .select('key, value')
    .like('key', 'nom_%')

  if (!rows || rows.length === 0) {
    return NextResponse.json({ imported: 0, total: 0 })
  }

  // Extract emails from nominations
  const emails: string[] = []
  for (const row of rows) {
    try {
      const nom = JSON.parse(row.value)
      const email = nom.nominator_email || nom.nominatorEmail
      if (email && /\S+@\S+\.\S+/.test(email)) {
        emails.push(email.toLowerCase().trim())
      }
    } catch {}
  }

  if (emails.length === 0) {
    return NextResponse.json({ imported: 0, total: 0 })
  }

  const uniqueEmails = Array.from(new Set(emails))

  // 1) Add to newsletter_subscribers (best effort, ignore duplicates)
  for (const email of uniqueEmails) {
    await adminSupabase.from('newsletter_subscribers').insert({ email })
    // duplicate errors are silently ignored
  }

  // 2) Store nominator emails list in settings so grouping works without a source column
  const { data: existing } = await adminSupabase
    .from('settings').select('value').eq('key', 'nominator_emails').single()
  let current: string[] = []
  if (existing?.value) { try { current = JSON.parse(existing.value) } catch {} }
  const merged = Array.from(new Set([...current, ...uniqueEmails]))
  await adminSupabase.from('settings').upsert({ key: 'nominator_emails', value: JSON.stringify(merged) })

  return NextResponse.json({ imported: uniqueEmails.length, total: rows.length })
}
