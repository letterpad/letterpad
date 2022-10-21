require("dotenv/config");

import { seed } from "./seed";

seed()
  .catch((e) => {
    throw e;
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
