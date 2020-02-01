const rootUrl =
  typeof window !== "undefined" ? (window as any).rootUrl : process.env.rootUrl;

export default {
  apiUrl: (function() {
    return typeof window !== "undefined"
      ? (window as any).apiUrl
      : rootUrl + "/graphql";
  })(),
  uploadUrl: (function() {
    return typeof window !== "undefined"
      ? (window as any).uploadUrl
      : rootUrl + "/upload";
  })(),
  rootUrl: (function() {
    return rootUrl;
  })(),
  appPort: (function() {
    return typeof window !== "undefined"
      ? (window as any).appPort
      : process.env.appPort;
  })(),
  baseName: (function() {
    return typeof window !== "undefined"
      ? (window as any).baseName
      : process.env.baseName;
  })(),
};
