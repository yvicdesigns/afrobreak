import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SERVCE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 3600 // cache 1h

export async function GET() {
  try {
    // Total unique visitors (all time)
    const { count: totalViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })

    // Unique visitors this month (by session_id)
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const { data: monthRows } = await supabase
      .from('page_views')
      .select('session_id')
      .gte('created_at', monthStart.toISOString())
      .not('session_id', 'is', null)

    const uniqueThisMonth = new Set(monthRows?.map(r => r.session_id) ?? []).size

    // Unique visitors today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { data: todayRows } = await supabase
      .from('page_views')
      .select('session_id')
      .gte('created_at', todayStart.toISOString())
      .not('session_id', 'is', null)

    const uniqueToday = new Set(todayRows?.map(r => r.session_id) ?? []).size

    return NextResponse.json(
      { total: totalViews ?? 0, month: uniqueThisMonth, today: uniqueToday },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    )
  } catch {
    return NextResponse.json({ total: 0, month: 0, today: 0 })
  }
}
