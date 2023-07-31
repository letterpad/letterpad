import { basePath } from "../constants";

export const getRootUrl = (baseUrl?: string) => {
  if (!process.env.VERCEL) {
    return process.env.ROOT_URL;
  }
  const protocol = "https://";

  if (process.env.VERCEL_ENV === "preview" && !baseUrl?.includes("-git-")) {
    return protocol + process.env.VERCEL_BRANCH_URL + basePath;
  }

  // eslint-disable-next-line no-console
  console.log("process.env.ROOT_URL - utils", process.env.ROOT_URL);
  return process.env.ROOT_URL + basePath;
};
