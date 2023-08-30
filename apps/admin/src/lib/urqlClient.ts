import { createClient, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { Message } from "ui";

import { publish, subscribe } from "../shared/eventBus";
import schema from "../../schema.json";

export const cache = cacheExchange({
  schema,
  keys: {
    Tag: () => "name",
    TagsNode: () => "name",
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
  updates: {
    Mutation: {
      updateOptions: () => {
        publish("save", "Settings updated");
      },
      updateAuthor: (_result) => {
        Message().loading({ content: "Updating, Please wait..." });
        Message().success({ content: "Saved", duration: 1 });
      },
    },
  },
});
const makeClient = () => {
  return createClient({
    url: "/api/graphql",
    exchanges: [cache, fetchExchange],
    fetchOptions: {
      credentials: "same-origin",
    },
  });
};

export const client = makeClient();
