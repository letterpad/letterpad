import { NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

import { basePath } from "@/constants";
import { decodeToken, verifyToken } from "@/shared/token";

import { NextApiRequestWithFormData } from "../../graphql/types";

const Unsubscribe = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  try {
    const isValidToken = verifyToken(req.query.token as string);
    if (!isValidToken) {
      return res.redirect(basePath + "/messages/expired");
    }
    const token = decodeToken(req.query.token as string);

    const destroyed = await prisma.subscriber.delete({
      where: {
        email_author_id: { email: token.email, author_id: token.author_id },
      },
    });
    if (destroyed) {
      return res.redirect(basePath + "/messages/unsubscribed");
    } else {
      return res.redirect(
        basePath + "/messages/unsubscribed?msg=Email not found in the system.",
      );
    }
  } catch (e) {
    res.send(e.message);
  }
};

export default Unsubscribe;
