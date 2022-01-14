import models from "@/graphql/db/models";
import { NextApiResponse } from "next";
import { NextApiRequestWithFormData } from "./../../graphql/types";
import { basePath } from "@/constants";
import { decodeToken, verifyToken } from "@/shared/token";

const Verify = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  try {
    const isValidToken = verifyToken(req.query.token as string);
    if (!isValidToken) {
      return res.redirect(basePath + "/messages/expired");
    }
    const token = decodeToken(req.query.token as string);
    const isSubscriber = req.query.subscriber;
    let update;
    if (isSubscriber) {
      update = await models.Subscribers.update(
        { verified: true },
        { where: { email: token.email } },
      );
    } else {
      update = await models.Author.update(
        { verified: true },
        { where: { email: token.email } },
      );
    }
    if (!update) {
      return res.redirect(
        basePath +
          "/messages/verified?msg=Either you are already verified or verification failed.",
      );
    }
    res.redirect(basePath + "/messages/verified");
  } catch (e) {
    res.send(e.message);
  }
};

export default Verify;
