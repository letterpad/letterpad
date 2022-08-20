import { NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { NextApiRequestWithFormData } from "@/graphql/types";
import { encrypt } from "@/graphql/utils/crypto";

const getHashFromPostId = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  const _session = await getSession({ req });

  if (!_session || !_session.user?.email)
    return res.status(401).send("Unauthorized");
  if (!req.query.id) {
    return res.status(401).send("Invalid Arguments");
  }
  res.send(encrypt(req.query.id.toString()));
};

export default getHashFromPostId;
