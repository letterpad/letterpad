import { hasCredentials, mail } from "@/lib/mail";

import { EmailTemplateMeta, Mail } from "@/graphql/types";
import logger from "@/shared/logger";

export function sendMail(
  data: Mail,
  meta: EmailTemplateMeta,
  addUnsubscribe = false,
): any {
  if (!hasCredentials()) {
    return logger.debug("No client found to send emails");
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { bodyDecorator } = require("./decorator");
  const recipients = typeof data.to === "string" ? [data.to] : data.to;
  const mails = recipients.map(async (to) => {
    const body = bodyDecorator(data.html, to, addUnsubscribe);
    // send mail
    const fromEmail = process.env.SENDER_EMAIL;

    const response = await mail({
      from: `"Letterpad" <${fromEmail}>`,
      replyTo: `"${meta.author.name}" <${to}>`,
      to: `"${meta.author.name}" <${to}>`,
      subject: data.subject,
      html: body,
    });
    return response;
  });
  return Promise.all(mails);
}
