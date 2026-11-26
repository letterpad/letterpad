import { createHash, createHmac, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getApiRootUrl } from '@/lib/utils/url';

export const dynamic = 'force-dynamic';
const SESSION = '__Host-letterpad-client-session';
const PENDING = '__Host-letterpad-sso-pending';
const SIGNED_OUT = '__Host-letterpad-sso-signed-out';
const headers = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
};
const cookie = {
  secure: true,
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};
const pendingAge = 15 * 60;
const challenge = (verifier: string) =>
  createHash('sha256').update(verifier).digest('base64url');

function requestOrigin(req: NextRequest) {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  if (!host || !/^[a-zA-Z0-9.-]+(?::[0-9]+)?$/.test(host)) return null;
  try {
    return new URL(`https://${host}`).origin;
  } catch {
    return null;
  }
}

function localReturn(path: unknown, origin: string) {
  if (typeof path !== 'string' || !path.startsWith('/'))
    return new URL('/', origin);
  const target = new URL(path, origin);
  return target.origin === origin && !target.pathname.startsWith('/api/')
    ? target
    : new URL('/', origin);
}

async function admin(action: string, data: object) {
  const secret = process.env.LETTERPAD_SSO_SECRET;
  if (!secret) return null;
  try {
    const response = await fetch(
      new URL(`/api/sso/${action}`, getApiRootUrl()),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify(data),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(5000),
      }
    );
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  const origin = requestOrigin(req);
  if (!origin) return new Response(null, { status: 400, headers });
  const query = req.nextUrl.searchParams;
  const session = req.cookies.get(SESSION)?.value;

  switch (params.action) {
    case 'session': {
      const signedOut = req.cookies.has(SIGNED_OUT);
      const data = session
        ? await admin('session', { origin, token: session })
        : null;
      return NextResponse.json(
        { ...data, canCheck: !!process.env.LETTERPAD_SSO_SECRET && !signedOut },
        { headers }
      );
    }
    case 'start': {
      const target = localReturn(query.get('return'), origin);
      const interactive = query.get('interactive') === '1';
      const secret = process.env.LETTERPAD_SSO_SECRET;
      if (!secret) {
        return NextResponse.redirect(
          interactive ? new URL('/login', getApiRootUrl()) : target,
          { headers }
        );
      }
      if (req.cookies.has(SIGNED_OUT) && !interactive)
        return NextResponse.redirect(target, { headers });
      const verifier = randomBytes(32).toString('base64url');
      const proofChallenge = challenge(verifier);
      const expires = Math.floor(Date.now() / 1000) + pendingAge;
      const proof = createHmac('sha256', secret)
        .update(JSON.stringify([origin, proofChallenge, expires]))
        .digest('base64url');
      const authorize = new URL('/api/sso/authorize', getApiRootUrl());
      authorize.search = new URLSearchParams({
        origin,
        challenge: proofChallenge,
        expires: String(expires),
        proof,
        interactive: interactive ? '1' : '0',
      }).toString();
      const response = NextResponse.redirect(authorize, { headers });
      response.cookies.set(
        `${PENDING}-${proofChallenge}`,
        JSON.stringify({
          verifier,
          returnTo: target.pathname + target.search + target.hash,
        }),
        { ...cookie, maxAge: pendingAge }
      );
      if (interactive)
        response.cookies.set(SIGNED_OUT, '', { ...cookie, maxAge: 0 });
      return response;
    }
    case 'callback': {
      const proofChallenge = query.get('challenge') ?? '';
      if (!/^[\w-]{43}$/.test(proofChallenge))
        return new Response(null, { status: 400, headers });
      const pendingCookie = `${PENDING}-${proofChallenge}`;
      let pending;
      try {
        pending = JSON.parse(req.cookies.get(pendingCookie)?.value ?? 'null');
      } catch {
        pending = null;
      }
      if (
        typeof pending?.verifier !== 'string' ||
        challenge(pending.verifier) !== proofChallenge
      ) {
        return new Response(null, { status: 400, headers });
      }
      const code = query.get('code');
      const result = code
        ? await admin('exchange', {
            origin,
            token: code,
            verifier: pending.verifier,
          })
        : null;
      const response = NextResponse.redirect(
        localReturn(pending.returnTo, origin),
        { headers }
      );
      response.cookies.set(pendingCookie, '', { ...cookie, maxAge: 0 });
      if (result?.session)
        response.cookies.set(SESSION, result.session, {
          ...cookie,
          maxAge: result.maxAge,
        });
      return response;
    }
    default:
      return new Response(null, { status: 404, headers });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  const origin = requestOrigin(req);
  if (
    params.action !== 'logout' ||
    !origin ||
    req.headers.get('origin') !== origin
  ) {
    return new Response(null, { status: 403, headers });
  }
  const session = req.cookies.get(SESSION)?.value;
  if (session) await admin('logout', { origin, token: session });
  const response = NextResponse.json({}, { headers });
  response.cookies.set(SESSION, '', { ...cookie, maxAge: 0 });
  response.cookies.set(SIGNED_OUT, '1', {
    ...cookie,
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
