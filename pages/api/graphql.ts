import { ApolloServer } from "apollo-server-micro";
import models from "../../db/models";
import { schema } from "../../lib/schema";

const apolloServer = new ApolloServer({
  schema,
  context: async context => {
    return { ...context, models };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
