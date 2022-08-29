import { ApolloServer } from "apollo-server-micro";

import { basePath } from "@/constants";
// import { formatError } from "graphql";
import { getResolverContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";

export const apolloServer = new ApolloServer({
  schema,
  context: async (context) => {
    const resolverContext = await getResolverContext(context);
    return resolverContext;
  },

  playground: {
    endpoint: basePath + "/api/graphql",
  },
  introspection: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});
