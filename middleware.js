import { NextResponse } from 'next/server'

export async function middleware(req) {
  const token = req.cookies.get('sb-access-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login.html', req.url))
  }

  const res = await fetch(
    `${process.env.SUPABASE_URL}/auth/v1/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.SUPABASE_ANON_KEY
      }
    }
  )

  if (!res.ok) {
    return NextResponse.redirect(new URL('/login.html', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
