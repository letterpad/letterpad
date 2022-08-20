import { GraphQLClient } from "graphql-request";

import { encryptEmail } from "@/shared/clientToken";

interface IArgs {
  query?: any;
  mutation?: any;
  variables?: any;
  token?: string;
  sessionId?: number;
}

const demoToken = encryptEmail("demo@demo.com");

const client = (token = demoToken, sessionId) =>
  new GraphQLClient("http://localhost:3000/graphql", {
    headers: {
      Authorization: `Bearer ${token}`,
      sessionId,
    },
  });

export const API = async ({ query, variables, token, sessionId }: IArgs) => {
  return client(token, sessionId).request(query, variables);
};
