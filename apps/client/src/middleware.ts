import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookieName } from '../lib/utils/authCookie';
import { getApiRootUrl } from '../lib/utils/url';
import { getSession } from '../lib/utils/session';

export async function middleware(request: NextRequest) {
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
  const url = request.nextUrl;

  const token = url.searchParams.get('token');
  if (token && u.pathname === '/api/identity/login') {
    url.searchParams.delete('token');
    requestHeaders.set(
      'set-cookie',
      `${getAuthCookieName()}=${token}; SameSite=True; Secure; Max-Age=60*60*24; path=/;`
    );
    const sourceUrl = new URL(url.searchParams.get('source')!);
    sourceUrl.searchParams.delete('token');
    return NextResponse.redirect(sourceUrl, { headers: requestHeaders });
  }
  if (u.pathname === '/api/identity/logout') {
    requestHeaders.set(
      'set-cookie',
      `${getAuthCookieName()}=; Max-Age=-1; path=/; secure;`
    );
    const sourceUrl = new URL(url.searchParams.get('source')!);
    return NextResponse.redirect(sourceUrl, { headers: requestHeaders });
  }

  if (u.pathname === '/api/client/session') {
    const a = await getSession(
      request.headers.get('siteurl')!,
      `${getAuthCookieName()}=${request.cookies.get(getAuthCookieName())
        ?.value}`
    );

    if (!a || Object.keys(a).length === 0) {
      requestHeaders.set(
        'set-cookie',
        `${getAuthCookieName()}=; Max-Age=-1; path=/; secure;`
      );
      return NextResponse.redirect(u.origin, { headers: requestHeaders });
    }
    return NextResponse.json(a);
  }
  return NextResponse.rewrite(url, { headers: requestHeaders });
}

export const config = { matcher: '/((?!.*\\.).*)' };
