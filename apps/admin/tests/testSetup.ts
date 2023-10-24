import dotenv from "dotenv";
import { createServer } from "node:http";
import path from "path";
const envPath = path.join(__dirname, "..", ".env.test.local");
const envLoaded = dotenv.config({ path: envPath, debug: true });
if (envLoaded.error) {
  throw new Error("`.env.test.local` not found.");
}
const { exec } = require("child_process");
import React from "react";

import logger from "@/shared/logger";

import { setupYoga } from "../src/app/api/graphql/route";
import { getResolverContext } from "../src/graphql/context";
import { seed } from "../src/graphql/db/seed/seed";
// import { schema } from "../src/graphql/schema";
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

const creatYogaTestServer = () => {
  const context = async ({ request }) => {
    const resolverContext = await getResolverContext(request);
    return { ...resolverContext, prisma, session };
  };
  const server = createServer(setupYoga(context));
  return { server };
};

let server: ReturnType<typeof createServer> | null = null;

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
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  }
  server = creatYogaTestServer().server;
  server.listen(3000, () => {
    logger.info("Server is running on http://localhost:3000/graphql");
  });
}, 60000);

afterAll(async () => {
  server?.close();
  // console.log(server)
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
