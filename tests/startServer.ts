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
  });
};

let server;
beforeAll(async () => {
  await seed();
  server = await createApolloTestServer();
  const { url } = await server.listen({ port: 3000 });
  console.log("server listening at " + url);
});

afterAll(async () => {
  server.stop();
});
