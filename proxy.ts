import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request }) 
  const { pathname } = request.nextUrl

  // 1. Define your public authentication routes
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')

  // 2. CASE: User IS logged in (has a token)
  if (token) {
    // If they try to go to log in again, send them to the dashboard instead
    if (isAuthPage || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 3. CASE: User IS NOT logged in (no token)
  if (!token) {
    // ONLY redirect them if they are trying to access protected dashboards/admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  // Allow the request to pass through by default
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/admin/:path*',
    '/dashboard/:path*',
  ],
}