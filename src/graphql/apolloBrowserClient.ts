import { basePath } from "@/constants";
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
  HttpLink,
} from "@apollo/client";
import { publish } from "@/shared/eventBus";

const httpLink = new HttpLink({
  uri: basePath + "/api/graphql",
  credentials: "same-origin",
});

const saveMiddleware = new ApolloLink((operation, forward) => {
  if (operation.query.definitions.length > 0) {
    const isMutation = operation.query.definitions[0];
    if (isMutation["operation"] === "mutation") {
      publish("save", null);
    }
  }

  return forward(operation);
});

export const apolloBrowserClient = new ApolloClient({
  ssrMode: false,
  link: concat(saveMiddleware, httpLink),
  cache: new InMemoryCache(),
});
