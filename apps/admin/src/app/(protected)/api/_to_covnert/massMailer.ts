import { NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "@/graphql/context";
import { NextApiRequestWithFormData } from "@/graphql/types";

import { triggerMail } from "./mail";

const users = async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
  const session = await getServerSession({ req });
  if (!session || session.user?.role === "ADMIN") {
    return res.status(401).send("Unauthorized");
  }
  const { subject, html, isTest } = req.body;
  if (isTest) {
    const response = await triggerMail({
      subject,
      html,
      author_id: session.user!.id,
      name: session.user!.name,
      to: process.env.SENDER_EMAIL!,
      username: session.user!.username,
    });
    return res.status(200).json({
      accepted: response?.accepted.pop(),
      rejected: response?.rejected.pop(),
    });
  }
  const activeUsers = await getActiveUsers();
  const promises = activeUsers.map((user) => {
    return triggerMail({
      subject,
      html,
      author_id: user.id,
      name: user.full_name,
      to: user.email,
      username: user.username,
    });
  });
  const resolved = await Promise.all(promises);
  const rejected = resolved
    .filter((r) => r?.rejected.length! > 0)
    .map((r) => r?.rejected.pop());
  const accepted = resolved
    .filter((r) => r?.accepted.length! > 0)
    .map((r) => r?.accepted.pop());
  res.json({ accepted, rejected });
};

export default users;

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

const getActiveUsers = async () => {
  const users =
    await prisma.$queryRaw`SELECT COUNT(*) as total, author_id, Author.id as id, username,email, full_name from Post INNER JOIN Author ON Author.id = Post.author_id WHERE Post.status = 'published' GROUP by author_id ORDER BY total DESC`;
  return users as {
    total: number;
    author_id: string;
    username: string;
    email: string;
    full_name: string;
    id: string;
  }[];
};
