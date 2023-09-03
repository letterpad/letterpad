import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

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
      return resolverContext;
    },
  }
);

const cors = Cors();

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "*");

  apolloServer(req, res);
});
