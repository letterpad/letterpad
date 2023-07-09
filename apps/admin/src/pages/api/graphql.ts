import { ApolloServer } from "apollo-server-micro";
import { getSession } from "next-auth/react";

import { basePath } from "@/constants";
// import { formatError } from "graphql";
import { getResolverContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";

export const getServerSession = async (cookie: string) => {
  const res = await fetch("/api/auth/session", {
    headers: { cookie: cookie },
  });
  const session = await res.json();
  // eslint-disable-next-line no-console
  console.log("session", session);
  return session;
};

export const apolloServer = new ApolloServer({
  schema,
  context: async (context) => {
    // eslint-disable-next-line no-console
    console.log("base url", context.req.headers.origin);
    // eslint-disable-next-line no-console
    console.log("req", context.req.cookies);
    const session = await getServerSession(context.req.headers.cookie);
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
