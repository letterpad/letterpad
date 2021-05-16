import { NextApiRequestWithFormData } from "@/graphql/types";
import { encrypt } from "@/graphql/utils/crypto";
import { NextApiResponse } from "next";
import { getSession } from "next-auth/client";

const getHashFromPostId = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse,
) => {
  const _session = await getSession({ req });

  if (!_session || !_session.user?.email)
    return res.status(401).send("Unauthorized");

  res.send(encrypt(req.query.id.toString()));
};

export default getHashFromPostId;
