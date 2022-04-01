import { basePath } from "@/constants";
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  // concat,
  HttpLink,
} from "@apollo/client";
import { publish } from "@/shared/eventBus";
import fetch from "cross-fetch";
import { onError } from "@apollo/client/link/error";

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) {
    publish("networkError", "Network request failed");
  }
});

const httpLink = new HttpLink({
  uri: basePath + "/api/graphql",
  credentials: "same-origin",
  fetch,
});

const saveMiddleware = new ApolloLink((operation, forward) => {
  if (operation.query.definitions.length > 0) {
    const isMutation = operation.query.definitions[0];
    if (isMutation["operation"] === "mutation") {
      publish("save", "Saving..");
    }
  }

  return forward(operation).map((result) => {
    console.info(operation.getContext().response);
    console.log(result.data);
    return result;
  });
});

// const responseLogger = new ApolloLink((operation, forward) => {
//   console.log("hello");
//   return forward(operation).map((result) => {
//     console.info(operation.getContext().response.headers);
//     return result;
//   });
// });

export const apolloBrowserClient = new ApolloClient({
  ssrMode: false,
  link: ApolloLink.from([saveMiddleware, errorLink, httpLink]),
  cache: new InMemoryCache(),
});
