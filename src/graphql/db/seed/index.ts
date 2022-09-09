import logger from "@/shared/logger";
require("dotenv/config");

import { seed } from "./seed";

seed()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
