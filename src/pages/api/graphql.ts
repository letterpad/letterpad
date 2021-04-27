import { ApolloServer } from "apollo-server-micro";
import models from "@/graphql/db/models";
import { schema } from "@/graphql/schema";

const apolloServer = new ApolloServer({
  schema,
  context: async context => {
    const authHeader = context.req?.headers.authorization;
    const clientEmail = authHeader.split(/\s+/).pop() || "";
    return { ...context, models, clientEmail };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});
