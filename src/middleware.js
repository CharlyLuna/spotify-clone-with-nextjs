import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export const middleware = async (req) => {
  // Token will exist if the user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const { pathname } = req.nextUrl
  // Allow the requests if the following is true
  // If the token exists
  // If its a request for nextauth session & provider fetching
  if (pathname?.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Redirect them to log in page if they dont fullfill any of the above
  if (pathname !== '/login' && !token) {
    return NextResponse.rewrite(new URL('/login', req.url))
  }
}

export { default } from 'next-auth/middleware'

export const config = { matcher: ['/'] }
