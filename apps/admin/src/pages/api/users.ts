import { NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { prisma } from "@/lib/prisma";

import { NextApiRequestWithFormData } from "../../graphql/types";

import { AdminUsersType } from "@/types";

const Users = async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || session.user?.role === "ADMIN") {
    return res.status(401).send("Unauthorized");
  }
  const type = req.query.type as unknown as AdminUsersType;

  switch (type) {
    case AdminUsersType.RECENT_USERS:
      await prisma.author.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      });
    case AdminUsersType.TOP_USERS:
      return res.send("Update user");

    default:
      return res.send("Invalid request");
  }
};

export default Users;
