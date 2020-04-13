function isServer() {
  return typeof window === "undefined";
}

// during bundling, restrict replacing process.env.xxx to values.
const config = (() => {
  const ROOT_URL = isServer() ? process.env.ROOT_URL : (window as any).ROOT_URL;
  const BASE_NAME = isServer()
    ? process.env.BASE_NAME
    : (window as any).BASE_NAME;
  const USE_GRAPHQL_JIT = isServer()
    ? !(
        process.env.USE_GRAPHQL_JIT === "false" ||
        process.env.USE_GRAPHQL_JIT === "0"
      )
    : true;

  return {
    ROOT_URL,
    BASE_NAME,
    API_URL: isServer()
      ? ROOT_URL + BASE_NAME + "/graphql"
      : (window as any).API_URL,
    UPLOAD_URL: isServer()
      ? ROOT_URL + BASE_NAME + "/upload"
      : (window as any).UPLOAD_URL,
    APP_PORT: isServer() ? process.env.APP_PORT : (window as any).APP_PORT,
    USE_GRAPHQL_JIT,
  };
})();

export default config;
