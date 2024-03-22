export const getApiRootUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    const protocol = 'https://';
    return new URL(protocol + process.env.VERCEL_BRANCH_URL)
      .toString()
      .replace('client', 'admin');
  }
  return new URL(process.env.NEXT_PUBLIC_API_URL!).toString();
};

export const getProfileUrl = (username: string) => {
  return new URL(`@${username}`, getApiRootUrl()).toString();
};

export const getApiUrl = () => {
  return new URL('/api/graphql', getApiRootUrl()).toString();
};

export const getSessionUrl = () => {
  return new URL('/api/client/session', getApiRootUrl()).toString();
};
