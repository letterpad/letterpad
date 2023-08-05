import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { getResolverContext } from "@/graphql/context";

import { seed } from "../src/graphql/db/seed/seed";
import { schema } from "../src/graphql/schema";

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
  const apolloServer = startStandaloneServer(
    new ApolloServer({
      schema,
      introspection: true,
    }),
    {
      context: async ({ req, res }) => {
        const resolverContext = getResolverContext({ req });
        if (req.headers.sessionid != "undefined") {
          session.user = {
            ...session.user,
            id: req.headers.sessionid as unknown as number,
          };
        }

        return { req, res, ...resolverContext };
      },
      listen: {
        port: 3000,
      },
    }
  );
  return apolloServer;
};

let server;
beforeAll(async () => {
  global.console = require("console");
  await seed();
  server = await createApolloTestServer();
});

afterAll(async () => {
  server.stop();
});
