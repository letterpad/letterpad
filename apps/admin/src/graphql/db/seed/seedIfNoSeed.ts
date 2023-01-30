require("dotenv/config");
import { prisma } from "@/lib/prisma";

import { seed } from "./seed";

hasSeed().then((seeded) => {
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
    // eslint-disable-next-line no-console
    console.log(process.env.DATABASE_URL);
    const author = await prisma.author.findFirst();
    return author;
  } catch (e) {
    return false;
  }
}
