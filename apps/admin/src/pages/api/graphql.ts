import { ApolloServer } from "apollo-server-micro";
import { getSession } from "next-auth/react";

import { basePath } from "@/constants";
// import { formatError } from "graphql";
import { getResolverContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";

export const apolloServer = new ApolloServer({
  schema,
  context: async (context) => {
    // eslint-disable-next-line no-console
    console.log("req", context.req);
    const c = await getSession(context);

    // eslint-disable-next-line no-console
    console.log(c);
    const resolverContext = await getResolverContext(context);
    return resolverContext;
  },
  introspection: true,
});
const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
