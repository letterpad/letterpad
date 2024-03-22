import { basePath } from "../constants";

export const getRootUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    const protocol = "https://";
    return new URL(protocol + process.env.VERCEL_BRANCH_URL + basePath).toString();
  }
  return new URL(process.env.NEXT_PUBLIC_ROOT_URL + basePath);
};

export const getApiUrl = () => {
  return new URL('/api/graphql', getRootUrl()).toString()
}

export const getNextAuthUrl = () => {
  return new URL('/api/auth', getRootUrl()).toString()
};

export const getSessionUrl = () => {
  return new URL('/api/auth/session', getRootUrl()).toString()
};

export const getLoginUrl = () => {
  return new URL('/login', getRootUrl()).toString()
}
