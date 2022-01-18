import { models } from "@/graphql/db/models";
import { NextApiResponse } from "next";
import { NextApiRequestWithFormData } from "../../graphql/types";
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

    const destroyed = await models.Subscribers.destroy({
      where: { email: token.email },
    });
    console.log(destroyed);
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

export default Verify;
