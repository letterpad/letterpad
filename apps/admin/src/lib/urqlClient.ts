import { createClient, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { Message } from "ui";
import { mapExchange } from "urql";

import { isOperationDefinition } from "../utils/type-guards";
import {
  PartialFragmentDoc,
  PostDocument,
  PostsDocument,
} from "../../__generated__/src/graphql/queries/queries.graphql";
import schema from "../../schema.json";

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
  return createClient({
    url: "/api/graphql",
    maskTypename: true,
    exchanges: [
      cache,
      mapExchange({
        onOperation(operation) {
          if (isOperationDefinition(operation.query.definitions[0])) {
            const mutationName = operation.query.definitions[0].name?.value;
            switch (mutationName) {
              case "UpdateAuthor":
              case "UpdateOptions":
              case "UpdatePost":
              case "UpdateTags":
                Message().loading({ content: "Saving...", duration: 3 });
            }
          }
        },
        onResult(result) {
          if (result.operation.kind === "query") return;
          Message().loading({ content: "Saved", duration: 0.5 });
        },
        onError() {
          Message().destroy();
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
