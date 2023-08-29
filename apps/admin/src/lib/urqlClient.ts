import { createClient, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";

import schema from "../../schema.json";
const makeClient = () => {
  return createClient({
    url: "/api/graphql",
    exchanges: [
      cacheExchange({
        schema,
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
      }),
      fetchExchange,
    ],
    fetchOptions: {
      credentials: "same-origin",
    },
  });
};

export const client = makeClient();
