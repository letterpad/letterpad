const baseName =
  typeof window !== "undefined"
    ? (window as any).baseName
    : process.env.baseName;

const ROOT_URL =
  typeof window !== "undefined"
    ? (window as any).ROOT_URL
    : process.env.ROOT_URL;

export default {
  ROOT_URL,
  apiUrl:
    typeof window !== "undefined"
      ? (window as any).apiUrl
      : ROOT_URL + baseName + "/graphql",
  uploadUrl:
    typeof window !== "undefined"
      ? (window as any).uploadUrl
      : baseName + "/upload",
  appPort:
    typeof window !== "undefined"
      ? (window as any).appPort
      : process.env.appPort,
  baseName: baseName || "",
};
