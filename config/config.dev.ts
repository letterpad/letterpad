const ROOT_URL = "http://localhost:4040";
const API_URL = "http://localhost:1111";

function isServer() {
  return typeof window === "undefined";
}

const USE_GRAPHQL_JIT = isServer()
  ? !(
      process.env.USE_GRAPHQL_JIT === "false" ||
      process.env.USE_GRAPHQL_JIT === "0"
    )
  : true;

export default {
  APP_PORT: 4040,
  ROOT_URL: ROOT_URL,
  API_URL: API_URL + "/graphql",
  UPLOAD_URL: API_URL + "/upload",
  HASH_URL: API_URL + "/getHashFromPostId",
  USE_GRAPHQL_JIT,
  BASE_NAME: "",
};
