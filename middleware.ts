import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// Supabase auth session cookie (set when any user is logged in)
const AUTH_COOKIE = `sb-${SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`

async function isMaintenanceOn(): Promise<boolean> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/settings?key=eq.maintenance_mode&select=value`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 30 }, // cache 30s to avoid hammering the DB on every request
      }
    )
    if (!res.ok) return false
    const data = await res.json()
    return data?.[0]?.value === 'true'
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow static assets, API routes, auth routes and the maintenance page itself
  if (
    pathname === '/maintenance' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/favicon') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp')
  ) {
    return NextResponse.next()
  }

  const maintenanceOn = await isMaintenanceOn()
  if (!maintenanceOn) return NextResponse.next()

  // If user has a Supabase session (logged in as admin or registered user), let them through
  const hasSession =
    request.cookies.get(AUTH_COOKIE)?.value ||
    request.cookies.get(`${AUTH_COOKIE}.0`)?.value // chunked cookie (Supabase SSR)

  if (hasSession) return NextResponse.next()

  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
