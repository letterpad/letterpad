import { getApiRootUrl } from './url';

export const getAuthCookieName = () => {
  const apiUrl = getApiRootUrl();
  if (apiUrl && new URL(apiUrl).protocol === 'https:') {
    return '__Secure-next-auth.session-token';
  }
  return 'next-auth.session-token';
};
