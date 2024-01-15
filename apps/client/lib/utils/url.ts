export const getApiRootUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL?.replace('/api/graphql', '');
};
