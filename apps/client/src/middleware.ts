import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  const u = new URL(request.url);
  const isSubdomainWww = u.host.split('.')[0];
  if (isSubdomainWww === 'www') {
    u.host = u.host.replace('www.', '');
    return NextResponse.redirect(u.toString());
  }
  requestHeaders.set('x-url', u.pathname);
  requestHeaders.set('Cache-Control', 'public, s-maxage=1');
  requestHeaders.set('CDN-Cache-Control', 'public, s-maxage=60');
  requestHeaders.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600');
  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}
