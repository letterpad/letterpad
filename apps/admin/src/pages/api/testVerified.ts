import { NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

import { NextApiRequestWithFormData } from "../../graphql/types";

const VerifyTestUser = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  try {
    await prisma.author.update({
      data: {
        verified: true,
      },
      where: {
        email: "test@test.com",
      },
    });
    res.send("Test user verified");
  } catch (e: any) {
    res.send(e.message);
  }
};

export default VerifyTestUser;
