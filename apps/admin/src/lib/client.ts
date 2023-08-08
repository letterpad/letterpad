import { HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr";

// import fetch from "cross-fetch";
import { basePath } from "../constants";

export const { getClient } = registerApolloClient(() => {
  const apolloClient = new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: basePath + "/api/graphql",
      fetch,
    }),
  });
  return apolloClient;
});
