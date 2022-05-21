import "dotenv/config";
process.env.DATABASE_URL = "file:data/test.sqlite";
import { ApolloServer } from "apollo-server";
const { exec } = require("child_process");
import { schema } from "../src/graphql/schema";
import { seed } from "../src/graphql/db/seed/seed";
import { getResolverContext } from "@/graphql/context";
import React from "react";
React.useLayoutEffect = React.useEffect;

const session = {
  user: {
    role: "AUTHOR",
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
    // playground: true,
    context: async (context) => {
      const resolverContext = await getResolverContext(context);
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
  // jest.setTimeout(0);
  try {
    global.console = require("console");
    await execShellCommand(
      "DATABASE_URL='file:data/test.sqlite' npx prisma db push --force-reset --schema prisma/sqlite/schema.prisma",
    );
  } catch (err) {
    console.log(err);
    process.exit();
  }
  await seed();
  server = await createApolloTestServer();
  const { url } = await server.listen({ port: 3000 });
  console.log("server listening at " + url);
}, 60000);

afterAll(async () => {
  server?.stop();
});

const execShellCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(stdout || stderr);
        resolve(null);
      }
    });
  });
};
