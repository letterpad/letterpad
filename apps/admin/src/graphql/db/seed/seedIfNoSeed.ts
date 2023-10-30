require("dotenv/config");
import { prisma } from "@/lib/prisma";

import { seed } from "./seed";
import { db } from "../../../lib/drizzle";

hasSeed().then((seeded) => {
  return;
  if (process.env.NODE_ENV === "production") return;
  // eslint-disable-next-line no-console
  console.log("DB URL", process.env.DATABASE_URL);
  if (!seeded) {
    seed()
      .catch((e) => {
        throw e;
        process.exit(1);
      })
      .then(() => {
        process.exit(0);
      });
  } else {
    // eslint-disable-next-line no-console
    console.info("Database ready");
  }
});

async function hasSeed() {
  try {
    const author = await db.query.Author.findFirst();
    // const author = await prisma.author.findFirst();
    return author;
  } catch (e) {
    return false;
  }
}
