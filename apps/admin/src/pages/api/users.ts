import { NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "../../graphql/context";
import { NextApiRequestWithFormData } from "../../graphql/types";

import { AdminUsersType } from "@/types";

const Users = async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
  const session = await getServerSession();
  if (!session || session.user?.role !== "ADMIN") {
    return res.status(401).send("Unauthorized");
  }
  const type = req.query.type as unknown as AdminUsersType;

  switch (type) {
    case AdminUsersType.RECENT_USERS:
      const rows = await prisma.author.findMany({
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
        take: 100,
      });
      return res.status(200).json(rows);
    case AdminUsersType.TOP_USERS:
      const result =
        await prisma.$queryRaw`SELECT COUNT(*) as post_count, P.author_id, A.name, A.username from Post P INNER JOIN Author A ON A.id = P.author_id WHERE P.status = 'published' GROUP by P.author_id ORDER BY post_count DESC LIMIT 100`;

      return res.status(200).json(result);
    case AdminUsersType.DOMAIN_MAPPED:
      const domainMapped =
        await prisma.$queryRaw`SELECT a.id, d.ssl, d.name as domain_name, d.mapped, a.username,a.email, a.name from Author a INNER JOIN Domain d ON d.author_id = a.id ORDER BY d.updatedAt DESC;`;
      return res.status(200).json(domainMapped);

    default:
      return res.send("Invalid request");
  }
};

export default Users;

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};
