import { IncomingMessage } from "http";
import { ApolloServer } from "apollo-server-micro";
import { getSession } from "next-auth/client";
import models from "../../db/models";
import { schema } from "../../lib/schema";

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }: { req: IncomingMessage }) => {
    const session = await getSession({ req });
    if (session) {
      console.log("session :>> ", session);
    }
    return { req, models, session };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
