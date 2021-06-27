import { GraphQLClient } from "graphql-request";
interface IArgs {
  query?: any;
  mutation?: any;
  variables: any;
}

const client = new GraphQLClient("http://localhost:3000/graphql", {
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjI0NTY1MjU5fQ.j8NDbHznGVNs_iBrgzmiXnTxfgb9ddTLlA9RF-WGTbk",
  },
});

export const API = async ({ query, variables }: IArgs) => {
  return client.request(query, variables);
};
