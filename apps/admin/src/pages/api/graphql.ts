import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { getResolverContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";

const apolloServer = startServerAndCreateNextHandler(
  new ApolloServer({
    schema,
    introspection: true,
  }),
  {
    context: async (req, res) => {
      const resolverContext = await getResolverContext({ req, res });
      res.setHeader("access-control-allow-origin", "*");
      res.setHeader("access-control-allow-methods", "*");
      return resolverContext;
    },
  }
);

export default apolloServer;
