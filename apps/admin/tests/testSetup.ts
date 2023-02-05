import dotenv from "dotenv";
import path from "path";
const envPath = path.join(__dirname, "..", ".env.test.local");
const envLoaded = dotenv.config({ path: envPath, debug: true });
if (envLoaded.error) {
  throw new Error("`.env.test.local` not found.");
}
import { ApolloServer } from "apollo-server";
const { exec } = require("child_process");
import React from "react";

import { getResolverContext } from "@/graphql/context";
import logger from "@/shared/logger";

import { seed } from "../src/graphql/db/seed/seed";
import { schema } from "../src/graphql/schema";
React.useLayoutEffect = React.useEffect;

const session = {
  user: {
    role: "AUTHOR",
    avatar: "",
    permissions: [],
    id: 1,
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
      "DATABASE_URL='file:data/test.sqlite' npx prisma db push --force-reset --schema prisma/sqlite/schema.prisma"
    );
  } catch (err) {
    logger.error(err);
    process.exit();
  }
  try {
    await seed();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  server = await createApolloTestServer();
  const { url } = await server.listen({ port: 3000 });
  logger.info("server listening at " + url);
}, 60000);

afterAll(async () => {
  server?.stop();
});

const execShellCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        logger.info(stdout || stderr);
        resolve(null);
      }
    });
  });
};
