const baseName =
  typeof window !== "undefined"
    ? (window as any).baseName
    : process.env.baseName;

export default {
  apiUrl: (function() {
    return typeof window !== "undefined"
      ? (window as any).apiUrl
      : baseName + "/graphql";
  })(),
  uploadUrl: (function() {
    return typeof window !== "undefined"
      ? (window as any).uploadUrl
      : baseName + "/upload";
  })(),
  appPort: (function() {
    return typeof window !== "undefined"
      ? (window as any).appPort
      : process.env.appPort;
  })(),
  baseName: baseName,
};
