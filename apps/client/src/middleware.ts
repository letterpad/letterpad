import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookieName } from '../lib/utils/authCookie';
import { getApiRootUrl } from '../lib/utils/url';

export async function middleware(request: NextRequest) {
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
    return tokenReceivedResponse(request);
  }
  if (isLogout) {
    return clearCookieAndRedirect(request);
  }

  if (isSession) {
    return handleSessionResponse(request);
  }
  return NextResponse.rewrite(url, { headers: requestHeaders });
}

export const config = { matcher: '/((?!.*\\.).*)' };

// Helpers
function tokenReceivedResponse(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const sourceUrl = new URL(request.nextUrl.searchParams.get('source')!);
  const token = request.nextUrl.searchParams.get('token');
  request.nextUrl.searchParams.delete('token');
  requestHeaders.set(
    'set-cookie',
    `${getAuthCookieName()}=${token}; SameSite=True; Secure; Max-Age=60*60*24; path=/;`
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
  const sessionCookie = request.cookies.get(getAuthCookieName());
  const header = request.headers;
  const siteUrl = `${header.get('x-forwarded-proto')}://${header.get('host')}`;

  if (sessionCookie) {
    const req = await fetch(`${getApiRootUrl()}/api/client/session`, {
      headers: {
        cookie: request.cookies.toString(),
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
