import { GraphQLClient } from "graphql-request";

interface IArgs {
  query?: any;
  mutation?: any;
  variables?: any;
  token?: string;
  sessionId?: string;
}

const client = (token, sessionId) =>
  new GraphQLClient("http://localhost:3000/api/graphql", {
    headers: {
      Authorization: `Bearer 1`,
      sessionId,
    },
  });

export const API = async ({ query, variables, token, sessionId }: IArgs) => {
  return client(token, sessionId).request(query, variables);
};
