import { ApolloServer } from "apollo-server-micro";
import { schema } from "@/graphql/schema";
import { getResolverContext } from "@/graphql/context";

export const apolloServer = new ApolloServer({
  schema,
  context: async (context) => {
    const resolverContext = await getResolverContext(context);
    return resolverContext;
  },
  // playground: true,
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
