import { NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

import { basePath } from "@/constants";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { decodeToken } from "@/shared/token";
import { VerifySubscriberToken } from "@/shared/types";

import {
  EmailTemplates,
  NextApiRequestWithFormData,
} from "../../graphql/types";

const Verify = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  try {
    if (!req.query.token || typeof req.query.token !== "string") {
      throw Error("No token provided");
    }

    const token = decodeToken<VerifySubscriberToken>(req.query.token);

    const update = await prisma.subscriber.update({
      data: {
        verified: true,
      },
      where: { id: token.subscriber_id },
    });

    await enqueueEmailAndSend({
      template_id: EmailTemplates.SubscriberVerified,
      author_id: token.author_id,
      subscriber_id: token.subscriber_id,
    });

    if (!update) {
      throw Error("Either you are already verified or verification failed.");
    }

    res.redirect(basePath + "/messages/verifiedSubscriber");
  } catch (e) {
    res.send(e.message);
  }
};

export default Verify;
