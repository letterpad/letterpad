import { NextRequest, NextResponse } from 'next/server';
import { isInMaintenanceModeEnabled } from 'ui/server';

import { getAuthCookieName } from '../lib/utils/authCookie';
import { getSessionUrl } from '../lib/utils/url';
export const config = { matcher: '/((?!static|.*\\..*|_next).*)' };

export async function middleware(request: NextRequest) {
  try {
    const isInMaintenanceMode = await isInMaintenanceModeEnabled();
    if (isInMaintenanceMode) {
      request.nextUrl.pathname = `/maintenance`;
      return NextResponse.rewrite(request.nextUrl);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  const requestHeaders = new Headers(request.headers);
  const requestUrl = new URL(request.url);
  const isSubdomainWww = requestUrl.host.split('.')[0];
  const hasWwwPrefix = isSubdomainWww === 'www';
  const isLogin = requestUrl.pathname === '/api/identity/login';
  const isLogout = requestUrl.pathname === '/api/identity/logout';
  const isSession = requestUrl.pathname === '/api/client/session';
  const url = request.nextUrl;
  const tokenReceived = url.searchParams.get('token');

  if (hasWwwPrefix) {
    requestUrl.host = requestUrl.host.replace('www.', '');
    return NextResponse.redirect(requestUrl.toString());
  }

  if (tokenReceived && isLogin) {
    return setSessionCookieAndRedirect(request);
  }
  if (isLogout) {
    return clearCookieAndRedirect(request);
  }

  if (isSession) {
    return handleSessionResponse(request);
  }
  return NextResponse.rewrite(url, { headers: requestHeaders });
}

// Helpers
function setSessionCookieAndRedirect(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const sourceUrl = new URL(request.nextUrl.searchParams.get('source')!);
  const token = request.nextUrl.searchParams.get('token');
  request.nextUrl.searchParams.delete('token');
  const days30 = 30 * 60 * 60 * 24 * 1000;
  requestHeaders.set(
    'set-cookie',
    `${getAuthCookieName()}=${token}; SameSite=True; Secure; Max-Age=${days30}; path=/;`
  );
  return NextResponse.redirect(sourceUrl, { headers: requestHeaders });
}

function clearCookieAndRedirect(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const sourceUrl = new URL(request.nextUrl.searchParams.get('source')!);
  requestHeaders.set(
    'set-cookie',
    `${getAuthCookieName()}=; Max-Age=-1; path=/; secure;`
  );
  return NextResponse.redirect(sourceUrl, { headers: requestHeaders });
}

async function handleSessionResponse(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const sessionCookie = request.cookies.get(getAuthCookieName())?.value;
  const header = request.headers;
  const siteUrl = `${header.get('x-forwarded-proto')}://${header.get('host')}`;

  if (sessionCookie) {
    const req = await fetch(getSessionUrl(), {
      headers: {
        cookie: `${getAuthCookieName()}=${sessionCookie}`,
        siteurl: siteUrl,
      },
    });
    const session = await req.json();
    if (!session) {
      request.nextUrl.searchParams.set('source', requestUrl.origin);
      return clearCookieAndRedirect(request);
    }
    return NextResponse.json(session);
  }
  return NextResponse.json(null);
}
