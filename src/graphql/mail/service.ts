import { EmailProps } from "@/graphql/types";
import { enqueueEmail } from "./mailqueue";
import { sendMail } from "./sendMail";
import { getEmailTemplate } from "./templates/getTemplate";

export default function MailService<T>(models: T) {
  return {
    enqueueEmail: <T extends EmailProps>(props: T) =>
      enqueueEmail(props, models),
    getEmailTemplate: <T extends EmailProps>(props: T) =>
      getEmailTemplate(props, models),
    sendMail,
  };
}
