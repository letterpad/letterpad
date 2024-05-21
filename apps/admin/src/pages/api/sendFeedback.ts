import { NextApiResponse } from "next";

import { mail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

import { NextApiRequestWithFormData } from "@/graphql/types";

import { getServerSession } from "../../graphql/context";

const sendFeedback = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  if (!req.body.feedback) {
    return res.status(403).send("Invalid input");
  }
  const _session = await getServerSession();

  if (!_session || !_session.user?.email)
    return res.status(401).send("Unauthorized");

  const author = await prisma.author.findUnique({
    where: { email: _session.user.email },
    include: {
      setting: true,
    },
  });

  if (!author) return res.status(204).send("No Author Found");

  if (!process.env.SENDER_EMAIL)
    return res.status(204).send("Admin email not found.");

  await mail({
    html: req.body.feedback.replace(/(?:\r\n|\r|\n)/g, "<br>"),
    subject: "Letterpad Feedback",
    to: `"Letterpad" <${process.env.SENDER_EMAIL}>`,
    from: `"Letterpad" <${process.env.SENDER_EMAIL}>`,
    replyTo: `"${author.name}" <${author.email}>`,
  });
  res.send("Feedback sent");
};

export default sendFeedback;
