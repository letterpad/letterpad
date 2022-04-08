import { NextApiResponse } from "next";
import { NextApiRequestWithFormData } from "./../../graphql/types";
import { basePath } from "@/constants";
import { decodeToken, verifyToken } from "@/shared/token";
import { prisma } from "@/lib/prisma";
import { onBoardUser } from "@/lib/onboard";

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
      update = await prisma.subscriber.update({
        data: { verified: true },
        where: { id: token.id },
      });
    } else {
      const result = await prisma.author.update({
        data: { verified: true },
        where: { id: token.author_id },
      });
      if (result) {
        onBoardUser(result.id);
      }
      update = result;
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
