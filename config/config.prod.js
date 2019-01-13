const rootUrl = typeof window !== "undefined" ? window.rootUrl : process.env.rootUrl;

module.exports = {
  apiUrl: (function() {
    return typeof window !== "undefined" ? window.apiUrl : rootUrl + "/graphql";
  })(),
  uploadUrl: (function() {
    return typeof window !== "undefined"
      ? window.uploadUrl
      : rootUrl + "/upload";
  })(),
  rootUrl: (function() {
    return rootUrl
  })(),
  appPort: (function() {
    return typeof window !== "undefined" ? window.appPort : process.env.appPort;
  })(),
  baseName: (function() {
    return typeof window !== "undefined"
      ? window.baseName
      : process.env.baseName;
  })(),
};
