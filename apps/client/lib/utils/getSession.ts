import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export async function getSession(header: ReadonlyHeaders) {
  try {
    const proto = header.get('x-forwarded-proto');
    const host = header.get('host');
    const siteUrl = `${proto}://${host}`;

    const response = await fetch(`${siteUrl}/api/client/session`, {
      headers: {
        cookie: header.get('cookie')?.toString()!,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return null;
  }
}
