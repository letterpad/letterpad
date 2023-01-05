import { NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

import { NextApiRequestWithFormData } from "../../graphql/types";

const VerifyTestUser = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  if (process.env.NODE_ENV !== "test")
    return res.status(401).send("Not Authorized");
  if (!req.query.email) return res.status(400).send("Email is required");
  try {
    await prisma.author.update({
      data: {
        verified: true,
      },
      where: {
        email: req.query.email as string,
      },
    });
    res.send("Test user verified");
  } catch (e: any) {
    res.send(e.message);
  }
};

export default VerifyTestUser;
