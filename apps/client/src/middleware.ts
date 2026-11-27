import { NextRequest, NextResponse } from 'next/server';
import { isInMaintenanceModeEnabled } from 'ui/dist/server.mjs';

// export const config = { matcher: '/((?!static|.*\\..*|_next).*)' };

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'next-action' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

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
  if (hasWwwPrefix) {
    requestUrl.host = requestUrl.host.replace('www.', '');
    return NextResponse.redirect(requestUrl.toString());
  }

  return NextResponse.rewrite(request.nextUrl, { headers: requestHeaders });
}
