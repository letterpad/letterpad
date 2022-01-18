const env = require("node-env-file");
env(__dirname + "/../.env.development.local");

import { ApolloServer } from "apollo-server";

import { schema } from "../src/graphql/schema";
import { seed } from "../src/graphql/db/seed/seed";
import { getResolverContext } from "@/graphql/context";

const session = {
  user: {
    role: "ADMIN",
    avatar: "",
    permissions: [],
    id: 2,
    username: "",
    __typename: "SessionData",
  },
};

export const createApolloTestServer = async () => {
  return new ApolloServer({
    schema,
    debug: true,
    introspection: true,
    playground: true,
    context: async (context) => {
      const resolverContext = await getResolverContext(context.req);
      return {
        ...context,
        ...resolverContext,
        session,
      };
    },
  });
};

let server;
beforeAll(async () => {
  global.console = require("console");
  await seed();
  server = await createApolloTestServer();
  const { url } = await server.listen({ port: 3000 });
  console.log("server listening at " + url);
});

afterAll(async () => {
  server.stop();
});
