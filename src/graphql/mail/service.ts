import { EmailProps } from "@/graphql/types";
import { PrismaClient } from "@prisma/client";
import { enqueueEmailAndSend } from "./enqueueEmailAndSend";
import { sendMail } from "./sendMail";
import { getEmailTemplate } from "./templates/getTemplate";

const isTest = process.env.NODE_ENV === "test";
const noop = () => {};

export default async function MailService(
  prisma: PrismaClient,
  author_id?: number,
) {
  if (author_id) {
    const author = await prisma?.author.findFirst({ where: { id: author_id } });
    if (author?.email === "demo@demo.com" && !isTest) {
      return {
        enqueueEmailAndSend: noop,
        sendMail: noop,
        getEmailTemplate: noop,
      };
    }
  }
  return {
    enqueueEmailAndSend: <T extends EmailProps>(props: T) =>
      enqueueEmailAndSend(props, prisma),
    getEmailTemplate: <T extends EmailProps>(props: T) =>
      getEmailTemplate(props, prisma),
    sendMail,
  };
}
