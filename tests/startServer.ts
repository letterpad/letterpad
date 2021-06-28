import getAuthorIdFromRequest from "../src/shared/getAuthorIdFromRequest";

import { ApolloServer } from "apollo-server";
import models from "../src/graphql/db/models";
import { schema } from "../src/graphql/schema";
import { seed } from "../src/graphql/db/seed/seed";

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
      const author_id = await getAuthorIdFromRequest({ req });
      if (req.headers.sessionid != "undefined") {
        session.user = {
          ...session.user,
          id: req.headers.sessionid as unknown as number,
        };
      }

      return { req, res, models, author_id, session };
    },
  });
};

let server;
beforeAll(async () => {
  await seed(models);
  server = await createApolloTestServer();
  const { url } = await server.listen({ port: 3000 });
  console.log("server listening at " + url);
});

afterAll(async () => {
  server.stop();
});
