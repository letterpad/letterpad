import { EmailProps } from "@/graphql/types";
import { enqueueEmailAndSend } from "./enqueueEmailAndSend";
import { sendMail } from "./sendMail";
import { getEmailTemplate } from "./templates/getTemplate";

const isTest = process.env.NODE_ENV === "test";

export default async function MailService<T>(models: T, author_id?: number) {
  if (author_id) {
    // @ts-ignore
    const author = await models?.Author.findOne({ where: { id: author_id } });
    if (author.email === "demo@demo.com" && !isTest) {
      return {};
    }
  }
  return {
    enqueueEmailAndSend: <T extends EmailProps>(props: T) =>
      enqueueEmailAndSend(props, models),
    getEmailTemplate: <T extends EmailProps>(props: T) =>
      getEmailTemplate(props, models),
    sendMail,
  };
}
