import jwt from 'jsonwebtoken'

export function middleware(req) {
  const token = req.cookies.get('auth_token')?.value

  if (!token) {
    return Response.redirect(new URL('/login.html', req.url))
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    return
  } catch {
    return Response.redirect(new URL('/login.html', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
}