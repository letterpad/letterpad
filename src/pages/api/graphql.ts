import { getSession } from "next-auth/client";
import { ApolloServer } from "apollo-server-micro";
import models from "@/graphql/db/models";
import { schema } from "@/graphql/schema";
import getAuthorIdFromRequest from "src/shared/getAuthorIdFromRequest";
import * as Sentry from "@sentry/nextjs";

export const apolloServer = new ApolloServer({
  schema,
  context: async (context) => {
    const session = await getSession(context);
    const author_id = await getAuthorIdFromRequest({ req: context.req });
    Sentry.setUser({ email: session?.user?.email || "" });
    return { ...context, models, author_id, session };
  },
  playground: true,
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
