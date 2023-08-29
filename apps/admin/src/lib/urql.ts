import { cacheExchange, createClient, fetchExchange, gql } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";
import { cookies } from "next/headers";

import { getRootUrl } from "../shared/getRootUrl";

const makeClient = () => {
  const sessionToken = cookies().get("next-auth.session-token")?.value;
  return createClient({
    url: getRootUrl() + "/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      credentials: "same-origin",
      headers: {
        cookie: `next-auth.session-token=${sessionToken}`,
      },
    },
  });
};

export const getClient = registerUrql(makeClient).getClient;
