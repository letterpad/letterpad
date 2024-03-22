import { getRootUrl } from "@/shared/getRootUrl";

export const getAuthCookieName = () => {
  const rootUrl = getRootUrl();
  if (rootUrl && new URL(rootUrl).protocol === "https:"
  ) {
    return "__Secure-next-auth.session-token";
  }
  return "next-auth.session-token";
};
