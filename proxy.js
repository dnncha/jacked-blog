import { NextResponse } from 'next/server'

const CANONICAL_HOST = 'jacked.coach'
const LEGACY_HOSTS = new Set(['jacked-blog.vercel.app'])

export function proxy(request) {
  const host = request.headers.get('host') || ''

  if (!LEGACY_HOSTS.has(host)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.protocol = 'https'
  url.hostname = CANONICAL_HOST
  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon-96x96.png|apple-touch-icon.png|og-image.png|manifest.json).*)',
  ],
}
