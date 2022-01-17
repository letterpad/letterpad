import { getSession } from "next-auth/react";
import { ApolloServer } from "apollo-server-micro";
import { models } from "@/graphql/db/models";
import { schema } from "@/graphql/schema";
import getAuthorIdFromRequest from "src/shared/getAuthorIdFromRequest";
import { enqueueEmail } from "@/mail/mailqueue";
import { getResolverContext } from "@/graphql/context";
const resolverContext = getResolverContext(models);
export const apolloServer = new ApolloServer({
  schema,
  context: async (context) => {
    const session = await getSession(context);
    const author_id = await getAuthorIdFromRequest({ req: context.req });
    return {
      ...context,
      ...resolverContext,
      author_id,
      session,
      enqueueEmail,
    };
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
