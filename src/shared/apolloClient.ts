import { ApolloLink, from } from "apollo-link";
import { EventBusInstance, Events } from "./eventBus";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import config from "../config";
import { createHttpLink } from "apollo-link-http";
import fetch from "isomorphic-fetch";
import { onError } from "apollo-link-error";

const httpLink = createHttpLink({
  uri: config.API_URL,
  fetch: fetch,
});

/**
 * Every request from admin dashboard requires a token which is set in localStorage.
 * For every request to admin, a new token is received and is resaved in localstorage.
 * This is also useful to invalidate the sesson if the user is inactive for more than x time
 * @param {*} token
 */
const middlewareLinkAdmin = (token: string | null = null) => {
  const isServer = typeof window === "undefined";
  return new ApolloLink((operation, forward) => {
    let headers = {};
    if (isServer) {
      headers = {
        authorization: token,
      };
    } else if (localStorage.getItem("token")) {
      headers = {
        authorization: localStorage.token,
      };

      const definations = operation.query.definitions;
      // @ts-ignore
      if (definations[0].operation === "mutation") {
        // ignore login mutation
        // @ts-ignore
        if (definations[0].name.value !== "login") {
          EventBusInstance.publish(Events.SAVING);
        }
      } else {
        EventBusInstance.publish(Events.LOADING);
      }
    }
    operation.setContext({
      headers,
    });
    if (isServer) {
      return forward(operation);
    }
    return forward(operation).map(response => {
      const {
        response: { headers },
      } = operation.getContext();
      if (headers) {
        const refreshToken = headers.get("x-refresh-token");
        if (refreshToken) {
          localStorage.token = refreshToken;
          EventBusInstance.publish(Events.LOADED);
        }
      }
      return response;
    });
  });
};
/**
 * Handle unauthorised errors
 */
const errorLink = onError(({ networkError }) => {
  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    delete localStorage.token;
    window.location.href = config.BASE_NAME + "/admin/login";
  }
});

/**
 * Any request from client (theme) will not require a token as whatever data they request
 * is public.
 */
const middlewareLinkClient = new ApolloLink((operation, forward) =>
  forward(operation),
);

let initialState = {};
let token;
if (typeof window !== "undefined") {
  token = localStorage.token;
  initialState = (window as any).__APOLLO_STATE__;
}

// prepare the client for graphql queries.
const apolloClient = (
  isAdmin = true,
  opts = {},
  authToken: string | null = token,
) => {
  const middleware = isAdmin
    ? middlewareLinkAdmin(authToken)
    : middlewareLinkClient;
  const link = from([errorLink, middleware, httpLink]);
  return new ApolloClient({
    link,
    cache: new InMemoryCache().restore(initialState),
    ssrForceFetchDelay: 100,
    queryDeduplication: false,
    ...opts,
  });
};

export default apolloClient;
