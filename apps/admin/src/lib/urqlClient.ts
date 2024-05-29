// import { Client, createClient, fetchExchange } from "@urql/core";
import { Client, createClient, fetchExchange, mapExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import schema from "letterpad-graphql/graphql.schema.json";

import { getApiUrl } from "@/shared/getRootUrl";

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
    Author: () => null,
    PostsNode: () => null,
    Notification: () => null,
    FavAuthorResponse: () => null,
    DeleteAuthorResponse: () => null,
    UnAuthorized: () => null,
    StatsError:() => null
  },
});

const url = getApiUrl();
const makeClient = () => {
  // eslint-disable-next-line no-console 
  if (_client) return _client;
  _client = createClient({
    url,
    suspense: true,
    exchanges: [
      cache,
      mapExchange({
        onResult(result) {
          const isAuthorized =
            result?.data?.[Object.keys(result?.data)[0]]?.__typename !==
            "UnAuthorized";

          if (!isAuthorized && typeof window !== "undefined") {
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
