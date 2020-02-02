const baseName =
  typeof window !== "undefined"
    ? (window as any).baseName
    : process.env.baseName;

const rootUrl =
  typeof window !== "undefined"
    ? (window as any).rootUrl
    : process.env.ROOT_URL;

export default {
  rootUrl,
  apiUrl:
    typeof window !== "undefined"
      ? (window as any).apiUrl
      : rootUrl + baseName + "/graphql",
  uploadUrl:
    typeof window !== "undefined"
      ? (window as any).uploadUrl
      : baseName + "/upload",
  appPort:
    typeof window !== "undefined"
      ? (window as any).appPort
      : process.env.appPort,
  baseName: baseName,
};
