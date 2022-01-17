import { useMemo } from "react";
import { basePath } from "@/constants";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloLink,
  concat,
} from "@apollo/client";
import { publish } from "@/shared/eventBus";

import { Optional } from "@/shared/types";
import { ResolverContext } from "./resolverContext";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createIsomorphLink(context: Optional<ResolverContext>) {
  if (typeof window === "undefined") {
    const { SchemaLink } = require("@apollo/client/link/schema");
    const { schema } = require("./schema");
    return new SchemaLink({ schema, context });
  } else {
    const { HttpLink } = require("@apollo/client");
    return new HttpLink({
      uri: basePath + "/api/graphql",
      credentials: "same-origin",
    });
  }
}

const saveMiddleware = new ApolloLink((operation, forward) => {
  if (operation.query.definitions.length > 0) {
    const isMutation = operation.query.definitions[0];
    if (isMutation["operation"] === "mutation") {
      publish("save", null);
    }
  }

  return forward(operation);
});

export function createApolloClient(context: Optional<ResolverContext>) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: concat(saveMiddleware, createIsomorphLink(context)),
    cache: new InMemoryCache(),
  });
}

export async function getApolloClient(
  initialState: any = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
  context?: ResolverContext,
) {
  let session;
  if (typeof window === "undefined") {
    if (!context) {
      console.error(
        "`getApolloClient` has been called without setting a context",
      );
    }
    if (process.env.NODE_ENV !== "test") {
      const { getSession } = require("next-auth/react");
      const isBuildRunning =
        process.env.NEXT_PHASE === "phase-production-build";
      if (!isBuildRunning) session = await getSession(context);
    }
  }
  const _apolloClient =
    apolloClient ?? createApolloClient({ ...context, session });

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  return useMemo(() => getApolloClient(initialState), [initialState]);
}
