import { cookies } from 'next/headers';
import { getApiRootUrl } from './url';

export const getSession = async (siteUrl?: string) => {
  if (!siteUrl) return null;
  const cStore = cookies();
  try {
    const req = await fetch(`${getApiRootUrl()}/api/auth/session`, {
      headers: {
        cookie: cStore.toString(),
      },
    });
    const session = await req.json();
    return Object.keys(session).length ? session : null;
  } catch (e) {
    // console.log(e);
  }
};
