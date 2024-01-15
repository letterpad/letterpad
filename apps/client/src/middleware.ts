import { NextResponse } from 'next/server';
import { getAuthCookieName } from '../lib/utils/authCookie';

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
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // if (u.pathname === '/api/identity/login') {
  console.log('Entered login');
  const token = u.searchParams.get('token');
  if (token) {
    console.log('found token');
    response.headers.set(
      'set-cookie',
      `${getAuthCookieName()}=${token}; SameSite=True; Secure; HttpOnly; Max-Age=60*60*24`
    );
  }
  // }

  if (u.pathname === '/logout') {
    console.log('found logout');
    response.headers.set('set-cookie', `${getAuthCookieName()}=; Max-Age=-1`);
  }

  return response;
}

export const config = { matcher: '/((?!.*\\.).*)' };
