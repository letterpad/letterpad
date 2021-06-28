import { GraphQLClient } from "graphql-request";

interface IArgs {
  query?: any;
  mutation?: any;
  variables?: any;
  token?: string;
  sessionId?: number;
}

const demoToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjI0NTY1MjU5fQ.j8NDbHznGVNs_iBrgzmiXnTxfgb9ddTLlA9RF-WGTbk";

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
