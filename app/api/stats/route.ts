import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SERVCE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 60 // cache 1 minute

function countUnique(rows: { session_id: string | null }[] | null): number {
  if (!rows || rows.length === 0) return 0
  const ids = new Set<string>()
  let nullCount = 0
  for (const r of rows) {
    if (r.session_id) ids.add(r.session_id)
    else nullCount++
  }
  // Each null session_id = 1 anonymous visitor (no sessionStorage, e.g. privacy mode)
  return ids.size + nullCount
}

export async function GET() {
  try {
    // Total unique visitors all time
    const { data: allRows } = await supabase
      .from('page_views')
      .select('session_id')

    const total = countUnique(allRows ?? [])

    // Unique visitors this month
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const { data: monthRows } = await supabase
      .from('page_views')
      .select('session_id')
      .gte('created_at', monthStart.toISOString())

    const month = countUnique(monthRows ?? [])

    // Unique visitors today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const { data: todayRows } = await supabase
      .from('page_views')
      .select('session_id')
      .gte('created_at', todayStart.toISOString())

    const today = countUnique(todayRows ?? [])

    return NextResponse.json(
      { total, month, today },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    )
  } catch {
    return NextResponse.json({ total: 0, month: 0, today: 0 })
  }
}
