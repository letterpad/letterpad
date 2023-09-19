import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import { prisma } from "@/lib/prisma";

import { getResolverContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";

import { Cors } from "./_cors";

export const runtime = "edge";

const handler = startServerAndCreateNextHandler(
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

const cors = Cors();
const corsHandler = cors(handler);

export { corsHandler as GET, corsHandler as POST };
