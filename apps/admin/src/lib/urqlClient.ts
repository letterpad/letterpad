import { Client, createClient, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { mapExchange } from "urql";

import schema from "../../schema.json";

let _client: Client | null = null;
export const cache = cacheExchange({
  schema,
  formatDocument: true,
  keys: {
    Tag: () => null,
    TagsNode: () => null,
    Social: () => null,
    // Setting: () => null,
    Design: () => null,
    Navigation: () => null,
    Image: () => null,
    Stats: () => null,
    PostCountsByStatus: () => null,
    PostStats: () => null,
    // Author: () => null,
    // PostsNode: () => null,
  },
});
const makeClient = () => {
  if (_client) return _client;
  _client = createClient({
    url: "/api/graphql",
    maskTypename: true,
    exchanges: [
      cache,
      mapExchange({
        onResult(result) {
          const isAuthorized =
            result?.data?.[Object.keys(result?.data)[0]]?.__typename !==
            "UnAuthorized";

          if (!isAuthorized) {
            window.location.replace(
              `/login?callbackUrl=${window.location.href}`
            );
          }
          if (result.operation.kind === "query") return;
        },
      }),
      fetchExchange,
    ],
  });
  return _client;
};

export const client = makeClient();
