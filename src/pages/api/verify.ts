import models from "@/graphql/db/models";
import { NextApiResponse } from "next";
import { NextApiRequestWithFormData } from "./../../graphql/types";
import Cryptr from "cryptr";
import { basePath } from "@/constants";

const cryptr = new Cryptr(process.env.SECRET_KEY);

const Verify = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  try {
    const token = cryptr.decrypt(req.query.token);
    const isSubscriber = req.query.subscriber;
    let update;
    if (isSubscriber) {
      update = await models.Subscribers.update(
        { verified: true },
        { where: { email: token } },
      );
    } else {
      update = await models.Author.update(
        { verified: true },
        { where: { email: token } },
      );
    }
    if (!update) {
      throw Error("Either you are already verified or verification failed.");
    }
    res.redirect(basePath + "/messages/verified");
  } catch (e) {
    res.send(e.message);
  }
};

export default Verify;
