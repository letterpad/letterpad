import {
  ApolloClient,
  ApolloLink,
  // concat,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// import fetch from "cross-fetch";
import { basePath } from "@/constants";
import { publish } from "@/shared/eventBus";
import logger from "@/shared/logger";

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      logger.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    publish("networkError", "Network request failed");
  }
});

const httpLink = new HttpLink({
  uri: basePath + "/api/graphql",
  credentials: "same-origin",
  // fetch,
});

const saveMiddleware = new ApolloLink((operation, forward) => {
  if (operation.query.definitions.length > 0) {
    const isMutation = operation.query.definitions[0];
    if (isMutation["operation"] === "mutation") {
      publish("save", "Saving..");
    }
  }

  return forward(operation).map((result) => {
    return result;
  });
});

export const apolloBrowserClient = new ApolloClient({
  ssrMode: false,
  link: ApolloLink.from([saveMiddleware, errorLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
