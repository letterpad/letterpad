import { cookies } from 'next/headers';
import { getApiRootUrl } from './url';

export const getSession = async (siteUrl: string, cookie?: string) => {
  if (!siteUrl) return null;
  const cStore = cookies();
  try {
    const req = await fetch(`${getApiRootUrl()}/api/client/session`, {
      headers: {
        cookie: cookie ?? cStore.toString(),
        siteurl: siteUrl,
        origin: getApiRootUrl()!,
      },
    });
    const session = await req.json();
    return Object.keys(session).length ? session : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
