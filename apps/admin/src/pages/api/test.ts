import { NextApiResponse } from "next";

import { NextApiRequestWithFormData } from "@/graphql/types";

import { SSL } from "../../lib/greenlock";
import logger from "../../shared/logger";

const test = async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
  try {
    const ssl = new SSL();
    const res = await ssl.delete("test.abhisaha.com");
    logger.debug("delete", res);
    const result = await ssl.add("test.abhisaha.com");
    logger.debug("result", result);
    res.send("success");
  } catch (e) {
    logger.error("error", e);
    res.send(e.message);
  }
};

export default test;
