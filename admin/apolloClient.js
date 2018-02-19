import ApolloClient from "apollo-client";
import { fetch } from "whatwg-fetch";
import { createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import config from "../config";

const httpLink = createHttpLink({
    uri: config.apiUrl,
    fetch
});

const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            authorization: localStorage.getItem("token") || null,
            admin: true,
            browser: true
        }
    });
    return forward(operation);
});
const errorLink = onError(({ networkError }) => {
    if (networkError.statusCode === 401) {
        window.location = "/admin/login";
    }
});
let initialState = {};
if (typeof window !== "undefined") {
    initialState = window.__APOLLO_STATE__;
}
const client = new ApolloClient({
    link: errorLink.concat(middlewareLink).concat(httpLink),
    cache: new InMemoryCache().restore(initialState),
    ssrForceFetchDelay: 100
});

export default client;
