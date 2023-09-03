import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { prisma } from "@/lib/prisma";

import { getResolverContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";

import { Cors } from "./_cors";

const apolloServer = startServerAndCreateNextHandler(
  new ApolloServer({
    schema,
    introspection: true,
  }),
  {
    context: async (req, res) => {
      const resolverContext = await getResolverContext({ req, res });
      return { ...resolverContext, prisma };
    },
  }
);
// export default apolloServer;
const cors = Cors();

export default cors(apolloServer);
