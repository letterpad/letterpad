import { ApolloServer } from "apollo-server-micro";
import { getSession } from "next-auth/client";
import models from "../../db/models";
import { schema } from "../../lib/schema";

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const session = await getSession({ req });
    return { session, models: models };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
