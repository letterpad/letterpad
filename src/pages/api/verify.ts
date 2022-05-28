import { NextApiResponse } from "next";

import { onBoardUser } from "@/lib/onboard";
import { prisma } from "@/lib/prisma";

import { basePath } from "@/constants";
import { decodeToken, verifyToken } from "@/shared/token";

import { NextApiRequestWithFormData } from "./../../graphql/types";

const Verify = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  try {
    try {
      verifyToken(req.query.token as string);
    } catch (e) {
      return res.redirect(basePath + "/messages/expired");
    }
    const token = decodeToken(req.query.token as string);
    const isSubscriber = req.query.subscriber;
    let update;
    if (isSubscriber) {
      update = await prisma.subscriber.update({
        data: { verified: true },
        where: { id: token.subscriber_id },
      });
    } else {
      const author = await prisma.author.findFirst({
        where: { id: token.author_id },
      });
      if (!author?.verified) {
        const result = await prisma.author.update({
          data: { verified: true },
          where: { id: token.author_id },
        });
        if (result) {
          onBoardUser(result.id);
        }
      }
      update = author;
    }
    if (!update) {
      return res.redirect(
        basePath +
          "/messages/verified?msg=Either you are already verified or verification failed.",
      );
    }
    res.redirect(basePath + "/messages/verified");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error:
        "We encountered an error and failed to Verify. This issue has been reported",
    });
  }
};

export default Verify;
