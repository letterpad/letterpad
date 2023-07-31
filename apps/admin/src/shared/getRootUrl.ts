import { basePath } from "../constants";

export const getRootUrl = (baseUrl?: string) => {
  if (!process.env.VERCEL) {
    return process.env.ROOT_URL + basePath;
  }
  const protocol = "https://";

  if (process.env.VERCEL_ENV === "preview" && !baseUrl?.includes("-git-")) {
    return protocol + process.env.VERCEL_BRANCH_URL + basePath;
  }
  return process.env.ROOT_URL + basePath;
};
